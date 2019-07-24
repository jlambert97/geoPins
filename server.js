const { ApolloServer } = require('apollo-server')
const typeDefs = require('./typeDefs')
const resolvers = require('./resolvers')
const mongoose = require('mongoose');
const { findOrCreateUser } = require('./controllers/userController')

mongoose.connect('mongodb+srv://admin:admin2019@dev-4srmh.mongodb.net/test?retryWrites=true&w=majority', 
{
    useNewUrlParser: true
})
.then(() => console.log('Database connected!'))
.catch(err => console.error(err))

const OAuthId = '570591330068-b3h868cn5rc16ilomus9mvltavui7ddb.apps.googleusercontent.com'
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({req}) => {
        let authToken = null
        let currentUser = null
        try {
            authToken = req.headers.authorization
            if (authToken) {
                currentUser = await findOrCreateUser(authToken)
            }   
        } catch (err) {
            console.error(`Unable to auth with token ${authToken}`)
        }

        return { currentUser }
    }
})

server.listen().then(({ url }) => {
    console.log(`Server listening on ${url}`)
})
