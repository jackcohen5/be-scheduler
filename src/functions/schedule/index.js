import { ApiError, BaseView } from 'functions/BaseView'
import { CreateEvent } from 'services/DynamoDB'
import { getNowPlusMinutes, validateDate } from 'helpers/dateUtils'
import { ScheduleTrigger } from 'services/SQS'

const ScheduleView = async ({
    auth: { userId },
    body: { data, triggerTime },
}) => {
    if (!validateDate(triggerTime)) {
        throw new ApiError(400, 'Invalid date')
    }

    const isScheduled =
        new Date(triggerTime).getTime() <= getNowPlusMinutes(14).getTime()

    const eventId = await CreateEvent({
        userId,
        triggerTime,
        body: data,
        isScheduled,
    })

    if (isScheduled) {
        await ScheduleTrigger({
            userId,
            eventId,
            triggerTime,
            body: data,
        })
    }
    return { statusCode: 201, body: { eventId } }
}

export const handler = BaseView(ScheduleView)
