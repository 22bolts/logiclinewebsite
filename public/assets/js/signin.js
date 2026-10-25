document.addEventListener('DOMContentLoaded', () => {
    const apiEndpoint = 'http://localhost:3001/api/users/signin';

    document.getElementById('signinForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = {
            email: document.getElementById('email_address').value,
            password: document.getElementById('psw-input').value,
        };

        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                console.log('User signed in:', result);

                // Save user details to localStorage
                localStorage.setItem('user', JSON.stringify(result.data, result));
                localStorage.setItem('authToken', JSON.stringify(result.token));

                // Handle success (e.g., redirect to a welcome page or dashboard)
                window.location.href = 'index.html';
            } else {
                console.error('Error signing in:', result.message);
                alert(result.message); // Display the error message to the user
            }
        } catch (error) {
            console.error('Error signing in:', error);
            alert('An error occurred while signing in. Please try again later.');
        }
    });
});
