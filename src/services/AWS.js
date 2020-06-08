import AWS from 'aws-sdk'

AWS.config.update({ region: process.env.REGION })

export const DynamoDB = new AWS.DynamoDB.DocumentClient()
export const SQS = new AWS.SQS()
