import { useEffect, useState } from "react";
import { fetchForecast, fetchGeolocation } from "../lib/fetchers";
import type { ForecastData, GeolocationData } from "../lib/weather";

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

		fetchGeolocation(
			coords.latitude.toString(),
			coords.longitude.toString(),
		)
			.then((res) => res.json())
			.then((data) => {
				console.log("Geolocation data is:", data);
				setGeolocation(data);
			});

		fetchForecast(coords.latitude.toString(), coords.longitude.toString())
			.then((res) => res.json())
			.then((data) => {
				console.log("Forecast data is:", data);
				setForecast(data);
			});
	}, [coords?.longitude]);

	return { coords, geolocation, forecast };
}
