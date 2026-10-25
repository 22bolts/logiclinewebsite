var rID;


async function GetData() {
    const user = JSON.parse(localStorage.getItem('user'));
    const authToken = JSON.parse(localStorage.getItem('authToken'));

    if (!user) throw new Error('NOT_SIGNED_IN');

    const apiEndpoint = `http://localhost:3001/api/chats/user/${user.id}/chats`;

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
        return data;
    } catch (e) {
        console.log(e);
        return null;
    }
}

function formatDate(date) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    } else {
        return date.toLocaleDateString();
    }
}

async function renderChats() {
    const chatInterface = document.getElementById('chat-interface');
    const chatWindow = document.getElementById('chat-window');
    const projectsContainer = document.querySelector(".chat-users");
    projectsContainer.innerHTML = ''; // Clear any existing content

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
            <div class="chat-user" data-index="${index}">
                <img src="assets/images/auth/03.jpg" alt="User 3" class="user-image">
                <div class="user-details">
                    <div class="details-header">
                        <span class="user-name">${user.first_name} ${user.last_name}</span>
                        <span class="last-seen">${chat.lastseen}</span>
                    </div>
                    <div class="details-last-messsage">
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
            element.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                chatInterface.classList.add('chatOpened');
                chatWindow.classList.add('chatOpened');
                openChat(chatlist[index]);
            });
        });

        const sendButton = document.getElementById('send-button');
        const authToken = JSON.parse(localStorage.getItem('authToken'));
        const profileDetail = JSON.parse(localStorage.getItem('user'));

        sendButton.addEventListener('click', function(){
            sendMessage(profileDetail.id, authToken);
        });
    } catch (error) {
        handleErrors(error, chatInterface, projectsContainer);
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
    const authToken = JSON.parse(localStorage.getItem('authToken'));

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
    } catch (e) {
        console.log(e);
        return null;
    }
}

async function sendMessage(userID, authToken) {
    const chatInput = document.getElementById('chat-input');
    const apiEndpoint = `http://localhost:3001/api/chats/message`;

    try {
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                userId: userID,
                recipientId: rID,
                content: chatInput.value,
            })
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        chatInput.value = ''; // Clear the input after sending the message
        openChat({ chat: { id: `${userID}-${rID}` } }); // Refresh the chat
    } catch (e) {
        console.log(e);
    }
}


document.addEventListener('DOMContentLoaded', function() {
    renderChats();

    const chatButton = document.getElementById('chat-button');
    const chatInterface = document.getElementById('chat-interface');
    const chatWindow = document.getElementById('chat-window');
    const searchInput = document.getElementById('searchInput');
    const searchBox = document.querySelector('.search-box');
    const closeChatButton = document.getElementById('close-chat-Button');
    const closeChatWindow = document.getElementById('close-chat-window');
    const cancelIcon = document.getElementById('cancel-icon');

    chatButton.addEventListener('click', function() {
        chatInterface.style.display = "block";
    });

    closeChatButton.addEventListener('click', function() {
        chatInterface.classList.remove('chatOpened');
        chatWindow.classList.remove('chatOpened');
        chatInterface.style.display = "none";
    });

    closeChatWindow.addEventListener('click', function(){
        chatInterface.classList.remove('chatOpened');
        chatWindow.classList.remove('chatOpened');
    });

    function updateEditingState() {
        if (searchInput.value.trim() !== '') {
            chatInterface.classList.add('editing');
        } else {
            chatInterface.classList.remove('editing');
        }
    }

    function openChat() {
        if (searchInput.value.trim() !== '') {
            searchBox.classList.add('chatOpened');
        } else {
            searchBox.classList.remove('chatOpened');
        }
    }

    searchInput.addEventListener('input', updateEditingState);

    cancelIcon.addEventListener('click', function(event) {
        event.preventDefault();
        searchInput.value = '';
        updateEditingState();
    });

    updateEditingState();
});
