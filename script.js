document.addEventListener("DOMContentLoaded", () => {
  const apiKey = "2a23a29c599f6d2b84b6671eae38d34e";
  const apiURL =
    "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

  const search = document.querySelector(".search input");
  const searchBtn = document.querySelector(".search button");
  const weatherIcon = document.querySelector(".weather-icon");
  const voiceBtn = document.querySelector(".voice-btn"); // Add a button to trigger voice input

  // Function for typing effect in the input placeholder
  function autoTypeText(inputElement, text) {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < text.length) {
        inputElement.placeholder += text.charAt(index);
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100); // Typing speed (100ms)
  }

  window.onload = () => {
    const cityToSearch = "Enter the city name";
    autoTypeText(search, cityToSearch);
  };

  // Function to start the voice recognition process
  function startVoiceRecognition() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser doesn't support voice recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US"; // Set language to English
    recognition.interimResults = false; // We want final results only
    recognition.maxAlternatives = 1; // Limit to 1 alternative

    // When the speech is recognized, update the input field with the recognized text
    recognition.onresult = (event) => {
      let city = event.results[0][0].transcript;
      city = city.replace(/\.$/, "");
      search.value = city;
      console.log(city); // Set input field value to the recognized city name
      checkWeather(city); // Check weather for the recognized city
    };

    // Start listening for voice input
    recognition.start();
  }

  // Function to check the weather based on city
  async function checkWeather(city) {
    const response = await fetch(apiURL + city + `&appid=${apiKey}`);

    if (response.status == 404) {
      document.querySelector(".error").style.display = "block";
      document.querySelector(".weather").style.display = "none";
    } else {
      var data = await response.json();
      console.log(data);

      document.querySelector(".city").innerHTML = data.name;
      document.querySelector(".temp").innerHTML =
        Math.round(data.main.temp) + "°C";
      document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
      document.querySelector(".wind").innerHTML = data.wind.speed + " km/hr";

      if (data.weather[0].main == "Clouds") {
        weatherIcon.src = "images/clouds.png";
      } else if (data.weather[0].main == "Clear") {
        weatherIcon.src = "images/clear.png";
      } else if (data.weather[0].main == "Rain") {
        weatherIcon.src = "images/rain.png";
      } else if (data.weather[0].main == "Drizzle") {
        weatherIcon.src = "images/drizzle.png";
      } else if (data.weather[0].main == "Mist") {
        weatherIcon.src = "images/mist.png";
      }

      document.querySelector(".weather").style.display = "block";
      document.querySelector(".error").style.display = "none";
    }
  }

  // Trigger weather check when search button is clicked
  searchBtn.addEventListener("click", () => {
    checkWeather(search.value);
  });

  // Trigger weather check when Enter key is pressed
  search.addEventListener("keydown", function (e) {
    if (e.key == "Enter") {
      checkWeather(search.value);
    }
  });

  // Add event listener for the voice button to trigger voice recognition
  voiceBtn.addEventListener("click", startVoiceRecognition);
});
