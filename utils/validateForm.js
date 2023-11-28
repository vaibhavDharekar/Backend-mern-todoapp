// function validateEmail(email) {
//     let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   }

// const validateForm = (email,password,firstName,lastName)=>{
//     email = email.trim();
//     password = password.trim();
//     firstName = firstName.trim();
//     lastName = lastName.trim();
//     let vals = [email,password,firstName,lastName];
//     let strVals = ["Email","Password","First Name","Last Name"]
//     if(email && password && firstName && lastName){
        
//         let msg;
//         if(password.length < 6)
//         return msg = "Password must have more than 5 characters"
//         if(!validateEmail(email))
//         return "Invalid email format"
//         vals.forEach((val,idx)=>{
//             if(val.length > 25)
//             msg = `${strVals[idx]} must be less than 20 characters`;
//         })
//         return msg;
//     }
//     else{
//         return  "All fields are mandetory!";
//     }
// }
// module.exports = validateForm;

const validateForm = (email,password,firstName,lastName)=>{
    let formErrors = {};
    if (!email || !email.trim()) {
        formErrors.emailError = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        formErrors.emailError = 'Invalid email address format';
      }
      else if(email.trim().length > 39)
      formErrors.emailError = 'Email must be less than 40 characters';
      if (!password || !password.trim()) {
        formErrors.passwordError = 'Password is required';
      }
      else if(password.length < 6){
        formErrors.passwordError = 'Password must be more than 5 characters ';
      }
      else if(password.length > 39){
        formErrors.passwordError = 'Password must be less than 40 characters ';
      }
      if (!firstName || !firstName.trim()) {
        formErrors.firstNameError = 'First Name is required';
      }
      else if (firstName.trim().length > 39) {
        formErrors.firstNameError = 'First Name must be less than 40 characters';
      }
      if (!lastName || !lastName.trim()) {
        formErrors.lastNameError = 'Last Name is required';
      }
      else if (lastName.trim().length > 39) {
        formErrors.lastNameError = 'Last Name must be less than 40 characters';
      }
      return formErrors;
}
module.exports =   validateForm;