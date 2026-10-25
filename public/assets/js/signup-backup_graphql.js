document.addEventListener('DOMContentLoaded', () => {
    const graphqlEndpoint = 'http://localhost:3001/graphql';

    const CREATE_USER = `
        mutation CreateUser(
            $email: String!,
            $password: String!,
            $first_name: String!,
            $middle_name: String,
            $last_name: String!,
            $phone_number: String,
            $role: String!,
            $usertag: String!,
            $status: String!,
            $avatar: String,
            $companyName: String,
            $address: String,
            $department: String,
            $position: String,
            $managerID: ID,
            $skills: [String!],
            $portfolio_Link: String,
            $availabilityStatus: String,
            $hourly_Rate: Float,
        ) {
            createUser(
                email: $email,
                password: $password,
                first_name: $first_name,
                middle_name: $middle_name,
                last_name: $last_name,
                phone_number: $phone_number,
                role: $role,
                usertag: $usertag,
                status: $status,
                avatar: $avatar,
                companyName: $companyName,
                address: $address,
                department: $department,
                position: $position,
                managerID: $managerID,
                skills: $skills,
                portfolio_Link: $portfolio_Link,
                availabilityStatus: $availabilityStatus,
                hourly_Rate: $hourly_Rate,
            ) {
                first_name
                middle_name
                email
            }
        }
    `;

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
            // managerID: null, // Add logic to handle managerID
            skills: [document.getElementById('skill').value], // Add logic to handle multiple skills
            portfolio_Link: document.getElementById('portfolioLink').value,
            // availabilityStatus: '', // Add logic to handle availabilityStatus
            hourly_Rate: parseFloat(document.getElementById('hourlyRate').value),
        };

        try {
            const response = await fetch(graphqlEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: CREATE_USER,
                    variables: formData,
                }),
            });

            const result = await response.json();

            if (response.ok && result.data) {
                console.log('User created:', result.data.createUser);

                // Save user details to localStorage
                localStorage.setItem('user', JSON.stringify(result.data.createUser));

                // Handle success (e.g., redirect to a login page)
                window.location.href = '/index.html'; // Replace with your actual login page
            } else {
                console.error('Error creating user:', result.errors);
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
