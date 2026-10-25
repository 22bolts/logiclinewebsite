// videoChat.js

let localStream;
let remoteStream;
let peerConnection;
const videoSocket = io('http://localhost:3001'); // Ensure the correct port

const servers = {
    iceServers: [
        {
            urls: 'stun:stun.l.google.com:19302'
        }
    ]
};

function startVideoCall() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
            localStream = stream;
            document.getElementById('local-video').srcObject = stream;
            createPeerConnection();
            stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
        })
        .catch(error => console.error('Error accessing media devices.', error));
}

function createPeerConnection() {
    peerConnection = new RTCPeerConnection(servers);
    peerConnection.onicecandidate = handleIceCandidate;
    peerConnection.ontrack = handleRemoteStreamAdded;
}

function handleIceCandidate(event) {
    if (event.candidate) {
        videoSocket.emit('candidate', event.candidate);
    }
}

function handleRemoteStreamAdded(event) {
    remoteStream = event.streams[0];
    document.getElementById('remote-video').srcObject = remoteStream;
}

videoSocket.on('offer', (offer) => {
    createPeerConnection();
    peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    peerConnection.createAnswer()
        .then(answer => {
            peerConnection.setLocalDescription(answer);
            videoSocket.emit('answer', answer);
        })
        .catch(error => console.error('Error creating answer:', error));
});

videoSocket.on('answer', (answer) => {
    peerConnection.setLocalDescription(new RTCSessionDescription(answer));
});

videoSocket.on('candidate', (candidate) => {
    const iceCandidate = new RTCIceCandidate(candidate);
    peerConnection.addIceCandidate(iceCandidate);
});

function callUser() {
    peerConnection.createOffer()
        .then(offer => {
            peerConnection.setLocalDescription(offer);
            videoSocket.emit('offer', offer);
        })
        .catch(error => console.error('Error creating offer:', error));
}

// HTML elements to trigger video call
document.getElementById('start-call-button').addEventListener('click', startVideoCall);
document.getElementById('call-user-button').addEventListener('click', callUser);

// Handling call end
function endCall() {
    peerConnection.close();
    localStream.getTracks().forEach(track => track.stop());
    document.getElementById('local-video').srcObject = null;
    document.getElementById('remote-video').srcObject = null;
    videoSocket.emit('endCall');
}

document.getElementById('end-call-button').addEventListener('click', endCall);

videoSocket.on('endCall', () => {
    endCall();
});
