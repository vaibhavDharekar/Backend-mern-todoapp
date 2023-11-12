const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require("cors");
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({
    origin: 'http://localhost:3000',  // Replace with the URL of your React app
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
  }))


let User = require('./models/User');

mongoose.connect('mongodb://127.0.0.1:27017/fullstackTodoApp_')
.then(()=>{
    console.log('Database connection successful!')
})
.catch(()=>{
    console.log('Database connection failed!')
})

app.post('/signup',async(req,res)=>{
    let {email,password,firstName,lastName} = req.body;console.log(email,password,firstName,lastName)
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

app.post('/signin',async(req,res)=>{
    let {email,password} = req.body;
    let userExist = await User.findOne({email});
    if(userExist){
        let correctPassword = await bcrypt.compare(password,userExist.password);
        if(correctPassword){
            let token = jwt.sign({_id:userExist._id},process.env.secret);
            return res.status(201).json({token,email});
        }
        else{
            return res.status(401).json({error:"Incorrect email or password!"});
        }
    }
    else{
        return res.status(401).json({error:"You need to signup first!"});
    }
})



app.listen(process.env.port,()=>{
    console.log('listening on port 8080');
})