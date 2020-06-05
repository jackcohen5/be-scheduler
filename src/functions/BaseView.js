import { errorResponse, successResponse } from 'services/Lambda'

export const Roles = {
    TEMPLATE_NAME_ROLE1: 'TEMPLATE_NAME_role1',
    TEMPLATE_NAME_ROLE2: 'TEMPLATE_NAME_role2',
}

const BaseView = (f, authorizedRoles) => async (event, ...otherParams) => {
    const userRoles = event?.requestContext?.authorizer?.roles ?? []
    if (authorizedRoles.some(r => userRoles.includes(r))) {
        try {
            const enhancedEvent = {
                auth: event?.requestContext?.authorizer ?? {},
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
            return errorResponse({
                message: err.message,
            })
        }
    } else {
        return errorResponse(
            {
                message: 'Unauthorized',
            },
            403,
        )
    }
}

export const Role1View = f => BaseView(f, [Roles.TEMPLATE_NAME_ROLE1])

export const Role2View = f => BaseView(f, [Roles.TEMPLATE_NAME_ROLE2])
