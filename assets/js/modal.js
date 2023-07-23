document.addEventListener('DOMContentLoaded', function() {

    // Button to open the modal
    const openModalButton = document.getElementById('openModalButton');
    const openCreateModalButton = document.getElementById('openCreateModalButton');
    const createCollectionButton = document.getElementById('createCollectionButton');
    const createTaskButton = document.getElementById('createTaskButton');
    const editTaskButtons = document.querySelectorAll('.edit-task');
    
    // Switch label inside the login form
    const switchToSignupFromLogin = document.querySelector('#loginForm .switch');
    
    // Switch label inside the signup form
    const switchToLoginFromSignup = document.querySelector('#signupForm .switch');
    
    // Function to handle tab change
    function changeTab(tab) {
      if (tab === 'login') {
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('signupForm').style.display = 'none';
      } else if (tab === 'signup') {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('signupForm').style.display = 'block';
      }
    }
  
    // Open the login modal
    if (openModalButton) {
      openModalButton.addEventListener('click', function() {
        document.getElementById('loginModal').style.display = 'flex';
        document.getElementById('overlay').style.display = 'block';
        toggleDisplay('none');
        changeTab('login'); 
      });
    }


    // Open the create modal
    openCreateModalButton.addEventListener('click', function() {
      document.getElementById('createModal').style.display = 'flex';
      document.getElementById('overlay').style.display = 'block';
      toggleDisplay('none');
    });

    // Open the create collection modal and close the create modal
    createCollectionButton.addEventListener('click', function() {
      document.getElementById('createModal').style.display = 'none';
      document.getElementById('createCollectionModal').style.display = 'flex';
      
    });

    // Open the create task modal and close the create modal
    createTaskButton.addEventListener('click', function() {
      document.getElementById('createModal').style.display = 'none';
      document.getElementById('createTaskModal').style.display = 'flex';
    });

  
    // Switch to signup form from login form
    switchToSignupFromLogin.addEventListener('click', function() {
      changeTab('signup');
    });
  
    // Switch to login form from signup form
    switchToLoginFromSignup.addEventListener('click', function() {
      changeTab('login');
    });

    // Open the edit task modal
    editTaskButtons.forEach(button => {
      button.addEventListener('click', function(event) {
          event.preventDefault();
          const taskId = this.getAttribute("data-task-id");
          openEditTaskModal(taskId);
      });
    });

    function openEditTaskModal(taskId) {
      document.getElementById('editTask').disabled = true;
      document.getElementById('editTaskId').value = taskId;
  
      fetch(`/get_task/${taskId}`)
      .then(response => response.json())
      .then(data => {
          document.getElementById('editTaskName').value = data.name;
          document.getElementById('editTaskDescription').value = data.description;
          
          if (data.goalDate !== null) {
            let goalDateTimestamp = data.goalDate.timestamp;
            let goalDate = new Date(goalDateTimestamp * 1000)
            document.getElementById('editGoalDate').value = goalDate.toISOString().split('T')[0];
            document.getElementById('editGoalTime').value = goalDate.toTimeString().split(' ')[0].slice(0,5);
          }
          
          
          document.getElementById('editLocation').value = data.location;
  
          document.getElementById('editTaskModal').style.display = 'flex';
          document.getElementById('overlay').style.display = 'block';
          toggleDisplay('none');
      })
      .catch((error) => {
          console.error('Error:', error);
      });
    }
  
    
    // If the user clicks outside the modal, close it
    window.addEventListener('click', function(event) {
      if (event.target == document.getElementById('loginModal')) {
        document.getElementById('loginModal').style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
        toggleDisplay('block');
      }
      if (event.target == document.getElementById('createModal')) {
        document.getElementById('createModal').style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
        toggleDisplay('block');
      }
      if (event.target == document.getElementById('createCollectionModal')) {
        document.getElementById('createCollectionModal').style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
        toggleDisplay('block');
      }
      if (event.target == document.getElementById('createTaskModal')) {
        document.getElementById('createTaskModal').style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
        toggleDisplay('block');
      }
      if (event.target == document.getElementById('editTaskModal')) {
        document.getElementById('editTaskModal').style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
        toggleDisplay('block');
      }
    });

    // Close the modal when the user presses the ESC key
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape') {
        document.getElementById('loginModal').style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
        document.getElementById('createModal').style.display = 'none';
        document.getElementById('createCollectionModal').style.display = 'none';
        document.getElementById('createTaskModal').style.display = 'none';
        document.getElementById('editTaskModal').style.display = 'none';
        toggleDisplay('block');
      }
    });

    // Enable the save button when the user types in the input fields
    document.getElementById('editTaskName').addEventListener('input', enableSaveButton);
    document.getElementById('editTaskDescription').addEventListener('input', enableSaveButton);
    document.getElementById('editGoalDate').addEventListener('input', enableSaveButton);
    document.getElementById('editGoalTime').addEventListener('input', enableSaveButton);
    document.getElementById('editLocation').addEventListener('input', enableSaveButton);

    function enableSaveButton() {
      let editTaskButton = document.getElementById('editTask');
      editTaskButton.disabled = false;
      editTaskButton.classList.remove('button-disabled');
      editTaskButton.classList.add('button-enabled');
    }

});

function toggleDisplay(state) {
  var checkboxes = document.getElementsByClassName('checkbox-wrapper');
  var dropdownMenus = document.getElementsByClassName('dropdownMenu');

  for (var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].style.display = state;
  }

  for (var i = 0; i < dropdownMenus.length; i++) {
    dropdownMenus[i].style.display = state;
  }
}

  
export function openEditTaskModal(taskId) {
  document.getElementById('editTask').disabled = true;
  document.getElementById('editTaskId').value = taskId;

  fetch(`/get_task/${taskId}`)
  .then(response => response.json())
  .then(data => {
      document.getElementById('editTaskName').value = data.name;
      document.getElementById('editTaskDescription').value = data.description;
      
      if (data.goalDate !== null) {
        let goalDateTimestamp = data.goalDate.timestamp;
        let goalDate = new Date(goalDateTimestamp * 1000)
        document.getElementById('editGoalDate').value = goalDate.toISOString().split('T')[0];
        document.getElementById('editGoalTime').value = goalDate.toTimeString().split(' ')[0].slice(0,5);
      }
      
      
      document.getElementById('editLocation').value = data.location;

      document.getElementById('editTaskModal').style.display = 'flex';
      document.getElementById('overlay').style.display = 'block';
      toggleDisplay('none');
  })
  .catch((error) => {
      console.error('Error:', error);
  });
}
