export const filterSucceeded = ({ status }) => status === 'fulfilled'
export const mapSucceeded = ({ value }) => value
export const allSettled = promises =>
    Promise.all(
        promises.map(promise =>
            promise
                .then(value => ({
                    status: 'fulfilled',
                    value,
                }))
                .catch(reason => ({
                    status: 'rejected',
                    reason,
                })),
        ),
    )
