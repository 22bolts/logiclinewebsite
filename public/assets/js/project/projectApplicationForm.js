
const urlParams = new URLSearchParams(window.location.search);

const projectId = urlParams.get('projectId');

let projectDetails;

async function GetData() {
    console.log("Trying to get data");

    const authToken = localStorage.getItem('authToken');
    const apiEndpoint = `http://localhost:3001/api/projects/projectDetails/${projectId}`;

    try {
        const response = await fetch(apiEndpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}` // Assuming you need the auth token for the request
            },
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        console.log("data:", data);
        return data;
    } catch (e) {
        console.error('Error fetching data:', e);
        return null;
    }
}

async function renderScreen() {
    console.log("Trying");
    const submitApplication = document.getElementById("submit_application");
    const projectsContainer = document.querySelector(".projects-container");

    // applyNow.href

    submitApplication.addEventListener('click', applyForJob)

    console.log("Trying");

    try {
        projectDetails = await GetData();
        const { projectName, description, skills, progress, tags } = projectDetails;
        console.log("The Project details are:", projectDetails);

        document.querySelector('#projectName').textContent = projectName;
        document.querySelector('#description').textContent = description;

        // Handle skills
        const skillsArray = skills.split(',');
        console.log("Skills list:", skillsArray);
        if(skills){
            const skillsArray = skills.split(',');
            const skillsList = document.querySelector('.skills-list');
            skillsList.innerHTML = ''; // Clear any existing skills

            skillsArray.forEach(skill => {
                const listItem = document.createElement('li');
                listItem.className = 'list-group-item d-flex mb-0';
                listItem.innerHTML = `<i class="bi bi-patch-check text-primary me-2"></i>${skill.trim()}`;
                skillsList.appendChild(listItem);
            });
        }
    } catch (error) {
        console.error('Error rendering projects:', error);
    }
}

async function applyForJob() {
    const authToken = localStorage.getItem('authToken');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!authToken || !user) {
        console.error("Authentication token or user information is missing.");
        return null;
    }

    const { id } = user;
    console.log("User id is:", id);

    const message = document.getElementById('application_message')?.value;
    if (!message) {
        console.error("Application message is missing.");
        return null;
    }

    const portfolioIds = [1, 2, 3]; // Replace with actual portfolio IDs if needed

    const apiEndpoint = `http://localhost:3001/api/projects/${projectId}/apply`;

    try {
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ userId: id, message, portfolioIds }),
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        console.log("Application successful:", data);

        try {
            await notifyUser(data.clientId, message);
        } catch (notificationError) {
            console.error('Error notifying user:', notificationError);
        }

        // Navigate back to the previous screen
        // window.history.back();
        return data;
    } catch (e) {
        console.error('Error applying for project:', e);
        return null;
    }
}

async function notifyUser(userId, message) {
    console.log("Attempting to notify user");
    const authToken = localStorage.getItem('authToken');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!authToken || !user) {
        console.error("Authentication token or user information is missing.");
        return;
    }

    const apiEndpoint = `http://localhost:3001/api/notifications`;

    try {
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ userId, title: `${user.first_name} ${user.last_name} applied for Project: ${projectDetails.projectName}` , message: message}),
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        console.log("Successfully notified user of Application:", data);
        return data;
    } catch (error) {
        console.error('Error notifying user:', error);
    }
}


document.addEventListener('DOMContentLoaded', renderScreen);
