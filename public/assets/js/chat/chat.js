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
    console.log("shajkthtkjhskh fdjdd,fsfdk", isChatOpened, chatId);
    console.log("Stored receiver Id is:", rID);
    console.log("Receiver Id is:", senderId);
    
    moveChatToTop(chatId);
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

        // Move the chat to the top of the list
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
        chatlist.reverse();
        allChatData = chatlist;
        projectsContainer.innerHTML = ''; // Clear previous contents

        chatlist.forEach((data, index) => {
            const { user, chat } = data;

            // Ensure unreadMessages is defined and get the unread count for this chat
            unreadCount = user.unreadMessages;

            console.log(user.id, user.unreadMessages[chat.id] || 0);

            const lastMessageSnippet = chat.last_message.length > 30 ? `${chat.last_message.substring(0, 30)}...` : chat.last_message;
            
            const chatUnreadCount = unreadCount[chat.id] ? 
                `<div class="new-message-notification">
                    <span class="new-message-count">${unreadCount[chat.id]}</span>
                </div>`
            : '';
            const projectHTML = `
            <div class="chat-user" data-index="${index}" data-user-id="${user.id}" data-chat-id="${chat.id}">
                <div class="avatar">
                    <img src="http://localhost:3001${user.avatar}" alt="User 3" class="user-image avatar-img">
                </div>
                <div class="user-details">
                    <div class="details-header">
                        <span class="user-name">${user.first_name} ${user.last_name}</span>
                        <span id="user-status-${user.id}" class="user-status ${user.status}"></span>
                    </div>
                    <div class="details-last-message">
                        <span class="last-message">${lastMessageSnippet}</span>
                        ${chatUnreadCount}
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

        sendButton.addEventListener('click', async function() {
            const chatInput = document.getElementById('chat-input');
            const message = chatInput.value;
            const fileInput = document.getElementById('file-input');
            let selectedFile = fileInput.files[0];

            if (selectedFile) {
                const formData = new FormData();
                formData.append('file', selectedFile);

                try {
                    const response = await fetch('http://localhost:3001/api/chats/upload', {
                        method: 'POST',
                        body: formData
                    });

                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                    console.log(response);

                    const data = await response.json();
                    console.log(response);
                    const imageUrl = data.fileUrl; // URL of the uploaded image
                    console.log("The image url is:", imageUrl);

                    // Send the message with the image URL
                    sendMessage(profileDetail.id, message, imageUrl);
                    console.log(response);

                    // Clear the file preview
                    const filePreviewContainer = document.getElementById('file-preview');
                    selectedFile = null;
                    filePreviewContainer.style.display = 'none';
                    filePreviewContainer.innerHTML = '';
                    fileInput.value = ''; // Reset the file input
                } catch (error) {
                    console.error('Error uploading file:', error);
                }
            } else {
                // Handle sending text messages here
                sendMessage(profileDetail.id, message);
            }

            chatInput.value = ''; // Clear the input after sending the message
        });

        // Initialize total message count
        updateTotalMessageCount();

    } catch (error) {
        console.error('Error rendering chats:', error);
        handleErrors(error, chatInterface, projectsContainer);
    }
}

function moveChatToTop(chatId) {
    const chatElement = document.querySelector(`.chat-user[data-chat-id="${chatId}"]`);
    console.log("child element");
    if (chatElement) {
        const parentElement = chatElement.parentElement;
        parentElement.prepend(chatElement);
    }
}

function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}

// Function to update the status of a user
function updateFriendStatus(userId, isOnline) {
    const chatInput = document.getElementById(`user-status-${userId}`);
    const friendElement = document.querySelector(`.chat-user[data-user-id="${userId}"] .user-status`);

    console.log(userId, chatInput);
    console.log(friendElement);
}

// Listen for the friendStatusChange event
socket.on('friendStatusChange', (data) => {
    console.log('Your friend status has changed:', data);
    updateFriendStatus(data.userId, data.isOnline);
});

// Call the renderChats function when the page loads
renderChats();

async function openChat(chat) {
    isChatOpened = true;
    
    const chatName = document.getElementById("chat-with");
    const chatMessages = document.querySelector(".chat-messages");
    const apiEndpoint = `http://localhost:3001/api/chats/chat/${chat.chat.id}/messages`;

    chatName.innerHTML = `${chat.user.first_name} ${chat.user.last_name}`;

    const profileDetail = JSON.parse(localStorage.getItem('user'));
    const authToken = localStorage.getItem('authToken');

    chatId = chat.chat.id;
    const conversationId = chat.chat.id;
    const conversationIds = conversationId.split('-');
    const recieverId = conversationIds.find(id => id != profileDetail.id);
    rID = recieverId;
    window.rID = recieverId


    // Highlight the active chat
    document.querySelectorAll('.chat-user').forEach(chatElement => {
        chatElement.classList.remove('active-chat');
    });
    document.querySelector(`.chat-user[data-chat-id="${chatId}"]`).classList.add('active-chat');

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

        let totalMessages = messages.length;
        const unreadMessages = unreadCount[chat.id] ? unreadCount[chat.id] : 0;

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

            totalMessages -= 1;
            // if(unreadMessages > 0 && unreadMessages == totalMessages){
            //     chatMessages.innerHTML += `
            //     <div class="date-divider-holder">
            //         <div class="date-divider">unread messages</div>
            //     </div>
            //     `;
            // }

            console.log("eedsj kfhlajhfadshfjds dhflsh jd fds  ahdfshafjdhlafdsk", unreadMessages, ":", totalMessages, ":", unreadCount, ":", unreadCount[chat.id])

        
            const isSentByUser = data.id === profileDetail.id;
            const localDateString = messageDate.toLocaleTimeString(navigator.language, {
                hour: '2-digit',
                minute: '2-digit'
            });
        
            const media = data.media;
        
            if (media) {
                console.log("sssssssssssssssssss sssssssssssssssssss ssssssssssssssssssss sssssssssss");
                console.log(`http://localhost:3001${media.url}`);
            }
        
            const readIcon = isSentByUser ? (data.read ? '<i class="fas fa-check-double message-read"></i>' : '<i class="fas fa-check-double message-unread"></i>') : '';
        
            const mediaHTML = media ? `
                <div class="media-holder">
                    <div>
                        ${media.type === "image" ? `<img src="http://localhost:3001${media.url}" alt="User 3" class="chat-image">` : ''}
                    </div>
                </div>
                <div class="divider"></div>
            ` : '';
        
            const messageHTML = `
            <div class="chat-message-holder ${isSentByUser ? 'sent' : 'received'}">
                <div class="chat-message ${isSentByUser ? 'sent' : 'received'}" data-index="${index}">
                    ${mediaHTML}
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

function addMessageToChat(message) {
    const chatMessages = document.querySelector(".chat-messages");
    const isSentByUser = message.userId === JSON.parse(localStorage.getItem('user')).id;
    const messageDate = new Date(message.timestamp);
    const localDateString = messageDate.toLocaleTimeString(navigator.language, {
        hour: '2-digit',
        minute: '2-digit'
    });


    const media = message.media;
        
    if (media) {
        console.log("sssssssssssssssssss sssssssssssssssssss ssssssssssssssssssss sssssssssss");
        console.log(`http://localhost:3001${media.url}`);
    }

    const readIcon = isSentByUser ? (message.read ? '<i class="fas fa-check-double message-read"></i>' : '<i class="fas fa-check-double message-unread"></i>') : '';

    const mediaHTML = media ? `
        <div class="media-holder">
            <div>
                ${media.type === "image" ? `<img src="http://localhost:3001${media.url}" alt="User 3" class="chat-image">` : ''}
            </div>
        </div>
        <div class="divider"></div>
    ` : '';

    const messageHTML = `
    <div class="chat-message-holder ${isSentByUser ? 'sent' : 'received'}">
        <div class="chat-message ${isSentByUser ? 'sent' : 'received'}">
            ${mediaHTML}
            <div>
                <span class="message-detail ${isSentByUser ? 'sent' : 'received'}">${message.content}</span>
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

    
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendMessage(userId, message, imageUrl = null) {
    if (!rID) rID = window.rID;
    if (!message && !imageUrl) return;

    const messageData = {
        userId: userId,
        recipientId: Number(rID),
        content: message,
        chatId: chatId,
        image: imageUrl,
        timestamp: new Date().toISOString()
    };

    console.log(messageData);

    socket.emit('sendMessage', messageData);

    addMessageToChat(messageData);
}

document.getElementById('file-input').addEventListener('change', function(event) {
    const filePreviewContainer = document.getElementById('file-preview');
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            const image = document.createElement('img');
            image.src = e.target.result;
            image.alt = 'Preview Image';

            filePreviewContainer.innerHTML = '';
            filePreviewContainer.appendChild(image);
            filePreviewContainer.style.display = 'block'; // Ensure it's visible
        };

        reader.readAsDataURL(file);
    } else {
        filePreviewContainer.innerHTML = '';
        filePreviewContainer.style.display = 'none'; // Hide if no file is selected
    }
});


document.addEventListener('DOMContentLoaded', function() {
    const sendButton = document.getElementById('send-button');
    const fileInput = document.getElementById('file-input');
    const filePreviewContainer = document.getElementById('file-preview');
    const sendFileButton = document.getElementById('send-file');
    const profileDetail = JSON.parse(localStorage.getItem('user'));

    

    sendFileButton.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = function(e) {
                const image = document.createElement('img');
                image.src = e.target.result;
                image.alt = 'Preview Image';

                filePreviewContainer.innerHTML = '';
                filePreviewContainer.appendChild(image);
                filePreviewContainer.style.display = 'block'; // Ensure it's visible
            };

            reader.readAsDataURL(file);
        } else {
            filePreviewContainer.innerHTML = '';
            filePreviewContainer.style.display = 'none'; // Hide if no file is selected
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
});
