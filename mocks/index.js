import { Roles } from 'functions/BaseView'

// COMMON
export const mockUserId1 = 'user_id_1'

// LAMBDA
export const makeAuthenticatedEvent = ({
    roles = [Roles.TEMPLATE_NAME_ROLE1],
} = {}) => ({
    requestContext: { authorizer: { userId: mockUserId1, roles } },
})

export const role1AuthenticatedEvent = makeAuthenticatedEvent()

// ITEM
export const mockItem1 = {
    itemId: 'item_id_1',
    userId: mockUserId1,
}

export const mockItem2 = {
    itemId: 'item_id_2',
    userId: 'user_id_2',
}

export const mockItems = [mockItem1, mockItem2]
