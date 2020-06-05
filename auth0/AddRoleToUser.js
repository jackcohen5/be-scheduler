function(user, context, callback) {
    try {
        const ROLE_MAPPINGS = {
            admin: 'rol_TEMPLATE_NAME_AUTH0_ROLE_ADMIN',
            role1: 'rol_TEMPLATE_NAME_AUTH0_ROLE_1',
            role2: 'rol_TEMPLATE_NAME_AUTH0_ROLE_2',
        };

        if (context.stats.loginsCount > 1) {
            return callback(null, user, context);
        }

        const hasInvalidRole = !user || !user.user_metadata || user.user_metadata.role === 'admin';
        const roles = hasInvalidRole ? [] : [ROLE_MAPPINGS[user.user_metadata.role]];

        const ManagementClient = require('auth0@2.19.0').ManagementClient;
        const management = new ManagementClient({
            token: auth0.accessToken,
            domain: auth0.domain
        });

        // Update the user's roles
        management.assignRolestoUser({ id : user.user_id }, { roles: roles }, (err) => {
            if (err) {
                console.error(JSON.stringify(err), null, 2);
                return callback(err, user, context);
            }
            return callback(null, user, context);
        });
    } catch (err) {
        console.error(err);
        return callback(err, user, context);
    }
}
