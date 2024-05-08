let data = {
  steps: { value: 0 },
  all_sleep_time: { value: 0 }
};

let activeSystem = 'muscular'; // Track the active system

function updateImage(system, sleepValue, stepsValue) {
  const imageElement = document.querySelector('.img-body');
  if (sleepValue > 420 || stepsValue > 7000) {
    switch (system) {
      case 'muscular':
        imageElement.src = 'Muscular_2.svg';
        break;
      case 'cardiovascular':
        imageElement.src = 'Сardiovascular_2.svg';
        break;
      case 'skeletal':
        imageElement.src = 'Skeletal_2.svg';
        break;
      case 'nervous':
        imageElement.src = 'Nervous_2.svg';
        break;
      default:
        imageElement.src = 'default.jpg';
        break;
    }
  } else {
    switch (system) {
      case 'muscular':
        imageElement.src = 'Muscular_1.svg';
        break;
      case 'cardiovascular':
        imageElement.src = 'Сardiovascular_1.svg';
        break;
      case 'skeletal':
        imageElement.src = 'Skeletal_1.svg';
        break;
      case 'nervous':
        imageElement.src = 'Nervous_1.svg';
        break;
      default:
        imageElement.src = 'default.jpg';
        break;
    }
  }
}

function updateActiveSystemImage() {
  console.log('sleepValue:', data.all_sleep_time.value);
  console.log('stepsValue:', data.steps.value);
  updateImage(activeSystem, data.all_sleep_time.value, data.steps.value);
}


function updateActiveSystemImage() {
  updateImage(activeSystem, data.all_sleep_time.value, data.steps.value);
}

function updateActiveSystemImage() {
  console.log('sleepValue:', data.all_sleep_time.value);
  console.log('stepsValue:', data.steps.value);
  updateImage(activeSystem, data.all_sleep_time.value, data.steps.value);
}


document.querySelectorAll('.rectangle').forEach(element => {
  element.addEventListener('click', function() {
    activeSystem = this.id;
    updateActiveSystemImage();
  });
});

// Check if the token is stored in Local Storage
const token = localStorage.getItem('token');

// Function to fetch and display data based on custom data URLs from the token
async function fetchAndDisplayCustomData(token) {
  try {
    // Decode the JWT token to access custom data
    const decodedToken = JSON.parse(atob(token.split('.')[1])); // Assuming token is in the format "header.payload.signature"

    // Access custom data URLs from the decoded token
    const stepsDataURL = decodedToken.dataUrls.steps;
    const sleepDataURL = decodedToken.dataUrls.sleep;

    // Fetch steps data
    const stepsResponse = await fetch(stepsDataURL);
    if (stepsResponse.ok) {
      const stepsData = await stepsResponse.json();
      data.steps.value = stepsData.value;
    } else {
      console.error('Error fetching steps data:', stepsResponse.status);
    }

    // Fetch sleep data
    const sleepResponse = await fetch(sleepDataURL);
    if (sleepResponse.ok) {
      const sleepData = await sleepResponse.json();
      data.all_sleep_time.value = sleepData.value;
    } else {
      console.error('Error fetching sleep data:', sleepResponse.status);
    }

    // Update UI with fetched data
    const activityDataElement = document.getElementById('activity-data');
    activityDataElement.innerHTML = `<p>Steps: ${data.steps.value}</p>`;

    const sleepDataElement = document.getElementById('sleep-data');
    sleepDataElement.innerHTML = `<p>All Sleep Time: ${data.all_sleep_time.value}</p>`;

    updateActiveSystemImage();
  } catch (error) {
    // Handle errors, e.g., token decoding or fetch errors
    console.error('Error fetching and displaying data:', error);
  }
}

// If a token is found in Local Storage, call the function to fetch and display data
if (token) {
  fetchAndDisplayCustomData(token);
}
