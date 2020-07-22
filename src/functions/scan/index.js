import { DynamoDB } from 'services/AWS'
import { successResponse } from 'services/Lambda'

export const scan = async () => {
    let count = 0

    const params = {
        TableName: process.env.DYNAMODB_TABLE,
    }
    const t = await DynamoDB.scan(params).promise()
    return t.Items.map(function (d) {
        const scheduled = new Date(d.sk1.split('#')[1]).getTime()
        const sent = new Date(d.data.sentTime).getTime()
        const diffTime = Math.abs(sent - scheduled)
        console.log(
            'Item :',
            ++count,
            diffTime,
            d.sk1.split('#')[1],
            d.data.sentTime,
        )
        return diffTime
    })
}

const TriggerView = async () => {
    const diffs = await scan()
    const medianIndex = Math.floor(diffs.length / 2)
    console.log(
        'diffs.sort()',
        JSON.stringify(
            diffs.sort((a, b) => a - b),
            null,
            2,
        ),
    )
    console.log('median: ', diffs.sort((a, b) => a - b)[500])
    console.log(
        'average: ',
        diffs.reduce(function (curr, next) {
            return curr + next
        }, 0) / diffs.length,
    )
    return successResponse()
}

export const handler = TriggerView
