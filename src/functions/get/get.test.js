import { role1AuthenticatedEvent } from '../../../mocks'

import get from '.'

describe('get', () => {
    it('executes as expected', async () => {
        const response = await get(role1AuthenticatedEvent)
        expect(response).toMatchSnapshot()
    })
})
