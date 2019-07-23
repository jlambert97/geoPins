const user = require('../models/User')

const { OAuth2Client } = require('google-auth-library')

const client = new OAuth2Client('570591330068-b3h868cn5rc16ilomus9mvltavui7ddb.apps.googleusercontent.com')

exports.findOrCreateUser = async token => {
    const googleUser = await verifyAuthToken(token)

    const user = await checkIfUserExists(googleUser.email)
    return user ? user : createNewUser(googleUser)
}

const verifyAuthToken = async token => {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: '570591330068-b3h868cn5rc16ilomus9mvltavui7ddb.apps.googleusercontent.com'
        })
        return ticket.getPayload()
    } catch (err) {
        console.error('Error on verify auth token ', err)
    }
}

const checkIfUserExists = async email => await user.findOne({ email }).exec()
const createNewUser = googleUser => {
    const { name, email, picture } = googleUser
    const user = { name, email, picture }
    return new User(user).save()
}