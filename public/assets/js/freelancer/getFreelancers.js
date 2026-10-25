const API = 'http://localhost:3001';

let allFreelancers = [];  // raw data from backend
let allSkills      = [];  // from /api/skills
let selectedSkills = [];  // filter state
let selectedStatus = [];
let maxRate        = 200;
let searchQuery    = '';

document.addEventListener('DOMContentLoaded', async () => {
    await Promise.all([loadSkills(), loadFreelancers()]);
    renderRangeBackground(document.getElementById('rateRange'));
});

async function loadSkills() {
    try {
        const res  = await fetch(`${API}/api/skills`);
        allSkills  = await res.json();
        renderSkillFilterList('');
    } catch (e) {
        console.error('Skills load error:', e);
        document.getElementById('skillFilterList').innerHTML =
            '<span style="font-size:12px;color:var(--ec-muted)">Could not load skills</span>';
    }
}

function renderSkillFilterList(query) {
    const container = document.getElementById('skillFilterList');
    const filtered  = query
        ? allSkills.filter(s => s.name.toLowerCase().includes(query.toLowerCase()))
        : allSkills;

    container.innerHTML = filtered.map(s => `
        <button
            class="fl-chip ${selectedSkills.includes(s.name) ? 'active' : ''}"
            data-skill="${s.name}"
            onclick="toggleSkill('${s.name}', this)"
        >${s.name}</button>
    `).join('');
}

function filterSkillList(query) {
    renderSkillFilterList(query);
}

function toggleSkill(name, el) {
    if (selectedSkills.includes(name)) {
        selectedSkills = selectedSkills.filter(s => s !== name);
        el.classList.remove('active');
    } else {
        selectedSkills.push(name);
        el.classList.add('active');
    }
    renderActiveFilters();
}

async function loadFreelancers() {
    renderSkeletons();
    try {
        const res = await fetch(`${API}/api/users/freelancers`, {
            headers: { 'Content-Type': 'application/json' }
        });
        allFreelancers = await res.json();
        console.log('Freelancers:', allFreelancers);

        // Update hero stats
        document.getElementById('statTotal').textContent = allFreelancers.length + '+';
        const avail = allFreelancers.filter(f => f.availabilityStatus === 'available').length;
        document.getElementById('statAvail').textContent = avail;

        // Update status counts in sidebar
        document.getElementById('cnt-available').textContent = avail;
        document.getElementById('cnt-busy').textContent =
            allFreelancers.filter(f => f.availabilityStatus === 'busy').length;

        applyFilters();
    } catch (e) {
        console.error('Freelancers load error:', e);
        document.getElementById('freelancersList').innerHTML = `
            <div class="fl-empty">
                <i class="bi bi-wifi-off"></i>
                <h5>Could not load freelancers</h5>
                <p>Check that your backend is running on ${API}</p>
            </div>`;
    }
}

function applyFilters() {
    let list = [...allFreelancers];

    // Search query
    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        list = list.filter(f => {
            const name   = `${f.user.first_name} ${f.user.last_name}`.toLowerCase();
            const skills = (f.skills || []).join(' ').toLowerCase();
            return name.includes(q) || skills.includes(q);
        });
    }

    // Rate
    list = list.filter(f => f.hourly_Rate <= maxRate);

    // Availability
    if (selectedStatus.length) {
        list = list.filter(f => selectedStatus.includes(f.availabilityStatus));
    }

    // Skills (freelancer must have ALL selected skills)
    if (selectedSkills.length) {
        list = list.filter(f =>
            selectedSkills.every(s => (f.skills || []).includes(s))
        );
    }

    // Sort
    const sort = document.getElementById('sortSelect')?.value || 'rate_asc';
    list = sortList(list, sort);

    // Render
    const count = list.length;
    document.getElementById('resultCount').innerHTML =
        `<strong>${count}</strong> <span>freelancer${count !== 1 ? 's' : ''} found</span>`;

    renderFreelancers(list);
    renderActiveFilters();
}

function sortList(list, mode) {
    switch (mode) {
        case 'rate_asc':       return list.sort((a, b) => a.hourly_Rate - b.hourly_Rate);
        case 'rate_desc':      return list.sort((a, b) => b.hourly_Rate - a.hourly_Rate);
        case 'name_asc':       return list.sort((a, b) => a.user.first_name.localeCompare(b.user.first_name));
        case 'available_first':return list.sort((a, b) => (b.availabilityStatus === 'available') - (a.availabilityStatus === 'available'));
        default: return list;
    }
}

function renderFreelancers(list) {
    const container = document.getElementById('freelancersList');

    if (!list.length) {
        container.innerHTML = `
            <div class="fl-empty">
                <i class="bi bi-person-x"></i>
                <h5>No freelancers match</h5>
                <p>Try adjusting your filters or search term.</p>
            </div>`;
        return;
    }

    container.innerHTML = list.map((f, i) => buildCard(f, i)).join('');
}

function buildCard(f, index) {
    const user   = f.user;
    const avatar = user.avatar
        ? `${API}${user.avatar}`
        : 'assets/images/avatar/05.jpg';

    const status  = f.availabilityStatus || 'offline';
    const skills  = (f.skills || []).slice(0, 5);
    const moreSkills = (f.skills || []).length - 5;

    const statusLabel = {
        available: 'Available',
        busy:      'Busy',
        offline:   'Offline'
    }[status] || status;

    const skillTags = skills.map(s =>
        `<span class="fl-skill-tag">${s}</span>`
    ).join('') + (moreSkills > 0 ? `<span class="fl-skill-tag">+${moreSkills} more</span>` : '');

    return `
    <div class="fl-card" style="animation-delay:${index * 0.04}s">
        <div class="fl-avatar-wrap">
            <img src="${avatar}" alt="${user.first_name}" class="fl-avatar"
                 onerror="this.src='assets/images/avatar/05.jpg'">
            <span class="fl-online-dot ${status}"></span>
        </div>

        <div class="fl-info">
            <div class="fl-name-row">
                <a href="freelancer-profile.html?id=${user.id}" class="fl-name">
                    ${user.first_name} ${user.last_name}
                </a>
                <span class="fl-verified">
                    <i class="bi bi-patch-check-fill"></i> Verified
                </span>
            </div>
            <p class="fl-tagline">${f.tagline || 'Freelance Developer & Designer'}</p>

            <div class="fl-meta">
                <span class="rate">$${f.hourly_Rate}<small style="font-size:10px;font-weight:400">/hr</small></span>
                <span><i class="bi bi-geo-alt"></i>${user.location || 'Remote'}</span>
                <span><i class="bi bi-briefcase"></i>${f.jobsCompleted || 0} jobs</span>
                <span class="fl-stars">
                    ${'<i class="bi bi-star-fill"></i>'.repeat(Math.min(5, Math.round(f.rating || 4)))}
                    <span>(${f.reviewCount || 0})</span>
                </span>
            </div>

            <div class="fl-skills">${skillTags || '<span style="font-size:12px;color:var(--ec-muted)">No skills listed</span>'}</div>
        </div>

        <div class="fl-actions">
            <span class="fl-status-badge ${status}">${statusLabel}</span>
            <button class="fl-btn-chat" onclick="startChatWithFreelancer(${user.id}, '${user.first_name} ${user.last_name}', '${avatar}')">
                <i class="bi bi-chat-dots"></i> Message
            </button>
            <a href="freelancer-profile.html?id=${user.id}" class="fl-btn-info">
                <i class="bi bi-person"></i> Profile
            </a>
        </div>
    </div>`;
}

function startChatWithFreelancer(userId, name, avatar) {
    // Open chat interface
    const chatInterface = document.getElementById('chat-interface');
    const chatPopup     = document.getElementById('chat-popup');
    if (chatInterface) chatInterface.style.display = 'block';

    // Update chat header
    const chatWith    = document.getElementById('chat-with');
    const chatUserImg = document.getElementById('chat-user-image');
    if (chatWith)    chatWith.textContent = `Chat with ${name}`;
    if (chatUserImg) chatUserImg.src = avatar;

    // Set globals that chat.js + videocall-overlay.js use
    window.rID = userId;

    // Try to find an existing chat in the rendered list and click it
    const existing = document.querySelector(`.chat-user[data-user-id="${userId}"]`);
    if (existing) {
        existing.click();
        return;
    }

    // If no existing chat, open chat window directly so user can send first message
    const chatWindow = document.getElementById('chat-window');
    if (chatWindow) {
        document.getElementById('chat-interface')?.classList.add('chatOpened');
        chatWindow.classList.add('chatOpened');
    }
}

function updateRateDisplay(val) {
    maxRate = Number(val);
    document.getElementById('rateDisplay').textContent = `≤ $${val}/hr`;
    renderRangeBackground(document.getElementById('rateRange'));
}

function renderRangeBackground(input) {
    const pct = ((input.value - input.min) / (input.max - input.min)) * 100;
    input.style.setProperty('--pct', pct + '%');
}

function toggleStatus(checkbox) {
    const val = checkbox.value;
    const opt = document.getElementById(`opt-${val}`);
    if (checkbox.checked) {
        selectedStatus.push(val);
        opt?.classList.add('checked');
    } else {
        selectedStatus = selectedStatus.filter(s => s !== val);
        opt?.classList.remove('checked');
    }
    renderActiveFilters();
}

function toggleChip(el, _group) {
    el.classList.toggle('active');
    renderActiveFilters();
}

function applyHeroSearch() {
    searchQuery = document.getElementById('heroSearch').value.trim();
    applyFilters();
    document.querySelector('.fl-layout')?.scrollIntoView({ behavior: 'smooth' });
}

// Also search on Enter
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && document.activeElement?.id === 'heroSearch') applyHeroSearch();
});

function resetFilters() {
    selectedSkills = [];
    selectedStatus = [];
    maxRate        = 200;
    searchQuery    = '';

    document.getElementById('rateRange').value = 200;
    document.getElementById('rateDisplay').textContent = '≤ $200/hr';
    document.getElementById('heroSearch').value = '';
    renderRangeBackground(document.getElementById('rateRange'));

    document.querySelectorAll('.fl-chip.active').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.fl-status-opt input').forEach(c => c.checked = false);
    document.querySelectorAll('.fl-status-opt').forEach(o => o.classList.remove('checked'));

    renderSkillFilterList('');
    renderActiveFilters();
    applyFilters();
}

function renderActiveFilters() {
    const container = document.getElementById('activeFilters');
    const tags = [];

    if (searchQuery) tags.push({ label: `"${searchQuery}"`, clear: () => { searchQuery = ''; document.getElementById('heroSearch').value = ''; applyFilters(); } });
    if (maxRate < 500) tags.push({ label: `≤ $${maxRate}/hr`, clear: () => { maxRate = 500; document.getElementById('rateRange').value = 500; updateRateDisplay(500); applyFilters(); } });
    selectedSkills.forEach(s => tags.push({ label: s, clear: () => { selectedSkills = selectedSkills.filter(x => x !== s); document.querySelector(`[data-skill="${s}"]`)?.classList.remove('active'); applyFilters(); } }));
    selectedStatus.forEach(s => tags.push({ label: s, clear: () => { selectedStatus = selectedStatus.filter(x => x !== s); applyFilters(); } }));

    container.innerHTML = tags.map((t, i) => `
        <span class="fl-active-tag">
            ${t.label}
            <button onclick="(${t.clear.toString()})()">×</button>
        </span>
    `).join('');
}

function toggleMobileSidebar() {
    document.getElementById('flSidebar').classList.toggle('open');
}

function renderSkeletons() {
    const container = document.getElementById('freelancersList');
    container.innerHTML = Array(4).fill(`
        <div class="fl-card" style="pointer-events:none">
            <div class="fl-skeleton" style="width:72px;height:72px;border-radius:50%"></div>
            <div style="flex:1">
                <div class="fl-skeleton" style="height:18px;width:55%;margin-bottom:10px"></div>
                <div class="fl-skeleton" style="height:13px;width:80%;margin-bottom:8px"></div>
                <div class="fl-skeleton" style="height:13px;width:40%;margin-bottom:14px"></div>
                <div style="display:flex;gap:6px">
                    <div class="fl-skeleton" style="height:24px;width:60px;border-radius:20px"></div>
                    <div class="fl-skeleton" style="height:24px;width:70px;border-radius:20px"></div>
                    <div class="fl-skeleton" style="height:24px;width:50px;border-radius:20px"></div>
                </div>
            </div>
            <div style="display:flex;flex-direction:column;gap:8px;min-width:120px">
                <div class="fl-skeleton" style="height:36px;border-radius:8px"></div>
                <div class="fl-skeleton" style="height:36px;border-radius:8px"></div>
            </div>
        </div>
    `).join('');
}