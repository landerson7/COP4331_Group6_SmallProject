const contacts = [
        { name: "Alice Johnson",
          phoneNumber: "1234567890",
          email: "alice@example.com"},
        { name: "Bob Smith" },
        { name: "Charlie Davis" },
        { name: "David Wilson" },
        { name: "Emma Brown" },
        { name: "Frank Green" },
        { name: "Grace Taylor" },
        { name: "Hank White" },
        { name: "Ivy Martinez" },
        { name: "Jack Lee" },
        { name: "Jack Black" },
        { name: "Black Jack" }
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
            contactBox.innerText = contact.name;
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
            userId: 1  // Replace with actual user ID
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

function populateContactFields(passedId) {
        const index = passedId.split("-")[2];
        const contact = contacts[index];
        const nameArray = contact.name.split(" ");
        
        // Decide whether to access elem.innerHTML, elem.textContent, or elem.value.
        document.getElementById("first-name").value = nameArray[0];
        document.getElementById("last-name").value = nameArray[1];
        document.getElementById("phone-number").value = contact.phoneNumber;
        document.getElementById("email").value = contact.email;
}