import { v4 as uuid } from 'uuid'

import { BaseView } from 'functions/BaseView'
import { DynamoDB } from 'services/AWS'

const createEvent = async ({ userId, triggerTime, body }) => {
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

    await DynamoDB.put(params).promise()
    return eventId
}

const getTargetTime = () => {
    const targetTime = new Date()
    targetTime.setMinutes(targetTime.getMinutes() + 2)
    return targetTime.toISOString()
}

const ScheduleView = async ({ auth: { userId }, body: { triggerTime } }) => {
    // TODO Handle < 10 minutes case and trigger date validation (is ISO and < now)
    const eventId = await createEvent({
        userId,
        triggerTime: getTargetTime(),
        // triggerTime,
        body: { some: 'data' },
    })
    return { statusCode: 201, body: { eventId } }
}

export const handler = BaseView(ScheduleView)
