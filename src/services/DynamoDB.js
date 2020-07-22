import { v4 as uuid } from 'uuid'

import { getNowPlusMinutes } from 'helpers/dateUtils'

import { DynamoDB } from './AWS'

/*
Data Model
{
    pk: "USER#123",
    sk: "EVENT#abc-def-ghi",
    pk1: "TRIGGER_DAY#2020-01-01",
    sk1: "TRIGGER_TIME#2020-01-01T00:00:00.000Z",
    data: {
        body: "{some: 'data'}",
        isScheduled: true,
        sentTime: "2020-01-01T00:00:01.000Z"
    },
}
*/

export const CreateEvent = async ({
    userId,
    triggerTime,
    body,
    isScheduled,
}) => {
    const eventId = uuid()
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Item: {
            pk: `USER#${userId}`,
            sk: `EVENT#${eventId}`,
            pk1: `TRIGGER_DAY#${triggerTime.substring(0, 10)}`,
            sk1: `TRIGGER_TIME#${triggerTime}`,
            data: {
                body: JSON.stringify(body),
            },
        },
    }

    if (isScheduled) {
        params.Item.data.isScheduled = true
    }

    await DynamoDB.put(params).promise()
    return eventId
}

export const GetNextEventBatch = async () => {
    // TODO get multiple batches
    // TODO check next TRIGGER_DAY
    const targetTime = getNowPlusMinutes(15).toISOString()
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        IndexName: 'GSI1',
        KeyConditionExpression:
            'pk1 = :pk1 and sk1 between :sk1Min and :sk1Max',
        FilterExpression: 'attribute_not_exists(#data.#isScheduled)',
        ExpressionAttributeNames: {
            '#data': 'data',
            '#isScheduled': 'isScheduled',
        },
        ExpressionAttributeValues: {
            ':pk1': `TRIGGER_DAY#${targetTime.substring(0, 10)}`,
            ':sk1Min': `TRIGGER_TIME#${new Date().toISOString()}`,
            ':sk1Max': `TRIGGER_TIME#${targetTime}`,
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

export const MarkEventScheduled = async ({ userId, eventId }) => {
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

export const GetEvent = async ({ userId, eventId }) => {
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            pk: `USER#${userId}`,
            sk: `EVENT#${eventId}`,
        },
        ConsistentRead: true,
    }

    const result = await DynamoDB.get(params).promise()
    return result.Item
}

export const MarkEventSent = async ({ userId, eventId, sentTime }) => {
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
