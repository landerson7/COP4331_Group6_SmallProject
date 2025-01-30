document.getElementById("password").addEventListener("input", validatePassword);
document.getElementById("register-btn").addEventListener("click", register);

function validatePassword() {
	const password = document.getElementById("password").value;
	const lengthReq = document.getElementById("length-req");
	const capitalReq = document.getElementById("capital-req");
	const specialReq = document.getElementById("special-req");

	// Regex checks
	const hasLength = password.length >= 8;
	const hasCapital = /[A-Z]/.test(password);
	const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

	// Update length requirement
	if (hasLength) {
		lengthReq.style.color = "green";
		lengthReq.innerHTML = "&#9989; At least 8 Characters Long";
		
	} else {
		lengthReq.style.color = "red";
		lengthReq.innerHTML = "&#10060; At least 8 Characters Long";
	}

	// Update capital letter requirement
	if (hasCapital) {
		capitalReq.style.color = "green";
		capitalReq.innerHTML = "&#9989; At least 1 Capital Letter";
		
	} else {
		capitalReq.style.color = "red";
		capitalReq.innerHTML = "&#10060; At least 1 Capital Letter";
	}

	// Update special character requirement
	if (hasSpecial) {
		specialReq.style.color = "green";
		specialReq.innerHTML = "&#9989; At least 1 Special Character";
	
	} else {
		specialReq.style.color = "red";
		specialReq.innerHTML = "&#10060; At least 1 Special Character";
	}
}

function register() {
	const firstName = document.getElementById("first-name").value;
	const lastName = document.getElementById("last-name").value;
	const username = document.getElementById("username").value;
	const password = document.getElementById("password").value;

	const lengthReq = /[A-Z]/.test(password);
	const capitalReq = /[A-Z]/.test(password);
	const specialReq = /[!@#$%^&*(),.?":{}|<>]/.test(password);

	if (!firstName || !lastName || !username || !password) {
		document.getElementById("error-message").innerText = "All fields are required.";
		document.getElementById("error-message").style.display = "block";
		return;
	}

	if (!(lengthReq && capitalReq && specialReq)) {
		document.getElementById("error-message").innerText = "Password does not meet the requirements.";
		document.getElementById("error-message").style.display = "block";
		return;
	}

	const data = {
		firstName: firstName,
		lastName: lastName,
		username: username,
		password: password,
	};

	fetch("createAccount.php", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		
		body: JSON.stringify(data),
	})
	.then((response) => response.json())
	.then((data) => {
		if (data.error) {
			document.getElementById("error-message").innerText = data.error;
			document.getElementById("error-message").style.display = "block";
		
		} else {
			alert("Registration successful! Welcome, " + data.firstName + "!");
			
			    // Make API Call to login.php after registering
				fetch('login.php', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						login: username,
						password: password,
					}),
				})
					.then((response) => response.json())
					.then((data) => {
						if (data.error) {
							// Display error from server
							errorMessage.textContent = data.error;
							errorMessage.style.display = 'block'; // Show error
						} else {
							// Redirect to contacts page on success
							window.location.href = './search_contacts.html';
							//set local data
							localStorage.setItem('userId', data.id);
						}
					})
					.catch((error) => {
						// Handle network errors
						errorMessage.textContent = 'An error occurred. Please try again later.';
						errorMessage.style.display = 'block'; // Show error
						console.error('Error:', error);
					});
			
		}
	})
	.catch((error) => {
		document.getElementById("error-message").innerText = "An error occurred. Please try again.";
		document.getElementById("error-message").style.display = "block";
		
	});
}