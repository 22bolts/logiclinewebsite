const urlParams = new URLSearchParams(window.location.search);

const projectId = urlParams.get('projectId');
const applicationId = urlParams.get('applicationId');

async function GetData() {
    console.log("Trying to get data");

    const authToken = localStorage.getItem('authToken');
    const apiEndpoint = `http://localhost:3001/api/projects/${projectId}/applications/${applicationId}`;

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

async function acceptApplication() {
    console.log("Attempting to accept application");
    const authToken = localStorage.getItem('authToken');
    const apiEndpoint = `http://localhost:3001/api/projects/${projectId}/applications/${applicationId}/accept`;

    try {
        const response = await fetch(apiEndpoint, {
            method: 'PUT', // Assuming 'PUT' is the correct method for accepting the application
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}` // Assuming you need the auth token for the request
            },
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        console.log("data:", data);

        // Navigate back to the previous screen
        window.history.back();

        return data;
    } catch (e) {
        console.error('Error fetching data:', e);
        return null;
    }
}

async function renderScreen() {
    const proposalLetter = document.getElementById('proposal_letter');
    const acceptApplicationButton = document.getElementById('accept_application');
    console.log("Rendering screen of application ID:", applicationId);

    try{
        const applicationDetails = await GetData();

        console.log("Application details:", applicationDetails);

        proposalLetter.innerHTML = applicationDetails.message;

        acceptApplicationButton.addEventListener('click', e => {
            e.preventDefault();
            acceptApplication();
        })
        
    } catch(error){
        console.log("Error:", error)
    }
}

document.addEventListener("DOMContentLoaded", function () {
    renderScreen();
});