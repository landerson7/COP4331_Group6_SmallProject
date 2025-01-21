//JavaScript - Register-page

//Preventing form refresh
const form = document.querySelector('.form');
form.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page
});

//References to Buttons
const loginButton = document.getElementById('login-btn');
const registerButton = document.getElementById('register-btn');

//Login Button Listener
loginButton.addEventListener('click', () => {
	//Redirect to login page
    window.location.href = './index.html';
});

//Register Button Listener
registerButton.addEventListener('click', () => {
    
	//Collect Username & Password
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
	
    //Username / Password Blank
    if (username === '' || password === '') {
        const errorMessage = document.getElementById('error-message');
		errorMessage.textContent = 'Please enter both username and password.';
        errorMessage.style.display = 'block'; //Show error
        
    }
	
	//Username & Password Given - Validate Record
    	//Waiting on API
	//Search for record
		//Record found
//		if (record_found) {
			//Go to contacts page
			// window.location.href = './search_contacts.html';
//		}
		//Record not found
//		if (!record_found) {
	//		const errorMessage = document.getElementById('error-message');
	//	 	errorMessage.textContent = 'Incorrect username or password.';
	//      errorMessage.style.display = 'block'; //Show error
//		}


});
