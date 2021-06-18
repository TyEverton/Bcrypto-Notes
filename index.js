```
// Remember to require your packages!
const bcrypt = require('bcryptjs')

/* 
    This users array is to hold our potential users. Normally, I'd 
    have a database in lieu of an array, but for this example, we're
    gonna store it in this users array.
*/
const users = []

module.exports = {
    login: (req, res) => {
    // We like to destructure our params from the body. This makes it easier for us to manipulate.
    // In this instance, in order to login all we need is a username and password (which we'll discuss in a second).
      const { username, password } = req.body
      
      // Let's check the users array to see if our specified user already exists.
      for (let i = 0; i < users.length; i++) {
        if (users[i].username === username) {
        /*
            If the user exists, let's check to see if the credentials check out. We do this
            using bcrypt.compareSync(), which takes in our unhashed password and the hashed
            password we've stored in the register function. This is why we can't just
            compare passwords 1 on 1, because one is a password and one is a hash. Also,
            bcrypt.compareSync() returns a BOOLEAN value, meaning true or false. That value
            is stored in authenticated.
        */
          const authenticated = bcrypt.compareSync(password, users[i].passwordHash)

          // authenticated can be any word you want (but use good language sense).
          if (authenticated) {
            // If the user is authenticated, let's return the user that just logged in by spanning (copying) their information.
            let userToReturn = {...users[i]}
            // Delete the hash because no one needs that.
            delete userToReturn.passwordHash
            // Send a confirmed code and the user back.
            res.status(200).send(userToReturn)
          }
        }
      }
      // User can't be found? Too bad.
      res.status(400).send("User not found.")
    },
    register: (req, res) => {
        // Same as above, but registering requires more information.
        const { username, email, firstName, lastName, password } = req.body

        /* 
            NOW we need to hash/salt our password. This is done when we instantiate a user, meaning
            when we create a user. Hashing occurs ONCE in this instance, so logically it makes sense
            to set it up at user creation.
        */
        const salt = bcrypt.genSaltSync(5) // 5 cycles is selected here, but a blank one defaults to 10.
        const passwordHash = bcrypt.hashSync(password, salt) // Pass in the password and salt to hash.

        /*
            Once we hash out the password, we can put those values to a new user object along with all their
            other destructure information. As you can see, the password variable no longer exists anywhere in 
            this new user. This is why we use bcrypt.compareSync() in the login function instead of
            straight comparing passwords.
        */
        let user = {
          username,
          email,
          firstName,
          lastName,
          passwordHash
        }

        // Add the new user to the users array.
        users.push(user)
        // Span that user along with their contents to this userToReturn variable.
        let userToReturn = {...user}
        // Delete the hash.
        delete userToReturn.passwordHash
        // Send 'em back!
        res.status(200).send(userToReturn)
    }
}
```
