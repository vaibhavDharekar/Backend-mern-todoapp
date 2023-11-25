const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
    taskTitle:{
        type: String,
    },
    completed : {
        type:Boolean,
        default:false},
    editing : {
        type:Boolean,
        default:false},
    email:{
        type: String
    },
    date:{
        type:String,default:() => {
        let date = new Date();
        date = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
        return date;
    } }
})
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;