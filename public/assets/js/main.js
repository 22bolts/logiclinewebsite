// public/main.js

// ... existing code ...

document.getElementById('startCall').addEventListener('click', () => {
    const userId = prompt('Enter your user ID');
    const recipientId = prompt('Enter recipient ID');
    
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
            localStream = stream;
            document.getElementById('localVideo').srcObject = stream;

            peer = new SimplePeer({
                initiator: true,
                trickle: false,
                stream: localStream
            });

            peer.on('signal', data => {
                socket.emit('startCall', { signalData: data, userId, recipientId });
            });

            peer.on('stream', stream => {
                document.getElementById('remoteVideo').srcObject = stream;
            });

            peer.on('error', err => console.error('Error with peer:', err));
        })
        .catch(err => console.error('Error accessing media devices:', err));
});

document.getElementById('joinCall').addEventListener('click', () => {
    const userId = prompt('Enter your user ID');
    const callId = prompt('Enter call ID');

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
            localStream = stream;
            document.getElementById('localVideo').srcObject = stream;

            peer = new SimplePeer({
                initiator: false,
                trickle: false,
                stream: localStream
            });

            peer.on('signal', data => {
                socket.emit('joinCall', { signalData: data, userId, callId });
            });

            peer.on('stream', stream => {
                document.getElementById('remoteVideo').srcObject = stream;
            });

            peer.on('error', err => console.error('Error with peer:', err));
        })
        .catch(err => console.error('Error accessing media devices:', err));
});

socket.on('callStarted', data => {
    if (peer) {
        peer.signal(data.signalData);
    }
});
