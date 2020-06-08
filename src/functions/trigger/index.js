import { errorResponse } from 'services/Lambda'

const TriggerView = async (...e) => {
    console.log('...e', ...e)
    // return { statusCode: 500 }
    return errorResponse({
        message: 'something',
    })
}

export const handler = TriggerView
