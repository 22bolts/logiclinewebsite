document.addEventListener("DOMContentLoaded", () => {
    const tabButtons = document.querySelectorAll(".tab-button");
    const tabPanes = document.querySelectorAll(".tab-pane");
  
    tabButtons.forEach(button => {
      button.addEventListener("click", () => {
        // Remove active class from all buttons and panes
        tabButtons.forEach(btn => btn.classList.remove("active"));
        tabPanes.forEach(pane => pane.classList.remove("active"));
  
        // Add active class to the clicked button and the corresponding pane
        button.classList.add("active");
        document.getElementById(button.dataset.tab).classList.add("active");
      });
    });
  });