import { isLoggedIn } from './modal.js';

let userIsLoggedIn = false;
isLoggedIn().then(isLoggedIn => {
    userIsLoggedIn = isLoggedIn;
});

if (userIsLoggedIn) {
    document.getElementById('dashboard-button').addEventListener('mouseover', function() {
        document.getElementById('dropdown-menu').classList.remove('hidden');
    });
    document.getElementById('dashboard-button').addEventListener('mouseout', function() {
        document.getElementById('dropdown-menu').classList.add('hidden');
    });
    // Make sure the dropdown stays visible when hovering over it
    document.getElementById('dropdown-menu').addEventListener('mouseover', function() {
        document.getElementById('dropdown-menu').classList.remove('hidden');
    });
    document.getElementById('dropdown-menu').addEventListener('mouseout', function() {
        document.getElementById('dropdown-menu').classList.add('hidden');
    });
}