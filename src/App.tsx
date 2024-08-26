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

	// https://gist.github.com/thesofakillers/bcf39eaed428304ddc126ca8f12336f7
	function convertObjectArraysToArrayOfObjects<T>(
		objectArrays: Record<string, Array<T>>,
	): Array<Record<string, T>> {
		return objectArrays[Object.keys(objectArrays)[0]].map((_, i) => {
			const internalObject: Record<string, T> = {};
			for (const key of Object.keys(objectArrays)) {
				internalObject[key] = objectArrays[key][i];
			}
			return internalObject;
		});
	}

	// I hate complicated TypeScript types :(
	type AdjustedHourlyForecast = Array<{
		[K in keyof ForecastData["hourly"]]: ForecastData["hourly"][K][number];
	}>;
	function timeAdjustHourlyForecast(
		hourlyForecast: ForecastData["hourly"],
	): AdjustedHourlyForecast {
		const indexOfNextTime = hourlyForecast.time.findIndex(
			// biome-ignore lint/style/useTemplate: readability
			(time) => new Date(time + "Z") > new Date(),
		);
		return convertObjectArraysToArrayOfObjects<string | number>(
			hourlyForecast,
		).slice(indexOfNextTime) as AdjustedHourlyForecast;
	}

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
	// TODO: Add hover tooltips for hourly weather time, temperature, and icon
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
								{/* TODO: Actually implement prediction here */}
								{(forecast &&
									`${
										wmo_descriptions[
											forecast.current.weather_code
										]?.[
											forecast.current.is_day !== 0
												? "day"
												: "night"
										]?.description || "Unknown Weather"
									}${
										wmo_descriptions[
											forecast.current.weather_code
										]?.[
											forecast.current.is_day !== 0
												? "day"
												: "night"
										]?.includeSuffix && " weather"
									} will continue in the next hour.`) ||
									"Unknown Weather"}
							</h3>
							<div id="hourly-forecast-list">
								{(forecast &&
									timeAdjustHourlyForecast(forecast.hourly)
										.slice(0, 24)
										.map(
											({
												time,
												is_day,
												temperature_2m,
												weather_code,
											}) => (
												<div
													key={time}
													className="hourly-forecast-item"
												>
													<div>
														{formatDateTime(time)}
													</div>
													<img
														className="hourly-forecast-item-image"
														src={
															wmo_descriptions[
																weather_code
															]?.[
																is_day !== 0
																	? "day"
																	: "night"
															]?.image ||
															defaultWeatherIcon
														}
														alt={
															wmo_descriptions[
																weather_code
															]?.[
																is_day !== 0
																	? "day"
																	: "night"
															]?.description ||
															"Unknown Weather"
														}
													/>
													<div>
														{formatTemperature(
															temperature_2m,
														)}
													</div>
												</div>
											),
										)) ||
									"Unknown Hourly Forecast"}
							</div>
						</section>
					</div>
				</main>
			</div>
		</div>
	);
}

export default App;
