import { useEffect } from "react";
import compassImg from "./assets/compass/compass.png";
import needleImg from "./assets/compass/needle.png";
import defaultWeatherIcon from "./assets/realll/default.png";
import useFetchGeolocationAndForecast from "./hooks/useFetchGeolocationAndForecast";
import {
	type AdjustedCurrentWind,
	adjustCurrentWind,
	convertObjectArraysToArrayOfObjects,
	formatDate,
	formatTemperature,
	formatTime,
	getAqiDescription,
	timeAdjustHourlyForecast,
} from "./lib/formatters";
import { type AdjustedDailyForecast, wmo_descriptions } from "./lib/weather";

function App() {
	const { error, geolocation, forecast, airQuality } =
		useFetchGeolocationAndForecast();

	const adjustedHourlyForecast = forecast
		? timeAdjustHourlyForecast(forecast.hourly)
		: null;

	const adjustedDailyForecast = forecast
		? (convertObjectArraysToArrayOfObjects<string | number>(
				forecast.daily,
			) as AdjustedDailyForecast)
		: null;

	const { adjustedWindValue, adjustedWindUnit } = (
		forecast && geolocation
			? adjustCurrentWind(
					forecast.current.wind_speed_10m,
					geolocation.address.country_code,
				)
			: { adjustedWindValue: null, adjustedWindUnit: null }
	) as AdjustedCurrentWind;

	const {
		adjustedWindValue: adjustedGustValue,
		adjustedWindUnit: adjustedGustUnit,
	} = (
		forecast && geolocation
			? adjustCurrentWind(
					forecast.current.wind_gusts_10m,
					geolocation.address.country_code,
				)
			: { adjustedWindValue: null, adjustedWindUnit: null }
	) as AdjustedCurrentWind;

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

	// ? Maybe user SWR/React Query for data fetching
	// ? Maybe add nicer error handling (maybe use ErrorBoundary)
	// ? Maybe use skeleton loaders for values
	// TODO: Extract components
	// TODO: Extract JavaScript in JSX to variables
	// TODO: Add hover tooltips for hourly weather time, temperature, and icon
	//	https://open-meteo.com/en/terms
	//	https://operations.osmfoundation.org/policies/nominatim/
	return (
		// ? Maybe add some weather-agnostic default background
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
						<h5 id="my-location">
							{error?.message || "My Location"}
						</h5>
						<div id="city-state-temperature">
							<div id="city-state">
								<h1 id="city">
									{(error && "Error") ||
										geolocation?.address.city ||
										geolocation?.address.county ||
										"..."}
								</h1>
								<h3 id="state">
									{(error && "API request failed") ||
										geolocation?.address.country ||
										"..."}
								</h3>
							</div>
							{/* TODO: Maybe let user click on this to change temperature units */}
							<h1 id="temperature">
								{(forecast &&
									geolocation &&
									formatTemperature(
										forecast.current.temperature_2m,
										geolocation.address.country_code,
									)) ||
									"..."}
							</h1>
						</div>
						<h5 id="type">
							{(error && "Please refresh the page") ||
								(forecast &&
									wmo_descriptions[
										forecast.current.weather_code
									]?.[
										forecast.current.is_day !== 0
											? "day"
											: "night"
									]?.description) ||
								"..."}
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
								{(forecast &&
									adjustedHourlyForecast &&
									`${
										wmo_descriptions[
											adjustedHourlyForecast[0]
												.weather_code
										]?.[
											forecast.current.is_day !== 0
												? "day"
												: "night"
										]?.description || "..."
									}${
										wmo_descriptions[
											adjustedHourlyForecast[0]
												.weather_code
										]?.[
											forecast.current.is_day !== 0
												? "day"
												: "night"
										]?.includeSuffix
											? " weather"
											: ""
									} will ${forecast.current.weather_code === adjustedHourlyForecast[0].weather_code ? "continue" : "develop"} in the next hour.`) ||
									"..."}
							</h4>
							<div id="hourly-forecast-list">
								{(geolocation &&
									adjustedHourlyForecast?.map(
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
												<div>{formatTime(time)}</div>
												<div className="forecast-image-container">
													<img
														className="forecast-image"
														width="40px"
														height="40px"
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
												</div>
												<div>
													{formatTemperature(
														temperature_2m,
														geolocation.address
															.country_code,
													)}
												</div>
											</div>
										),
									)) ||
									"..."}
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
									{(forecast && "Forecast") || "..."}
								</h4>
								<div id="week-forecast-list">
									{(forecast &&
										geolocation &&
										adjustedDailyForecast?.map(
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
													<div className="forecast-image-container">
														<img
															className="forecast-image"
															width="40px"
															height="40px"
															src={
																wmo_descriptions[
																	weather_code
																]?.[
																	forecast
																		.current
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
																	forecast
																		.current
																		.is_day !==
																	0
																		? "day"
																		: "night"
																]
																	?.description ||
																"Unknown Weather"
															}
														/>
													</div>
													<div>
														{formatTemperature(
															temperature_2m_min,
															geolocation.address
																.country_code,
														)}
													</div>
													<div>
														{formatTemperature(
															temperature_2m_max,
															geolocation.address
																.country_code,
														)}
													</div>
												</div>
											),
										)) ||
										"..."}
								</div>
							</div>
							<div
								id="air-forecast-container"
								className="forecast-container"
							>
								<h4
									id="air-forecast-heading"
									className="forecast-heading"
								>
									{forecast ? "Air Quality" : "..."}
								</h4>
								<div id="air-forecast-scale-container">
									<div id="air-forecast-list">
										<div className="air-forecast-item forecast-item">
											<div id="air-forecast-value-list">
												<div id="air-forecast-value">
													{(geolocation &&
													geolocation.address
														.country_code === "us"
														? airQuality?.current
																.us_aqi
														: airQuality?.current
																.european_aqi) ||
														"..."}
												</div>
												<div id="air-forecast-units">
													{(geolocation &&
													geolocation.address
														.country_code === "us"
														? airQuality
																?.current_units
																.us_aqi
														: airQuality
																?.current_units
																.european_aqi) ||
														"..."}
												</div>
											</div>
											<div id="air-forecast-description">
												{(airQuality &&
													geolocation &&
													getAqiDescription(
														geolocation.address
															.country_code ===
															"us"
															? airQuality.current
																	.us_aqi
															: airQuality.current
																	.european_aqi,
														geolocation.address
															.country_code,
													)) ||
													"..."}
											</div>
										</div>
									</div>
									<div id="air-forecast-image-container">
										{airQuality && geolocation && (
											<>
												<div
													id="air-forecast-scale"
													className={`air-forecast-scale-${geolocation.address.country_code === "us" ? "usaqi" : "eaqi"}`}
												/>
												<div
													id="circle-container"
													style={{
														left: `calc(${geolocation.address.country_code === "us" ? (airQuality?.current.us_aqi / 500) * 100 : airQuality?.current.european_aqi}% - 10px)`,
													}}
												>
													<svg
														viewBox="0 0 20 20"
														xmlns="http://www.w3.org/2000/svg"
													>
														<title>circle</title>
														<circle
															cx="10"
															cy="10"
															r="7"
															stroke="gray"
															strokeWidth="3"
															fill="lightgray"
														/>
													</svg>
												</div>
											</>
										)}
									</div>
								</div>
							</div>
							<div
								id="wind-forecast-container"
								className="forecast-container"
							>
								<h4
									id="wind-forecast-heading"
									className="forecast-heading"
								>
									{forecast ? "Wind" : "..."}
								</h4>
								<div id="wind-forecast-compass-container">
									<div id="wind-forecast-image-container">
										{/* I only found out that the needle doesn't indicate direction once I already separated it from the compass :( */}
										{forecast && geolocation && (
											<>
												<img
													id="wind-forecast-compass"
													width="150px"
													style={{
														rotate:
															// biome-ignore lint/style/useTemplate: <explanation>
															(
																360 -
																forecast.current
																	.wind_direction_10m
															).toString() +
															"deg",
													}}
													src={compassImg}
													alt="compass"
												/>
												<img
													id="wind-forecast-needle"
													width="150px"
													style={{
														rotate:
															// biome-ignore lint/style/useTemplate: <explanation>
															(
																360 -
																forecast.current
																	.wind_direction_10m
															).toString() +
															"deg",
													}}
													src={needleImg}
													alt="compass needle"
												/>
											</>
										)}
									</div>
									<div id="wind-forecast-list">
										<div
											id="wind-forecast-list-clarifier"
											className="forecast-item"
										>
											(Coming from{" "}
											{
												forecast?.current
													.wind_direction_10m
											}
											&deg;)
										</div>
										<div className="wind-forecast-list-item forecast-item">
											<div>Wind Speed</div>
											<div className="wind-forecast-list-item-value">
												<div>
													{adjustedWindValue || "..."}
												</div>
												<div>
													{adjustedWindUnit || "..."}
												</div>
											</div>
										</div>
										<div className="wind-forecast-list-item forecast-item">
											<div>Gust Speed</div>
											<div className="wind-forecast-list-item-value">
												<div>
													{adjustedGustValue || "..."}
												</div>
												<div>
													{adjustedGustUnit || "..."}
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</section>
					</main>
				</div>
			</div>
			<footer className="forecast-item">
				<div className="forecast-container">
					<div>
						Made with ❤️ by{" "}
						<a
							href="https://github.com/piotrpdev"
							target="_blank"
							rel="noopener noreferrer"
						>
							@piotrpdev
						</a>
					</div>
					<div>
						Design by{" "}
						<a
							href="https://x.com/1000kilobytes"
							target="_blank"
							rel="noopener noreferrer"
						>
							@1000kilobytes
						</a>
					</div>
					<div>
						Weather data by{" "}
						<a
							href="https://open-meteo.com/"
							target="_blank"
							rel="noopener noreferrer"
						>
							Open-Meteo.com
						</a>
					</div>
				</div>
			</footer>
		</div>
	);
}

export default App;
