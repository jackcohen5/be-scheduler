import { BaseView } from 'functions/BaseView'
import { DynamoDB } from 'services/AWS'
import { sendMessage } from 'services/SQS'

const filterSucceeded = ({ status }) => status === 'fulfilled'
const mapSucceeded = ({ value }) => value

const allSettled = promises =>
    Promise.all(
        promises.map(promise =>
            promise
                .then(value => ({
                    status: 'fulfilled',
                    value,
                }))
                .catch(reason => ({
                    status: 'rejected',
                    reason,
                })),
        ),
    )

const getTargetTime = () => {
    const targetTime = new Date()
    targetTime.setMinutes(targetTime.getMinutes() + 15)
    return targetTime.toISOString()
}

const getNextBatch = async () => {
    // TODO adjust query to only get 20 min range at a time
    const targetTime = getTargetTime()
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        IndexName: 'GSI1',
        KeyConditionExpression: 'pk1 = :pk1 and sk1 <= :sk1',
        FilterExpression: 'attribute_not_exists(#data.#isScheduled)',
        ExpressionAttributeNames: {
            '#data': 'data',
            '#isScheduled': 'isScheduled',
        },
        ExpressionAttributeValues: {
            ':pk1': `TRIGGER_DAY#${targetTime.substring(0, 10)}`,
            ':sk1': `TRIGGER_TIME#${targetTime}`,
        },
    }
    const result = await DynamoDB.query(params).promise()
    return result.Items.map(({ pk, sk, sk1, data: { body } }) => ({
        userId: pk.split('#')[1],
        eventId: sk.split('#')[1],
        triggerTime: sk1.split('#')[1],
        body,
    }))
}

export const scheduleTrigger = async ({
    userId,
    eventId,
    triggerTime,
    body,
}) => {
    const delaySeconds =
        (new Date(triggerTime).getTime() - new Date().getTime()) / 1000
    await sendMessage({
        message: 'Trigger',
        attributes: {
            userId: {
                DataType: 'String',
                StringValue: userId,
            },
            eventId: {
                DataType: 'String',
                StringValue: eventId,
            },
            body: {
                DataType: 'String',
                StringValue: JSON.stringify(body),
            },
        },
        delaySeconds: delaySeconds < 0 ? 0 : Math.floor(delaySeconds),
    })
    return { userId, eventId, triggerTime, body }
}

export const markScheduled = async ({ userId, eventId }) => {
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            pk: `USER#${userId}`,
            sk: `EVENT#${eventId}`,
        },
        UpdateExpression: 'SET #data.#isScheduled = :isScheduled',
        ExpressionAttributeNames: {
            '#data': 'data',
            '#isScheduled': 'isScheduled',
        },
        ExpressionAttributeValues: {
            ':isScheduled': true,
        },
    }
    await DynamoDB.update(params).promise()
    return params.Key
}

const DispatchView = async () => {
    // TODO handle query spans multiple days edge case
    // TODO error handling

    const events = await getNextBatch()
    console.log('events', events)

    const scheduledEvents = await allSettled(events.map(scheduleTrigger))
    console.log('scheduledEvents', scheduledEvents)

    const markedScheduledEvents = await allSettled(
        scheduledEvents
            .filter(filterSucceeded)
            .map(mapSucceeded)
            .map(markScheduled),
    )
    console.log('markedScheduledEvents', markedScheduledEvents)

    return { statusCode: 200 }
}

export const handler = BaseView(DispatchView)
