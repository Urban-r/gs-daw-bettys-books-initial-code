// Create a new router
const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt')
const saltRounds = 10



router.get('/register', function (req, res, next) {
    res.render('register.ejs')                                                               
})    

router.post('/registered', function (req, res, next) {
    // saving data in database
    const plainPassword = req.body.password
    let sqlquery = "INSERT INTO users (firstname, lastname,username, hashedpassword) VALUES (?,?,?)";
    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
        // Store hashed password in your database.
        db.query(err, result => {
            if (err) {
                next(err)
            }
            let newrecord = [
                req.body.firstname,
                req.body.lastname,
                req.body.username,
                req.body.email,
                hashedPassword
            ]

      })
      res.send(' This user is added to database, name: '+ req.body.firstmame + ' lastname '+ req.body.lastname + 'username' + req.body.username + 'email' + req.body.email + 'hashedpasssword' + req.body.hashedPassword)
})
      

    res.send(' Hello '+ req.body.first + ' '+ req.body.last +' you are now registered!  We will send an email to you at ' + req.body.email)                                                                           
})

// Export the router object so index.js can access it
module.exports = router