 // getting Elements from Dom 
 const joinButton = document.querySelector("button");
 const videoContainer = document.getElementById("videoContainer");
 const textDiv = document.getElementById("textDiv");
 
 // decalare Variables
 let participants = [];
 let meeting = null;
 let localParticipant;
 let localParticipantAudio;
 let remoteParticipantId = "";
 
 joinButton.addEventListener("click", () => {
   joinButton.style.display = "none";
   textDiv.textContent = "Please wait, we are joining the meeting";
 
  //  window.VideoSDK.config("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiIwZmU3NzA3My1iMDBiLTQ1YWYtOWFmMC0zZjM4ZmNjN2UzMTgiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTc3Nzk2ODQxNywiZXhwIjoxODA5NTA0NDE3fQ.butZ0PBZzeV5aaVIhligJKUrckep-LmgwU_LtoAz8UI") // required;
  //  meeting = window.VideoSDK.initMeeting({
  //    meetingId: "79qi-s504-287d", // required
  //    name: "BENJAMIN's Org", // required
  //    micEnabled: true, // optional, default: true
  //    webcamEnabled: true, // optional, default: true
  //  });
 
  const { token } = await fetch('http://localhost:3001/api/get-token').then(r => r.json());

  // 2. Create a room
  const { roomId } = await fetch('http://localhost:3001/api/create-room', { method: 'POST' }).then(r => r.json());

  // 3. Use both
  // window.VideoSDK.config(token);
  // meeting = window.VideoSDK.initMeeting({
  //     meetingId: roomId,  // dynamic now
  //     name: "User's Name",
  //     micEnabled: true,
  //     webcamEnabled: true,
  // });

  // 3. Use both
  window.VideoSDK.config("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiIwZmU3NzA3My1iMDBiLTQ1YWYtOWFmMC0zZjM4ZmNjN2UzMTgiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIiwiYWxsb3dfbW9kIl0sImlhdCI6MTc3Nzk3MDE4NiwiZXhwIjoxODA5NTI3Nzg2fQ.XWvekqzEyG-DYkPZULNXXmk8_OyluGLeFtv0SCmGCl0");
  meeting = window.VideoSDK.initMeeting({
      meetingId: roomId,  // dynamic now
      name: "User's Name",
      micEnabled: true,
      webcamEnabled: true,
  });

   meeting.join();


   // creating local participant
   createLocalParticipant();
  
   // setting local participant stream
     meeting.localParticipant.on("stream-enabled", (stream) => {
       setTrack(
         stream,
         localParticipantAudio,
         meeting.localParticipant,
         (isLocal = true)
       );
     });
   
     meeting.on("meeting-joined", () => {
       textDiv.style.display = "none";
     });
   
     // other participants
     meeting.on("participant-joined", (participant) => {
       let videoElement = createVideoElement(participant.id);
       let audioElement = createAudioElement(participant.id);
       remoteParticipantId = participant.id;
   
       participant.on("stream-enabled", (stream) => {
         setTrack(stream, audioElement, participant, (isLocal = false));
       });
       videoContainer.appendChild(videoElement);
       videoContainer.appendChild(audioElement);
     });
   
     // participants left
     meeting.on("participant-left", (participant) => {
       let vElement = document.getElementById(`v-${participant.id}`);
       vElement.parentNode.removeChild(vElement);
   
       let aElement = document.getElementById(`a-${participant.id}`);
       aElement.parentNode.removeChild(aElement);
       //remove it from participant list participantId;
       document.getElementById(`p-${participant.id}`).remove();
     });
 });


  // creating video element
  function createVideoElement(pId) {
    let videoElement = document.createElement("video");
    videoElement.classList.add("video-frame");
    videoElement.setAttribute("id", `v-${pId}`);
    videoElement.setAttribute("playsinline", true);
    videoElement.setAttribute("width", "300");
    return videoElement;
  }
  
  // creating audio element
  function createAudioElement(pId) {
    let audioElement = document.createElement("audio");
    audioElement.setAttribute("autoPlay", "false");
    audioElement.setAttribute("playsInline", "true");
    audioElement.setAttribute("controls", "false");
    audioElement.setAttribute("id", `a-${pId}`);
    return audioElement;
  }
  
  // creating local participant
  function createLocalParticipant() {
    localParticipant = createVideoElement(meeting.localParticipant.id);
    videoContainer.appendChild(localParticipant);
  }
  
  // setting media track
  function setTrack(stream, audioElement, participant, isLocal) {
    if (stream.kind == "video") {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(stream.track);
      let videoElm = document.getElementById(`v-${participant.id}`);
      videoElm.srcObject = mediaStream;
      videoElm
        .play()
        .catch((error) =>
          console.error("videoElem.current.play() failed", error)
        );
    }
    if (stream.kind == "audio" && !isLocal) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(stream.track);
      audioElement.srcObject = mediaStream;
      audioElement
        .play()
        .catch((error) => console.error("audioElem.play() failed", error));
    }
  }