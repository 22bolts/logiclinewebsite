async function GetData() {
    const user = JSON.parse(localStorage.getItem('user'));
    const authToken = localStorage.getItem('authToken');

    const apiEndpoint = `http://localhost:3001/api/projects`;

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
        console.log("data:", data);
        return data;
    } catch (e) {
        console.error('Error fetching data:', e);
        return null;
    }
}

function createStars(rating) {
    let stars = '';
    for (let i = 0; i < 5; i++) {
        stars += `<i class="bi bi-star${i < rating ? '-fill' : ''}"></i>`;
    }
    return stars;
}

async function renderProjects() {
    const projectsContainer = document.querySelector(".projects-container");

    try {
        const projectList = await GetData();
        console.log("The Project list is:", projectList)
        projectsContainer.innerHTML = ''; // Clear previous contents

        projectList.forEach((data, index) => {
            const descriptionSnippet = data.description.length > 100 ? `${data.description.substring(0, 100)}...` : data.description;
            const avatar = data.client.avatar ? `http://localhost:3001${data.client.avatar}` : 'assets/images/avatar/avatar.png';
            const projectHTML = `
            <div class="card card-body bg-light d-md-flex justify-content-md-between align-items-md-center flex-md-row p-4 mb-3" data-index="${index}" data-project-id="${data.id}">
                <div class="mb-4 mb-md-0 project_breifing_holder">
                    <!-- Badge -->
                    <div class="badge text-bg-dark mb-3">${data.tags}</div>
                    <!-- Title -->
                    <h5 class="mb-0"><a href="career-single.html">${data.projectName}</a></h5>

                    <!-- Description -->
                    <p>${descriptionSnippet} <a href="#" class="read-more" data-index="${index}">Read more</a></p>

                    <!-- List -->
                    <div class="hstack gap-3 gap-sm-4 flex-wrap mt-3">
                        <span><i class="bi bi-geo-alt me-2"></i>USA, ontario</span>
                        <span><i class="bi bi-clock me-2"></i>San Francisco</span>
                        <span><i class="bi bi-briefcase me-2"></i>${data.projectType}: $${data.budget}</span>
                    </div>
                </div>
                <!-- Button -->
                <div class="client-display-holder">
                    <div>
                        <div class="client-info">
                            <img src="${avatar}" alt="Client profile picture" class="rounded-circle border border-2 border-white" width="50">
                        </div>
                        <div class="client-info">
                            <span>${`${data.client.first_name} ${data.client.last_name}` || 'Client Name'}</span>
                        </div>
                        <div class="client-info mb-2">
                            <div class="rating">${createStars(data.clientRating || 0)}</div>
                        </div>
                        <div class="client-info">
                            <a href="career-single.html?projectId=${data.id}" class="btn btn-primary mb-0 apply-btn" data-index="${index}">Apply now<i class="bi bi-arrow-right ms-2"></i></a>
                        </div>
                    </div>
                </div>
            </div>`;
            projectsContainer.innerHTML += projectHTML;
        });

        document.querySelectorAll('.read-more').forEach(button => {
            console.log("Idk something random I guess");
            
            button.addEventListener('click', event => {
                event.preventDefault();
                console.log("Read more clicked")
                const index = event.target.dataset.index;
                const project = projectList[index];
                displayFullDetails(project);
            });
        });

        // document.querySelectorAll('.apply-btn').forEach(button => {
        //     console.log("hekskdg k sgdkaj;d;kadag;dls");
        //     button.addEventListener('click', event => {
        //         event.preventDefault();
        //         const index = event.target.dataset.index;
        //         const project = projectList[index];
        //         applyToProject(project);
        //     });
        // });

    } catch (error) {
        console.error('Error rendering projects:', error);
    }
}

function displayFullDetails(project) {
    const modal = document.getElementById('projectModal');
    modal.querySelector('.modal-title').innerText = project.projectName;
    modal.querySelector('.modal-body').innerHTML = `
        <p>${project.description}</p>
        <div class="hstack gap-3 gap-sm-4 flex-wrap mt-3">
            <span><i class="bi bi-geo-alt me-2"></i>USA, ontario</span>
            <span><i class="bi bi-clock me-2"></i>San Francisco</span>
            <span><i class="bi bi-briefcase me-2"></i>${project.projectType}: $${project.budget}</span>
        </div>
        <div class="client-info mt-3">
            <img src="client-profile.jpg" alt="Client profile picture" class="rounded-circle" width="50">
            <span>${project.clientName || 'Client Name'}</span>
            <div class="rating">${createStars(project.clientRating || 0)}</div>
        </div>
    `;
    modal.querySelector('.apply-now').dataset.projectId = project.id;
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
}

function applyToProject(project) {
    // Handle project application logic here
    console.log(`Applying to project: ${project.projectName}`);
}

document.addEventListener('DOMContentLoaded', renderProjects);

// HTML for modal (add this to your HTML file)
/*
<div class="modal fade" id="projectModal" tabindex="-1" aria-labelledby="projectModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="projectModalLabel">Project Details</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <!-- Full project details will be inserted here -->
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary apply-now">Apply now</button>
      </div>
    </div>
  </div>
</div>
*/
