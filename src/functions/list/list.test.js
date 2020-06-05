import { role1AuthenticatedEvent } from '../../../mocks'

import list from '.'

describe('list', () => {
    it('executes as expected', async () => {
        const response = await list(role1AuthenticatedEvent)
        expect(response).toMatchSnapshot()
    })
})
