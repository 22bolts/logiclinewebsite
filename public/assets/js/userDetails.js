
const user = JSON.parse(localStorage.getItem('user'));
document.addEventListener('DOMContentLoaded', () => {
    // const userDetail = document.getElementById('userDetail');
    const userDetails = document.querySelectorAll('.userDetail');
    // const emailField = document.getElementById('emailField');
    const emailFields = document.querySelectorAll('.emailField');
    const profileTagFields = document.querySelectorAll('.profile_tag');
    const avatarImgFields = document.querySelectorAll('.avatar-img');
    var signupSection = document.getElementById("signupSection");

    var profileSection = document.getElementById("profileSection");

    console.log(document.getElementById("signupSection"));

    if (user) {
        console.log('Logged in user exists with details:', user);
        if(signupSection){
            signupSection.style.display = "none";
        }
        if(profileSection){
            profileSection.style.display = "block";
        }
        displayUserDetails();

        const { id } = user;
        fetchUnreadCount(id);
    } else {
        console.log('No user logged in');
        if(signupSection){
            signupSection.style.display = "block";
        }
        if(profileSection){
            profileSection.style.display = "none";
        }
        // signupSection.classList.remove('d-none'); 
        // Handle case where no user is logged in
    }

    function displayUserDetails() {
        userDetails.forEach((userDetail) =>{
            userDetail.innerHTML = `${user.first_name} ${user.last_name}`;
        })
        // userDetail.innerHTML = `${user.first_name} ${user.last_name}`;

        emailFields.forEach((emailField) =>{
            emailField.innerHTML = `${user.email}`;
        })
        // emailField.innerHTML = `${user.email}`;

        console.log(profileTagFields);

        if(profileTagFields.length > 0){
            profileTagFields.forEach((profileTag) => {
                profileTag.classList.add(user.role)
                profileTag.innerHTML = `<span>${user.role}</span>`
            })
        }

        if(avatarImgFields.length > 0){
            avatarImgFields.forEach((avartarImg) => {
                if(user.avatar){
                    avartarImg.src = `http://localhost:3001${user.avatar}`;
                }else{
                    avartarImg.src = '';
                    avartarImg.alt = "isjfkid";
                }
            })
        }
    }


    // Example usage
    const rating = 3.8; // Replace with your dynamic rating value
    displayStars(rating);

    function displayStars(rating) {
        const starsContainer = document.getElementById('stars-container');
        starsContainer.innerHTML = ''; // Clear existing stars
        starsContainer.innerHTML += `
            <div class="fw-bold">${rating}</div>
            <div id="star_holder"></div>
        `
        const starHolder = document.getElementById('star_holder');
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('i');
            if (rating >= i) {
                star.classList.add('fas', 'fa-star', 'filled');
            } else if (rating >= i - 0.5) {
                star.classList.add('fas', 'fa-star-half-alt', 'filled');
            } else {
                star.classList.add('far', 'fa-star');
            }
            star.classList.add('rating_star');
            starHolder.appendChild(star);
        }
    }
    
    async function fetchUnreadCount(userId) {
        const authToken = localStorage.getItem('authToken');
        const notificationCountField = document.getElementById('notification_count');
        
        const apiEndpoint = `http://localhost:3001/api/notifications/users/${userId}/unread-count`;
        console.log(document.querySelectorAll('.emailField'));
        if(userId){
            console.log("This exists:", document.getElementById("signupSection"));
            console.log("This exists:", document.getElementById("notification_count"));
            try {
                const response = await fetch(apiEndpoint, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                const data = await response.json();

                const unreadMessages = Number(data.unreadCount);

                console.log("Unread messages:", unreadMessages);

                console.log("This exists:", document.getElementById('notification_count'));

                if(notificationCountField){
                    if(unreadMessages > 0){
                        notificationCountField.innerHTML = `<span>${data.unreadCount}</span>`;
                    } else{
                        notificationCountField.style.display = "none";
                    }
                }
            } catch (error) {
                console.error('Error fetching unread count:', error);
            }
        }
    }

    // Check if user is signed in on page load
    if (localStorage.getItem('username')) {
        displayUserDetails();
    }
});

