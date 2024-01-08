
function alert(id) {
    setTimeout(() => {
        id.style.border = '';
        id.textContent = '';
        id.classList.remove('custom_alert');
    }, 3000); 
}

function validate() {
    try {
        
        let username = document.getElementById('uname');
        let email = document.getElementById('email');
        let pass = document.getElementById('password');
        let con = document.getElementById('conform');

        if(!/^\w+$/.test(username.value)) {
            uError.style.border = 'solid 1px red';
            uError.style.textContent = 'only allow letters numbers and underscore';
            alert(uError);

            return false;
        }
    } catch (error) {
        console.log(error);
    }
}




    document.getElementById('cross')
    .addEventListener('click', () => {
        document.querySelector('.error')
        .style.display = "none";
    }, );
