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
            req.body.first,
            req.body.last,
            req.body.username,
            req.body.email,
            hashedPassword
        ]
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                next(err);
            } else {     
                result = 'Hello '+ req.body.first + ' '+ req.body.last +' you are now registered!  We will send an email to you at ' + req.body.email
                result += 'Your password is: '+ req.body.password +' and your hashed password is: '+ hashedPassword
                res.send(result)
                            }
        });   
    })
})
router.get('/list', function(req, res, next) {
    let sqlquery = "SELECT * FROM users" // query database to get all the books
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("users.ejs", {availableUsers:result})
     })
})

// Export the router object so index.js can access it
module.exports = router