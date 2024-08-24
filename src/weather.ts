import day0 from "./assets/realll/day/0.png";
import day2 from "./assets/realll/day/2.png";
import day3 from "./assets/realll/day/3.png";
import day45 from "./assets/realll/day/45.png";
import day51 from "./assets/realll/day/51.png";
import day63 from "./assets/realll/day/63.png";
import day73 from "./assets/realll/day/73.png";
import day85 from "./assets/realll/day/85.png";
import day95 from "./assets/realll/day/95.png";

import night0 from "./assets/realll/night/0.png";
import night2 from "./assets/realll/night/2.png";
import night3 from "./assets/realll/night/3.png";
import night45 from "./assets/realll/night/45.png";
import night51 from "./assets/realll/night/51.png";
import night63 from "./assets/realll/night/63.png";
import night73 from "./assets/realll/night/73.png";
import night85 from "./assets/realll/night/85.png";
import night95 from "./assets/realll/night/95.png";

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
		wind_speed_10m: string;
		weather_code: string;
		is_day: string;
	};
	current: {
		time: string;
		interval: number;
		temperature_2m: number;
		wind_speed_10m: number;
		weather_code: number;
		is_day: number;
	};
	hourly_units: {
		time: string;
		temperature_2m: string;
		relative_humidity_2m: string;
		wind_speed_10m: string;
	};
	hourly: {
		time: Array<string>;
		temperature_2m: Array<number>;
		weather_code: Array<number>;
		is_day: Array<number>;
	};
};

export type WmoDescriptions = Record<
	string,
	{
		day: {
			description: string;
			image: string;
		};
		night: {
			description: string;
			image: string;
		};
	}
>;

// TODO: Maybe change key to number instead
// Taken from this URL: https://gist.github.com/stellasphere/9490c195ed2b53c707087c8c2db4ec0c
// Further detail here: https://www.nodc.noaa.gov/archive/arc0021/0002199/1.1/data/0-data/HTML/WMO-CODE/WMO4677.HTM
export const wmo_descriptions: WmoDescriptions = {
	"0": {
		day: {
			description: "Sunny",
			image: day0,
		},
		night: {
			description: "Clear",
			image: night0,
		},
	},
	"1": {
		day: {
			description: "Mainly Sunny",
			image: day0,
		},
		night: {
			description: "Mainly Clear",
			image: night0,
		},
	},
	"2": {
		day: {
			description: "Partly Cloudy",
			image: day2,
		},
		night: {
			description: "Partly Cloudy",
			image: night2,
		},
	},
	"3": {
		day: {
			description: "Cloudy",
			image: day3,
		},
		night: {
			description: "Cloudy",
			image: night3,
		},
	},
	"45": {
		day: {
			description: "Foggy",
			image: day45,
		},
		night: {
			description: "Foggy",
			image: night45,
		},
	},
	"48": {
		day: {
			description: "Rime Fog",
			image: day45,
		},
		night: {
			description: "Rime Fog",
			image: night45,
		},
	},
	"51": {
		day: {
			description: "Light Drizzle",
			image: day51,
		},
		night: {
			description: "Light Drizzle",
			image: night51,
		},
	},
	"53": {
		day: {
			description: "Drizzle",
			image: day51,
		},
		night: {
			description: "Drizzle",
			image: night51,
		},
	},
	"55": {
		day: {
			description: "Heavy Drizzle",
			image: day51,
		},
		night: {
			description: "Heavy Drizzle",
			image: night51,
		},
	},
	"56": {
		day: {
			description: "Light Freezing Drizzle",
			image: day51,
		},
		night: {
			description: "Light Freezing Drizzle",
			image: night51,
		},
	},
	"57": {
		day: {
			description: "Freezing Drizzle",
			image: day51,
		},
		night: {
			description: "Freezing Drizzle",
			image: night51,
		},
	},
	"61": {
		day: {
			description: "Light Rain",
			image: day63,
		},
		night: {
			description: "Light Rain",
			image: night63,
		},
	},
	"63": {
		day: {
			description: "Rain",
			image: day63,
		},
		night: {
			description: "Rain",
			image: night63,
		},
	},
	"65": {
		day: {
			description: "Heavy Rain",
			image: day63,
		},
		night: {
			description: "Heavy Rain",
			image: night63,
		},
	},
	"66": {
		day: {
			description: "Light Freezing Rain",
			image: day63,
		},
		night: {
			description: "Light Freezing Rain",
			image: night63,
		},
	},
	"67": {
		day: {
			description: "Freezing Rain",
			image: day63,
		},
		night: {
			description: "Freezing Rain",
			image: night63,
		},
	},
	"71": {
		day: {
			description: "Light Snow",
			image: day73,
		},
		night: {
			description: "Light Snow",
			image: night73,
		},
	},
	"73": {
		day: {
			description: "Snow",
			image: day73,
		},
		night: {
			description: "Snow",
			image: night73,
		},
	},
	"75": {
		day: {
			description: "Heavy Snow",
			image: day73,
		},
		night: {
			description: "Heavy Snow",
			image: night73,
		},
	},
	"77": {
		day: {
			description: "Snow Grains",
			image: day73,
		},
		night: {
			description: "Snow Grains",
			image: night73,
		},
	},
	"80": {
		day: {
			description: "Light Showers",
			image: day63,
		},
		night: {
			description: "Light Showers",
			image: night63,
		},
	},
	"81": {
		day: {
			description: "Showers",
			image: day63,
		},
		night: {
			description: "Showers",
			image: night63,
		},
	},
	"82": {
		day: {
			description: "Heavy Showers",
			image: day51,
		},
		night: {
			description: "Heavy Showers",
			image: night51,
		},
	},
	"85": {
		day: {
			description: "Light Snow Showers",
			image: day63,
		},
		night: {
			description: "Light Snow Showers",
			image: night63,
		},
	},
	"86": {
		day: {
			description: "Snow Showers",
			image: day85,
		},
		night: {
			description: "Snow Showers",
			image: night85,
		},
	},
	"95": {
		day: {
			description: "Thunderstorm",
			image: day95,
		},
		night: {
			description: "Thunderstorm",
			image: night95,
		},
	},
	"96": {
		day: {
			description: "Light Thunderstorms With Hail",
			image: day95,
		},
		night: {
			description: "Light Thunderstorms With Hail",
			image: night95,
		},
	},
	"99": {
		day: {
			description: "Thunderstorm With Hail",
			image: day95,
		},
		night: {
			description: "Thunderstorm With Hail",
			image: night95,
		},
	},
};
