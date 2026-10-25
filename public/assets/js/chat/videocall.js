/**
 * EverythingCodes — Video Call Overlay System
 * Hooks into the existing chat.js globals:
 *   - rID         (recipient id)
 *   - chatId      (current chat id)
 *   - userDetails (logged-in user object)
 *   - socket      (existing socket.io instance)
 */

(function () {
  const BACKEND = 'http://localhost:3001';

  let meeting     = null;
  let isMinimised = false;
  let isMicOn     = true;
  let isCamOn     = true;
  let currentCallee = null; // { id, name, avatar }

  /* ─────────────────────────────────────────────
     INJECT HTML
  ───────────────────────────────────────────── */
  function buildOverlay() {
    const el = document.createElement('div');
    el.id = 'ec-call-overlay';
    el.innerHTML = `
      <!-- FULL-SCREEN CALL UI -->
      <div id="ec-call-full" class="ec-call-full">
        <div class="ec-call-header">
          <div class="ec-call-caller-info">
            <img id="ec-callee-avatar" src="" alt="" onerror="this.style.display='none'" />
            <div>
              <span id="ec-callee-name">Connecting…</span>
              <span id="ec-call-status" class="ec-call-status">Calling…</span>
            </div>
          </div>
          <button class="ec-icon-btn" id="ec-minimise-btn" title="Minimise">
            <svg viewBox="0 0 24 24"><path d="M19 13H5v-2h14v2z"/></svg>
          </button>
        </div>

        <div class="ec-videos-grid" id="ec-videos-grid">
          <div class="ec-no-video" id="ec-no-remote">
            <div class="ec-spinner"></div>
            <p>Waiting for others…</p>
          </div>
        </div>

        <div class="ec-local-pip-full" id="ec-local-pip-full">
          <video id="ec-local-video-full" autoplay muted playsinline></video>
          <span class="ec-local-label">You</span>
        </div>

        <div class="ec-call-controls">
          <button class="ec-ctrl-btn ec-ctrl-mic" id="ec-mic-btn" title="Mute/Unmute">
            <svg viewBox="0 0 24 24"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3zm-1 19.93V23h2v-2.07A8 8 0 0 0 20 13h-2a6 6 0 0 1-12 0H4a8 8 0 0 0 7 7.93z"/></svg>
          </button>
          <button class="ec-ctrl-btn ec-ctrl-cam" id="ec-cam-btn" title="Camera on/off">
            <svg viewBox="0 0 24 24"><path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4z"/></svg>
          </button>
          <button class="ec-ctrl-btn ec-ctrl-end" id="ec-end-btn" title="End call">
            <svg viewBox="0 0 24 24"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
          </button>
          <button class="ec-ctrl-btn ec-ctrl-chat" id="ec-open-chat-btn" title="Open chat">
            <svg viewBox="0 0 24 24"><path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/></svg>
          </button>
        </div>
      </div>

      <!-- MINIMISED PIP -->
      <div id="ec-call-pip" class="ec-call-pip" style="display:none;">
        <video id="ec-remote-pip-video" autoplay playsinline></video>
        <div class="ec-pip-overlay">
          <button class="ec-pip-expand" id="ec-expand-btn" title="Expand">⤢</button>
          <button class="ec-pip-end" id="ec-pip-end-btn" title="End">✕</button>
        </div>
        <div class="ec-pip-label" id="ec-pip-label">On call</div>
      </div>

      <!-- INCOMING CALL BANNER -->
      <div id="ec-incoming" class="ec-incoming" style="display:none;">
        <img id="ec-inc-avatar" src="" alt="" onerror="this.style.display='none'" />
        <div class="ec-inc-info">
          <span id="ec-inc-name">Someone</span>
          <span>is calling you…</span>
        </div>
        <button class="ec-inc-accept" id="ec-inc-accept" title="Accept">
          <svg viewBox="0 0 24 24"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
        </button>
        <button class="ec-inc-reject" id="ec-inc-reject" title="Decline">
          <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </button>
      </div>
    `;
    document.body.appendChild(el);
  }

  /* ─────────────────────────────────────────────
     INJECT CALL BUTTON INTO CHAT HEADER
     chat.js renders .chat-header-options —
     we patch openChat() to inject after it runs.
  ───────────────────────────────────────────── */
  function injectCallButton() {
    if (document.getElementById('ec-chat-call-btn')) return;

    const headerOpts = document.querySelector('.chat-header-options');
    if (!headerOpts) return;

    const btn = document.createElement('button');
    btn.id        = 'ec-chat-call-btn';
    btn.className = 'ec-chat-call-btn';
    btn.title     = 'Video call';
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round">
        <path d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14"/>
        <rect x="1" y="6" width="15" height="14" rx="2"/>
      </svg>
    `;
    btn.addEventListener('click', handleCallButtonClick);
    headerOpts.insertBefore(btn, headerOpts.firstChild);
  }

  function handleCallButtonClick() {
    // rID is the recipient id set by chat.js's openChat()
    const recipientId = window.rID;
    if (!recipientId) { alert('Please open a chat first.'); return; }

    const nameEl   = document.getElementById('chat-with');
    const avatarEl = document.getElementById('chat-user-image');

    startCall({
      id:     recipientId,
      name:   nameEl   ? nameEl.textContent.trim() : 'User',
      avatar: avatarEl ? avatarEl.src : ''
    });
  }

  /* ─────────────────────────────────────────────
     VIDEOSDK
  ───────────────────────────────────────────── */
  async function fetchToken() {
    const res  = await fetch(`${BACKEND}/api/get-token`);
    const data = await res.json();
    return data.token;
  }

  async function createRoom(token) {
    const res = await fetch(`${BACKEND}/api/create-room`, {
      method: 'POST',
      headers: { Authorization: token, 'Content-Type': 'application/json' }
    });

    console.log('Create room response:', res);
    const data = await res.json();
    return data.roomId;
  }

  /* ─────────────────────────────────────────────
     START CALL (outgoing)
  ───────────────────────────────────────────── */
  async function startCall(callee) {
    currentCallee = callee;
    showCallUI();
    setStatus('Connecting…');

    try {
      const token  = await fetchToken();
      const roomId = await createRoom(token);

      // Uses the same socket instance already created in chat.js
      if (window.socket) {
        const me = JSON.parse(localStorage.getItem('user'));
        window.socket.emit('startCall', {
          userId:      me.id,
          recipientId: callee.id,
          signalData:  { token, roomId }
        });
      }

      await joinVideoRoom(token, roomId);
    } catch (err) {
      console.error('Call start error:', err);
      setStatus('Connection failed ✕');
    }
  }

  /* ─────────────────────────────────────────────
     ACCEPT CALL (incoming)
  ───────────────────────────────────────────── */
  async function acceptCall(token, roomId, caller) {
    currentCallee = caller;
    hideIncoming();
    showCallUI();
    setStatus('Connecting…');
    await joinVideoRoom(token, roomId);
  }

  /* ─────────────────────────────────────────────
     JOIN VIDEOSDK ROOM
  ───────────────────────────────────────────── */
  async function joinVideoRoom(token, roomId) {
    if (!window.VideoSDK) {
      console.error('VideoSDK not loaded on this page.');
      setStatus('VideoSDK not loaded');
      return;
    }

    const me = JSON.parse(localStorage.getItem('user'));

    window.VideoSDK.config(token);
    meeting = window.VideoSDK.initMeeting({
      meetingId:     roomId,
      name:          me ? `${me.first_name} ${me.last_name}` : 'Me',
      micEnabled:    true,
      webcamEnabled: true,
    });

    meeting.join();

    meeting.localParticipant.on('stream-enabled', (stream) => {
      if (stream.kind === 'video') {
        const ms = new MediaStream();
        ms.addTrack(stream.track);
        const v = document.getElementById('ec-local-video-full');
        if (v) { v.srcObject = ms; v.play().catch(() => {}); }
      }
    });

    meeting.on('meeting-joined', () => {
      setStatus('Connected ●');
      document.getElementById('ec-no-remote').style.display = 'none';
    });

    meeting.on('participant-joined', (p) => addRemoteParticipant(p));
    meeting.on('participant-left',   (p) => removeRemoteParticipant(p));
    meeting.on('meeting-left',       ()  => endCall());
  }

  /* ─────────────────────────────────────────────
     REMOTE PARTICIPANTS
  ───────────────────────────────────────────── */
  function addRemoteParticipant(participant) {
    const grid = document.getElementById('ec-videos-grid');

    const wrap = document.createElement('div');
    wrap.className = 'ec-remote-wrap';
    wrap.id        = `ec-remote-${participant.id}`;

    const vid = document.createElement('video');
    vid.autoplay    = true;
    vid.playsInline = true;
    vid.className   = 'ec-remote-video';

    const lbl = document.createElement('span');
    lbl.className   = 'ec-remote-label';
    lbl.textContent = participant.displayName || currentCallee?.name || 'Participant';

    wrap.appendChild(vid);
    wrap.appendChild(lbl);
    grid.appendChild(wrap);

    participant.on('stream-enabled', (stream) => {
      if (stream.kind === 'video') {
        const ms = new MediaStream();
        ms.addTrack(stream.track);
        vid.srcObject = ms;
        vid.play().catch(() => {});

        const pipVid = document.getElementById('ec-remote-pip-video');
        if (pipVid && !pipVid.srcObject) { pipVid.srcObject = ms; pipVid.play().catch(() => {}); }
      }
    });
  }

  function removeRemoteParticipant(participant) {
    const el = document.getElementById(`ec-remote-${participant.id}`);
    if (el) el.remove();
  }

  /* ─────────────────────────────────────────────
     SHOW / HIDE UI
  ───────────────────────────────────────────── */
  function showCallUI() {
    document.getElementById('ec-call-overlay').classList.add('ec-active');
    document.getElementById('ec-call-full').style.display = 'flex';
    isMinimised = false;

    if (currentCallee) {
      document.getElementById('ec-callee-name').textContent = currentCallee.name || 'User';
      const av = document.getElementById('ec-callee-avatar');
      if (av) av.src = currentCallee.avatar || '';
    }
  }

  function minimiseCall() {
    isMinimised = true;
    document.getElementById('ec-call-full').style.display = 'none';
    document.getElementById('ec-call-pip').style.display  = 'flex';
    document.getElementById('ec-pip-label').textContent   = currentCallee?.name || 'On call';
    // Remove active so full overlay doesn't block page interaction
    document.getElementById('ec-call-overlay').classList.remove('ec-active');
    syncPipWithChat();
  }

  function expandCall() {
    isMinimised = false;
    document.getElementById('ec-call-pip').style.display  = 'none';
    document.getElementById('ec-call-full').style.display = 'flex';
    document.getElementById('ec-call-overlay').classList.add('ec-active');
  }

  function endCall() {
    if (meeting) { try { meeting.leave(); } catch (_) {} meeting = null; }

    document.getElementById('ec-call-overlay').classList.remove('ec-active');
    document.getElementById('ec-call-full').style.display = 'none';
    document.getElementById('ec-call-pip').style.display  = 'none';
    document.querySelectorAll('.ec-remote-wrap').forEach(el => el.remove());
    document.getElementById('ec-no-remote').style.display = 'flex';

    const lv = document.getElementById('ec-local-video-full');
    if (lv) lv.srcObject = null;
    const pv = document.getElementById('ec-remote-pip-video');
    if (pv) pv.srcObject = null;

    isMinimised   = false;
    currentCallee = null;
  }

  function hideIncoming() {
    document.getElementById('ec-incoming').style.display = 'none';
  }

  function setStatus(msg) {
    const el = document.getElementById('ec-call-status');
    if (el) el.textContent = msg;
  }

  /* ─────────────────────────────────────────────
     PIP ↔ CHAT SYNC
  ───────────────────────────────────────────── */
  function syncPipWithChat() {
    if (!isMinimised) return;
    const chatPopup = document.getElementById('chat-popup');
    const pip       = document.getElementById('ec-call-pip');
    if (!chatPopup || !pip) return;

    const chatRect = chatPopup.getBoundingClientRect();
    pip.style.right  = (window.innerWidth  - chatRect.right)  + 'px';
    pip.style.bottom = (window.innerHeight - chatRect.top + 10) + 'px';
  }

  function observeChat() {
    const targets = [
      document.getElementById('chat-interface'),
      document.getElementById('chat-window'),
      document.getElementById('chat-popup'),
    ].filter(Boolean);

    const mo  = new MutationObserver(syncPipWithChat);
    const cfg = { attributes: true, attributeFilter: ['style', 'class'] };
    targets.forEach(t => mo.observe(t, cfg));

    window.addEventListener('resize', syncPipWithChat);
    window.addEventListener('scroll', syncPipWithChat, { passive: true });
  }

  /* ─────────────────────────────────────────────
     CONTROLS
  ───────────────────────────────────────────── */
  function toggleMic() {
    if (!meeting) return;
    isMicOn ? meeting.muteMic() : meeting.unmuteMic();
    isMicOn = !isMicOn;
    document.getElementById('ec-mic-btn').classList.toggle('ec-ctrl-off', !isMicOn);
  }

  function toggleCam() {
    if (!meeting) return;
    isCamOn ? meeting.disableWebcam() : meeting.enableWebcam();
    isCamOn = !isCamOn;
    document.getElementById('ec-cam-btn').classList.toggle('ec-ctrl-off', !isCamOn);
  }

  /* ─────────────────────────────────────────────
     INCOMING CALL — hooks into chat.js's socket
  ───────────────────────────────────────────── */
  function hookSocketIncoming() {
    const tryHook = () => {
      if (!window.socket) { setTimeout(tryHook, 300); return; }

      window.socket.on('callStarted', ({ userId, signalData }) => {
        const { token, roomId } = signalData || {};
        if (!token || !roomId) return;

        // Grab caller info from rendered chat list
        const callerEl     = document.querySelector(`.chat-user[data-user-id="${userId}"]`);
        const callerName   = callerEl?.querySelector('.user-name')?.textContent || 'Someone';
        const callerAvatar = callerEl?.querySelector('.user-image')?.src || '';

        document.getElementById('ec-inc-name').textContent   = callerName;
        document.getElementById('ec-inc-avatar').src         = callerAvatar;
        document.getElementById('ec-incoming').style.display = 'flex';

        document.getElementById('ec-inc-accept').onclick = () =>
          acceptCall(token, roomId, { id: userId, name: callerName, avatar: callerAvatar });

        document.getElementById('ec-inc-reject').onclick = () => hideIncoming();
      });

      window.socket.on('endCall', () => endCall());
    };

    tryHook();
  }

  /* ─────────────────────────────────────────────
     PATCH openChat so button re-injects each time
     a new chat is opened (chat.js re-renders header)
  ───────────────────────────────────────────── */
  function patchOpenChat() {
    const tryPatch = () => {
      if (typeof window.openChat !== 'function') { setTimeout(tryPatch, 400); return; }

      const original = window.openChat;
      window.openChat = function (...args) {
        const result = original.apply(this, args);
        setTimeout(injectCallButton, 200);
        return result;
      };
    };
    tryPatch();
  }

  /* ─────────────────────────────────────────────
     WIRE EVENTS
  ───────────────────────────────────────────── */
  function wireEvents() {
    document.getElementById('ec-minimise-btn').addEventListener('click', minimiseCall);
    document.getElementById('ec-expand-btn').addEventListener('click', expandCall);
    document.getElementById('ec-end-btn').addEventListener('click', endCall);
    document.getElementById('ec-pip-end-btn').addEventListener('click', endCall);
    document.getElementById('ec-mic-btn').addEventListener('click', toggleMic);
    document.getElementById('ec-cam-btn').addEventListener('click', toggleCam);
    document.getElementById('ec-open-chat-btn').addEventListener('click', () => {
      const chatInterface = document.getElementById('chat-interface');
      if (chatInterface) { chatInterface.style.display = 'block'; syncPipWithChat(); }
    });
  }

  /* ─────────────────────────────────────────────
     INIT
  ───────────────────────────────────────────── */
  function init() {
    buildOverlay();
    wireEvents();
    observeChat();
    hookSocketIncoming();
    patchOpenChat();
    setTimeout(injectCallButton, 600);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();