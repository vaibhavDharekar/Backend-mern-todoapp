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
let Task = require('./models/Task')

mongoose.connect('mongodb+srv://Vaibhav:Vaibhav3549@cluster0.j3oxtv3.mongodb.net/?retryWrites=true&w=majority')
.then(()=>{
    console.log('Database connection successful!')
})
.catch((err)=>{
    console.log('Database connection failed!',err)
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
            return res.status(201).json({token,email,firstName:userExist.firstName});
        }
        else{
            return res.status(401).json({error:"Incorrect email or password!",errroCode:2});
        }
    }
    else{
        return res.status(401).json({error:"You need to signup first!",errorCode:1});
    }
})
app.post('/addTask',async(req,res)=>{
    let{authorization} = req.headers;
    let id;
    if(!authorization){
        return res.status(401).json({error:"You must be logged in A"});
    }
    else{
        let token = authorization.replace('Bearer ',"");
        jwt.verify(token,process.env.secret,(error,payload)=>{
            if(error){
                return res.status(401).json({error:"You must be logged in B"})
            }
            id = payload._id;  
        })
        let user = await User.findOne({_id:id});
        console.log('user is ',user);
        userEmail = user.email;   
    }
    const {task} = req.body;
    const newTask = new Task({taskTitle : task, completed : false,email:userEmail});
    await newTask.save();
    return res.status(201).json({msg:'Task added successfully'});
})




app.listen(process.env.port,()=>{
    console.log('listening on port 8080');
})