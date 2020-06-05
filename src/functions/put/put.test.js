import { role1AuthenticatedEvent } from '../../../mocks'

import put from '.'

describe('put', () => {
    it('executes as expected', async () => {
        const response = await put(role1AuthenticatedEvent)
        expect(response).toMatchSnapshot()
    })
})
