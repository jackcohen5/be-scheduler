import { BaseView } from 'functions/BaseView'
import { DynamoDB } from 'services/AWS'

const getNextBatch = async () => {
    const targetTime = new Date()
    targetTime.setMinutes(targetTime.getMinutes() + 15)
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        IndexName: 'GSI1',
        KeyConditionExpression: 'pk1 = :pk1 and sk1 <= :sk1',
        ExpressionAttributeValues: {
            ':pk1': `TRIGGER_DAY#${targetTime.substring(0, 10)}`,
            ':sk1': `TRIGGER_TIME#${targetTime.toISOString()}`,
        },
    }
    const result = await DynamoDB.query(params).promise()
    return result.Items
}

const DispatchView = async () => {
    // TODO handle query spans multiple days edge case
    const events = await getNextBatch()
    console.log('events', events)
    return { statusCode: 200 }
}

export const handler = BaseView(DispatchView)
