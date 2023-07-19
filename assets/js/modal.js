document.addEventListener('DOMContentLoaded', function() {
  console.log('modal.js loaded');

    // Button to open the modal
    const openModalButton = document.getElementById('openModalButton');
    const openCreateModalButton = document.getElementById('openCreateModalButton');
    
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
        changeTab('login'); 
      });
    }


    // Open the create modal
    openCreateModalButton.addEventListener('click', function() {
      console.log('create modal button clicked');
      document.getElementById('createModal').style.display = 'flex';
      document.getElementById('overlay').style.display = 'block';
    });

    // Open the create collection modal and close the create modal
    createCollectionButton.addEventListener('click', function() {
      document.getElementById('createModal').style.display = 'none';
      document.getElementById('createCollectionModal').style.display = 'flex';
    });
  
    // Switch to signup form from login form
    switchToSignupFromLogin.addEventListener('click', function() {
      changeTab('signup');
    });
  
    // Switch to login form from signup form
    switchToLoginFromSignup.addEventListener('click', function() {
      changeTab('login');
    });

    // If the user clicks outside the modal, close it
    window.addEventListener('click', function(event) {
      if (event.target == document.getElementById('loginModal')) {
        document.getElementById('loginModal').style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
      }
      if (event.target == document.getElementById('createModal')) {
        document.getElementById('createModal').style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
      }
      if (event.target == document.getElementById('createCollectionModal')) {
        document.getElementById('createCollectionModal').style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
      }
    });

    // Close the modal when the user presses the ESC key
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape') {
        document.getElementById('loginModal').style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
        document.getElementById('createModal').style.display = 'none';
        document.getElementById('createCollectionModal').style.display = 'none';
      }
    });
});
  