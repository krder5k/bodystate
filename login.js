function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if(data.success) {
            localStorage.setItem('stepsUrl', data.stepsUrl);
            localStorage.setItem('sleepUrl', data.sleepUrl);
            localStorage.setItem('fiwareService', data.fiwareService);
            localStorage.setItem('fiwareServicePath', data.fiwareServicePath);
            window.location.href = 'https://bodystate.azurewebsites.net';
        } else {
            alert('Login failed: ' + data.message);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Login failed. Please check the console for more information.');
    });
}


// function login() {
//     const username = document.getElementById('username').value;
//     const password = document.getElementById('password').value;

//     // Send a request to your server
//     fetch('http://localhost:8080/login', { // Use the correct route for the login endpoint
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ username, password }),
//     })
//     .then(response => response.json())
//     .then(data => {
//         if(data.success) {
//             // Handle successful login
//             window.location.href = 'http://localhost:8080'; // Redirect to the root of your Node.js server
//         } else {
//             // Handle login failure
//             alert('Login failed!');
//         }
//     })
//     .catch((error) => {
//         console.error('Error:', error);
//     });
// }
