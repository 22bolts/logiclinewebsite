document.addEventListener('DOMContentLoaded', () => {
    const apiEndpoint = 'http://localhost:3001/api/users/signup';

    document.getElementById('signupForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = {
            email: document.getElementById('email_address').value,
            password: document.getElementById('psw-input').value,
            first_name: document.getElementById('first_name').value,
            middle_name: document.getElementById('middle_name').value,
            last_name: document.getElementById('last_name').value,
            // phone_number: document.getElementById('phone_number').value,
            role: document.getElementById('role').value,
            usertag: document.getElementById('usertag').value,
            status: 'offline',
            // avatar: '', // Add logic to handle avatar
            companyName: document.getElementById('companyName').value,
            address: document.getElementById('address').value,
            // department: document.getElementById('department').value,
            // position: document.getElementById('position').value,
            // managerID: null,
            skills: [document.getElementById('skill').value],
            portfolio_Link: document.getElementById('portfolioLink').value,
            // availabilityStatus: '',
            hourly_Rate: parseFloat(document.getElementById('hourlyRate').value),
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
                console.log('User created:', result);

                // Save user details to localStorage
                localStorage.setItem('user', JSON.stringify(result.data));

                // Handle success (e.g., redirect to a login page)
                window.location.href = 'index.html';
            } else {
                console.error('Error creating user:', result.message);
                // Handle error (e.g., show an error message)
            }
        } catch (error) {
            console.error('Error creating user:', error);
            // Handle error (e.g., show an error message)
        }
    });

    const roleSelect = document.getElementById('role');
    const clientFields = document.getElementById('clientFields');
    const freelancerFields = document.getElementById('freelancerFields');

    roleSelect.addEventListener('change', () => {
        const role = roleSelect.value;

        clientFields.style.display = role === 'client' ? 'block' : 'none';
        freelancerFields.style.display = role === 'freelancer' ? 'block' : 'none';
    });
});
