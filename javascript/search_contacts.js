// UNCOMMENT WHEN DONE TESTING
//Get userId from browser
const userId = localStorage.getItem("userId");

//No userId in browser - re enable for server (disabled for home dev) ----------------------------------------------------------------------------
if (!userId) {
    alert("You must be logged in to search contacts.");
    window.location.href = "index.html"; // Redirect to login page
}

let returnedContacts = [];
let currentContactIndex = 0;
let HTMLID;

const contacts = [
    { firstName: "Alice", lastName: "Johnson", phoneNumber: "123-456-7890", email: "alice@example.com" },
    { firstName: "Bob", lastName: "Smith", phoneNumber: "987-654-3210", email: "bob@example.com" },
    { firstName: "Charlie", lastName: "Davis", phoneNumber: "456-123-7890", email: "charlie@example.com" },
    { firstName: "David", lastName: "Wilson", phoneNumber: "321-654-9870", email: "david@example.com" },
    { firstName: "Emma", lastName: "Brown", phoneNumber: "741-852-9630", email: "emma@example.com" },
    { firstName: "Frank", lastName: "Green", phoneNumber: "852-963-7410", email: "frank@example.com" },
    { firstName: "Grace", lastName: "Taylor", phoneNumber: "369-258-1470", email: "grace@example.com" },
    { firstName: "Hank", lastName: "White", phoneNumber: "159-753-4860", email: "hank@example.com" },
    { firstName: "Ivy", lastName: "Martinez", phoneNumber: "654-789-1230", email: "ivy@example.com" },
    { firstName: "Jack", lastName: "Lee", phoneNumber: "753-951-4560", email: "jack@example.com" },
    { firstName: "Jack", lastName: "Black", phoneNumber: "852-456-1230", email: "jackblack@example.com" },
    { firstName: "Black", lastName: "Jack", phoneNumber: "951-357-2580", email: "blackjack@example.com" }
]; // Example data, replace with actual fetched contacts
	
// returnedContacts = contacts; //uncomment to use constant array as returned contacts (local use) --------------------------------------

document.addEventListener("DOMContentLoaded", function () {
    const contactsPerPage = 9;
    let currentPage = 1;

    const contactCards = document.getElementById("contact-cards");
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
    const errorMsg = document.getElementById("create-error-message");
    const deleteErrorMsg = document.getElementById("delete-error-message");
    
    const updateBtn = document.getElementById("update-btn");
	const updateModal = document.getElementById("updateContactModal");
	const updateCancelBtn = document.getElementById("updateCancelBtn");
    const updateSaveContactBtn = document.getElementById("updateSaveContactBtn");
    const updateErrorMsg = document.getElementById("update-error-message");
    const noContacts = document.getElementById("noContacts");
    

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validatePhone(phone) {
        return /^\d{3}-\d{3}-\d{4}$/.test(phone); // Simple 10-digit validation
    }
    
    function renderContacts() {

        //No contacts to render
        if (returnedContacts.length == 0) {
            noContacts.style.display = "block";
            return;
        }
        else {
            noContacts.style.display = "none";
        }

        const startIndex = (currentPage - 1) * contactsPerPage;
        const endIndex = startIndex + contactsPerPage;

        contactCards.innerHTML = "";

        // const currentContacts = contacts.slice(startIndex, endIndex);
        const currentContacts = returnedContacts.slice(startIndex, endIndex);
        let offset = 0;

        //Rendering contacts
        currentContacts.forEach(contact => {
            const contactBox = document.createElement("div");
            contactBox.classList.add("contact-card");
            contactBox.setAttribute("id", "contact-box-" + (startIndex + offset));
            contactBox.setAttribute("onclick", "selectContact(id)");

            // Determine the contact's first and last name
            const firstName = contact.FirstName === undefined ? contact.firstName : contact.FirstName;
            const lastName = contact.LastName === undefined ? contact.lastName : contact.LastName;
            const phone = contact.Phone === undefined ? contact.phone : contact.Phone;
            const email = contact.Email === undefined ? contact.email : contact.Email;

            // Set the inner HTML of the contactBox
            contactBox.innerHTML = `
                <div class="contact-image">
                    <img style="border-radius: 20px;" src="images/contact_icon.jpeg" alt="Contact Icon Depiction of Palm Tree">
                </div>
                <div class="contact-info">
                    <div class="name-row">
                        <span class="first-name">${firstName}</span>
                        <span class="last-name">${lastName}</span>
                    </div>
                    <div class="phone-row">
                        <span class="phone-number">${phone}</span>
                    </div>
                    <div class="email-row">
                        <span class="email">${email}</span>
                    </div>
                </div>
            `;

            contactCards.appendChild(contactBox);
            offset += 1;
        });
        pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(returnedContacts.length / contactsPerPage)}`;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = endIndex >= returnedContacts.length;
    }

    //Initial Render of All Contacts
    doSearchContact();
    setTimeout(() => {
        // if (returnedContacts.length > 0) {  //Check if contacts exist before rendering
            renderContacts();
        // }
    }, 300); //Delay to give time for search
	
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
        setTimeout(() => {
            // if (returnedContacts.length > 0) {  //Check if contacts exist before rendering
                renderContacts();
            // }
        }, 300); //Delay to give time for search
    });
    
	
    deleteBtn.addEventListener("click", function() {
        deleteErrorMsg.textContent = "";

        if (!selectedContact) {
            deleteErrorMsg.textContent = "No contact selected.";
            return;
        }
		deleteModal.style.display = "flex";
        deleteErrorMsg.style.display = "block";
        
	});
	
    deleteConfirm.addEventListener("click", function () {
		let info = document.getElementById(HTMLID).getElementsByClassName("contact-info")[0];
		
		// Name.
		let HTMLNameInfo = info.getElementsByClassName("name-row")[0];
		let HTMLFirstName = HTMLNameInfo.getElementsByClassName("first-name")[0].innerHTML.trim();
		let HTMLLastName = HTMLNameInfo.getElementsByClassName("last-name")[0].innerHTML.trim();
		
		// Phone.
		let HTMLPhoneInfo = info.getElementsByClassName("phone-row")[0];
		let HTMLPhone = HTMLPhoneInfo.getElementsByClassName("phone-number")[0].innerHTML.trim();
		
		// Email.
		let HTMLEmailInfo = info.getElementsByClassName("email-row")[0];
		let HTMLEmail = HTMLEmailInfo.getElementsByClassName("email")[0].innerHTML.trim();
		
		// console.log(HTMLFirstName+";"+HTMLLastName+";"+HTMLPhone+";"+HTMLEmail);
		
		let contact_data = {
			firstName: HTMLFirstName,
			lastName: HTMLLastName,
			phone: HTMLPhone,
			email: HTMLEmail,
			ID: returnedContacts[currentContactIndex].ID,
			userId: userId
		};

		fetch("php/deleteContact.php", {
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
				
				selectedContact = null;
                currentContactIndex = -1;
    
                document.querySelectorAll(".contact-card").forEach(card => {
                    card.classList.remove("selected");
                });
				
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
        deleteErrorMsg.textContent = "";
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
            errorMsg.style.display = "block";
            return;
        }

        if (!validatePhone(contact_data.phone)) {
            errorMsg.textContent = "Invalid phone number.";
            errorMsg.style.display = "block";
            return;
        }

        if (!validateEmail(contact_data.email)) {
            errorMsg.textContent = "Invalid email format.";
            errorMsg.style.display = "block";
            return;
        }

        fetch("php/createContact.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(contact_data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.error) {
                errorMsg.textContent = result.error;
                errorMsg.style.display = "block";
            } else {
                createModal.style.display = "none";
                errorMsg.textContent = "";

                document.getElementById("contact_firstName").value = "";
                document.getElementById("contact_lastName").value = "";
                document.getElementById("contact_phone").value = "";
                document.getElementById("contact_email").value = "";

                //Adding info and re-rendering Contacts
                //Initial Render of All Contacts
                doSearchContact();
                setTimeout(() => {
                    // if (returnedContacts.length > 0) {  //Check if contacts exist before rendering
                        renderContacts();
                    // }
                }, 300); //Delay to give time for search
            }
        })
        .catch(error => {
            console.error("Error:", error);
            errorMsg.textContent = "An unexpected error occurred. Please try again.";
        });
    });
        
    updateBtn.addEventListener("click", function () {
        updateErrorMsg.textContent = "";

        if (!selectedContact) {
            updateErrorMsg.textContent = "No contact selected.";
            return;
        }
    
        updateModal.style.display = "flex";
        updateErrorMsg.style.display = "block";
    
        // Pre-fill update modal with selected contact data
        document.getElementById("update_contact_firstName").value = selectedContact.firstName || selectedContact.FirstName;
        document.getElementById("update_contact_lastName").value = selectedContact.lastName || selectedContact.LastName;
        document.getElementById("update_contact_phone").value = selectedContact.phone || selectedContact.Phone;
        document.getElementById("update_contact_email").value = selectedContact.email || selectedContact.Email;
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
            updateErrorMsg.style.display = "block";
            return;
        }

        if (!validatePhone(contact_data.phone)) {
            updateErrorMsg.textContent = "Invalid phone number.";
            updateErrorMsg.style.display = "block";
            return;
        }

        if (!validateEmail(contact_data.email)) {
            updateErrorMsg.textContent = "Invalid email format.";
            updateErrorMsg.style.display = "block";
            return;
        }

        fetch("php/updateContact.php", {
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
				
                selectedContact = null;
                currentContactIndex = -1;
    
                document.querySelectorAll(".contact-card").forEach(card => {
                    card.classList.remove("selected");
                });
				
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

let selectedContact = null; // Store selected contact details globally

function selectContact(passedId) {
    currentContactIndex = parseInt(passedId.split("-")[2]);
	HTMLID = passedId;
	
    if (isNaN(currentContactIndex) || currentContactIndex < 0 || currentContactIndex >= returnedContacts.length) {
        console.error("Invalid contact index:", currentContactIndex);
        return;
    }

    selectedContact = returnedContacts[currentContactIndex];

    document.querySelectorAll(".contact-card").forEach(card => {
        card.classList.remove("selected");
    });

    document.getElementById(passedId).classList.add("selected");
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

    //No userId in browser re enable for server (disabled for home dev) -----------------------------------------------------------------------------------------
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
	const url = "php/searchContact.php";


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

                        returnedContacts = alphaSortContacts(returnedContacts);

                    } else { // no results found
                        returnedContacts = [];
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

//Alphabetically sort contacts to render
function alphaSortContacts(returnedContacts) {
    returnedContacts.sort((a, b) => {
        const nameA = a.FirstName.toLowerCase();
        const nameB = b.FirstName.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;

        const lastNameA = a.LastName.toLowerCase();
        const lastNameB = b.LastName.toLowerCase();
        if (lastNameA < lastNameB) return -1;
        if (lastNameA > lastNameB) return 1;

        return 0;
    });

    return returnedContacts
}

