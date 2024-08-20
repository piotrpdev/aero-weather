import { useEffect, useState } from "react";
import { type Forecast, type Geolocation, wmo_descriptions } from "./weather";

function App() {
	const [coords, setCoords] = useState<GeolocationCoordinates>();
	const [geolocation, setGeolocation] = useState<Geolocation>();
	const [forecast, setForecast] = useState<Forecast>();

	// biome-ignore lint/correctness/useExhaustiveDependencies: object dep
	useEffect(() => {
		navigator.geolocation.getCurrentPosition((position) => {
			setCoords(position.coords);
		});

		if (coords !== undefined) {
			console.log("Coordinate data is:", coords);

			const geolocationApiUrl = new URL(
				"https://nominatim.openstreetmap.org/reverse",
			);
			geolocationApiUrl.searchParams.set("format", "json");
			geolocationApiUrl.searchParams.set(
				"lat",
				coords.latitude.toString(),
			);
			geolocationApiUrl.searchParams.set(
				"lon",
				coords.longitude.toString(),
			);

			fetch(geolocationApiUrl.toString())
				.then((res) => res.json())
				.then((data) => {
					console.log("Geolocation data is:", data);
					setGeolocation(data);
				});

			const forecastApiUrl = new URL(
				"https://api.open-meteo.com/v1/forecast",
			);
			forecastApiUrl.searchParams.set(
				"latitude",
				coords.latitude.toString(),
			);
			forecastApiUrl.searchParams.set(
				"longitude",
				coords.longitude.toString(),
			);
			forecastApiUrl.searchParams.set(
				"current",
				"temperature_2m,is_day,weather_code",
			);
			forecastApiUrl.searchParams.set(
				"hourly",
				"temperature_2m,weather_code",
			);

			fetch(forecastApiUrl.toString())
				.then((res) => res.json())
				.then((data) => {
					console.log("Forecast data is:", data);
					setForecast(data);
				});
		}
	}, [coords?.longitude]);

	return (
		<div className="container">
			<header>
				<h5 id="my-location">My Location</h5>
				<div id="city-state-temperature">
					<div id="city-state">
						<h1 id="city">
							{geolocation?.address.city || "Redmond"}
						</h1>
						<h3 id="state">
							{geolocation?.address.country || "USA"}
						</h3>
					</div>
					<h1 id="temperature">
						{(forecast &&
							forecast?.current.temperature_2m +
								forecast?.current_units.temperature_2m) ||
							"61&deg;"}
					</h1>
				</div>
				<h5 id="type">
					{(forecast &&
						wmo_descriptions[forecast.current.weather_code][
							forecast.current.is_day !== 0 ? "day" : "night"
						].description) ||
						"Thunderstorm"}
				</h5>
			</header>
		</div>
	);
}

export default App;
