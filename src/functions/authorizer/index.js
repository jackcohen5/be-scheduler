import { promisify } from 'util'

import jwt from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'

import {
    AUTH0_AUDIENCE,
    AUTH0_DOMAIN,
    ROLES_CLAIM_KEY,
} from './authorizer.constants'

const getSigningKey = async kid => {
    const client = jwksClient({
        jwksUri: `${AUTH0_DOMAIN}.well-known/jwks.json`,
    })
    return promisify(client.getSigningKey)(kid)
}

const generatePolicy = ({ effect, resource, roles = [], userId }) => {
    const authResponse = {
        principalId: userId,
        context: {
            userId,
            roles,
        },
    }

    if (effect && resource) {
        authResponse.policyDocument = {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: effect,
                    Resource: resource,
                },
            ],
        }
    }

    return authResponse
}

const Authorize = async event => {
    try {
        const splitAuthHeader = event.authorizationToken.split(' ')
        const token =
            splitAuthHeader.length > 1
                ? splitAuthHeader[1]
                : event.authorizationToken
        const decoded = jwt.decode(token, { complete: true })
        try {
            if (decoded.payload.iss !== AUTH0_DOMAIN) {
                throw new Error('Auth Error: JWT issuer does not match domain')
            }

            const signingKey = await getSigningKey(decoded.header.kid)
            const key = signingKey.publicKey || signingKey.rsaPublicKey
            jwt.verify(token, key, {
                algorithm: ['RS256'],
                audience: AUTH0_AUDIENCE,
            })
            return generatePolicy({
                effect: 'Allow',
                resource: '*',
                roles: decoded.payload[ROLES_CLAIM_KEY],
                userId: decoded.payload.sub,
            })
        } catch (err) {
            console.error(err)
            return generatePolicy({
                effect: 'Deny',
                resource: event.methodArn,
                userId: decoded.payload.sub,
            })
        }
    } catch (err) {
        console.error(err)
        return generatePolicy({
            effect: 'Deny',
            resource: event.methodArn,
            userId: 'Unauthorized',
        })
    }
}

export default Authorize
