// Projects data structure
const projectsData = [
    {
        id: 1,
        title: "TaskFlow",
        genre: "Productivity • Task Management",
        image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=700&fit=crop",
        videoId: "video1",
        videoSrc: "https://media.istockphoto.com/id/1265220754/video/mock-up-fantasy-rpg-moba-video-game-gameplay-with-role-playing-personage-doing-animated-magic.mp4?s=mp4-640x640-is&k=20&c=n3PvOni4Nz7puhQt0D1gw7R4EDmd9Lkb8lEh0vQtI54=",
        description: "A powerful task management application designed to streamline your workflow and boost productivity. TaskFlow combines intuitive design with advanced features like real-time collaboration, smart notifications, and AI-powered task prioritization to help teams stay organized and focused.",
        platforms: [
            { name: "Windows", icon: "assets/images/elements/windows-com.svg" },
            { name: "Android", icon: "assets/images/elements/android.svg" }
        ],
        features: [
            {
                title: "Real-time Sync",
                icon: "⚡",
                image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop",
                description: "Instant synchronization across all your devices with lightning-fast cloud technology"
            },
            {
                title: "AI Assistant",
                icon: "🤖",
                image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop",
                description: "Smart task prioritization and scheduling powered by advanced machine learning"
            },
            {
                title: "Team Collaboration",
                icon: "👥",
                image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop",
                description: "Seamless teamwork with shared workspaces and real-time updates"
            },
            {
                title: "Analytics Dashboard",
                icon: "📊",
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
                description: "Comprehensive insights into productivity patterns and performance metrics"
            }
        ],
        technologies: [
            { icon: "⚛️", name: "React Native" },
            { icon: "🔥", name: "Firebase" },
            { icon: "🟢", name: "Node.js" },
            { icon: "🐘", name: "PostgreSQL" },
            { icon: "🎨", name: "Tailwind CSS" },
            { icon: "🔐", name: "JWT Auth" },
            { icon: "📡", name: "WebSocket" },
            { icon: "☁️", name: "AWS" }
        ]
    },
    {
        id: 2,
        title: "FitTrack Pro",
        genre: "Health & Fitness • Wellness",
        image: "https://images.unsplash.com/photo-1556742111-a301076d9d18?w=400&h=700&fit=crop",
        videoId: "video2",
        videoSrc: "https://media.istockphoto.com/id/1357049879/video/video-game-mock-up-concept-game-play-3d-third-person-shooter-online-multiplayer-battle-royale.mp4?s=mp4-640x640-is&k=20&c=X9FMppRUBxo_PN1JOkCcRwGrNbrYkPKz7uG_eZuHuo4=",
        description: "Your personal fitness companion that transforms the way you approach health and wellness. FitTrack Pro offers personalized workout plans, nutrition tracking, and progress analytics all in one beautiful, easy-to-use interface. Whether you're a beginner or an athlete, achieve your fitness goals faster.",
        platforms: [
            { name: "Windows", icon: "assets/images/elements/windows-com.svg" },
            { name: "Android", icon: "assets/images/elements/android.svg" }
        ],
        features: [
            {
                title: "Personalized Workouts",
                icon: "💪",
                image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=400&fit=crop",
                description: "Custom workout plans tailored to your fitness level and goals"
            },
            {
                title: "Nutrition Tracking",
                icon: "🥗",
                image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=400&fit=crop",
                description: "Easy meal logging with comprehensive nutritional information"
            },
            {
                title: "Progress Analytics",
                icon: "📈",
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
                description: "Visual insights into your fitness journey with detailed charts"
            },
            {
                title: "Community Support",
                icon: "👥",
                image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop",
                description: "Connect with fitness enthusiasts and share your achievements"
            }
        ],
        technologies: [
            { icon: "📱", name: "Flutter" },
            { icon: "🎯", name: "Dart" },
            { icon: "🔥", name: "Firestore" },
            { icon: "🐍", name: "Python" },
            { icon: "🧠", name: "TensorFlow" },
            { icon: "📊", name: "MongoDB" },
            { icon: "⚡", name: "FastAPI" },
            { icon: "🔔", name: "Push Notifications" }
        ]
    },
    {
        id: 3,
        title: "StreamVibe",
        genre: "Entertainment • Media Streaming",
        image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=700&fit=crop",
        videoId: "video3",
        videoSrc: "https://cdn.pixabay.com/video/2022/08/17/128210-747086064_large.mp4",
        description: "Experience entertainment like never before with StreamVibe. Our cutting-edge streaming platform delivers high-quality content with adaptive streaming technology, personalized recommendations, and a sleek interface. Enjoy your favorite shows and movies across all your devices with offline download capabilities.",
        platforms: [
            { name: "Windows", icon: "assets/images/elements/windows-com.svg" },
            { name: "Android", icon: "assets/images/elements/android.svg" }
        ],
        features: [
            {
                title: "4K Streaming",
                icon: "🎬",
                image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=600&h=400&fit=crop",
                description: "Ultra HD streaming with adaptive bitrate for optimal quality"
            },
            {
                title: "Smart Recommendations",
                icon: "🤖",
                image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop",
                description: "AI-powered content suggestions based on your viewing habits"
            },
            {
                title: "Offline Downloads",
                icon: "📥",
                image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop",
                description: "Download content to watch anywhere without internet"
            },
            {
                title: "Multi-Device Sync",
                icon: "📱",
                image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop",
                description: "Continue watching seamlessly across all your devices"
            }
        ],
        technologies: [
            { icon: "⚛️", name: "React" },
            { icon: "📘", name: "TypeScript" },
            { icon: "🟢", name: "Node.js" },
            { icon: "⚡", name: "Express" },
            { icon: "🎥", name: "FFmpeg" },
            { icon: "☁️", name: "AWS S3" },
            { icon: "🌐", name: "CloudFront CDN" },
            { icon: "🔴", name: "Redis" },
            { icon: "🎬", name: "HLS Protocol" }
        ]
    },
    {
        id: 4,
        title: "CodeCollab",
        genre: "Development • Collaboration",
        image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=700&fit=crop",
        videoId: "video1",
        videoSrc: "https://media.istockphoto.com/id/1265220754/video/mock-up-fantasy-rpg-moba-video-game-gameplay-with-role-playing-personage-doing-animated-magic.mp4?s=mp4-640x640-is&k=20&c=n3PvOni4Nz7puhQt0D1gw7R4EDmd9Lkb8lEh0vQtI54=",
        description: "The ultimate collaborative coding platform for modern development teams. CodeCollab offers real-time code editing, integrated version control, and powerful debugging tools all in a beautifully designed interface.",
        platforms: [
            { name: "Windows", icon: "assets/images/elements/windows-com.svg" },
            { name: "Android", icon: "assets/images/elements/android.svg" }
        ],
        features: [
            {
                title: "Live Collaboration",
                icon: "👨‍💻",
                image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop",
                description: "Code together in real-time with your team members"
            },
            {
                title: "Git Integration",
                icon: "🔀",
                image: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=600&h=400&fit=crop",
                description: "Seamless integration with GitHub, GitLab, and Bitbucket"
            },
            {
                title: "Smart Debugging",
                icon: "🐛",
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
                description: "Advanced debugging tools with AI-powered suggestions"
            },
            {
                title: "Code Review",
                icon: "✅",
                image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop",
                description: "Streamlined code review process with inline comments"
            }
        ],
        technologies: [
            { icon: "⚡", name: "Electron" },
            { icon: "⚛️", name: "React" },
            { icon: "🟢", name: "Node.js" },
            { icon: "🔌", name: "WebSocket" },
            { icon: "📝", name: "Monaco Editor" },
            { icon: "🐙", name: "Git" },
            { icon: "🔐", name: "OAuth" },
            { icon: "☁️", name: "AWS" }
        ]
    },
    {
        id: 5,
        title: "ShopEase",
        genre: "E-commerce • Shopping",
        image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=400&h=700&fit=crop",
        videoId: "video2",
        videoSrc: "https://media.istockphoto.com/id/1357049879/video/video-game-mock-up-concept-game-play-3d-third-person-shooter-online-multiplayer-battle-royale.mp4?s=mp4-640x640-is&k=20&c=X9FMppRUBxo_PN1JOkCcRwGrNbrYkPKz7uG_eZuHuo4=",
        description: "Revolutionary shopping experience that brings the best deals to your fingertips. ShopEase features AI-powered recommendations, augmented reality try-ons, and seamless checkout for a delightful shopping journey.",
        platforms: [
            { name: "Windows", icon: "assets/images/elements/windows-com.svg" },
            { name: "Android", icon: "assets/images/elements/android.svg" }
        ],
        features: [
            {
                title: "AR Try-On",
                icon: "👓",
                image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop",
                description: "Visualize products in your space with augmented reality"
            },
            {
                title: "Smart Search",
                icon: "🔍",
                image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop",
                description: "AI-powered search with visual recognition capabilities"
            },
            {
                title: "Price Tracking",
                icon: "💰",
                image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&h=400&fit=crop",
                description: "Track price history and get alerts on deals"
            },
            {
                title: "One-Click Checkout",
                icon: "🛒",
                image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
                description: "Lightning-fast checkout with saved preferences"
            }
        ],
        technologies: [
            { icon: "⚛️", name: "React Native" },
            { icon: "🛍️", name: "Stripe" },
            { icon: "🎨", name: "ARKit" },
            { icon: "🔥", name: "Firebase" },
            { icon: "🧠", name: "TensorFlow" },
            { icon: "🟢", name: "Node.js" },
            { icon: "📊", name: "GraphQL" },
            { icon: "☁️", name: "Google Cloud" }
        ]
    },
    {
        id: 6,
        title: "MindfulMe",
        genre: "Health • Meditation",
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=700&fit=crop",
        videoId: "video3",
        videoSrc: "https://cdn.pixabay.com/video/2022/08/17/128210-747086064_large.mp4",
        description: "Your personal sanctuary for mental wellness. MindfulMe offers guided meditations, breathing exercises, and sleep stories designed by wellness experts to help you achieve inner peace and better mental health.",
        platforms: [
            { name: "Windows", icon: "assets/images/elements/windows-com.svg" },
            { name: "Android", icon: "assets/images/elements/android.svg" }
        ],
        features: [
            {
                title: "Guided Meditations",
                icon: "🧘",
                image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=400&fit=crop",
                description: "Expert-led meditation sessions for all experience levels"
            },
            {
                title: "Sleep Stories",
                icon: "😴",
                image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=600&h=400&fit=crop",
                description: "Calming bedtime stories to help you fall asleep"
            },
            {
                title: "Mood Tracking",
                icon: "📊",
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
                description: "Track your emotional wellness journey over time"
            },
            {
                title: "Breathing Exercises",
                icon: "🌬️",
                image: "https://images.unsplash.com/photo-1447452001602-7090c7ab2db3?w=600&h=400&fit=crop",
                description: "Science-backed breathing techniques for stress relief"
            }
        ],
        technologies: [
            { icon: "📱", name: "Flutter" },
            { icon: "🎵", name: "Audio Streaming" },
            { icon: "🔥", name: "Firebase" },
            { icon: "📊", name: "Chart.js" },
            { icon: "🧠", name: "ML Kit" },
            { icon: "☁️", name: "Cloud Storage" },
            { icon: "🔔", name: "Notifications" },
            { icon: "💾", name: "SQLite" }
        ]
    }
];

// State management
let currentIndex = 0;
const projectsPerView = 3;

// Initialize videos
function initializeVideos() {
    const videoContainer = document.getElementById('videoBackground');
    if (!videoContainer) return;

    videoContainer.innerHTML = '';
    
    // Get unique video sources from projects
    const uniqueVideos = {};
    projectsData.forEach(project => {
        if (!uniqueVideos[project.videoId]) {
            uniqueVideos[project.videoId] = project.videoSrc;
        }
    });

    // Create video elements
    Object.entries(uniqueVideos).forEach(([videoId, videoSrc]) => {
        const video = document.createElement('video');
        video.id = videoId;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        
        const source = document.createElement('source');
        source.src = videoSrc;
        source.type = 'video/mp4';
        
        video.appendChild(source);
        videoContainer.appendChild(video);
    });
}

// Render projects
function renderProjects() {
    const main = document.querySelector('main');
    if (!main) return;

    // Clear existing content except video background
    const videoBackground = document.getElementById('videoBackground');
    main.innerHTML = '';
    if (videoBackground) {
        main.appendChild(videoBackground);
    }

    // Get current projects to display
    const endIndex = Math.min(currentIndex + projectsPerView, projectsData.length);
    const currentProjects = projectsData.slice(currentIndex, endIndex);

    // Render each project
    currentProjects.forEach((project, idx) => {
        const section = createProjectSection(project);
        main.appendChild(section);
    });

    // Add navigation controls
    const navControls = createNavigationControls();
    main.appendChild(navControls);

    // Setup observers for video switching
    setupIntersectionObservers();
}

// Create project section HTML
function createProjectSection(project) {
    const section = document.createElement('section');
    section.className = 'project-section';
    section.setAttribute('data-video', project.videoId);

    section.innerHTML = `
        <div class="project-container">
            <div class="project-header">
                <div class="project-image">
                    <img src="${project.image}" alt="${project.title}">
                </div>
                <div class="project-info">
                    <h1 class="project-title">${project.title}</h1>
                    <p class="project-genre">${project.genre}</p>
                    <p class="project-description">${project.description}</p>
                    <div class="download-links">
                        ${project.platforms.map(platform => `
                            <a href="#" class="download-btn">
                                <img src="${platform.icon}" alt="${platform.name}" 
                                style="width:25px; height: 25px; filter: brightness(0) invert(1);">
                                <span>${platform.name}</span>
                            </a>
                        `).join('')}
                    </div>
                </div>
            </div>

            <div class="tech-stack-section">
                <h2 class="section-title2">Key Features</h2>
                <div class="features-grid">
                    ${project.features.map(feature => `
                        <a href="#" class="feature-card">
                            <img src="${feature.image}" alt="${feature.title}" class="feature-image">
                            <div class="feature-overlay"></div>
                            <div class="feature-tag">
                                <span class="feature-icon">${feature.icon}</span>
                                <span>${feature.title}</span>
                            </div>
                            <div class="feature-content">
                                <h3 class="feature-title">${feature.title}</h3>
                                <p class="feature-description">${feature.description}</p>
                            </div>
                        </a>
                    `).join('')}
                </div>
                <a href="#" class="view-details-btn">View Full Project Details →</a>
            </div>

            <div class="technologies-section">
                <h2 class="section-title2">Software & Technologies Used</h2>
                <div class="tech-tags">
                    ${project.technologies.map(tech => `
                        <div class="tech-tag">
                            <div class="tech-icon">${tech.icon}</div>
                            <span>${tech.name}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    return section;
}

// Create navigation controls
function createNavigationControls() {
    const nav = document.createElement('div');
    nav.className = 'project-navigation';
    nav.style.cssText = `
        position: fixed;
        bottom: 40px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1000;
        display: flex;
        gap: 20px;
        align-items: center;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(10px);
        padding: 15px 30px;
        border-radius: 50px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    `;

    const prevBtn = document.createElement('button');
    prevBtn.className = 'nav-btn prev-btn';
    prevBtn.innerHTML = '← Previous';
    prevBtn.disabled = currentIndex === 0;
    prevBtn.onclick = () => navigateProjects('prev');

    const counter = document.createElement('span');
    counter.className = 'project-counter';
    counter.style.cssText = 'color: white; font-weight: 600; min-width: 100px; text-align: center;';
    counter.textContent = `${currentIndex + 1}-${Math.min(currentIndex + projectsPerView, projectsData.length)} of ${projectsData.length}`;

    const nextBtn = document.createElement('button');
    nextBtn.className = 'nav-btn next-btn';
    nextBtn.innerHTML = 'Next →';
    nextBtn.disabled = currentIndex + projectsPerView >= projectsData.length;
    nextBtn.onclick = () => navigateProjects('next');

    // Style buttons
    [prevBtn, nextBtn].forEach(btn => {
        btn.style.cssText = `
            background: rgba(255, 255, 255, 0.1);
            border: 2px solid rgba(255, 255, 255, 0.2);
            color: white;
            padding: 10px 20px;
            border-radius: 25px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
        `;
        btn.onmouseover = () => {
            if (!btn.disabled) {
                btn.style.background = 'rgba(255, 255, 255, 0.2)';
                btn.style.borderColor = 'rgba(255, 255, 255, 0.4)';
            }
        };
        btn.onmouseout = () => {
            btn.style.background = 'rgba(255, 255, 255, 0.1)';
            btn.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        };
        if (btn.disabled) {
            btn.style.opacity = '0.3';
            btn.style.cursor = 'not-allowed';
        }
    });

    nav.appendChild(prevBtn);
    nav.appendChild(counter);
    nav.appendChild(nextBtn);

    return nav;
}

// Navigate between project sets
function navigateProjects(direction) {
    if (direction === 'next' && currentIndex + projectsPerView < projectsData.length) {
        currentIndex += projectsPerView;
    } else if (direction === 'prev' && currentIndex > 0) {
        currentIndex = Math.max(0, currentIndex - projectsPerView);
    }

    renderProjects();
    
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Setup intersection observers for video switching
function setupIntersectionObservers() {
    const sections = document.querySelectorAll('.project-section');
    const videos = {};
    
    // Get all video elements
    document.querySelectorAll('video').forEach(video => {
        videos[video.id] = video;
    });

    let currentVideo = null;

    const observerOptions = {
        threshold: 0,
        rootMargin: '-40% 0px -40% 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const videoId = entry.target.getAttribute('data-video');
                if (videoId && videos[videoId] && currentVideo !== videoId) {
                    // Stop all videos
                    Object.values(videos).forEach(video => {
                        video.classList.remove('active');
                        video.pause();
                    });

                    // Play current video
                    videos[videoId].classList.add('active');
                    videos[videoId].play().catch(e => console.log('Video play failed:', e));
                    currentVideo = videoId;
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    // Initialize first video
    if (sections.length > 0 && videos[sections[0].getAttribute('data-video')]) {
        const firstVideoId = sections[0].getAttribute('data-video');
        videos[firstVideoId].classList.add('active');
        videos[firstVideoId].play().catch(e => console.log('Video play failed:', e));
        currentVideo = firstVideoId;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeVideos();
    renderProjects();
});