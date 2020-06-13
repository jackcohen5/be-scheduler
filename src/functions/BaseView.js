import { errorResponse, successResponse } from 'services/Lambda'

export class ApiError extends Error {
    constructor(status, message) {
        super(message)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ApiError)
        }
        this.name = 'ApiError'
        this.status = status
    }
}

export const BaseView = f => async (event, ...otherParams) => {
    // const BaseView = (f, authorizedRoles) => async (event, ...otherParams) => {
    // const userRoles = event?.requestContext?.authorizer?.roles ?? []
    // if (authorizedRoles.some(r => userRoles.includes(r))) {
    try {
        const enhancedEvent = {
            auth: { userId: '123' },
            // auth: event?.requestContext?.authorizer,
            body: JSON.parse(event?.body ?? '{}'),
            pathParameters: event?.pathParameters ?? {},
        }
        const { data, statusCode = 200 } = await f(
            enhancedEvent,
            ...otherParams,
        )
        return successResponse(
            {
                data,
            },
            statusCode,
        )
    } catch (err) {
        console.error(err)
        return err.name === 'ApiError'
            ? errorResponse({ message: err.message }, err.status)
            : errorResponse({ message: 'Server error' })
    }
    // } else {
    //     return errorResponse(
    //         {
    //             message: 'Unauthorized',
    //         },
    //         403,
    //     )
    // }
}

// export const Role1View = f => BaseView(f, [Roles.TEMPLATE_NAME_ROLE1])

// export const Role2View = f => BaseView(f, [Roles.TEMPLATE_NAME_ROLE2])
