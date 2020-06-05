import { role1AuthenticatedEvent } from '../../../mocks'

import upload from '.'

describe('upload', () => {
    it('executes as expected', async () => {
        const response = await upload(role1AuthenticatedEvent)
        expect(response).toMatchSnapshot()
    })
})
