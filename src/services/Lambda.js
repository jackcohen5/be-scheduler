function lambdaResponse({ json, statusCode, allowCORS = false }) {
    const response = {
        statusCode,
        body: JSON.stringify(json),
    }

    if (allowCORS) {
        response.headers = {
            'Access-Control-Allow-Origin': '*',
        }
    }

    return response
}

export const successResponse = (json, statusCode = 200) =>
    lambdaResponse({
        json,
        statusCode,
        allowCORS: true,
    })

export const errorResponse = (json, statusCode = 500) =>
    lambdaResponse({
        json,
        statusCode,
        allowCORS: true,
    })
