document.addEventListener("DOMContentLoaded", function () {
    const contacts = [
        { name: "Alice Johnson" },
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
    ]; //Example data, replace with actual fetched contacts

    const contactsPerPage = 5;
    let currentPage = 1;

    const contactResults = document.getElementById("contact-results");
    const prevPageBtn = document.getElementById("prev-page");
    const nextPageBtn = document.getElementById("next-page");
    const pageInfo = document.getElementById("page-info");

    function renderContacts() {
        contactResults.innerHTML = "";

        const startIndex = (currentPage - 1) * contactsPerPage;
        const endIndex = startIndex + contactsPerPage;
        const currentContacts = contacts.slice(startIndex, endIndex);

        currentContacts.forEach(contact => {
            const contactBox = document.createElement("div");
            contactBox.classList.add("contact-box");
            contactBox.innerText = contact.name;
            contactResults.appendChild(contactBox);
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

    renderContacts();
});

