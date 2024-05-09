function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Send a request to your server
    fetch('https://bodystate.azurewebsites.net/login', { // Use the correct route for the login endpoint
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        username: document.getElementById('username').value,
        password: document.getElementById('password').value
    })
    .then(response => response.json())
    .then(data => {
        console.log(data); // Эта строка добавлена для отладки
        if(data.success) {
            localStorage.setItem('stepsUrl', data.stepsUrl);
            console.log('Setting localStorage items...');
            console.log('Saved stepsUrl:', data.stepsUrl);
            localStorage.setItem('sleepUrl', data.sleepUrl);
            console.log('Saved sleepUrl:', data.sleepUrl);
            localStorage.setItem('fiwareService', data.fiwareService);
            localStorage.setItem('fiwareServicePath', data.fiwareServicePath);
            window.location.href = '/index.html';
        } else {
            // Handle login failure
            alert('Login failed!');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
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
