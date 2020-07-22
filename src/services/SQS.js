import { SQS } from './AWS'

const SendMessage = async ({
    message,
    delaySeconds = null,
    attributes = null,
}) => {
    const { QueueUrl } = await SQS.getQueueUrl({
        QueueName: process.env.SQS_QUEUE,
    }).promise()

    const optionalParams = {}
    if (delaySeconds) {
        optionalParams.DelaySeconds = delaySeconds
    }
    if (attributes) {
        optionalParams.MessageAttributes = attributes
    }

    return await SQS.sendMessage({
        QueueUrl,
        MessageBody: message,
        ...optionalParams,
    }).promise()
}

export const ScheduleTrigger = async ({
    userId,
    eventId,
    triggerTime,
    body,
}) => {
    const delaySeconds =
        (new Date(triggerTime).getTime() - new Date().getTime()) / 1000
    await SendMessage({
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

export const DeleteMessage = async ({ receiptHandle }) => {
    const { QueueUrl } = await SQS.getQueueUrl({
        QueueName: process.env.SQS_QUEUE,
    }).promise()

    const params = {
        QueueUrl,
        ReceiptHandle: receiptHandle,
    }

    await SQS.deleteMessage(params).promise()
}
