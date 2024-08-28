import day0 from "../assets/realll/day/0.png";
import day2 from "../assets/realll/day/2.png";
import day3 from "../assets/realll/day/3.png";
import day45 from "../assets/realll/day/45.png";
import day51 from "../assets/realll/day/51.png";
import day63 from "../assets/realll/day/63.png";
import day73 from "../assets/realll/day/73.png";
import day85 from "../assets/realll/day/85.png";
import day95 from "../assets/realll/day/95.png";

import night0 from "../assets/realll/night/0.png";
import night2 from "../assets/realll/night/2.png";
import night3 from "../assets/realll/night/3.png";
import night45 from "../assets/realll/night/45.png";
import night51 from "../assets/realll/night/51.png";
import night63 from "../assets/realll/night/63.png";
import night73 from "../assets/realll/night/73.png";
import night85 from "../assets/realll/night/85.png";
import night95 from "../assets/realll/night/95.png";

// TODO: update this type when decided on API params
export type GeolocationData = {
	place_id: number;
	licence: string;
	osm_type: string;
	osm_id: number;
	lat: string;
	lon: string;
	class: string;
	type: string;
	place_rank: number;
	importance: number;
	addresstype: string;
	name: string;
	display_name: string;
	address: {
		road: string;
		city_district: string;
		city: string;
		county: string;
		"ISO3166-2-lvl6": string;
		region: string;
		"ISO3166-2-lvl5": string;
		postcode: string;
		country: string;
		country_code: string;
	};
	boundingbox: Array<string>;
};

// TODO: update this type when decided on API params
export type ForecastData = {
	latitude: number;
	longitude: number;
	generationtime_ms: number;
	utc_offset_seconds: number;
	timezone: string;
	timezone_abbreviation: string;
	elevation: number;
	current_units: {
		time: string;
		interval: string;
		temperature_2m: string;
		weather_code: string;
		is_day: string;
		wind_direction_10m: string;
		wind_gusts_10m: string;
		wind_speed_10m: string;
	};
	current: {
		time: string;
		interval: number;
		temperature_2m: number;
		weather_code: number;
		is_day: number;
		wind_direction_10m: number;
		wind_gusts_10m: number;
		wind_speed_10m: number;
	};
	hourly_units: {
		time: string;
		temperature_2m: string;
		relative_humidity_2m: string;
		weather_code: string;
	};
	hourly: {
		time: Array<string>;
		temperature_2m: Array<number>;
		weather_code: Array<number>;
		is_day: Array<number>;
	};
	daily_units: {
		time: string;
		temperature_2m_max: string;
		temperature_2m_min: string;
		weather_code: string;
	};
	daily: {
		time: Array<string>;
		temperature_2m_max: Array<number>;
		temperature_2m_min: Array<number>;
		weather_code: Array<number>;
	};
};

export type WmoDescriptions = Record<
	string,
	{
		day: {
			description: string;
			includeSuffix: boolean;
			image: string;
			cssClass: string;
		};
		night: {
			description: string;
			includeSuffix: boolean;
			image: string;
			cssClass: string;
		};
	}
>;

// I hate complicated TypeScript types :(
export type AdjustedHourlyForecast = Array<{
	[K in keyof ForecastData["hourly"]]: ForecastData["hourly"][K][number];
}>;

export type AdjustedDailyForecast = Array<{
	[K in keyof ForecastData["daily"]]: ForecastData["daily"][K][number];
}>;

// TODO: Maybe change key to number instead
// Taken from this URL: https://gist.github.com/stellasphere/9490c195ed2b53c707087c8c2db4ec0c
// Further detail here: https://www.nodc.noaa.gov/archive/arc0021/0002199/1.1/data/0-data/HTML/WMO-CODE/WMO4677.HTM
export const wmo_descriptions: WmoDescriptions = {
	"0": {
		day: {
			description: "Sunny",
			includeSuffix: true,
			image: day0,
			cssClass: "bg-sunny",
		},
		night: {
			description: "Clear",
			includeSuffix: true,
			image: night0,
			cssClass: "bg-sunny",
		},
	},
	"1": {
		day: {
			description: "Mainly Sunny",
			includeSuffix: true,
			image: day0,
			cssClass: "bg-sunny",
		},
		night: {
			description: "Mainly Clear",
			includeSuffix: true,
			image: night0,
			cssClass: "bg-sunny",
		},
	},
	"2": {
		day: {
			description: "Partly Cloudy",
			includeSuffix: true,
			image: day2,
			cssClass: "bg-cloudy",
		},
		night: {
			description: "Partly Cloudy",
			includeSuffix: true,
			image: night2,
			cssClass: "bg-cloudy",
		},
	},
	"3": {
		day: {
			description: "Cloudy",
			includeSuffix: true,
			image: day3,
			cssClass: "bg-cloudy",
		},
		night: {
			description: "Cloudy",
			includeSuffix: true,
			image: night3,
			cssClass: "bg-cloudy",
		},
	},
	"45": {
		day: {
			description: "Foggy",
			includeSuffix: true,
			image: day45,
			cssClass: "bg-foggy",
		},
		night: {
			description: "Foggy",
			includeSuffix: true,
			image: night45,
			cssClass: "bg-foggy",
		},
	},
	"48": {
		day: {
			description: "Rime Fog",
			includeSuffix: false,
			image: day45,
			cssClass: "bg-foggy",
		},
		night: {
			description: "Rime Fog",
			includeSuffix: false,
			image: night45,
			cssClass: "bg-foggy",
		},
	},
	"51": {
		day: {
			description: "Light Drizzle",
			includeSuffix: false,
			image: day51,
			cssClass: "bg-drizzle",
		},
		night: {
			description: "Light Drizzle",
			includeSuffix: false,
			image: night51,
			cssClass: "bg-drizzle",
		},
	},
	"53": {
		day: {
			description: "Drizzle",
			includeSuffix: false,
			image: day51,
			cssClass: "bg-drizzle",
		},
		night: {
			description: "Drizzle",
			includeSuffix: false,
			image: night51,
			cssClass: "bg-drizzle",
		},
	},
	"55": {
		day: {
			description: "Heavy Drizzle",
			includeSuffix: false,
			image: day51,
			cssClass: "bg-drizzle",
		},
		night: {
			description: "Heavy Drizzle",
			includeSuffix: false,
			image: night51,
			cssClass: "bg-drizzle",
		},
	},
	"56": {
		day: {
			description: "Light Freezing Drizzle",
			includeSuffix: false,
			image: day51,
			cssClass: "bg-drizzle",
		},
		night: {
			description: "Light Freezing Drizzle",
			includeSuffix: false,
			image: night51,
			cssClass: "bg-drizzle",
		},
	},
	"57": {
		day: {
			description: "Freezing Drizzle",
			includeSuffix: false,
			image: day51,
			cssClass: "bg-drizzle",
		},
		night: {
			description: "Freezing Drizzle",
			includeSuffix: false,
			image: night51,
			cssClass: "bg-drizzle",
		},
	},
	"61": {
		day: {
			description: "Light Rain",
			includeSuffix: false,
			image: day63,
			cssClass: "bg-drizzle",
		},
		night: {
			description: "Light Rain",
			includeSuffix: false,
			image: night63,
			cssClass: "bg-drizzle",
		},
	},
	"63": {
		day: {
			description: "Rain",
			includeSuffix: false,
			image: day63,
			cssClass: "bg-drizzle",
		},
		night: {
			description: "Rain",
			includeSuffix: false,
			image: night63,
			cssClass: "bg-drizzle",
		},
	},
	"65": {
		day: {
			description: "Heavy Rain",
			includeSuffix: false,
			image: day63,
			cssClass: "bg-drizzle",
		},
		night: {
			description: "Heavy Rain",
			includeSuffix: false,
			image: night63,
			cssClass: "bg-drizzle",
		},
	},
	"66": {
		day: {
			description: "Light Freezing Rain",
			includeSuffix: false,
			image: day63,
			cssClass: "bg-drizzle",
		},
		night: {
			description: "Light Freezing Rain",
			includeSuffix: false,
			image: night63,
			cssClass: "bg-drizzle",
		},
	},
	"67": {
		day: {
			description: "Freezing Rain",
			includeSuffix: false,
			image: day63,
			cssClass: "bg-drizzle",
		},
		night: {
			description: "Freezing Rain",
			includeSuffix: false,
			image: night63,
			cssClass: "bg-drizzle",
		},
	},
	"71": {
		day: {
			description: "Light Snow",
			includeSuffix: false,
			image: day73,
			cssClass: "bg-snow",
		},
		night: {
			description: "Light Snow",
			includeSuffix: false,
			image: night73,
			cssClass: "bg-snow",
		},
	},
	"73": {
		day: {
			description: "Snow",
			includeSuffix: false,
			image: day73,
			cssClass: "bg-snow",
		},
		night: {
			description: "Snow",
			includeSuffix: false,
			image: night73,
			cssClass: "bg-snow",
		},
	},
	"75": {
		day: {
			description: "Heavy Snow",
			includeSuffix: false,
			image: day73,
			cssClass: "bg-snow",
		},
		night: {
			description: "Heavy Snow",
			includeSuffix: false,
			image: night73,
			cssClass: "bg-snow",
		},
	},
	"77": {
		day: {
			description: "Snow Grains",
			includeSuffix: false,
			image: day73,
			cssClass: "bg-snow",
		},
		night: {
			description: "Snow Grains",
			includeSuffix: false,
			image: night73,
			cssClass: "bg-snow",
		},
	},
	"80": {
		day: {
			description: "Light Showers",
			includeSuffix: false,
			image: day63,
			cssClass: "bg-drizzle",
		},
		night: {
			description: "Light Showers",
			includeSuffix: false,
			image: night63,
			cssClass: "bg-drizzle",
		},
	},
	"81": {
		day: {
			description: "Showers",
			includeSuffix: false,
			image: day63,
			cssClass: "bg-drizzle",
		},
		night: {
			description: "Showers",
			includeSuffix: false,
			image: night63,
			cssClass: "bg-drizzle",
		},
	},
	"82": {
		day: {
			description: "Heavy Showers",
			includeSuffix: false,
			image: day51,
			cssClass: "bg-drizzle",
		},
		night: {
			description: "Heavy Showers",
			includeSuffix: false,
			image: night51,
			cssClass: "bg-drizzle",
		},
	},
	"85": {
		day: {
			description: "Light Snow Showers",
			includeSuffix: false,
			image: day63,
			cssClass: "bg-snow",
		},
		night: {
			description: "Light Snow Showers",
			includeSuffix: false,
			image: night63,
			cssClass: "bg-snow",
		},
	},
	"86": {
		day: {
			description: "Snow Showers",
			includeSuffix: false,
			image: day85,
			cssClass: "bg-snow",
		},
		night: {
			description: "Snow Showers",
			includeSuffix: false,
			image: night85,
			cssClass: "bg-snow",
		},
	},
	"95": {
		day: {
			description: "Thunderstorm",
			includeSuffix: false,
			image: day95,
			cssClass: "bg-thunderstorm",
		},
		night: {
			description: "Thunderstorm",
			includeSuffix: false,
			image: night95,
			cssClass: "bg-thunderstorm",
		},
	},
	"96": {
		day: {
			description: "Light Thunderstorms With Hail",
			includeSuffix: false,
			image: day95,
			cssClass: "bg-thunderstorm",
		},
		night: {
			description: "Light Thunderstorms With Hail",
			includeSuffix: false,
			image: night95,
			cssClass: "bg-thunderstorm",
		},
	},
	"99": {
		day: {
			description: "Thunderstorm With Hail",
			includeSuffix: false,
			image: day95,
			cssClass: "bg-thunderstorm",
		},
		night: {
			description: "Thunderstorm With Hail",
			includeSuffix: false,
			image: night95,
			cssClass: "bg-thunderstorm",
		},
	},
};
