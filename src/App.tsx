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

	const intlTimeFormatter = new Intl.DateTimeFormat("en-US", {
		hour12: true,
		hour: "numeric",
	});
	// https://stackoverflow.com/a/32252922/19020549
	const formatTime = (time: string): string =>
		// biome-ignore lint/style/useTemplate: readability
		intlTimeFormatter.format(new Date(time + "Z"));

	const intlDateFormatter = new Intl.DateTimeFormat("en-US", {
		weekday: "short",
	});

	const formatDate = (date: string): string =>
		// biome-ignore lint/style/useTemplate: readability
		intlDateFormatter.format(new Date(date + "Z"));

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

	type AdjustedDailyForecast = Array<{
		[K in keyof ForecastData["daily"]]: ForecastData["daily"][K][number];
	}>;

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
				"temperature_2m,weather_code,is_day",
			);
			forecastApiUrl.searchParams.set(
				"hourly",
				"temperature_2m,weather_code,is_day",
			);
			forecastApiUrl.searchParams.set(
				"daily",
				"temperature_2m_max,temperature_2m_min,weather_code",
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

	// TODO: Add OSM, Open-Meteo, personal, design, license, etc. attribution
	// TODO: Maybe user SWR/React Query for data fetching
	// TODO: Add error handling (maybe use ErrorBoundary)
	// TODO: Add loading states, maybe use skeleton loaders for values
	// TODO: Extract components
	// TODO: Add hover tooltips for hourly weather time, temperature, and icon
	// TODO: Optimize/reduce re-renders
	return (
		// TODO: Maybe add some weather-agnostic default background
		<div
			id="container"
			className={`${
				forecast &&
				wmo_descriptions[forecast.current.weather_code]?.[
					forecast.current.is_day !== 0 ? "day" : "night"
				]?.cssClass
			}`}
		>
			<div id="before-inner-container">
				<div id="inner-container">
					<header>
						<h5 id="my-location">My Location</h5>
						<div id="city-state-temperature">
							<div id="city-state">
								<h1 id="city">
									{geolocation?.address.city ||
										geolocation?.address.county}
								</h1>
								<h3 id="state">
									{geolocation?.address.country}
								</h3>
							</div>
							{/* TODO: Maybe let user click on this to change temperature units */}
							<h1 id="temperature">
								{forecast &&
									formatTemperature(
										forecast.current.temperature_2m,
									)}
							</h1>
						</div>
						<h5 id="type">
							{forecast &&
								wmo_descriptions[
									forecast.current.weather_code
								]?.[
									forecast.current.is_day !== 0
										? "day"
										: "night"
								]?.description}
						</h5>
					</header>
					<main>
						<section
							id="hourly-forecast-container"
							className="forecast-container"
						>
							<h4
								id="hourly-forecast-heading"
								className="forecast-heading"
							>
								{/* TODO: Actually implement prediction here */}
								{forecast &&
									`${
										wmo_descriptions[
											forecast.current.weather_code
										]?.[
											forecast.current.is_day !== 0
												? "day"
												: "night"
										]?.description
									}${
										wmo_descriptions[
											forecast.current.weather_code
										]?.[
											forecast.current.is_day !== 0
												? "day"
												: "night"
										]?.includeSuffix
											? " weather"
											: ""
									} will continue in the next hour.`}
							</h4>
							<div id="hourly-forecast-list">
								{forecast &&
									timeAdjustHourlyForecast(forecast.hourly)
										.slice(0, 36)
										.map(
											({
												time,
												is_day,
												temperature_2m,
												weather_code,
											}) => (
												<div
													key={time}
													className="hourly-forecast-item forecast-item"
												>
													<div>
														{formatTime(time)}
													</div>
													<img
														className="forecast-image"
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
										)}
							</div>
						</section>
						<section id="week-air-wind-container">
							<div
								id="week-forecast-container"
								className="forecast-container"
							>
								<h4
									id="week-forecast-heading"
									className="forecast-heading"
								>
									{forecast && "Forecast"}
								</h4>
								<div id="week-forecast-list">
									{forecast &&
										(
											convertObjectArraysToArrayOfObjects<
												string | number
											>(
												forecast.daily,
											) as AdjustedDailyForecast
										).map(
											({
												time,
												temperature_2m_max,
												temperature_2m_min,
												weather_code,
											}) => (
												<div
													key={time}
													className="week-forecast-item forecast-item"
												>
													<div>
														{formatDate(time)}
													</div>
													<img
														className="forecast-image"
														src={
															wmo_descriptions[
																weather_code
															]?.[
																forecast.current
																	.is_day !==
																0
																	? "day"
																	: "night"
															]?.image ||
															defaultWeatherIcon
														}
														alt={
															wmo_descriptions[
																weather_code
															]?.[
																forecast.current
																	.is_day !==
																0
																	? "day"
																	: "night"
															]?.description ||
															"Unknown Weather"
														}
													/>
													<div>
														{formatTemperature(
															temperature_2m_min,
														)}
													</div>
													<div>
														{formatTemperature(
															temperature_2m_max,
														)}
													</div>
												</div>
											),
										)}
								</div>
							</div>
							<div className="forecast-container">
								<h4
									id="air-forecast-heading"
									className="forecast-heading"
								>
									{forecast && "Air Quality"}
								</h4>
							</div>
							<div className="forecast-container">
								<h4
									id="wind-forecast-heading"
									className="forecast-heading"
								>
									{forecast && "Wind"}
								</h4>
							</div>
						</section>
					</main>
				</div>
			</div>
		</div>
	);
}

export default App;
