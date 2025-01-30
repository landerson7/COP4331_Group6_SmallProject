// UNCOMMENT WHEN DONE TESTING
/*//Get userId from browser
const userId = localStorage.getItem("userId");

//No userId in browser
if (!userId) {
    alert("You must be logged in to search contacts.");
    window.location.href = "login.html"; // Redirect to login page
}*/

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
    const createModal = document.getElementById("createContactModal");
    const cancelBtn = document.getElementById("cancelBtn");
    const saveContactBtn = document.getElementById("saveContactBtn");
    const errorMsg = document.getElementById("error-message");

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
        const currentContacts = contacts.slice(startIndex, endIndex);
        let offset = 0;
        currentContacts.forEach(contact => {
            const contactBox = document.createElement("div");
            contactBox.classList.add("contact-box");
            contactBox.setAttribute("id", "contact-box-"+(startIndex+offset));
            contactBox.setAttribute("onclick", "populateContactFields(id)");
            contactBox.innerText = `${contact.firstName} ${contact.lastName}`;
            contactResults.appendChild(contactBox);
            offset += 1;
        });
        pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(contacts.length / contactsPerPage)}`;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = endIndex >= contacts.length;
    }
	
    prevPageBtn.addEventListener("click", function () {
        if (currentPage > 1) {
            currentPage--;
            renderContacts();
        }
    });

    nextPageBtn.addEventListener("click", function () {
        if (currentPage * contactsPerPage < contacts.length) {
            currentPage++;
            renderContacts();
        }
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
    
    renderContacts();
});

//Clear userId and route to login page
function doLogout() {
    localStorage.removeItem('userId');
    window.location.href = 'index.html';
}

function populateContactFields(passedId) {
        const index = passedId.split("-")[2];
        const contact = contacts[index];
        
        // Decide whether to access elem.innerHTML, elem.textContent, or elem.value.
        document.getElementById("first-name").value = contact.firstName;
        document.getElementById("last-name").value = contact.lastName;
        document.getElementById("phone-number").value = contact.phoneNumber;
        document.getElementById("email").value = contact.email;
}