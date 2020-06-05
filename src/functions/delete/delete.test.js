import { role1AuthenticatedEvent } from '../../../mocks'

import deleteItem from '.'

describe('delete', () => {
    it('executes as expected', async () => {
        const response = await deleteItem(role1AuthenticatedEvent)
        expect(response).toMatchSnapshot()
    })
})
