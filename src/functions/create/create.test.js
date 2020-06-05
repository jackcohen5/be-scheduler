import { role1AuthenticatedEvent } from '../../../mocks'

import create from '.'

describe('create', () => {
    it('executes as expected', async () => {
        const response = await create(role1AuthenticatedEvent)
        expect(response).toMatchSnapshot()
    })
})
