//JavaScript - Login-page

//Preventing form refresh
const form = document.querySelector('.form');
form.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page

    // Collect Username & Password
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    // Reference to Error Message
    const errorMessage = document.getElementById('error-message');

    // Username / Password Blank
    if (username === '' || password === '') {
        errorMessage.textContent = 'Please enter both username and password.';
        errorMessage.style.display = 'block'; // Show error
        return;
    }

    // Hide previous error messages
    errorMessage.style.display = 'none';

    // Make API Call to login.php
    fetch('./login.php', {
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
            errorMessage.textContent = error.message;
            errorMessage.style.display = 'block'; // Show error
            console.error('Error:', error);
        });
});

//Register Button Listener
registerButton.addEventListener('click', () => {
    //Redirect to registration page
    window.location.href = './register.html';
});
