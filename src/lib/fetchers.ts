export function fetchGeolocation(
	latitude: string,
	longitude: string,
): Promise<Response> {
	const geolocationApiUrl = new URL(
		"https://nominatim.openstreetmap.org/reverse",
	);
	geolocationApiUrl.searchParams.set("format", "json");
	geolocationApiUrl.searchParams.set("lat", latitude);
	geolocationApiUrl.searchParams.set("lon", longitude);

	return fetch(geolocationApiUrl.toString());
}

export function fetchForecast(latitude: string, longitude: string) {
	const forecastApiUrl = new URL("https://api.open-meteo.com/v1/forecast");
	forecastApiUrl.searchParams.set("latitude", latitude);
	forecastApiUrl.searchParams.set("longitude", longitude);
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
