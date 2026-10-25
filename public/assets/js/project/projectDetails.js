
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
    const applyNow = document.getElementById("apply_now");
    const projectsContainer = document.querySelector(".projects-container");

    // applyNow.href

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

        getApplicants();
    } catch (error) {
        console.error('Error rendering projects:', error);
    }
}

async function getApplicants() {
    const applyNowButton = document.getElementById("apply_now");
    const authToken = localStorage.getItem('authToken');
    const apiEndpoint = `http://localhost:3001/api/projects/${projectId}/applications`;
    const user = JSON.parse(localStorage.getItem('user'));
    const { id } = user;

    try {
        const response = await fetch(apiEndpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        console.log("Applicants:", data);

    
        // applyNowButton.addEventListener('click', applyForJob)

        hasUserAppliedAlready(data, id);
    } catch (e) {
        console.error('Error applying for project:', e);
        return null;
    }
}

function hasUserAppliedAlready(data, id){
    console.log("Length of this array is:", data.length);
    if(data.length == 0){
        notApplied();
        console.log("You have not yet applied for this work");
        return;
    }

    for (let i = 0; i < data.length; i++) {
        console.log("The data is:", data[i]);
        if (data[i].user.id == id) {
            console.log("You have already applied for this work");
            applied();
            return true;
        }
    }

    // If the loop completes without finding the ID
    notApplied();
    console.log("You have not yet applied for this work");
    return false;
}

function applied(){
    console.log("You have already applied for this work")
    const applyNowButton = document.getElementById("apply_now");
    console.log("You have already applied for this work")
    
    applyNowButton.removeEventListener<'click'>
    console.log("You have already applied for this work")

    
    applyNowButton.innerHTML = 'Applied'
    applyNowButton.href = ``;
}

function notApplied(){
    const applyNowButton = document.getElementById("apply_now");
    applyNowButton.href = `career-single-application-form.html?projectId=${projectId}`;
    applyNowButton.innerHTML = 'Apply now'
}

async function applyForJob() {
    const authToken = localStorage.getItem('authToken');
    const user = JSON.parse(localStorage.getItem('user'));
    const { id } = user;

    console.log("User id is:", id)
    const message = document.getElementById('application_message').value; // Replace with actual message
    const portfolioIds = [1, 2, 3]; // Replace with actual portfolio IDs

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
        console.log("data:", data);

        notifyUser(data.client.id);
        return data;
    } catch (e) {
        console.error('Error applying for project:', e);
        return null;
    }
}

async function notifyUser(userId) {
    const authToken = localStorage.getItem('authToken');
    const user = JSON.parse(localStorage.getItem('user'));
    const apiEndpoint = `http://localhost:3001/api/notifications`;

    try{
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ userId, message: `${user.first_name} ${user.last_name} applied for ${projectDetails.projectName}` }),
        });
        console.log("Successfully notified user of Application");

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        console.log("data:", data);
        return data;
    } catch(error) {
        console.log('Error:', error);
    }
}


document.addEventListener('DOMContentLoaded', renderScreen);
