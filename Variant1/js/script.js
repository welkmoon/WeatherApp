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
    document.querySelector('.weather-icon img').src = `https://openweathermap.org/img/wn/${data.icon}@4x.png`;
    document.querySelector('.weather-descr').innerHTML = data.descr;
    document.querySelector('.weather-temp').innerHTML = data.temp + '°' + '<span>C</span>';
    document.querySelector('.weather-city').innerHTML = data.city + '<span>' + data.country + '</span>';
    document.querySelector('#humidity').innerHTML = data.humidity + '%';
    document.querySelector('#wind').innerHTML = data.windSspeed + ' km/h';
    document.querySelector('#sunrise').innerHTML = data.sunrise.hour + ':' + data.sunrise.min;
    document.querySelector('#sunset').innerHTML = data.sunset.hour + ':' + data.sunset.min;
    document.querySelector('.weather-time').innerHTML = data.time.date + ' ' + data.time.month + ' ' + data.time.year;
    weatherInfoWrap.classList.remove('none');
    weatherInfoWrap.classList.add('acc');
}

function timeConverter(UNIX_timestamp) {
    const dateObj = new Date(UNIX_timestamp * 1000);
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
  
    return {
      date: dateObj.getDate(),
      month: months[dateObj.getMonth()],
      year: dateObj.getFullYear(),
      hour: dateObj.getHours(),
      min: dateObj.getMinutes() >= 10 ? dateObj.getMinutes() : '0' + dateObj.getMinutes(),
    };
  }

//   function getWindDirection(degree) {
//     const directions = [
//       'North', 'Northeast', 'East', 'Southeast', 'South', 'Southwest', 'West', 'Northwest'
//     ];
//     const index = Math.round(degree / 45) % 8;
//     return directions[index];
//   }
  
  