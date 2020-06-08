import { DynamoDB } from 'services/AWS'
import { errorResponse } from 'services/Lambda'

// const filterSucceeded = ({ status }) => status === 'fulfilled'

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

export const markSent = async ({ userId, eventId, sentTime }) => {
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            pk: `USER#${userId}`,
            sk: `EVENT#${eventId}`,
        },
        UpdateExpression: 'SET #data.#sentTime = :sentTime',
        ExpressionAttributeNames: {
            '#data': 'data',
            '#sentTime': 'sentTime',
        },
        ExpressionAttributeValues: {
            ':sentTime': sentTime,
        },
    }
    await DynamoDB.update(params).promise()
    return params.Key
}

const TriggerView = async e => {
    const events = e.Records.map(
        ({
            messageAttributes: {
                eventId: { stringValue: eventId },
                userId: { stringValue: userId },
                body: { stringValue: body },
            },
        }) => ({
            userId,
            eventId,
            body,
            sentTime: new Date().toISOString(),
        }),
    )
    console.log('events', events)

    const markedSentEvents = await allSettled(events.map(markSent))
    console.log('markedSentEvents', markedSentEvents)

    // return { statusCode: 500 }
    return errorResponse({
        message: 'something',
    })
}

export const handler = TriggerView
