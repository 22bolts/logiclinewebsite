let client;
let developer;

async function assingClient(){
    const user = JSON.parse(localStorage.getItem('user'));

    client = user;

    console.log(user);

    setUser('client');
}

async function assingDeveloper(){
    setUser('developer');
}

async function swapRoles(){
    const _client = client;
    const _developer = developer;


    client = _developer;
    developer = _client;

    console.log(client);
    console.log(developer);

    setUser('client');
    setUser('developer');
}

function setUser(role){
    if (role == 'client'){
        console.log ("assigning client");
        const userNameField = document.getElementById('client-username');
        const avatarField = document.getElementById('client_avatar');

        console.log("dsfrgtfvfd")

        if(client){
            userNameField.innerHTML = client? `${client.first_name} ${client.last_name}` : 'client name';

            const avatar = client.avatar ? `http://localhost:3001${client.avatar}` : 'assets/images/avatar/avatar.png';

            avatarField.innerHTML = ` <img src="${avatar}" alt="Client profile picture" class="profile-picture" width="50">`
        }else{
            
            userNameField.innerHTML = 'client name';

            // const avatar = client.avatar ? client.avatar : 'assets/images/avatar/avatar.png';
            const avatar = 'assets/images/avatar/avatar1.png';

            avatarField.innerHTML = ` <img src="${avatar}" alt="Client profile picture" class="profile-picture">`
        }
    } else if (role == 'developer'){
        console.log ("assigning developer");
        const userNameField = document.getElementById('developer_username');
        const avatarField = document.getElementById('developer_avatar');

        console.log("dsfrgtfvfd")

        if(developer){
            console.log("There is a developer");
            userNameField.innerHTML = developer? `${developer.first_name} ${developer.last_name}` : 'client name';

            const avatar = developer.avatar ? developer.avatar : 'assets/images/avatar/avatar.png';

            avatarField.innerHTML = ` <img src="${avatar}" alt="Client profile picture" class="profile-picture" width="50">`
        }else{
            console.log("There is a no developer available");
            userNameField.innerHTML = 'no developer. Do u want to invite?';

            // const avatar = client.avatar ? client.avatar : 'assets/images/avatar/avatar.png';
            const avatar = 'assets/images/avatar/avatar1.png';

            avatarField.innerHTML = ` <img src="${avatar}" alt="Client profile picture" class="profile-picture">`
        }
    }
}

// Wait for the DOM to fully load before rendering projects
document.addEventListener('DOMContentLoaded', async () => {
    const apiEndpoint = 'http://localhost:3001/api/projects';
    
    const swapRolesIcon = document.getElementById('swap_roles');

    swapRolesIcon.addEventListener('click', event => swapRoles());

    assingClient();
    assingDeveloper();

    document.getElementById('new-project-form').addEventListener('submit', async function (e) {
        e.preventDefault();
        
        const authToken = localStorage.getItem('authToken');

        const developerId = developer ? developer.id : null;
        const clientId = client ? client.id : null;

        const projectData = {
            projectName: document.getElementById('project-name').value,
            description: document.getElementById('description').value,
            startDate: document.getElementById('start-date').value,
            endDate: document.getElementById('end-date').value,
            status: document.getElementById('status').value,
            tags: document.getElementById('tags').value,
            budget: document.getElementById('budget').value,
            skills: document.getElementById('skills').value,
            attachments: [], // Assuming you handle attachments elsewhere
            projectType: document.getElementById('project-type').value,
            visibility: document.getElementById('visibility').value,
            developerId: developerId,
            clientId: clientId,
        };

        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(projectData),
            });

            const result = await response.json();

            if (response.ok) {
                console.log('Project created:', result);

                // Handle success (e.g., redirect to a projects page)
                window.location.href = '/account-projects.html'; // Replace with your actual projects page
            } else {
                console.error('Error creating project:', result.message);
            }
        } catch (error) {
            console.error('Error creating project:', error);
            // Handle error (e.g., show an error message)
        }
    });
    console.log("New project screen");
});

