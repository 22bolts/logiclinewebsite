let rID;
const socket = io('http://localhost:3001'); // Correct the port

socket.on('connect', () => {
    console.log('Connected to socket server');
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        socket.emit('userOnline', { userId: user.id });
    }
});

socket.on('disconnect', () => {
    console.log('Disconnected from socket server');
});

async function GetData() {
    const user = JSON.parse(localStorage.getItem('user'));
    const authToken = localStorage.getItem('authToken');

    if (!user) throw new Error('NOT_SIGNED_IN');

    const apiEndpoint = `http://localhost:3001/api/chats/user/${user.id}/chats`;

    try {
        const response = await fetch(apiEndpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        console.log("data:", data)
        return data;
    } catch (e) {
        console.error('Error fetching data:', e);
        return null;
    }

    // try {
    //     const response = await fetch(apiEndpoint, {
    //         method: 'GET',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${authToken}`
    //         }
    //     });

    //     if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    //     const data = await response.json();
    //     return data;
    // } catch (e) {
    //     console.error('Error fetching data:', e);
    //     return null;
    // }
}

async function renderChats() {
    const chatInterface = document.getElementById('chat-interface');
    const chatWindow = document.getElementById('chat-window');
    const projectsContainer = document.querySelector(".chat-users");

    try {
        const data = await GetData();
        if (!data) {
            projectsContainer.innerHTML = '<p>Error loading chats.</p>';
            return;
        }

        const { chatlist } = data;
        chatlist.forEach((data, index) => {
            const { user, chat } = data;
            const projectHTML = `
            <div class="chat-user" data-index="${index}" data-user-id="${user.id}">
                <img src="assets/images/auth/03.jpg" alt="User 3" class="user-image">
                <div class="user-details">
                    <div class="details-header">
                        <span class="user-name">${user.first_name} ${user.last_name}</span>
                        <span class="user-status ${user.isOnline ? 'online' : 'offline'}"></span>
                        <span class="last-seen">${chat.lastseen}</span>
                    </div>
                    <div class="details-last-message">
                        <span class="last-message">${chat.lastmessage}</span>
                        <div class="new-message-notification">
                            <span class="new-message-count">${chat.notifications}</span>
                        </div>
                    </div>
                </div>
            </div>`;
            projectsContainer.innerHTML += projectHTML;
        });

        document.querySelectorAll('.chat-user').forEach((element) => {
            element.addEventListener('click', function () {
                const index = this.getAttribute('data-index');
                chatInterface.classList.add('chatOpened');
                chatWindow.classList.add('chatOpened');
                openChat(chatlist[index]);
            });
        });

    } catch (error) {
        console.error('Error rendering chats:', error);
        projectsContainer.innerHTML = '<p>Error loading chats.</p>';
    }
}

function handleErrors(error, chatInterface, projectsContainer) {
    if (error.message === 'NOT_SIGNED_IN') {
        chatInterface.classList.add('notSignIn');

        const errorContainer = document.createElement('div');
        errorContainer.classList.add('error-container');

        const errorImage = document.createElement('img');
        errorImage.src = 'assets/images/error/01.png';
        errorImage.alt = 'Error Image';
        errorImage.classList.add('error-image');

        const errorMessage = document.createElement('p');
        errorMessage.classList.add('error-message');
        errorMessage.textContent = 'Please sign in to view chats.';

        const signInButton = document.createElement('a');
        signInButton.href = 'sign-in.html';
        signInButton.classList.add('sign-in-button');
        signInButton.textContent = 'Sign In';

        errorContainer.appendChild(errorImage);
        errorContainer.appendChild(errorMessage);
        errorContainer.appendChild(signInButton);

        projectsContainer.innerHTML = '';
        projectsContainer.appendChild(errorContainer);
    } else {
        console.error(error);
        projectsContainer.innerHTML = '<p>Error loading chats.</p>';
    }
}

async function openChat(chat) {
    const chatMessages = document.querySelector(".chat-messages");
    const apiEndpoint = `http://localhost:3001/api/chats/chat/${chat.chat.id}/messages`;

    const profileDetail = JSON.parse(localStorage.getItem('user'));
    const authToken = localStorage.getItem('authToken');

    const conversationId = chat.chat.id;
    const conversationIds = conversationId.split('-');
    const recieverId = conversationIds.find(id => id != profileDetail.id);
    rID = recieverId;

    try {
        const response = await fetch(apiEndpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const messages = await response.json();
        chatMessages.innerHTML = '';

        let lastDate = null;
        messages.forEach((data, index) => {
            const messageDate = new Date(data.timestamp);
            const formattedDate = formatDate(messageDate);

            if (!lastDate || formattedDate !== lastDate) {
                chatMessages.innerHTML += `
                <div class="date-divider-holder">
                    <div class="date-divider">${formattedDate}</div>
                </div>
                `;
                lastDate = formattedDate;
            }

            const isSentByUser = data.id === profileDetail.id;
            const localDateString = messageDate.toLocaleTimeString(navigator.language, {
                hour: '2-digit',
                minute: '2-digit'
            });

            const messageHTML = `
            <div class="chat-message-holder ${isSentByUser ? 'sent' : 'received'}">
                <div class="chat-message ${isSentByUser ? 'sent' : 'received'}" data-index="${index}">
                    <div>
                        <span class="user-name">${data.content}</span>
                    </div>
                    <div class="message-footer">
                        <i class='far fa-smile'></i>
                        <span class="user-name">${localDateString}</span>
                    </div>
                </div>
            </div>`;
            chatMessages.innerHTML += messageHTML;
        });

        socket.on('receiveMessage', (message) => {
            addMessageToChat(message);
        });
    } catch (e) {
        console.log(e);
        return null;
    }
}

async function sendMessage(userID, authToken) {
    const chatInput = document.getElementById('chat-input');
    const message = chatInput.value;
    if (message.trim() === '') return;

    const newMessage = {
        userId: userID,
        recipientId: rID,
        content: message,
        timestamp: new Date().toISOString()
    };

    socket.emit('sendMessage', newMessage);

    chatInput.value = ''; // Clear the input after sending the message
    addMessageToChat(newMessage);
}

function addMessageToChat(message) {
    const chatMessages = document.querySelector(".chat-messages");
    const isSentByUser = message.userId === JSON.parse(localStorage.getItem('user')).id;
    const messageDate = new Date(message.timestamp);
    const localDateString = messageDate.toLocaleTimeString(navigator.language, {
        hour: '2-digit',
        minute: '2-digit'
    });

    const messageHTML = `
        <div class="chat-message-holder ${isSentByUser ? 'sent' : 'received'}">
            <div class="chat-message ${isSentByUser ? 'sent' : 'received'}">
                <div>
                    <span class="user-name">${message.content}</span>
                </div>
                <div class="message-footer">
                    <i class='far fa-smile'></i>
                    <span class="user-name">${localDateString}</span>
                </div>
            </div>
        </div>
    `;
    chatMessages.innerHTML += messageHTML;
}

function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}

document.addEventListener('DOMContentLoaded', renderChats);
