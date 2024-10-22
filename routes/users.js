// Create a new router
const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt')
const saltRounds = 10
const { check, validationResult } = require('express-validator');

const redirectLogin = (req, res, next) => {
    if (!req.session.userId ) {
      res.redirect('./login') // redirect to the login page
    } else { 
        next (); // move to the next middleware function
    } 
}


router.get('/register', function (req, res, next) {
    res.render('register.ejs')                                                               
})    

router.post('/registered', [check('email').isEmail()],[check('password').isLength({min: 8})], function (req, res) {
    check('first', 'First Name is required').isEmpty(),
    check('last', 'Last Name is required').isEmpty(),
    check('username', 'User Name is required').isEmpty(),
    check('password', 'Password is required').isEmpty()
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.redirect('./register'); }
    else { 
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
                    result = 'Hello '+ req.sanitize(req.body.first) + ' '+ req.sanitize(req.body.last) +' you are now registered!  We will send an email to you at ' + req.body.email
                    result += 'Your password is: '+ req.sanitize(req.body.password) +' and your hashed password is: '+ req.sanitize(hashedPassword)
                    res.send(result)
                }
            }
        )}
    )}
})
router.get('/login', function (req, res, next) {
    res.render('login.ejs')                                                               
})
router.post('/loggedin', function (req, res, next) {
    // saving data in database
    let sqlquery = "SELECT * FROM users WHERE username = ?"
    db.query(sqlquery, req.body.username, (err, result) => {
        if (err) {
            next(err);
        } else {
            if (result.length > 0) {
                bcrypt.compare(req.body.password, result[0].hashedpassword, function(err, result) {
                    if (result) {
                        // Save user session here, when login is successful
                        req.session.userId = req.body.username;
                        res.send('Welcome '+ req.sanitize(req.body.username) + ' you are now logged in!')
                    } else {
                        res.send('Invalid password')
                    }
                })
            } else {
                res.send('Invalid username')
            }
        }
    })
})
router.get('/list', redirectLogin, function(req, res, next) {
    let sqlquery = "SELECT * FROM users" // query database to get all the books
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("users.ejs", {availableUsers:result})
     })
})

router.get('/users', function(req, res, next) {
    res.redirect('/')    
})

router.get('/logout', redirectLogin, (req,res) => {
    req.session.destroy(err => {
    if (err) {
      return res.redirect('/')
    }
    res.send('you are now logged out. <a href='+'/'+'>Home</a>');
    })
})

// Export the router object so index.js can access it
module.exports = router