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
    let sqlquery = "INSERT INTO users (firstname, lastname, username, email, hashedpassword) VALUES (?,?,?,?,?)";
    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
        // Store hashed password in your database.
        let newrecord = [
            req.body.firstname,
            req.body.lastname,
            req.body.username,
            req.body.email,
            hashedPassword
        ]
        db.query(sqlquery, newrecord, err, result => {
            if (err) {
                next(err)
            }
            else      
            res.send(' Hello '+ req.body.first + ' '+ req.body.last +' you are now registered!  We will send an email to you at ' + req.body.email)                                                                       
        })    
    })
})

// Export the router object so index.js can access it
module.exports = router