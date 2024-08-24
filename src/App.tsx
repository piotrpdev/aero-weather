import { useEffect, useState } from "react";
import defaultWeatherIcon from "./assets/realll/default.png";
import {
	type ForecastData,
	type GeolocationData,
	wmo_descriptions,
} from "./weather";

function App() {
	const [coords, setCoords] = useState<GeolocationCoordinates>();
	const [geolocation, setGeolocation] = useState<GeolocationData>();
	const [forecast, setForecast] = useState<ForecastData>();

	const formatTemperature = (temperature: number): string => {
		if (!geolocation) return temperature.toString();

		// https://en.wikipedia.org/wiki/Fahrenheit
		// https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes
		if (
			["us", "bs", "ky", "pw", "fm", "mh", "lr"].includes(
				geolocation.address.country_code,
			)
		) {
			// IEEE 754 has come to haunt us
			const fahrenheit = temperature * 1.8 + 32;
			return `${Math.round(fahrenheit)}°F`;
		}

		return `${Math.round(temperature)}°C`;
	};

	const intlFormatter = new Intl.DateTimeFormat("en-US", {
		hour12: true,
		hour: "numeric",
	});
	// https://stackoverflow.com/a/32252922/19020549
	const formatDateTime = (datetime: string): string =>
		// biome-ignore lint/style/useTemplate: readability
		intlFormatter.format(new Date(datetime + "Z"));

	useEffect(() => {
		// No fancy window blur possible on Linux
		if (navigator.userAgent.includes("Linux")) {
			console.log("User agent includes 'Linux', changing styles...");
			document.querySelector("#root")?.classList.add("linux");
		}

		if (!("__TAURI_INTERNALS__" in window)) {
			console.log("Not running in Tauri, changing styles...");
			document.querySelector("#root")?.classList.add("web");
		}
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: object dep
	useEffect(() => {
		// TODO: Maybe use Tauri geolocation API for better accuracy
		navigator.geolocation.getCurrentPosition((position) => {
			setCoords(position.coords);
		});

		if (coords !== undefined) {
			console.log("Coordinate data is:", coords);

			// TODO: Handle errors

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
				"temperature_2m,weather_code,is_day",
			);
			forecastApiUrl.searchParams.set("temperature_unit", "celsius");
			forecastApiUrl.searchParams.set("timezone", "UTC");

			fetch(forecastApiUrl.toString())
				.then((res) => res.json())
				.then((data) => {
					console.log("Forecast data is:", data);
					setForecast(data);
				});
		}
	}, [coords?.longitude]);

	// TODO: Add OSM and Open-Meteo attribution
	// TODO: Maybe user SWR/React Query for data fetching
	// TODO: Add error handling (maybe use ErrorBoundary)
	// TODO: Add loading states
	// TODO: Extract components
	return (
		<div id="container">
			<div id="inner-container">
				<header>
					<h5 id="my-location">My Location</h5>
					<div id="city-state-temperature">
						<div id="city-state">
							<h1 id="city">
								{geolocation?.address.city ||
									geolocation?.address.county ||
									"Unknown City/County"}
							</h1>
							<h3 id="state">
								{geolocation?.address.country ||
									"Unknown Country"}
							</h3>
						</div>
						{/* TODO: Maybe let user click on this to change temperature units */}
						<h1 id="temperature">
							{(forecast &&
								formatTemperature(
									forecast.current.temperature_2m,
								)) ||
								"Unknown Temperature"}
						</h1>
					</div>
					<h5 id="type">
						{(forecast &&
							wmo_descriptions[forecast.current.weather_code]?.[
								forecast.current.is_day !== 0 ? "day" : "night"
							]?.description) ||
							"Unknown Weather"}
					</h5>
				</header>
				<main>
					<div id="blend">
						<section id="hourly-forecast-container">
							<h3 id="hourly-forecast-heading">
								{/* TODO: Actually implement prediction here, handle 'Clear will continue...' */}
								{(forecast &&
									`${
										wmo_descriptions[
											forecast.current.weather_code
										]?.[
											forecast.current.is_day !== 0
												? "day"
												: "night"
										]?.description || "Unknown Weather"
									} will continue in the next hour.`) ||
									"Unknown Weather"}
							</h3>
							<div id="hourly-forecast-list">
								{forecast?.hourly.time.map((time, index) => (
									<div
										key={time}
										className="hourly-forecast-item"
									>
										<div>{formatDateTime(time)}</div>
										{/* TODO: Either use realistic weather icon set or handle caching (or both) */}
										<img
											className="hourly-forecast-item-image"
											src={
												wmo_descriptions[
													forecast.hourly
														.weather_code[index]
												]?.[
													forecast.hourly.is_day[
														index
													] !== 0
														? "day"
														: "night"
												]?.image || defaultWeatherIcon
											}
											alt={
												wmo_descriptions[
													forecast.hourly
														.weather_code[index]
												]?.[
													forecast.hourly.is_day[
														index
													] !== 0
														? "day"
														: "night"
												]?.description ||
												"Unknown Weather"
											}
										/>
										<div>
											{formatTemperature(
												forecast.hourly.temperature_2m[
													index
												],
											)}
										</div>
									</div>
								))}
							</div>
						</section>
					</div>
				</main>
			</div>
		</div>
	);
}

export default App;
