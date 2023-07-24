document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/login', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            '_username': email,
            '_password': password,
        }),
    })
    .then(response => {
        if (response.status === 200) {
            console.log('User logged in successfully');
            sessionStorage.setItem('user', JSON.stringify(response));
            document.getElementById('overlay').style.display = 'none';
            document.getElementById('loginModal').style.display = 'none';
            location.reload();
        } else if (response.status === 401) {
            console.log('Login failed');
        }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
});
