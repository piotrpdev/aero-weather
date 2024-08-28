import { useEffect } from "react";
import defaultWeatherIcon from "./assets/realll/default.png";
import useFetchGeolocationAndForecast from "./hooks/useFetchGeolocationAndForecast";
import {
	convertObjectArraysToArrayOfObjects,
	formatDate,
	formatTemperature,
	formatTime,
	timeAdjustHourlyForecast,
} from "./lib/formatters";
import { type AdjustedDailyForecast, wmo_descriptions } from "./lib/weather";

function App() {
	const { geolocation, forecast } = useFetchGeolocationAndForecast();
	const adjustedHourlyForecast = forecast
		? timeAdjustHourlyForecast(forecast.hourly)
		: null;

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

	// TODO: Add OSM, Open-Meteo, personal, design, license, etc. attribution
	// TODO: Maybe user SWR/React Query for data fetching
	// TODO: Add error handling (maybe use ErrorBoundary)
	// TODO: Add loading states, maybe use skeleton loaders for values
	// TODO: Extract components
	// TODO: Add hover tooltips for hourly weather time, temperature, and icon
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
										geolocation?.address.county ||
										"..."}
								</h1>
								<h3 id="state">
									{geolocation?.address.country || "..."}
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
							{(forecast &&
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
							<div className="forecast-container">
								<h4
									id="air-forecast-heading"
									className="forecast-heading"
								>
									{(forecast && "Air Quality") || "..."}
								</h4>
							</div>
							<div className="forecast-container">
								<h4
									id="wind-forecast-heading"
									className="forecast-heading"
								>
									{(forecast && "Wind") || "..."}
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
