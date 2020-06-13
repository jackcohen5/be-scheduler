import { v4 as uuid } from 'uuid'

import { ApiError, BaseView } from 'functions/BaseView'
import { DynamoDB } from 'services/AWS'

import { scheduleTrigger } from '../dispatch'

const getNowPlus14Mins = () => {
    const t = new Date()
    t.setMinutes(t.getMinutes() + 14)
    return t.getTime()
}

const ISO_DATE_REGEX = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/

const validateDateFormat = d => ISO_DATE_REGEX.test(d)

const validateDate = d =>
    validateDateFormat(d) && new Date(d).getTime() > new Date().getTime()

const createEvent = async ({ userId, triggerTime, body, isScheduled }) => {
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

const ScheduleView = async ({
    auth: { userId },
    body: { data, triggerTime },
}) => {
    if (!validateDate(triggerTime)) {
        throw new ApiError(400, 'Invalid date')
    }

    const isScheduled = new Date(triggerTime).getTime() <= getNowPlus14Mins()

    const eventId = await createEvent({
        userId,
        triggerTime,
        body: data,
        isScheduled,
    })

    if (isScheduled) {
        await scheduleTrigger({
            userId,
            eventId,
            triggerTime,
            body: data,
        })
    }
    return { statusCode: 201, body: { eventId } }
}

export const handler = BaseView(ScheduleView)
