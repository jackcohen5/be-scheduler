import { DynamoDB } from 'services/AWS'
import { deleteMessage } from 'services/SQS'

const markSent = async ({ userId, eventId, sentTime }) => {
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
            // TODO Send webhook
            console.log('Sending webhook with data...', body)
            await markSent({
                userId,
                eventId,
                sentTime: new Date().toISOString(),
            })
            await deleteMessage({ receiptHandle })
        } catch (e) {
            console.error('Handling error...', e)
        }
    }
}
