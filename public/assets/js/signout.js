document.addEventListener('DOMContentLoaded', () => {
    // Sign-out functionality
    document.getElementById('signoutLink').addEventListener('click', function (e) {
        e.preventDefault();
        
        // Clear user details from localStorage
        localStorage.removeItem('user');
        
        // Redirect to sign-in page
        window.location.href = '/index.html'; // Replace with your actual sign-in page URL
    });

    // console.log("Sign out in process");

    // Load user details dynamically
    const userDetailsElement = document.getElementById('userDetails');
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && user.first_name && user.last_name) {
        userDetailsElement.textContent = `${user.first_name} ${user.last_name}`;
    } else {
        userDetailsElement.textContent = 'Guest';
    }
});
