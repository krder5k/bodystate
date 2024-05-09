document.addEventListener('DOMContentLoaded', (event) => {
    // Проверка, загружены ли данные в localStorage, перед выполнением запросов
    if (localStorage.getItem('stepsUrl') && localStorage.getItem('sleepUrl')) {
        fetchAndDisplayData();
        fetchAndDisplaySleepData();
    } else {
        // Redirect to login page if URLs are not set in localStorage
        window.location.href = 'login.html'; // Замените на URL вашей страницы входа
    }
  });
  
  let glass = document.querySelector('.img-magnifier-glass');
  if (!glass) {
      glass = document.createElement("DIV");
      glass.setAttribute("class", "img-magnifier-glass");
      document.body.appendChild(glass);
  }
    
  
  let data = {
    steps: { value: 0 },
    all_sleep_time: { value: 0 }
  };
  
  let activeSystem = 'muscular'; // Track the active system
  
  function updateImage(system, sleepValue, stepsValue) {
    const imageElement = document.querySelector('.img-body');
    if (sleepValue > 420 && stepsValue > 7000) {
      switch (system) {
        case 'muscular':
          imageElement.src = 'Muscular_1.svg';
          break;
            case 'cardiovascular':
                imageElement.src = 'Cardiovascular_1.svg';
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
    } else if (sleepValue <= 420 && sleepValue > 360 && stepsValue <= 7000 && stepsValue > 4000) {
      switch (system) {
        case 'muscular':
          imageElement.src = 'Muscular_2.svg';
          break;
            case 'cardiovascular':
                imageElement.src = 'Cardiovascular_2.svg';
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
    }
      else if (stepsValue <= 4000 && sleepValue <= 360) {
      switch (system) {
        case 'muscular':
          imageElement.src = 'Muscular_3.svg';
          break;
          case 'cardiovascular':
              imageElement.src = 'Cardiovascular_3.svg';
              break;
          case 'skeletal':
                imageElement.src = 'Skeletal_3.svg';
                break;
            case 'nervous':
                imageElement.src = 'Nervous_3.svg';
                break;
            default:
                imageElement.src = 'default.jpg';
                break;
        }
    }
  }
  
  function updateActiveSystemImage() {
    updateImage(activeSystem, data.all_sleep_time.value, data.steps.value);
  }
  
  document.querySelectorAll('.rectangle').forEach(element => {
    element.addEventListener('click', function() {
        activeSystem = this.id;
        updateActiveSystemImage();
        applyMagnifyEffect();
    });
  });


  
  async function fetchAndDisplayData() {
    const stepsUrl = localStorage.getItem('stepsUrl');
    console.log('Steps URL retrieved from localStorage:', stepsUrl);
    if (!stepsUrl) {
        console.error('Steps URL is not defined.');
        return; // Прекратить выполнение функции, если URL не определён
    }
    const headers = {
        'fiware-service': localStorage.getItem('fiwareService'),
        'fiware-servicepath': localStorage.getItem('fiwareServicePath')
    };
  
    try {
        const response = await fetch(stepsUrl, { headers: headers });
        if (response.ok) {
            const fetchedData = await response.json();
            data.steps.value = fetchedData.steps.value;
            const activityDataElement = document.getElementById('activity-data');
            activityDataElement.innerHTML = `<p>Steps: ${data.steps.value}</p>`;
            updateActiveSystemImage();
        } else {
            console.error('Failed to load steps data:', response.status);
            const activityDataElement = document.getElementById('activity-data');
            activityDataElement.innerHTML = '<p>Error loading data.</p>';
        }
    } catch (error) {
        console.error('Error fetching steps data:', error);
        const activityDataElement = document.getElementById('activity-data');
        activityDataElement.innerHTML = '<p>Error loading data.</p>';
    }
  }
  
  async function fetchAndDisplaySleepData() {
    const sleepUrl = localStorage.getItem('sleepUrl');
    console.log('Sleep URL retrieved from localStorage:', sleepUrl);
    if (!sleepUrl) {
        console.error('Sleep URL is not defined.');
        return; // Прекратить выполнение функции, если URL не определён
    }
    const headers = {
        'fiware-service': localStorage.getItem('fiwareService'),
        'fiware-servicepath': localStorage.getItem('fiwareServicePath')
    };
  
    try {
        const response = await fetch(sleepUrl, { headers: headers });
        if (response.ok) {
            const fetchedData = await response.json();
            data.all_sleep_time.value = fetchedData.all_sleep_time.value;
            const sleepDataElement = document.getElementById('sleep-data');
            sleepDataElement.innerHTML = `<p>All Sleep Time: ${data.all_sleep_time.value}</p>`;
            updateActiveSystemImage();
        } else {
            console.error('Failed to load sleep data:', response.status);
            const sleepDataElement = document.getElementById('sleep-data');
            sleepDataElement.innerHTML = '<p>Error loading data.</p>';
        }
    } catch (error) {
        console.error('Error fetching sleep data:', error);
        const sleepDataElement = document.getElementById('sleep-data');
        sleepDataElement.innerHTML = '<p>Error loading data.</p>';
    }
  }
  
  document.querySelectorAll('.img-body').forEach((img) => {
    img.addEventListener('mousemove', function(e) {
        const magnifierGlass = document.querySelector('.img-magnifier-glass');
        if (!magnifierGlass) return;

        // Получаем размеры и позицию изображения
        const imgRect = img.getBoundingClientRect();

        // Вычисляем положение курсора в процентах относительно изображения
        const xPercent = ((e.clientX - imgRect.left) / imgRect.width) * 100;
        const yPercent = ((e.clientY - imgRect.top) / imgRect.height) * 100;

        // Обновляем позицию фона в лупе, чтобы отразить текущее положение курсора
        magnifierGlass.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
    });

    img.addEventListener('mouseenter', function() {
        // Показываем лупу и настраиваем изображение
        showMagnifier(img);
    });

    img.addEventListener('mouseleave', hideMagnifier);
});

function showMagnifier(img) {
    const magnifierContainer = document.querySelector('.magnifier-container');
    magnifierContainer.style.display = 'block';
    const magnifierGlass = document.querySelector('.img-magnifier-glass');
    magnifierGlass.style.backgroundImage = `url('${img.src}')`;
    magnifierGlass.style.backgroundSize = "700%"; // Пример увеличения
}

function hideMagnifier() {
    const magnifierContainer = document.querySelector('.magnifier-container');
    magnifierContainer.style.display = 'none';
}



  function magnify(imgID, zoom) {
      var img, glass, w, h, bw;
      img = document.getElementById(imgID);
      glass = document.createElement("DIV");
      glass.setAttribute("class", "img-magnifier-glass");
      document.body.appendChild(glass);
    
      glass.style.backgroundImage = `url('${img.src}')`;
      glass.style.backgroundRepeat = "no-repeat";
      glass.style.backgroundSize = (img.width * zoom) + "px " + (img.height * zoom) + "px";
      bw = 3;
      w = glass.offsetWidth / 2;
      h = glass.offsetHeight / 2;
    
      glass.addEventListener("mousemove", moveMagnifier);
      img.addEventListener("mousemove", moveMagnifier);
      
      function moveMagnifier(e) {
        var pos, x, y;
        e.preventDefault();
        pos = getCursorPos(e);
        x = pos.x;
        y = pos.y;
    
        if (x > img.width - (w / zoom)) {x = img.width - (w / zoom);}
        if (x < w / zoom) {x = w / zoom;}
        if (y > img.height - (h / zoom)) {y = img.height - (h / zoom);}
        if (y < h / zoom) {y = h / zoom;}
    
        glass.style.left = (x - w) + "px";
        glass.style.top = (y - h) + "px";
        glass.style.backgroundPosition = "-" + ((x * zoom) - w + bw) + "px -" + ((y * zoom) - h + bw) + "px";
      }
    
      function getCursorPos(e) {
        var a, x = 0, y = 0;
        e = e || window.event;
        a = img.getBoundingClientRect();
        x = e.pageX - a.left;
        y = e.pageY - a.top;
        x = x - window.pageXOffset;
        y = y - window.pageYOffset;
        return {x : x, y : y};
      }
    }
    
  
  function logout() {
      localStorage.clear(); // Очищает все данные из localStorage
      window.location.href = 'login.html'; // Перенаправление на страницу входа
  }



// async function fetchAndDisplayData() {
//   const response = await fetch('https://evita-dashboard.evita.digital-enabler.eng.it/v2/entities/6578612cd7539329b6a8a285', {
//     headers: {
//       'fiware-service': 'a5d8564c_391f_4958_a597_5fae30de6309',
//       'fiware-servicepath': '/a5d8564c_391f_4958_a597_5fae30de6309'
//     }
//   });

//   if (response.ok) {
//     const fetchedData = await response.json();
//     data.steps.value = fetchedData.steps.value;

//     const activityDataElement = document.getElementById('activity-data');
//     activityDataElement.innerHTML = `<p>Steps: ${data.steps.value}</p>`;

//     updateActiveSystemImage();
//   } else {
//     const activityDataElement = document.getElementById('activity-data');
//     activityDataElement.innerHTML = '<p>Error loading data.</p>';
//   }
// }

// async function fetchAndDisplaySleepData() {
//   const response = await fetch('https://evita-dashboard.evita.digital-enabler.eng.it/v2/entities/6578627bd7539329b6a8a2e5', {
//     headers: {
//       'fiware-service': 'a5d8564c_391f_4958_a597_5fae30de6309',
//       'fiware-servicepath': '/a5d8564c_391f_4958_a597_5fae30de6309'
//     }
//   });

//   if (response.ok) {
//     const fetchedData = await response.json();
//     data.all_sleep_time.value = fetchedData.all_sleep_time.value;

//     const sleepDataElement = document.getElementById('sleep-data');
//     sleepDataElement.innerHTML = `<p>All Sleep Time: ${data.all_sleep_time.value}</p>`;

//     updateActiveSystemImage();
//   } else {
//     const sleepDataElement = document.getElementById('sleep-data');
//     sleepDataElement.innerHTML = '<p>Error loading data.</p>';
//   }
// }

// fetchAndDisplayData();
// fetchAndDisplaySleepData();
