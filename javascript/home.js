document.getElementById("search-btn").addEventListener("click", goToSearchPage);
document.getElementById("logout-btn").addEventListener("click", logout);

function goToSearchPage() {
	window.location.href = './search_contacts.html';
}

function logout() {
	// Delete cookie.
	
	// Go to Front Login Page.
	window.location.href = './index.html';
}
