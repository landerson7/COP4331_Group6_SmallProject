// UNCOMMENT WHEN DONE TESTING
//Get userId from browser
const userId = localStorage.getItem("userId");

//No userId in browser
if (!userId) {
    alert("You must be logged in to search contacts.");
    window.location.href = "login.html"; // Redirect to login page
}

let returnedContacts = [];
let currentContactIndex = 0;

const contacts = [
    { firstName: "Alice", lastName: "Johnson", phoneNumber: "1234567890", email: "alice@example.com" },
    { firstName: "Bob", lastName: "Smith", phoneNumber: "9876543210", email: "bob@example.com" },
    { firstName: "Charlie", lastName: "Davis", phoneNumber: "4561237890", email: "charlie@example.com" },
    { firstName: "David", lastName: "Wilson", phoneNumber: "3216549870", email: "david@example.com" },
    { firstName: "Emma", lastName: "Brown", phoneNumber: "7418529630", email: "emma@example.com" },
    { firstName: "Frank", lastName: "Green", phoneNumber: "8529637410", email: "frank@example.com" },
    { firstName: "Grace", lastName: "Taylor", phoneNumber: "3692581470", email: "grace@example.com" },
    { firstName: "Hank", lastName: "White", phoneNumber: "1597534860", email: "hank@example.com" },
    { firstName: "Ivy", lastName: "Martinez", phoneNumber: "6547891230", email: "ivy@example.com" },
    { firstName: "Jack", lastName: "Lee", phoneNumber: "7539514560", email: "jack@example.com" },
    { firstName: "Jack", lastName: "Black", phoneNumber: "8524561230", email: "jackblack@example.com" },
    { firstName: "Black", lastName: "Jack", phoneNumber: "9513572580", email: "blackjack@example.com" }
]; // Example data, replace with actual fetched contacts
	
document.addEventListener("DOMContentLoaded", function () {
    const contactsPerPage = 5;
    let currentPage = 1;

    const contactResults = document.getElementById("contact-results");
    const prevPageBtn = document.getElementById("prev-page");
    const nextPageBtn = document.getElementById("next-page");
    const pageInfo = document.getElementById("page-info");
    const createBtn = document.getElementById("create-btn");
    const searchBtn = document.getElementById("search-btn");
    const deleteBtn = document.getElementById("delete-btn");
    const deleteConfirm = document.getElementById("deleteConfirm");
    const deleteCancel= document.getElementById("deleteCancel");
    const createModal = document.getElementById("createContactModal");
    const deleteModal = document.getElementById("deleteContactModal");
    const cancelBtn = document.getElementById("cancelBtn");
    const saveContactBtn = document.getElementById("saveContactBtn");
    const errorMsg = document.getElementById("error-message");
    const deleteErrorMsg = document.getElementById("delete-error-message");
    
    const updateBtn = document.getElementById("update-btn");
	const updateModal = document.getElementById("updateContactModal");
	const updateCancelBtn = document.getElementById("updateCancelBtn");
    const updateSaveContactBtn = document.getElementById("updateSaveContactBtn");
    const updateErrorMsg = document.getElementById("update-error-message");
    

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validatePhone(phone) {
        return /^\d{10}$/.test(phone); // Simple 10-digit validation
    }
    
    function renderContacts() {
        contactResults.innerHTML = "";
        const startIndex = (currentPage - 1) * contactsPerPage;
        const endIndex = startIndex + contactsPerPage;
        // const currentContacts = contacts.slice(startIndex, endIndex);
        const currentContacts = returnedContacts.slice(startIndex, endIndex);
        let offset = 0;
        currentContacts.forEach(contact => {
            const contactBox = document.createElement("div");
            contactBox.classList.add("contact-box");
            contactBox.setAttribute("id", "contact-box-"+(startIndex+offset));
            contactBox.setAttribute("onclick", "populateContactFields(id)");

			// A contact from the client-side global array.
			if (contact.FirstName === undefined) {
				contactBox.innerText = `${contact.firstName} ${contact.lastName}`;
			}
			
			// A contact returned from the API.
			else {
				contactBox.innerText = `${contact.FirstName} ${contact.LastName}`;
			}
            
            contactResults.appendChild(contactBox);
            offset += 1;
        });
        pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(returnedContacts.length / contactsPerPage)}`;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = endIndex >= returnedContacts.length;
    }
	
    prevPageBtn.addEventListener("click", function () {
        if (currentPage > 1) {
            currentPage--;
            renderContacts();
        }
    });

    nextPageBtn.addEventListener("click", function () {
        if (currentPage * contactsPerPage < returnedContacts.length) {
            currentPage++;
            renderContacts();
        }
    });

    searchBtn.addEventListener("click", function() {
		doSearchContact();
		renderContacts();
	});
	
    deleteBtn.addEventListener("click", function() {
		deleteModal.style.display = "flex";
        deleteErrorMsg.textContent = "";
	});
	
    deleteConfirm.addEventListener("click", function () {
		let contact_data = {
			firstName: document.getElementById("first-name").value.trim(),
			lastName: document.getElementById("last-name").value.trim(),
			phone: document.getElementById("phone-number").value.trim(),
			email: document.getElementById("email").value.trim(),
			ID: returnedContacts[currentContactIndex].ID,
			userId: userId
		};
		
		if (!contact_data.firstName || !contact_data.lastName || !contact_data.phone || !contact_data.email) {
				deleteErrorMsg.textContent = "All fields are required!";
				return;
			}

		if (!validatePhone(contact_data.phone)) {
			deleteErrorMsg.textContent = "Invalid phone number. Please enter a 10-digit number.";
			return;
		}

		if (!validateEmail(contact_data.email)) {
			deleteErrorMsg.textContent = "Invalid email format.";
			return;
		}

		fetch("deleteContact.php", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(contact_data)
		})
		.then(response => response.json())
		.then(result => {
			if (result.error) {
				deleteErrorMsg.textContent = result.error;
			} else {
				// Delete element from the global array.
				returnedContacts.splice(currentContactIndex, 1);
				renderContacts();
				
				document.getElementById("first-name").value = "";
				document.getElementById("last-name").value = "";
				document.getElementById("phone-number").value = "";
				document.getElementById("email").value = "";
				
				deleteModal.style.display = "none";
				deleteErrorMsg.textContent = "";
			}
		})
		.catch(error => {
			console.error("Error:", error);
			deleteErrorMsg.textContent = "An unexpected error occurred. Please try again.";
		});
	});
	
    deleteCancel.addEventListener("click", function() {
		deleteModal.style.display = "none";
	});
    
    createBtn.addEventListener("click", function () {
        createModal.style.display = "flex";
        errorMsg.textContent = "";
    });

    cancelBtn.addEventListener("click", function () {
        createModal.style.display = "none";
        errorMsg.textContent = "";
        document.getElementById("contact_firstName").value = "";
        document.getElementById("contact_lastName").value = "";
        document.getElementById("contact_phone").value = "";
        document.getElementById("contact_email").value = "";
    });

    saveContactBtn.addEventListener("click", function () {
        const contact_data = {
            firstName: document.getElementById("contact_firstName").value.trim(),
            lastName: document.getElementById("contact_lastName").value.trim(),
            phone: document.getElementById("contact_phone").value.trim(),
            email: document.getElementById("contact_email").value.trim(),
            userId: userId
        };

        if (!contact_data.firstName || !contact_data.lastName || !contact_data.phone || !contact_data.email) {
            errorMsg.textContent = "All fields are required!";
            return;
        }

        if (!validatePhone(contact_data.phone)) {
            errorMsg.textContent = "Invalid phone number. Please enter a 10-digit number.";
            return;
        }

        if (!validateEmail(contact_data.email)) {
            errorMsg.textContent = "Invalid email format.";
            return;
        }

        fetch("createContact.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(contact_data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.error) {
                errorMsg.textContent = result.error;
            } else {
                createModal.style.display = "none";
                errorMsg.textContent = "";
            }
        })
        .catch(error => {
            console.error("Error:", error);
            errorMsg.textContent = "An unexpected error occurred. Please try again.";
        });
    });
        
    updateBtn.addEventListener("click", function () {
        updateModal.style.display = "flex";
		
		document.getElementById("update_contact_firstName").value = document.getElementById("first-name").value;
        document.getElementById("update_contact_lastName").value = document.getElementById("last-name").value;
        document.getElementById("update_contact_phone").value = document.getElementById("phone-number").value;
        document.getElementById("update_contact_email").value = document.getElementById("email").value;
		
        updateErrorMsg.textContent = "";
    });

    updateCancelBtn.addEventListener("click", function () {
        updateModal.style.display = "none";
        updateErrorMsg.textContent = "";
        document.getElementById("update_contact_firstName").value = "";
        document.getElementById("update_contact_lastName").value = "";
        document.getElementById("update_contact_phone").value = "";
        document.getElementById("update_contact_email").value = "";
    });

    updateSaveContactBtn.addEventListener("click", function () {
		let contact_data = {
            firstName: document.getElementById("update_contact_firstName").value.trim(),
            lastName: document.getElementById("update_contact_lastName").value.trim(),
            phone: document.getElementById("update_contact_phone").value.trim(),
            email: document.getElementById("update_contact_email").value.trim(),
			ID: returnedContacts[currentContactIndex].ID,
            userId: userId
        };
		
        if (!contact_data.firstName || !contact_data.lastName || !contact_data.phone || !contact_data.email) {
            updateErrorMsg.textContent = "All fields are required!";
            return;
        }

        if (!validatePhone(contact_data.phone)) {
            updateErrorMsg.textContent = "Invalid phone number. Please enter a 10-digit number.";
            return;
        }

        if (!validateEmail(contact_data.email)) {
            updateErrorMsg.textContent = "Invalid email format.";
            return;
        }

        fetch("updateContact.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(contact_data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.error) {
                updateErrorMsg.textContent = result.error;
            } else {
                returnedContacts[currentContactIndex] = contact_data;
				renderContacts();
				
				let passedId = "contact-box-" + currentContactIndex;
				populateContactFields(passedId);
				
				updateModal.style.display = "none";
                updateErrorMsg.textContent = "";
            }
        })
        .catch(error => {
            console.error("Error:", error);
            updateErrorMsg.textContent = "An unexpected error occurred. Please try again.";
        });
    });
    
    renderContacts();
});

//Clear userId and route to login page
function doLogout() {
    localStorage.removeItem('userId');
    window.location.href = 'index.html';
}

function populateContactFields(passedId) {
        currentContactIndex = passedId.split("-")[2];
        const contact = returnedContacts[currentContactIndex];

		// A contact from the client-side global array.
		if (contact.FirstName === undefined) {
			document.getElementById("first-name").value = contact.firstName;
			document.getElementById("last-name").value = contact.lastName;
			document.getElementById("phone-number").value = contact.phone;
			document.getElementById("email").value = contact.email;
		}

		// A contact returned from the API.
		else {
			document.getElementById("first-name").value = contact.FirstName;
			document.getElementById("last-name").value = contact.LastName;
			document.getElementById("phone-number").value = contact.Phone;
			document.getElementById("email").value = contact.Email;
		
		}
}

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
	const url = "searchContact.php";


    //XML Request made
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    console.log(response);
                    if (response.contacts && response.contacts.length > 0) {
                        returnedContacts = response.contacts;
                    } else { // no results found
                        displayNoResultsMessage();
                    }
                } catch (err) {
                    console.error("Error parsing response:", err);
                    alert("An error occurred while processing the response.");
                }
            } else {
                console.error(`Error: ${this.status} - ${xhr.statusText}`);
                alert(`Failed to search contacts. Status: ${this.status}`);
            }
        }
    };    
    xhr.send(jsonPayload);
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

