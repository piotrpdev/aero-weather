import type {
	AdjustedHourlyForecast,
	AirQualityData,
	ForecastData,
	GeolocationData,
} from "./weather";

export function formatTemperature(
	temperature: number,
	countryCode: GeolocationData["address"]["country_code"],
): string {
	// https://en.wikipedia.org/wiki/Fahrenheit
	// https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes
	if (["us", "bs", "ky", "pw", "fm", "mh", "lr"].includes(countryCode)) {
		// IEEE 754 has come to haunt us
		const fahrenheit = temperature * 1.8 + 32;
		return `${Math.round(fahrenheit)}°F`;
	}

	return `${Math.round(temperature)}°C`;
}

export const intlTimeFormatter = new Intl.DateTimeFormat("en-US", {
	hour12: true,
	hour: "numeric",
});

// https://stackoverflow.com/a/32252922/19020549
export const formatTime = (time: string): string =>
	// biome-ignore lint/style/useTemplate: readability
	intlTimeFormatter.format(new Date(time + "Z"));

export const intlDateFormatter = new Intl.DateTimeFormat("en-US", {
	weekday: "short",
});

export const formatDate = (date: string): string =>
	// biome-ignore lint/style/useTemplate: readability
	intlDateFormatter.format(new Date(date + "T00:00Z"));

// https://gist.github.com/thesofakillers/bcf39eaed428304ddc126ca8f12336f7
export function convertObjectArraysToArrayOfObjects<T>(
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

export function timeAdjustHourlyForecast(
	hourlyForecast: ForecastData["hourly"],
	sliceLength = 36,
): AdjustedHourlyForecast {
	const indexOfNextTime = hourlyForecast.time.findIndex(
		// biome-ignore lint/style/useTemplate: readability
		(time) => new Date(time + "Z") > new Date(),
	);
	return convertObjectArraysToArrayOfObjects<string | number>(hourlyForecast)
		.slice(indexOfNextTime)
		.slice(0, sliceLength) as AdjustedHourlyForecast;
}

export type AdjustedCurrentWind = {
	adjustedWindValue: number;
	adjustedWindUnit: string;
};

export function adjustCurrentWind(
	wind_speed_10m: ForecastData["current"]["wind_speed_10m"],
	countryCode: GeolocationData["address"]["country_code"],
): AdjustedCurrentWind {
	// https://en.wikipedia.org/wiki/Fahrenheit
	// https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes
	if (["us", "bs", "ky", "pw", "fm", "mh", "lr"].includes(countryCode)) {
		// IEEE 754 has come to haunt us
		const mph = wind_speed_10m / 1.609;
		return { adjustedWindValue: Math.round(mph), adjustedWindUnit: "mph" };
	}

	return {
		adjustedWindValue: Math.round(wind_speed_10m),
		adjustedWindUnit: "km/h",
	};
}

// https://open-meteo.com/en/docs/air-quality-api
export function getAqiDescription(
	aqi:
		| AirQualityData["current"]["european_aqi"]
		| AirQualityData["current"]["us_aqi"],
	countryCode: GeolocationData["address"]["country_code"],
) {
	let description = "Unknown";

	if (countryCode === "us") {
		if (aqi <= 50) {
			description = "Good";
		} else if (aqi <= 100) {
			description = "Moderate";
		} else if (aqi <= 150) {
			description = "Unhealthy for Sensitive Groups";
		} else if (aqi <= 200) {
			description = "Unhealthy";
		} else if (aqi <= 300) {
			description = "Very Unhealthy";
		} else {
			description = "Hazardous";
		}
	} else {
		if (aqi <= 20) {
			description = "Good";
		} else if (aqi <= 40) {
			description = "Fair";
		} else if (aqi <= 60) {
			description = "Moderate";
		} else if (aqi <= 80) {
			description = "Poor";
		} else if (aqi <= 100) {
			description = "Very Poor";
		} else {
			description = "Extremely Poor";
		}
	}

	return description;
}
