
async function GetData() {
    console.log("Attempting to notify user");
    const authToken = localStorage.getItem('authToken');
    const user = JSON.parse(localStorage.getItem('user'));
    const { id } = user;

    if (!authToken || !user) {
        console.error("Authentication token or user information is missing.");
        return;
    }

    const apiEndpoint = `http://localhost:3001/api/notifications/users/${id}/notifications`;

    try {
        const response = await fetch(apiEndpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        console.log("Successfully gotten user notifications:", data);
        return data;
    } catch (error) {
        console.error('Error notifying user:', error);
    }
}


async function renderScreen() {
    try {
        const notificationsContainer = document.querySelector('.notifications_Container');
        notifications = await GetData();

        

        if(notifications){
            notifications.forEach((data, index) => {
                const messageSnippet = data.message.length > 100 ? `${data.message.substring(0, 100)}...` : data.message;
                
                const isRead = data.read === true ? 
                    ''
                : `<div class="notification_Icon">
						<div></div>
					</div>`;
                const projectHTML = `
				<div class="d-flex justify-content-between align-items-center mb-4 border-bottom" data-index="${index}" >
					<div>
						<p class="heading-color ${data.read? '': 'fw-bold'} mb-0">${data.title}</p>
						<small class="${data.read? '': 'fw-bold'} mb-0">${messageSnippet}</small>
					</div>
					${isRead}
				</div>`;
                notificationsContainer.innerHTML += projectHTML;
            });
        }
    } catch (error) {
        console.error('Error rendering notifications:', error);
    }
}


document.addEventListener('DOMContentLoaded', renderScreen);