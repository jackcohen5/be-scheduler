import { BaseView } from 'functions/BaseView'
import { GetNextEventBatch, MarkEventScheduled } from 'services/DynamoDB'
import { ScheduleTrigger } from 'services/SQS'
import { allSettled, filterSucceeded, mapSucceeded } from 'helpers/promiseUtils'

const DispatchView = async () => {
    // TODO error handling
    const events = await GetNextEventBatch()
    console.log('events', events)

    const scheduledEvents = await allSettled(events.map(ScheduleTrigger))
    console.log('scheduledEvents', scheduledEvents)

    const markedScheduledEvents = await allSettled(
        scheduledEvents
            .filter(filterSucceeded)
            .map(mapSucceeded)
            .map(MarkEventScheduled),
    )
    console.log('markedScheduledEvents', markedScheduledEvents)

    return { statusCode: 200 }
}

export const handler = BaseView(DispatchView)
