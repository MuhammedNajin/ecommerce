// script.js
const inputs = document.getElementById("inputs");

inputs.addEventListener("input", function (e) {
	const target = e.target;
	const val = target.value;

	if (isNaN(val)) {
		target.value = "";
		return;
	}

	if (val != "") {
		const next = target.nextElementSibling;
		if (next) {
			next.focus();
		}
	}
});

inputs.addEventListener("keyup", function (e) {
	const target = e.target;
	const key = e.key.toLowerCase();

	if (key == "backspace" || key == "delete") {
		target.value = "";
		const prev = target.previousElementSibling;
		if (prev) {
			prev.focus();
		}
		return;
	}
});






let countdownInterval;
function startCountdown(initialValue) {
    let n = initialValue;
    countdownInterval = setInterval(() => {
        if (n === 0) {
            clearInterval(countdownInterval);
        }
        document.querySelector('.time').innerHTML = n;
        n = n - 1;
    }, 1000);
}

function resend() {
    clearInterval(countdownInterval); 
    startCountdown(60); 
}
startCountdown(60); 

document.getElementById("resend").onclick = function () {
    resend();
};

document.getElementById('resend').addEventListener('click', () => {
	try {
		const currentUrl = window.location.href;
	
		const urlParams = new URLSearchParams(window.location.search);
		const email = urlParams.get("email");
		const {email: testmail} = urlParams;
		console.log(email);
		console.log('destrustured', testmail);
	
	   
		const postUrl = "/resend" + (email ? `?email=${encodeURIComponent(email)}` : "");
	      console.log(postUrl);
		fetch(postUrl, {
			method: "POST"
		})
		.then(response => {
			if (response.ok) {
				console.log("Resend request successful");
			} else {    
				console.error("Resend request failed");
			}
		})
		.catch(error => {
			console.error("Error:", error);
		});
	} catch (error) {
		console.error("Error:", error);
	}
	});


