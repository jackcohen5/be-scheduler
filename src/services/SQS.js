import { SQS } from './AWS'

export const sendMessage = async ({
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

export const deleteMessage = async ({ receiptHandle }) => {
    const { QueueUrl } = await SQS.getQueueUrl({
        QueueName: process.env.SQS_QUEUE,
    }).promise()

    const params = {
        QueueUrl,
        ReceiptHandle: receiptHandle,
    }

    await SQS.deleteMessage(params).promise()
}
