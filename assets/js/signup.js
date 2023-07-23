document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    fetch('/register', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'email': email,
            'password': password,
        }),
    })
    .then(response => {
        if(response.ok) {
            alert("Account successfully created! You can now log in.");
            return response.text();
        } else {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.indexOf('application/json') !== -1) {
                return response.json().then(json => {
                    throw new Error(json.message);
                });
            } else {
                return response.text().then(text => {
                    throw new Error(text);
                });
            }
        }
    })
    .then(data => console.log(data))
    .catch((error) => {
        if (error.message.includes("409")) {
            alert("Password must be at least 8 characters long.");
        } else {
            alert("Error: " + error.message);
        }
        console.error('Error:', error);
    });
});
