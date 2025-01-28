const urlBase = 'http://localhost:80/COP4331_Group6_SmallProject/php';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin()
{
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
    fetch(urlBase + '/login.' + extension, {
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

}


function doSignup()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let username = document.getElementById("username").value;
	let password = document.getElementById("password").value;
	let firstName = document.getElementById("firstName").value;
	let lastName = document.getElementById("lastName").value;
	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:username,password:hash, firstName:firstName, lastName:lastName};
	//var tmp2 = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/createAccount.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "color.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

// function doCreateContact() {}

// function doDeleteContact() {}

//searches for contacts
function doSearchContact() {
    //search term from box
    const searchBox = document.getElementById("search-box");
    const searchTerm = searchBox.value.trim();
	const fullName = searchTerm.split(" ");
	let firstName = "";
	let lastName = "";
	console.log(fullName);
	if (fullName.length > 1) {
		firstName = fullName[0];
		lastName = fullName[1];
	} else {
		firstName = fullName[0];
		lastName = "";
	}
    //Get userId from browser
    const userId = localStorage.getItem("userId");

    //No userId in browser
    if (!userId) {
        alert("You must be logged in to search contacts.");
        return;
    }
    

    //payload
	let payload;
	if (lastName === "") {
		console.log(firstName)
		payload = { firstName: searchTerm, userId: userId };
	} else {
		//console.log(firstName)
		payload = { firstName: firstName, lastName: lastName, userId: userId };
	}
    

	console.log(payload);
    const jsonPayload = JSON.stringify(payload);

    
    //url
	const url = urlBase + '/searchContact.' + extension;

    //XML Request made
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
           
                try {
                    const response = JSON.parse(xhr.responseText);
					console.log(response);
                    //Display from handler func
                    if (response.contacts && response.contacts.length > 0) {
                        displaySearchResults(response.contacts);
                    } else { //no results found
                        displayNoResultsMessage();
                    }
                } catch (err) {
                    console.error("Error parsing response:", err);
                    alert("An error occurred while processing the response.");
                }
            } else { //error
                console.error(`Error: ${this.status} - ${xhr.statusText}`);
                alert(`Failed to search contacts. Status: ${this.status}`);
            }
        
    };

    xhr.send(jsonPayload);
}

// Function to display search results
function displaySearchResults(contacts) {
    const resultsContainer = document.getElementById("contact-results");

    // Clear any previous results
    resultsContainer.innerHTML = "";

    // Loop through the contacts and create elements for each
    contacts.forEach(contact => {
        const contactDiv = document.createElement("div");
        contactDiv.className = "contact-item";
		console.log("contact" + contact);
        contactDiv.innerHTML = `
            <button> ${contact.FirstName} ${contact.LastName}</button>
            
        `;

        resultsContainer.appendChild(contactDiv);
    });
}

// Function to display a "no results found" message
function displayNoResultsMessage() {
    const resultsContainer = document.getElementById("contact-results");

    // Clear previous results
    resultsContainer.innerHTML = "";

    // Display message
    const messageDiv = document.createElement("div");
    messageDiv.className = "no-results";
    messageDiv.textContent = "No contacts found.";
    resultsContainer.appendChild(messageDiv);
}
