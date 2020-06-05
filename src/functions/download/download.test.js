import { Roles } from 'functions/BaseView'

import { makeAuthenticatedEvent, role1AuthenticatedEvent } from '../../../mocks'

import download from '.'

describe('download', () => {
    it('returns a 403 if role 1', async () => {
        const response = await download(role1AuthenticatedEvent)
        expect(response).toMatchSnapshot()
    })

    it('executes as expected if role 2', async () => {
        const response = await download(
            makeAuthenticatedEvent({ roles: [Roles.TEMPLATE_NAME_ROLE2] }),
        )
        expect(response).toMatchSnapshot()
    })
})
