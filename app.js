// REQUIRE ALL PACAKAGES
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

//using bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

mongoose.Promise = global.Promise;          //FOR USING PROMISE

//CONNECTING TO MONGODB
mongoose.connect('mongodb://localhost:27017/login', { useNewUrlParser: true }, () => {

    console.log('connected');
});


//POST NEW USER
app.post('/register', (req, res) => {
    const newUser = new User();

    newUser.email = req.body.email;
    newUser.password = req.body.password;

    //HASH THE PASSWORD
    bcrypt.genSalt(10, (err, salt) => {

        bcrypt.hash(newUser.password, salt, (err, hash) =>{

            if(err) return err;

            newUser.password = hash;

            newUser.save().then(userSaved => {

                res.send('USER SAVED');      
                    }).catch(err => {
                res.send('NOT SAVED');
        
            });
        });
    });
});

//LOGIN INTO THE USER
app.post('/login', (req, res) => {

    User.findOne({email: req.body.email}).then(user => {

        //COMPARE THE PASSWORD
        if(user){

            
            bcrypt.compare(req.body.password, user.password, (err, matched) => {

                if(err) return;

                if(matched){
                    res.send("User able to login");
                }
                else{
                    res.send('User not able to login');
                }
            });
        }
    });
});

//IF CONNECTED TO DATABASE
app.listen(4444, () => {

    console.log('listning on 4444');
});