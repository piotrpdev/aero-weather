import { useEffect, useState } from "react";
import type { ForecastData, GeolocationData } from "../lib/weather";

const IS_TEST = false;
// White House coordinates (Washington, D.C., USA)
const TEST_LAT = "38.8977";
const TEST_LON = "-77.0366";

function fetchGeolocation(
	latitude: number,
	longitude: number,
): Promise<Response> {
	const geolocationApiUrl = new URL(
		"https://nominatim.openstreetmap.org/reverse",
	);
	geolocationApiUrl.searchParams.set("format", "json");
	geolocationApiUrl.searchParams.set(
		"lat",
		IS_TEST ? TEST_LAT : latitude.toString(),
	);
	geolocationApiUrl.searchParams.set(
		"lon",
		IS_TEST ? TEST_LON : longitude.toString(),
	);

	return fetch(geolocationApiUrl.toString());
}

function fetchForecast(latitude: number, longitude: number): Promise<Response> {
	const forecastApiUrl = new URL("https://api.open-meteo.com/v1/forecast");
	forecastApiUrl.searchParams.set(
		"latitude",
		IS_TEST ? TEST_LAT : latitude.toString(),
	);
	forecastApiUrl.searchParams.set(
		"longitude",
		IS_TEST ? TEST_LON : longitude.toString(),
	);
	forecastApiUrl.searchParams.set(
		"current",
		[
			"temperature_2m",
			"weather_code",
			"is_day",
			"wind_speed_10m",
			"wind_direction_10m",
			"wind_gusts_10m",
		].join(","),
	);
	forecastApiUrl.searchParams.set(
		"hourly",
		["temperature_2m", "weather_code", "is_day"].join(","),
	);
	forecastApiUrl.searchParams.set(
		"daily",
		["temperature_2m_max", "temperature_2m_min", "weather_code"].join(","),
	);
	forecastApiUrl.searchParams.set("temperature_unit", "celsius");
	// Daily results are UTC and rollover, if someone is very behind  e.g. in USA this could cause issues
	// Consider using luxon https://moment.github.io/luxon/#/zones?id=creating-datetimes-in-a-zone
	forecastApiUrl.searchParams.set("timezone", "UTC");

	return fetch(forecastApiUrl.toString());
}

export default function useFetchGeolocationAndForecast(): {
	coords: GeolocationCoordinates | null;
	geolocation: GeolocationData | null;
	forecast: ForecastData | null;
} {
	const [coords, setCoords] = useState<GeolocationCoordinates | null>(null);
	const [geolocation, setGeolocation] = useState<GeolocationData | null>(
		null,
	);
	const [forecast, setForecast] = useState<ForecastData | null>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: object dep
	useEffect(() => {
		// TODO: Maybe use Tauri geolocation API for better accuracy
		navigator.geolocation.getCurrentPosition((position) => {
			setCoords(position.coords);
		});

		if (!coords || (forecast && geolocation)) return;

		// TODO: Handle errors

		fetchGeolocation(coords.latitude, coords.longitude)
			.then((res) => res.json())
			.then((data) => {
				console.log("Geolocation data is:", data);
				setGeolocation(data);
			});

		fetchForecast(coords.latitude, coords.longitude)
			.then((res) => res.json())
			.then((data) => {
				console.log("Forecast data is:", data);
				setForecast(data);
			});
	}, [coords?.longitude]);

	return { coords, geolocation, forecast };
}
