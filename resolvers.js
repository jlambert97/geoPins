const { AuthenticationError } = require('apollo-server')

const user = {
    _id: "1",
    name: "Reed",
    email: "xaxa@xaxa.com",
    picture: "xexe@com.com"
}

const authenticated = next => (root, args, ctx, info) => {
    if(!ctx.currentUser) {
        throw new AuthenticationError('You must be logged in')
    }

    return next(root, args, ctx, info)
}


module.exports = {
    Query: {
        authenticated: (root, args, ctx) => ctx.currentUser
    }
}