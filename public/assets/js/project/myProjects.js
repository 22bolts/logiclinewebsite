function isUserDeveloper(developerId) {
  const user = JSON.parse(localStorage.getItem('user'));
  return developerId && developerId === user.id;
}

async function GetProjectData() {
  const user = JSON.parse(localStorage.getItem('user'));
  const { id } = user;
  const apiEndpoint = `http://localhost:3001/api/projects/${id}`;
  const authToken = localStorage.getItem('authToken');

  try {
    const response = await fetch(apiEndpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    });

    const result = await response.json();

    if (response.ok) {
      console.log('Projects fetched:', result);
      return result;
    } else {
      throw new Error(result.message || 'Error fetching projects');
    }
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

function getStatusClass(status) {
  const statusClasses = {
    'In Progress': 'status-in-progress',
    'Complete': 'status-complete',
    'Canceled': 'status-canceled',
    'Paused': 'status-paused',
    'Pending': 'status-pending',
    'Live': 'status-live',
    'Testing': 'status-testing'
  };
  return statusClasses[status] || '';
}

function getStarRating(rating) {
  let stars = '';
  for (let i = 0; i < 5; i++) {
    stars += i < rating ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
  }
  return stars;
}

async function renderProjects() {
  const projectsContainer = document.querySelector('.projects');
  projectsContainer.innerHTML = ''; // Clear any existing content

  const projectsList = await GetProjectData();

  if (projectsList.length === 0) {
    projectsContainer.innerHTML = '<p>No projects found.</p>';
    return;
  }

  projectsList.forEach((project) => {
    const statusClass = getStatusClass(project.status);
    const isDeveloper = isUserDeveloper(project.developer ? project.developer.id : null);
    const userDetails = isDeveloper ? project.client : project.developer;
    const userName = userDetails ? `${userDetails.first_name} ${userDetails.last_name}` : 'N/A';
    const userAvatar = userDetails && userDetails.avatar ? userDetails.avatar : 'assets/images/avatar/avatar.png';
    const starRating = getStarRating(project.rating || 0);

    console.log(project.developer);

    const tagsSnipet = project.tags.length > 20 ? `${project.tags.substring(0, 20)}...` : project.tags;
    const projectNameSnipet = project.projectName.length > 15 ? `${project.projectName.substring(0, 20)}...` : project.projectName;

    const startDate = new Date(project.startDate);
    const endDate = new Date(project.endDate);

    const projectHTML = `
      <div class="project">
        <div class="project-header">
            <div class="tag">${tagsSnipet}</div>
            <div class="dropdown">
                <i class='fas fa-sort-down' style='font-size:18px;color:#fa2500'></i>
                <div class="dropdown-content">
                    <a href="account-projects-details.html?projectId=${project.id}"><span class="options-text">View Details</span></a>
                    <a href="#"><span class="options-text">Suspend</span></a>
                    <a href="#"><span class="options-text">Delete</span></a>
                    <a href="#"><span class="options-text">Duplicate</span></a>
                    <a href="#"><span class="options-text">Schedules</span></a>
                    <a href="#"><span class="options-text">Manage Team</span></a>
                    <a href="#"><span class="options-text">Archive</span></a>
                    <a href="#"><span class="options-text tc_secondary">Delete</span></a>
                </div>
            </div>
        </div>
        <h3>${projectNameSnipet}</h3>
        <hr class="divider">
        <div class="midbar">
            <div class="timeline">
                <div>
                    <li>since: ${startDate.toLocaleDateString()}</li>
                    <li>till: ${endDate.toLocaleDateString()}</li>
                </div>
            </div>
            <div class="progress-bar-container">
                <div>
                    <div class="progress-bar" data-progress="${project.progress}">
                        <svg viewBox="0 0 36 36">
                            <path class="circle-bg" d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831" />
                            <path class="circle" d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831" />
                        </svg>
                        <div class="progress-text">${project.progress || 0}%</div>
                    </div>
                </div>
                <h>progress</h>
            </div>
        </div>
        <hr class="divider">
        <div class="manager">
            <p><strong>${isDeveloper ? 'Client' : 'Developer'}:</strong> ${userName}</p>
            <div>
                <div class="project_avatar">
                    <img src="http://localhost:3001${userAvatar}" alt="${userName}" class="mb-3 avatar-img">
                </div>
                <div class="star-rating">${starRating}</div>
            </div>
        </div>
        <div class="status ${statusClass}">${project.status}</div>
      </div>
    `;
    projectsContainer.innerHTML += projectHTML;
  });

  // Dropdown functionality
  document.querySelectorAll('.dropdown').forEach(dropdown => {
    dropdown.addEventListener('click', () => {
      const content = dropdown.querySelector('.dropdown-content');
      content.style.display = content.style.display === 'block' ? 'none' : 'block';
    });
  });

  document.addEventListener('click', (event) => {
    document.querySelectorAll('.dropdown-content').forEach(content => {
      if (!content.parentNode.contains(event.target)) {
        content.style.display = 'none';
      }
    });
  });
}

// Wait for the DOM to fully load before rendering projects
document.addEventListener('DOMContentLoaded', async () => {
  await renderProjects();
});
