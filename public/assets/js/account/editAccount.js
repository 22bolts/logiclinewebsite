
document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const { id, email, phone_number } = user;

    console.log(`User details are: ${user}`)
    console.log(`User email is: ${email}`)
    console.log(`User phone number is: ${phone_number}`)

    const emailAddress = document.getElementById('email_address');
    const firstName = document.getElementById('first_name');
    const middleName = document.getElementById('middle_name');
    const lastName = document.getElementById('last_name');
    const phoneNumber = document.getElementById('phone_number');
    const role = document.getElementById('role');

    
    const fileInput = document.getElementById('file-input');
    // const filePreviewContainer = document.getElementById('file-preview');
    const avatarImage = document.getElementById('avatar-img');

    emailAddress.value = user.email? user.email : '';
    firstName.value = user.first_name? user.first_name : '';
    middleName.value = user.middle_name? user.middle_name : '';
    lastName.value = user.last_name? user.last_name : '';
    phoneNumber.value = user.phone_number? user.phone_number : '';
    role.value = user.role? user.role : '';

    if(user.url){
        console.log("This user has an image");
    }else{
        console.log(" this user does not have a profile picture");
    }

    const apiEndpoint = `http://localhost:3001/api/users/${id}`;


    const form = document.getElementById('updateInfo').addEventListener('submit', async function (e) {
        e.preventDefault();
        let selectedFile = fileInput.files[0];
        let avatar;

        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);

            if(fileInput){
                try {
                    const response = await fetch('http://localhost:3001/api/users/upload', {
                        method: 'POST',
                        body: formData
                    });

                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                    console.log(response);

                    const data = await response.json();
                    console.log(response);
                    const imageUrl = data.fileUrl; // URL of the uploaded image
                    console.log("The image url is:", imageUrl);
                    console.log(response);

                    avatar = imageUrl;

                    selectedFile = null;
                    fileInput.value = ''; // Reset the file input
                } catch (error) {
                    console.error('Error uploading file:', error);
                }
            }
            else{
                avatar = null
            }
        }

        const formData = {
            email: emailAddress.value,
            first_name: firstName.value,
            middle_name: middleName.value,
            last_name: lastName.value,
            phone_number: phoneNumber.value,
            role: role.value,
            avatar: avatar
            // usertag: document.getElementById('usertag').value,
            // status: 'offline',
            // avatar: '', // Add logic to handle avatar
            // companyName: document.getElementById('companyName').value,
            // address: document.getElementById('address').value,
            // department: document.getElementById('department').value,
            // position: document.getElementById('position').value,
            // managerID: null,
            // skills: [document.getElementById('skill').value],
            // portfolio_Link: document.getElementById('portfolioLink').value,
            // availabilityStatus: '',
            // hourly_Rate: parseFloat(document.getElementById('hourlyRate').value),
        };

        console.log("form data:", formData);

        try {
            const response = await fetch(apiEndpoint, {
                method: 'PUT',
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
                window.location.href = '/index.html'; // Replace with your actual login page
            } else {
                console.error('Error updating user:', result.message);
                // Handle error (e.g., show an error message)
            }
        } catch (error) {
            console.error('Error updating user:', error);
            // Handle error (e.g., show an error message)
        }
    });

    console.log(form);

    const roleSelect = document.getElementById('role');
    const clientFields = document.getElementById('clientFields');
    const freelancerFields = document.getElementById('freelancerFields');

    roleSelect.addEventListener('change', () => {
        const role = roleSelect.value;

        clientFields.style.display = role === 'client' ? 'block' : 'none';
        freelancerFields.style.display = role === 'freelancer' ? 'block' : 'none';
    });

    
    const sendFileButton = document.getElementById('send-file');

    sendFileButton.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = function(e) {
                // const image = document.createElement('img');
                // image.src = e.target.result;
                // image.alt = 'Preview Image';
                // image.classList = 'avatar-img rounded-circle border border-2 border-white'

                // filePreviewContainer.innerHTML = '';
                // filePreviewContainer.appendChild(image);
                // filePreviewContainer.style.display = 'block'; // Ensure it's visible

                avatarImage.src = e.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            filePreviewContainer.innerHTML = '';
            filePreviewContainer.style.display = 'none'; // Hide if no file is selected
        }
    });

    
    // filePreviewContainer.addEventListener('click', (event) => {
    //     if (event.target.classList.contains('remove-preview')) {
    //         selectedFile = null;
    //         filePreviewContainer.style.display = 'none';
    //         filePreviewContainer.innerHTML = '';
    //         fileInput.value = ''; // Reset the file input
    //     }
    // });
});
