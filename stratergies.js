const passport=require('passport')
const LocalStratergy=require('passport-local')
const { connectdb }=require('./database/db')

passport.use(new LocalStratergy({
    usernameField: 'email'
},(username, password, done) => {
    connectdb('chatApp')
        .then(db => db.collection('users').find({ email: username }))
        .then(user => user.toArray())
        .then((user) => {
            if(!user) {
                return done(new Error('username invalid'))
            }
            if(user[0].password != password) {
                return done(null, false)
            }
            done(null, user)
        })
        .catch(done)
}
)
);

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    done(null, user)
  })
  
  module.exports = passport