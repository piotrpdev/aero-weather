import { useEffect, useState } from "react";
import type { ForecastData, GeolocationData } from "../lib/weather";

function fetchGeolocation(
	latitude: number,
	longitude: number,
): Promise<Response> {
	const geolocationApiUrl = new URL(
		"https://nominatim.openstreetmap.org/reverse",
	);
	geolocationApiUrl.searchParams.set("format", "json");
	geolocationApiUrl.searchParams.set("lat", latitude.toString());
	geolocationApiUrl.searchParams.set("lon", longitude.toString());

	return fetch(geolocationApiUrl.toString());
}

function fetchForecast(latitude: number, longitude: number): Promise<Response> {
	const forecastApiUrl = new URL("https://api.open-meteo.com/v1/forecast");
	forecastApiUrl.searchParams.set("latitude", latitude.toString());
	forecastApiUrl.searchParams.set("longitude", longitude.toString());
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
