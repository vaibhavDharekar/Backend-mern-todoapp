function validateEmail(email) {
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    console.log('emailRegex',emailRegex.test(email))
    return emailRegex.test(email);
  }

const validateForm = (email,password,firstName,lastName)=>{
    email = email.trim();
    password = password.trim();
    firstName = firstName.trim();
    lastName = lastName.trim();
    let vals = [email,password,firstName,lastName];
    let strVals = ["Email","Password","First Name","Last Name"]
    if(email && password && firstName && lastName){
        
        let msg;
        if(password.length < 6)
        return msg = "Password must have more than 5 characters"
        if(!validateEmail(email))
        return "Invalid email format"
        vals.forEach((val,idx)=>{
            if(val.length > 25)
            msg = `${strVals[idx]} must be less than 20 characters`;
        })
        return msg;
    }
    else{
        return  "All fields are mandetory!";
    }
}
module.exports = validateForm;