const userRoutes = require('./users.routes')
const feedRoutes = require('./feeds.routes')
const authRoutes  = require('./auth.routes')




const routers = (app)=>{
 app.use('/api/v1/user', userRoutes)
 app.use('/api/v1/feed', feedRoutes)
 app.use('/api/v1/auth', authRoutes)
}

module.exports = routers