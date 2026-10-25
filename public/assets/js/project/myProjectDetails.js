const urlParams = new URLSearchParams(window.location.search);

const projectId = urlParams.get('projectId');

async function GetData() {
    console.log("Trying to get data");

    const authToken = localStorage.getItem('authToken');
    const apiEndpoint = `http://localhost:3001/api/projects/projectDetails/${projectId}`;

    try {
        const response = await fetch(apiEndpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}` // Assuming you need the auth token for the request
            },
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        console.log("data:", data);
        return data;
    } catch (e) {
        console.error('Error fetching data:', e);
        return null;
    }
}

async function renderScreen() {
    const user = JSON.parse(localStorage.getItem('user'));
    const { id } = user;
    console.log("Trying");
    const projectsContainer = document.querySelector(".projects-container");

    console.log("Trying");

    try {
        const projectDetails = await GetData();
        const { projectName, description, skills, progress, tags } = projectDetails;
        console.log("The Project details are:", projectDetails);

        console.log("Description is:", description);
        document.querySelector('#projectName').textContent = projectName;
        document.querySelector('#description').textContent = description;

        // Handle skills
        const skillsArray = skills.split(',');
        const skillsList = document.getElementById('skills-list');
        skillsList.innerHTML = ''; // Clear any existing skills
        
        console.log("Skills list:", skillsArray);

        skillsArray.forEach(skill => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item d-flex mb-0';
            listItem.innerHTML = `<i class="bi bi-patch-check text-primary me-2"></i>${skill.trim()}`;
            skillsList.appendChild(listItem);
        });

        renderApplicants(projectDetails.applications, id);
        hasUserAppliedAlready(projectDetails.applications, id);
    } catch (error) {
        console.error('Error rendering projects:', error);
    }
}

function hasUserAppliedAlready(data, id){
    data.forEach(data => {
        if(data.user.id == id){
            console.log("You have already applied for this work")
            applied();
            return true;
        }
    })
    return false;
}

function renderApplicants(data, id){
    applicantList = document.getElementById("applicant-list");

    data.forEach(data => {
        const applicant = `
            <div class="user-card d-md-flex justify-content-md-between align-items-md-center flex-md-row p-4 mb-3">
                <div class="d-md-flex align-items-md-center flex-md-row">
                    <div class="me-1">
                        <img src="assets/images/auth/01.jpg" alt="Avatar" class="avatar_icon me-5 bs-success" width="100" height="100">
                    </div>
                    <div>
                        <div class="applicant mb-2">Skills: Python, Django, HTM...</div>
                        <h5 class="mb-0"><a href="applicant-profile.html" class="bs-black">${data.user.first_name} ${data.user.last_name}</a></h5>
                        <p>Email: ${data.user.email}</p>
                    </div>
                </div>
                <div>
                    <div>
                        <a href="career-single-application.html?projectId=${projectId}&&applicationId=${data.id}" class="btn btn-primary mb-1">View Application<i class="bi bi-arrow-right ms-2"></i></a>
                    </div>
                    <div>
                        <a href="#" class="btn btn-info mb-0">Message<i class="bi bi-arrow-right ms-2"></i></a>
                    </div>
                </div>
            </div>
        `

        applicantList.innerHTML += applicant;
    })
    return false;
}

function applied(){
    console.log("You have already applied for this work")
    const applyNowButton = document.getElementById("apply_now");
    console.log("You have already applied for this work")
    
    applyNowButton.removeEventListener<'click'>
    console.log("You have already applied for this work")
}

function notApplied(){
    const applyNowButton = document.getElementById("apply_now");
}

async function applyForJob() {
    const authToken = localStorage.getItem('authToken');
    const user = JSON.parse(localStorage.getItem('user'));
    const { id } = user;

    console.log("User id is:", id)
    const message = document.getElementById('application_message').value; // Replace with actual message
    const portfolioIds = [1, 2, 3]; // Replace with actual portfolio IDs

    const apiEndpoint = `http://localhost:3001/api/projects/${projectId}/apply`;

    try {
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ userId: id, message, portfolioIds }),
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        console.log("data:", data);
        return data;
    } catch (e) {
        console.error('Error applying for project:', e);
        return null;
    }
}



// const galleryContainer = document.querySelector('.gallery-container');
// const galleryControlsContainer = document.querySelector('.gallery-controls');
// const galleryControls = ['previous', 'next'];
// const galleryItems = document.querySelectorAll('.gallery-item');

// class Carousel {
//     constructor(container, items, controls) {
//         this.carouselContainer = container;
//         this.carouselControls = controls;
//         this.carouselArray = [...items];
//     }

//     updateGallery() {
//         this.carouselArray.forEach(el => {
//             el.classList.remove('gallery-item-1', 'gallery-item-2', 'gallery-item-3', 'gallery-item-4', 'gallery-item-5');
//         });

//         this.carouselArray.slice(0, 5).forEach((el, i) => {
//             el.classList.add(`gallery-item-${i + 1}`);
//         });
//     }

//     setCurrentState(direction) {
//         if (direction.className === 'gallery-controls-previous') {
//             this.carouselArray.unshift(this.carouselArray.pop());
//         } else {
//             this.carouselArray.push(this.carouselArray.shift());
//         }
//         this.updateGallery();
//     }

//     setControls() {
//         this.carouselControls.forEach(control => {
//             const button = document.createElement('button');
//             button.className = `gallery-controls-${control}`;
//             button.innerText = control; // Set the text of the button
//             galleryControlsContainer.appendChild(button);
//         });
//     }

//     useControls() {
//         const triggers = [...galleryControlsContainer.childNodes];
//         triggers.forEach(control => {
//             control.addEventListener('click', e => {
//                 e.preventDefault();
//                 this.setCurrentState(control);
//             });
//         });
//     }
// }

// const exampleCarousel = new Carousel(galleryContainer, galleryItems, galleryControls);

// exampleCarousel.setControls();
// exampleCarousel.useControls();



// const slider = document.querySelector('.image-slider');
// const slidesContainer = document.querySelector('.slides-container');
// const slides = document.querySelectorAll('.slide');
// let currentIndex = 0;
// let slideWidth = slider.clientWidth;

// window.addEventListener('resize', () => {
//     slideWidth = slider.clientWidth;
//     updateSlidePosition();
// });

// function moveToNextSlide() {
//     currentIndex++;
//     if (currentIndex >= slides.length + 1) {
//         currentIndex = 1;
//         slidesContainer.style.transition = 'none';
//         updateSlidePosition();
//         setTimeout(() => {
//             slidesContainer.style.transition = 'transform 1s ease-in-out';
//         }, 0);
//     } else {
//         updateSlidePosition();
//     }
// }

// function updateSlidePosition() {
//     slidesContainer.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
// }

// // Clone the first and last slides for seamless looping
// const firstSlideClone = slides[0].cloneNode(true);
// const lastSlideClone = slides[slides.length - 1].cloneNode(true);

// slidesContainer.appendChild(firstSlideClone);
// slidesContainer.insertBefore(lastSlideClone, slides[0]);

// // Initial positioning
// slidesContainer.style.transform = `translateX(0)`;

// slidesContainer.addEventListener('transitionend', () => {
//     if (currentIndex === slides.length + 1) {
//         slidesContainer.style.transition = 'none';
//         currentIndex = 1;
//         updateSlidePosition();
//         setTimeout(() => {
//             slidesContainer.style.transition = 'transform 1s ease-in-out';
//         }, 0);
//     }
// });

// // Start the slider with a delay on the first slide
// setTimeout(() => {
//     currentIndex = 1;  // Start from the first slide
//     updateSlidePosition();
//     setInterval(moveToNextSlide, 3000); // Change slide every 3 seconds
// }, 3000); // Initial delay on the first slide


document.addEventListener("DOMContentLoaded", function () {
    renderScreen();

    // Auto-scrolling header
    // const slider = document.querySelector('.image-slider');
    // const slides = document.querySelectorAll('.image-slider .slide');
    // let currentIndex = 0;

    // function showNextSlide() {
    //     slides[currentIndex].style.transform = 'translateX(-100%)';
    //     currentIndex = (currentIndex + 1) % slides.length;
    //     slides[currentIndex].style.transform = 'translateX(0)';
    // }

    // setInterval(showNextSlide, 3000);

    // Tabs functionality
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

    function showTab(tabId) {
        tabContents.forEach(content => content.style.display = 'none');
        document.getElementById(tabId).style.display = 'block';
        
        tabLinks.forEach(link => link.classList.remove('active'));
        const activeLink = Array.from(tabLinks).find(link => link.getAttribute('data-tab') === tabId);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    // Add click event listeners to tabs
    tabLinks.forEach(link => {
        link.addEventListener('click', function () {
            const tabId = this.getAttribute('data-tab');
            showTab(tabId);
        });
    });

    // Initial tab
    showTab('details');
});


const galleryContainer = document.querySelector('.gallery-container');
const galleryControlsContainer = document.querySelector('.gallery-controls');
const galleryItems = document.querySelectorAll('.gallery-item');

class Carousel {
    constructor(container, items) {
        this.carouselContainer = container;
        this.carouselArray = [...items];
    }

    updateGallery() {
        this.carouselArray.forEach(el => {
            el.classList.remove('gallery-item-1', 'gallery-item-2', 'gallery-item-3', 'gallery-item-4', 'gallery-item-5');
        });

        this.carouselArray.slice(0, 5).forEach((el, i) => {
            el.classList.add(`gallery-item-${i + 1}`);
        });
    }

    setCurrentState(direction) {
        if (direction.classList.contains('gallery-controls-previous')) {
            this.carouselArray.unshift(this.carouselArray.pop());
        } else {
            this.carouselArray.push(this.carouselArray.shift());
        }
        this.updateGallery();
    }

    setControls() {
        const previousButton = document.createElement('button');
        previousButton.className = 'gallery-controls-previous';
        galleryControlsContainer.appendChild(previousButton);

        const nextButton = document.createElement('button');
        nextButton.className = 'gallery-controls-next';
        galleryControlsContainer.appendChild(nextButton);
    }

    useControls() {
        const triggers = [...galleryControlsContainer.childNodes];
        triggers.forEach(control => {
            control.addEventListener('click', e => {
                e.preventDefault();
                this.setCurrentState(control);
            });
        });
    }
}

const exampleCarousel = new Carousel(galleryContainer, galleryItems);

exampleCarousel.setControls();
exampleCarousel.useControls();
