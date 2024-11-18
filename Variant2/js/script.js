import mustache from "mustache";

const apiKey = '6da49ccf77186e47ae9fa30b49cef84b';
const showWeatherBtn = document.querySelector('#weather-btn');
const input = document.querySelector('#city-name');
const weatherInfoWrap = document.querySelector('.weather-info-wrap');
const showError = document.querySelector('.error');

showWeatherBtn.addEventListener('click', e => {
    e.preventDefault();
    const city = input.value.trim();
    input.value = '';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=en`; //Формуємо URL для запиту до OpenWeatherMap API

    let promise = fetch(apiUrl); //Відправка запиту (fetch(apiUrl) - це вбудована функція JavaScript, яка надсилає HTTP-запит до вказаного URL і повертає Promise)

    promise  //Обробка відповіді від API
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(   //throw зупиняє подальше виконання коду в межах поточного блоку, new Error(...) створює новий об'єкт помилки типу Error, який містить повідомлення про помилку.
                    `City not found or server problem.  Error code: ${response.status}`
                );
            }
        })
        .then(data => {
            const weatherInfo = {
                icon: data.weather[0].icon,
                city: data.name,
                temp: Math.round(data.main.temp),
                descr: data.weather[0].description,
                humidity: data.main.humidity,
                windSspeed: data.wind.speed,
                sunrise: timeConverter(data.sys.sunrise),
                sunset: timeConverter(data.sys.sunset),
                time: timeConverter(data.dt),
                country: data.sys.country,
            };
            showError.classList.add('none');
            renderWeather(weatherInfo);
            weatherInfoWrap.classList.remove('none');
            weatherInfoWrap.classList.add('acc');
        })
        .catch(error => {
            showError.innerHTML = error.message;   //об’єкт помилки передається як error.
            showError.classList.remove('none');
            console.log(error.message);
        });
});

function renderWeather(data) {
    // Отримуємо шаблон з HTML
    const template = document.querySelector('#weather-template').innerHTML;
  
    // Генеруємо HTML на основі шаблону та даних
    const rendered = mustache.render(template, data);
  
    // Додаємо згенерований контент у контейнер
    const weatherInfoWrap = document.querySelector('.weather-info-wrap');
    weatherInfoWrap.innerHTML = rendered;
  
    // Показуємо елемент (видаляємо клас 'none')
    weatherInfoWrap.classList.remove('none');
    weatherInfoWrap.classList.add('acc');
  }

function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes() >= 10 ? a.getMinutes() : '0' + a.getMinutes();
    let time = {
      date: date,
      month: month,
      year: year,
      hour: hour,
      min: min,
    };
    return time;
  }

  function getWindDirection(degree) {
    const directions = [
      'North', 'Northeast', 'East', 'Southeast', 'South', 'Southwest', 'West', 'Northwest'
    ];
    const index = Math.round(degree / 45) % 8;
    return directions[index];
  }
  
  