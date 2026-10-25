let chatId;
let rID;
let userDetails;
let isChatOpened = false;
let unreadCount;
const socket = io('http://localhost:3001'); // Correct the port

let allChatData = [];

socket.on('connect', () => {
    console.log('Connected to socket server');
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        socket.emit('userOnline', { userId: user.id });
    }
});

socket.on('receiveMessage', (message) => {
    const { newMessage, senderId, chatId } = message;
    console.log(isChatOpened, chatId);
    console.log("Stored receiver Id is:", rID);
    console.log("Receiver Id is:", senderId);
    if (isChatOpened && senderId == rID) {
        addMessageToChat(newMessage);
        socket.emit('markMessagesAsRead', { chatId, userId: userDetails.id });
        updateUnreadCount(chatId, 0);
        console.log("You just read a new message");
    } else {
        if (unreadCount[chatId] === undefined) {
            unreadCount[chatId] = 0;
        }
        unreadCount[chatId] += 1;
        updateUnreadCount(chatId, unreadCount[chatId]);
        console.log("You have a new message from", senderId);
    }
});

socket.on('messageMarkedAsRead', ({ chatId, userId }) => {
    if (userId === userDetails.id && unreadCount[chatId]) {
        unreadCount[chatId] = 0;
        updateUnreadCount(chatId, 0);
    }
});

function updateUnreadCount(chatId, count) {
    const chatElement = document.querySelector(`.chat-user[data-chat-id="${chatId}"] .new-message-count`);
    if (chatElement) {
        chatElement.textContent = count;
        // if (count > 0) {
        //     chatElement.style.display = 'block'; // Ensure it's visible
        // } else {
        //     chatElement.style.display = 'none'; // Hide if zero
        // }
    }
    updateTotalMessageCount(); // Update the total message count
}

function updateTotalMessageCount() {
    const totalMessagesElement = document.getElementById('total-messages');
    const totalUnreadMessages = Object.values(unreadCount).reduce((sum, count) => sum + count, 0);

    console.log("total unread message is", totalUnreadMessages, unreadCount);

    if (totalUnreadMessages > 0) {
        console.log("total unread message is greater than 1. It is:", totalUnreadMessages);
        totalMessagesElement.textContent = totalUnreadMessages;
        totalMessagesElement.style.display = 'flex'; // Ensure it's visible
    } else {
        totalMessagesElement.style.display = 'none'; // Hide if zero
    }
}

socket.on('disconnect', () => {
    console.log('Disconnected from socket server');
});

async function GetData() {
    const user = JSON.parse(localStorage.getItem('user'));
    const authToken = localStorage.getItem('authToken');

    userDetails = user;

    if (!user) throw new Error('NOT_SIGNED_IN');

    const apiEndpoint = `http://localhost:3001/api/chats/user/${user.id}/chats`;

    try {
        const response = await fetch(apiEndpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}` // Assuming you need the auth token for the request
            }
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        console.log("data:", data.chatlist);
        return data;
    } catch (e) {
        console.error('Error fetching data:', e);
        return null;
    }
}

async function renderChats() {
    const chatInterface = document.getElementById('chat-interface');
    const chatWindow = document.getElementById('chat-window');
    const chatButton = document.getElementById('chat-button');
    const closeChatButton = document.getElementById('close-chat-Button');
    const closeChatWindow = document.getElementById('close-chat-window');
    const projectsContainer = document.querySelector(".chat-users");
    const sendFileButton = document.getElementById('send-file');

    // sendFileButton.addEventListener('click', () => {
    //     // const file = await file
    // })

    chatButton.addEventListener('click', function() {
        chatInterface.style.display = "block";
    });

    closeChatButton.addEventListener('click', function() {
        chatInterface.classList.remove('chatOpened');
        chatWindow.classList.remove('chatOpened');
        chatInterface.style.display = "none";
    });

    closeChatWindow.addEventListener('click', function(){
        isChatOpened = false;
        chatInterface.classList.remove('chatOpened');
        chatWindow.classList.remove('chatOpened');
    });

    try {
        const data = await GetData();
        if (!data) {
            projectsContainer.innerHTML = '<p>Error loading chats.</p>';
            return;
        }

        const { chatlist } = data;
        allChatData = chatlist;
        projectsContainer.innerHTML = ''; // Clear previous contents

        chatlist.forEach((data, index) => {
            const { user, chat } = data;

            // Ensure unreadMessages is defined and get the unread count for this chat
            unreadCount = user.unreadMessages;

            console.log(user.id, user.unreadMessages[chat.id] || 0);

            const projectHTML = `
            <div class="chat-user" data-index="${index}" data-user-id="${user.id}" data-chat-id="${chat.id}">
                <img src="assets/images/auth/03.jpg" alt="User 3" class="user-image">
                <div class="user-details">
                    <div class="details-header">
                        <span class="user-name">${user.first_name} ${user.last_name} ${user.id}</span>
                        <span id="user-status-${user.id}" class="user-status ${user.status}"></span>
                        <span class="last-seen">${user.status}</span>
                    </div>
                    <div class="details-last-message">
                        <span class="last-message">${chat.lastmessage}</span>
                        <div class="new-message-notification">
                            <span class="new-message-count">${unreadCount[chat.id] || 0}</span>
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

        const sendButton = document.getElementById('send-button');
        const profileDetail = JSON.parse(localStorage.getItem('user'));

        sendButton.addEventListener('click', function(){
            sendMessage(profileDetail.id);
        });

        // Initialize total message count
        updateTotalMessageCount();

    } catch (error) {
        console.error('Error rendering chats:', error);
        handleErrors(error, chatInterface, projectsContainer);
    }
}



// Function to update the status of a user
function updateFriendStatus(userId, isOnline) {
    const chatInput = document.getElementById(`user-status-${userId}`);
    const friendElement = document.querySelector(`.chat-user[data-user-id="${userId}"] .user-status`);
    const lastSeenElement = document.querySelector(`.chat-user[data-user-id="${userId}"] .last-seen`);

    console.log(userId, chatInput);
    console.log(friendElement);
    console.log(lastSeenElement);

    // if (friendElement && lastSeenElement) {
    //     const statusClass = isOnline ? 'online' : 'offline';
    //     friendElement.className = `user-status ${statusClass}`;
    //     lastSeenElement.textContent = statusClass; // Update text content to reflect the new status
    // }
}

// Listen for the friendStatusChange event
socket.on('friendStatusChange', (data) => {
    console.log('Your friend status has changed', data);

    // Example data structure: { userId: number, isOnline: boolean }
    const { userId, isOnline } = data;

    // Update the friend's status in the UI
    updateFriendStatus(userId, isOnline);
});
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
    isChatOpened = true;
    
    const chatName = document.getElementById("chat-with");
    const chatMessages = document.querySelector(".chat-messages");
    const apiEndpoint = `http://localhost:3001/api/chats/chat/${chat.chat.id}/messages`;

    chatName.innerHTML = `${chat.user.first_name} ${chat.user.last_name} ${chat.user.id}`;

    const profileDetail = JSON.parse(localStorage.getItem('user'));
    const authToken = localStorage.getItem('authToken');

    chatId = chat.chat.id;
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
        console.log("Messages", messages);
        
        // Reverse the messages array to display them in chronological order
        messages.reverse();
    
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

            const readIcon = isSentByUser? data.read ? '<i class="fas fa-check-double message-read"></i>' : '<i class="fas fa-check-double message-unread"></i>' : '';
    
            const messageHTML = `
            <div class="chat-message-holder ${isSentByUser ? 'sent' : 'received'}">
                <div class="chat-message ${isSentByUser ? 'sent' : 'received'}" data-index="${index}">
                    <div>
                        <span class="message-detail ${isSentByUser ? 'sent' : 'received'}">${data.content}</span>
                    </div>
                    <div class="message-footer">
                        <i class='far fa-smile'></i>
                        <div>
                            ${readIcon}
                            <span class="message-detail date ${isSentByUser ? 'sent' : 'received'}">${localDateString}</span>
                        </div>
                    </div>
                </div>
            </div>`;
            chatMessages.innerHTML += messageHTML;

            
            socket.emit('markMessagesAsRead', { chatId, userId: userDetails.id });

            unreadCount[chatId] = 0;
            updateUnreadCount(chatId, 0);
        });

        // Scroll to the bottom after messages have been added
        setTimeout(() => {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 100);
    } catch (error) {
        console.error('Error fetching messages:', error);
        return null;
    }
}


async function sendMessage(userID) {
    console.log("sending message");
    const chatInput = document.getElementById('chat-input');
    const message = chatInput.value;
    if (message.trim() === '') return;

    const newMessage = {
        userId: userID,
        recipientId: Number(rID),
        content: message,
        chatId,
        timestamp: new Date().toISOString()
    };

    socket.emit('sendMessage', newMessage);

    // socket.emit('sendMessage', {
    //     userId: YOUR_USER_ID.toString(), // Ensure IDs are strings
    //     recipientId: RECIPIENT_USER_ID.toString(), // Ensure IDs are strings
    //     content: 'Your message content'
    // });

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

    const readIcon = isSentByUser? message.read ? '<i class="fas fa-check-double message-read"></i>' : '<i class="fas fa-check-double message-unread"></i>' : '';

    if(isSentByUser){
        console.log("This was sent by user")
        if(message.read){
            console.log("Message read:", message.read);
        }else{
            console.log("Message not read or something:", message.read)
            console.log(readIcon)
        }
    }

    const messageHTML = `
        <div class="chat-message-holder ${isSentByUser ? 'sent' : 'received'}">
            <div class="chat-message ${isSentByUser ? 'sent' : 'received'}">
                <div>
                    <span class="message-detail ${isSentByUser ? 'sent' : 'received'}">${message.content}</span>
                </div>
                <div class="message-footer">
                    <i class='far fa-smile'></i>
                    <div>
                        <i class="fas fa-check-double message-unread"></i>
                        <span class="message-detail date ${isSentByUser ? 'sent' : 'received'}">${localDateString}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    chatMessages.innerHTML += messageHTML;

    
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}

document.addEventListener('DOMContentLoaded', () => {
    renderChats();

    const sendFileButton = document.getElementById('send-file');
    const fileInput = document.getElementById('file-input');
    const filePreviewContainer = document.getElementById('file-preview');
    const sendButton = document.getElementById('send-button');
    const chatInput = document.getElementById('chat-input');
    let selectedFile = null;

    sendFileButton.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            selectedFile = file;

            // Create a file preview
            const reader = new FileReader();
            reader.onload = (e) => {
                filePreviewContainer.innerHTML = `
                    <img src="${e.target.result}" alt="Preview" class="file-preview-image">
                    <span class="remove-preview">&times;</span>
                `;
                filePreviewContainer.style.display = 'flex';
            };
            reader.readAsDataURL(file);
        }
    });

    filePreviewContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-preview')) {
            selectedFile = null;
            filePreviewContainer.style.display = 'none';
            filePreviewContainer.innerHTML = '';
            fileInput.value = ''; // Reset the file input
        }
    });

    sendButton.addEventListener('click', async () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);

            try {
                const response = await fetch('http://localhost:3001/api/chats/upload', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const data = await response.json();
                const imageUrl = data.url; // URL of the uploaded image

                console.log("Suceeded and data retruned is:", data);

                // Send the message with the image URL
                // addMessageToChat({
                //     userId: userDetails.id,
                //     content: `<img src="${imageUrl}" alt="Image" class="chat-image">`,
                //     chatId,
                //     timestamp: new Date().toISOString()
                // });

                // // Clear the file preview
                // selectedFile = null;
                // filePreviewContainer.style.display = 'none';
                // filePreviewContainer.innerHTML = '';
                // fileInput.value = ''; // Reset the file input
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        } else {
            // Handle sending text messages here
            sendMessage(userDetails.id);
        }
    });
});