const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

let User = require('./models/user');

mongoose.connect('mongodb://127.0.0.1:27017/fullstackTodoApp')
.then(()=>{
    console.log('Database connection successful!')
})
.catch(()=>{
    console.log('Database connection failed!')
})

app.post('/signup',async(req,res)=>{
    let {email,password,firstName,lastName} = req.body;
    let newUser = await User.findOne({email});
    if(newUser){
        return res.status(404).json({error:"User already exist!"})
    }
    else{
        let hashedPassword = await bcrypt.hash(password,10);
        newUser = new User({
            email,password:hashedPassword,firstName,lastName
        })
        await newUser.save();
        return res.status(201).json({msg:"User signed up successfully"});
    }
})

















app.listen(8080,()=>{
    console.log('listening on port 8080');
})