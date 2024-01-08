
function alert(id) {
    setTimeout(() => {
        id.style.border = '';
        id.textContent = '';
        id.classList.remove('custom_alert');
    }, 3000); 
}

function validate(){
    let username = document.getElementById("uname");
    let password = document.getElementById("password");
    let passwordconf = document.getElementById("conform");
    let userphone = document.getElementById("phone");
    
    
    if( !/^\w+$/.test(username.value) ){
    username.style.border = 'solid 1px red'    
    userError.textContent = "only allow letters numbers and underscores"
    setTimeout(function () {
        username.style.border = '';
        userError.textContent = '';
    }, 3000); 
   
    return false;
    }
    else if (userphone.value.trim().length < 10 || !/^\d+$/.test(userphone.value)) {
        
    userphone.style.border = 'solid 1px red';
    phoneErr.textContent = "Mobile number should be an Number with  10 digits";
    setTimeout(function () {
        userphone.style.border = '';
        phoneErr.textContent = '';
    }, 3000);
    return false;
}



   else if (  !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/.test(password.value) ) {
      password.style.border = 'solid 1px red';
      passwordError.textContent = "Password must be atleast 6 charcaters long and contain at least one uppercase letter one lowercase letter,and one number";
      setTimeout(function () {
        password.style.border = '';
        passwordError.textContent = '';
    }, 6000);
      return false;
   }

    else if( password.value !== passwordconf.value ){
        passwordconf.style.border = 'solid 1px red';
        passwordError2.textContent = "Password should be same";
        setTimeout(function () {
        passwordconf.style.border = '';
        passwordError2.textContent = '';
    }, 3000);
        return false

    }
    else{
         
        true;
    }
}




    // document.getElementById('cross')
    // .addEventListener('click', () => {
    //     document.querySelector('.error')
    //     .style.display = "none";
    // }, );
