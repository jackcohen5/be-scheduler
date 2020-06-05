function(user, context, callback) {
    const ROLES_CLAIM_KEY = 'TEMPLATE_NAME_AUTH0_ROLES_CLAIM_KEY';
    try {
        if (!user.email || !user.email_verified) {
            return callback(null, user, context);
        }

        context.idToken[ROLES_CLAIM_KEY] = context.authorization.roles;
        context.accessToken[ROLES_CLAIM_KEY] = context.authorization.roles;
        return callback(null, user, context);
    } catch (err) {
        console.error(err);
        return callback(err, user, context);
    }
}
