import { GetEvent, MarkEventSent } from 'services/DynamoDB'
import { DeleteMessage } from 'services/SQS'

export const handler = async event => {
    for (const r of event.Records) {
        const {
            // body: message,
            messageAttributes: {
                eventId: { stringValue: eventId },
                userId: { stringValue: userId },
                body: { stringValue: body },
            },
            receiptHandle,
        } = r

        try {
            const event = await GetEvent({ userId, eventId })
            if (!event.data.sentTime) {
                // TODO Send webhook
                console.log('Sending webhook with body...', body)
                await MarkEventSent({
                    userId,
                    eventId,
                    sentTime: new Date().toISOString(),
                })
            }
            await DeleteMessage({ receiptHandle })
        } catch (e) {
            console.error('Handling error...', e)
        }
    }
}
