const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
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


let User = require('./models/User_');
let Task = require('./models/Task')
let checkLogin = require('./middlewares/checkLogin')
let validateForm = require('./utils/validateForm');
let port = process.env.PORT || 5000

mongoose.connect(process.env.DATABASE)
.then(()=>{
    console.log('Database connection successful!')
})
.catch((err)=>{
    console.log('Database connection failed!',err)
})




app.post('/signup',async(req,res)=>{
    let validated = validateForm();
    try{
    let {email,password,firstName,lastName} = req.body;
    if(!validated){
        return res.status(500).json({errorMessage:validated,statusCode:500})
    }


    let newUser = await User.findOne({email});
    if(newUser){
        return res.status(500).json({errorMessage:"User already exist!",statusCode:500})
    }
    else{
        let hashedPassword = await bcrypt.hash(password,10);
        newUser = new User({
            email,password:hashedPassword,firstName,lastName
        })
        await newUser.save();
        return res.status(201).json({msg:"User signed up successfully"});
    }
    }
    catch(err){
        let statusCode = err.statusCode || 500;
        return res.status(err.statusCode).json({errorMessage:err.message,statusCode});
    }
})

app.post('/signin',async(req,res)=>{
        try{
            let {email,password} = req.body;
        if(!email || !password){
            return res.status(500).json({errorMessage:"Provide email and password",statusCode:500})
        }
        let userExist = await User.findOne({email});
        if(userExist){
            let correctPassword = await bcrypt.compare(password,userExist.password);
            if(correctPassword){
                let token = jwt.sign({_id:userExist._id},process.env.SECRET);
                return res.status(201).json({token,email,firstName:userExist.firstName});
            }
            else{
                return res.status(500).json({errorMessage:"Incorrect email or password!",errroCode:2});
            }
        }
        else{
            return res.status(500).json({errorMessage:"You need to signup first!",errorCode:1});
    }
        }
        catch(err){
            return res.status(500).json({errorMessage:err.message,statusCode:500})
        }
})
app.post('/addTask',checkLogin,async(req,res)=>{
    try{
        let user = req.user;
    let userEmail = user.email;
    const {task} = req.body;
    if(!task){
        return res.status(500).json({errorMessage:"Provide task",statusCode:500});
    }
    const newTask = new Task({taskTitle : task, completed : false,email:userEmail});
    await newTask.save();
    let tasks = await Task.find({email:userEmail});
    return res.status(201).json({msg:'Task added successfully',tasks});
    }
    catch(err){
        return res.status(500).json({errorMessage:err.message,statusCode:500})
    }
})

app.get('/showTasks',checkLogin,async(req,res)=>{
    try{
        let user = req.user;
        let userEmail = user.email;
        const allTasks = await Task.find({email:userEmail});
        return res.status(201).json({allTasks});
    }
    catch(err){
        return res.status(500).json({errorMessage:err.message,statusCode:500})
    }
})

app.get('/taskDone/:taskId',checkLogin,async(req,res)=>{
    try{
        let {taskId} = req.params;
        let user = req.user;
        let userEmail = user.email;
        let task = await Task.findOne({_id:taskId});
        await Task.updateOne({_id:taskId},{completed:!task.completed})
        let allTasks = await Task.find({email:userEmail});
        return res.status(201).json({allTasks});
    }
    catch(err){
        return res.status(500).json({errorMessage:err.message,statusCode:500})
    }
})
app.get('/taskEdit/:taskId',checkLogin,async(req,res)=>{
    try{
        let {taskId} = req.params;
        let user = req.user;
        let userEmail = user.email;
        await Task.findOneAndUpdate({_id:taskId},{editing:true});
        let allTasks = await Task.find({email:userEmail});
        return res.status(201).json({allTasks});
    }
    catch(err){
        return res.status(500).json({errorMessage:err.message,statusCode:500})
    }
})
app.post('/taskEdit/:taskId',checkLogin,async(req,res)=>{
        try{
            let {taskId} = req.params;
    let user = req.user;
    let {task} = req.body;
    let userEmail = user.email;
    await Task.findOneAndUpdate({_id:taskId},{editing:false,taskTitle:task});
    let allTasks = await Task.find({email:userEmail});
    return res.status(201).json({allTasks}); 
        }
        catch(err){
            return res.status(500).json({errorMessage:err.message,statusCode:500})
        }
})
app.get('/taskDelete/:taskId',checkLogin,async(req,res)=>{
    try{
        let {taskId} = req.params;
    let user = req.user;
    let userEmail = user.email;
    await Task.findOneAndDelete({_id:taskId});
    let allTasks = await Task.find({email:userEmail});
    return res.status(201).json({allTasks});
    }
    catch(err){
        return res.status(500).json({errorMessage:err.message,statusCode:500})
    }
})

app.listen(port,()=>{
    console.log('listening on port ',port);
})