const fs = require("fs");

async function updateWeather() {
  const city = "Kathmandu";
  const apiKey = process.env.WEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  let weatherText = "";

  try {
    const response = await fetch(url); // native fetch
    const data = await response.json();

    if (data.cod !== 200) throw new Error(data.message);

    const weather = data.weather[0].description;
    const temp = data.main.temp;
    weatherText = `<!-- WEATHER-START -->\n >🌤️ Weather: ${weather}, ${temp}°C\n<!-- WEATHER-END -->`;
  } catch (err) {
    console.error("❌ Failed to fetch weather:", err.message);
    weatherText = `<!-- WEATHER-START -->\n> Current weather: Updating...\n<!-- WEATHER-END -->`;
  }

  // Read/write README (same as before)
  let readme = fs.readFileSync("README.md", "utf-8");
  if (
    readme.includes("<!-- WEATHER-START -->") &&
    readme.includes("<!-- WEATHER-END -->")
  ) {
    const start = readme.indexOf("<!-- WEATHER-START -->");
    const end =
      readme.indexOf("<!-- WEATHER-END -->") + "<!-- WEATHER-END -->".length;
    const oldWeatherBlock = readme.slice(start, end);
    if (oldWeatherBlock !== weatherText) {
      readme = readme.slice(0, start) + weatherText + readme.slice(end);
      fs.writeFileSync("README.md", readme, "utf-8");
      console.log("✅ README updated with weather!");
    } else {
      console.log("Weather unchanged. No update needed.");
    }
  } else {
    readme += `\n\n${weatherText}`;
    fs.writeFileSync("README.md", readme, "utf-8");
    console.log("✅ README updated with weather!");
  }
}

updateWeather();
