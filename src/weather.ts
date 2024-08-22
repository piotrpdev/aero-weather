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
		relative_humidity_2m: Array<number>;
		wind_speed_10m: Array<number>;
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
export const wmo_descriptions: WmoDescriptions = {
	"0": {
		day: {
			description: "Sunny",
			image: "http://openweathermap.org/img/wn/01d@2x.png",
		},
		night: {
			description: "Clear",
			image: "http://openweathermap.org/img/wn/01n@2x.png",
		},
	},
	"1": {
		day: {
			description: "Mainly Sunny",
			image: "http://openweathermap.org/img/wn/01d@2x.png",
		},
		night: {
			description: "Mainly Clear",
			image: "http://openweathermap.org/img/wn/01n@2x.png",
		},
	},
	"2": {
		day: {
			description: "Partly Cloudy",
			image: "http://openweathermap.org/img/wn/02d@2x.png",
		},
		night: {
			description: "Partly Cloudy",
			image: "http://openweathermap.org/img/wn/02n@2x.png",
		},
	},
	"3": {
		day: {
			description: "Cloudy",
			image: "http://openweathermap.org/img/wn/03d@2x.png",
		},
		night: {
			description: "Cloudy",
			image: "http://openweathermap.org/img/wn/03n@2x.png",
		},
	},
	"45": {
		day: {
			description: "Foggy",
			image: "http://openweathermap.org/img/wn/50d@2x.png",
		},
		night: {
			description: "Foggy",
			image: "http://openweathermap.org/img/wn/50n@2x.png",
		},
	},
	"48": {
		day: {
			description: "Rime Fog",
			image: "http://openweathermap.org/img/wn/50d@2x.png",
		},
		night: {
			description: "Rime Fog",
			image: "http://openweathermap.org/img/wn/50n@2x.png",
		},
	},
	"51": {
		day: {
			description: "Light Drizzle",
			image: "http://openweathermap.org/img/wn/09d@2x.png",
		},
		night: {
			description: "Light Drizzle",
			image: "http://openweathermap.org/img/wn/09n@2x.png",
		},
	},
	"53": {
		day: {
			description: "Drizzle",
			image: "http://openweathermap.org/img/wn/09d@2x.png",
		},
		night: {
			description: "Drizzle",
			image: "http://openweathermap.org/img/wn/09n@2x.png",
		},
	},
	"55": {
		day: {
			description: "Heavy Drizzle",
			image: "http://openweathermap.org/img/wn/09d@2x.png",
		},
		night: {
			description: "Heavy Drizzle",
			image: "http://openweathermap.org/img/wn/09n@2x.png",
		},
	},
	"56": {
		day: {
			description: "Light Freezing Drizzle",
			image: "http://openweathermap.org/img/wn/09d@2x.png",
		},
		night: {
			description: "Light Freezing Drizzle",
			image: "http://openweathermap.org/img/wn/09n@2x.png",
		},
	},
	"57": {
		day: {
			description: "Freezing Drizzle",
			image: "http://openweathermap.org/img/wn/09d@2x.png",
		},
		night: {
			description: "Freezing Drizzle",
			image: "http://openweathermap.org/img/wn/09n@2x.png",
		},
	},
	"61": {
		day: {
			description: "Light Rain",
			image: "http://openweathermap.org/img/wn/10d@2x.png",
		},
		night: {
			description: "Light Rain",
			image: "http://openweathermap.org/img/wn/10n@2x.png",
		},
	},
	"63": {
		day: {
			description: "Rain",
			image: "http://openweathermap.org/img/wn/10d@2x.png",
		},
		night: {
			description: "Rain",
			image: "http://openweathermap.org/img/wn/10n@2x.png",
		},
	},
	"65": {
		day: {
			description: "Heavy Rain",
			image: "http://openweathermap.org/img/wn/10d@2x.png",
		},
		night: {
			description: "Heavy Rain",
			image: "http://openweathermap.org/img/wn/10n@2x.png",
		},
	},
	"66": {
		day: {
			description: "Light Freezing Rain",
			image: "http://openweathermap.org/img/wn/10d@2x.png",
		},
		night: {
			description: "Light Freezing Rain",
			image: "http://openweathermap.org/img/wn/10n@2x.png",
		},
	},
	"67": {
		day: {
			description: "Freezing Rain",
			image: "http://openweathermap.org/img/wn/10d@2x.png",
		},
		night: {
			description: "Freezing Rain",
			image: "http://openweathermap.org/img/wn/10n@2x.png",
		},
	},
	"71": {
		day: {
			description: "Light Snow",
			image: "http://openweathermap.org/img/wn/13d@2x.png",
		},
		night: {
			description: "Light Snow",
			image: "http://openweathermap.org/img/wn/13n@2x.png",
		},
	},
	"73": {
		day: {
			description: "Snow",
			image: "http://openweathermap.org/img/wn/13d@2x.png",
		},
		night: {
			description: "Snow",
			image: "http://openweathermap.org/img/wn/13n@2x.png",
		},
	},
	"75": {
		day: {
			description: "Heavy Snow",
			image: "http://openweathermap.org/img/wn/13d@2x.png",
		},
		night: {
			description: "Heavy Snow",
			image: "http://openweathermap.org/img/wn/13n@2x.png",
		},
	},
	"77": {
		day: {
			description: "Snow Grains",
			image: "http://openweathermap.org/img/wn/13d@2x.png",
		},
		night: {
			description: "Snow Grains",
			image: "http://openweathermap.org/img/wn/13n@2x.png",
		},
	},
	"80": {
		day: {
			description: "Light Showers",
			image: "http://openweathermap.org/img/wn/09d@2x.png",
		},
		night: {
			description: "Light Showers",
			image: "http://openweathermap.org/img/wn/09n@2x.png",
		},
	},
	"81": {
		day: {
			description: "Showers",
			image: "http://openweathermap.org/img/wn/09d@2x.png",
		},
		night: {
			description: "Showers",
			image: "http://openweathermap.org/img/wn/09n@2x.png",
		},
	},
	"82": {
		day: {
			description: "Heavy Showers",
			image: "http://openweathermap.org/img/wn/09d@2x.png",
		},
		night: {
			description: "Heavy Showers",
			image: "http://openweathermap.org/img/wn/09n@2x.png",
		},
	},
	"85": {
		day: {
			description: "Light Snow Showers",
			image: "http://openweathermap.org/img/wn/13d@2x.png",
		},
		night: {
			description: "Light Snow Showers",
			image: "http://openweathermap.org/img/wn/13n@2x.png",
		},
	},
	"86": {
		day: {
			description: "Snow Showers",
			image: "http://openweathermap.org/img/wn/13d@2x.png",
		},
		night: {
			description: "Snow Showers",
			image: "http://openweathermap.org/img/wn/13n@2x.png",
		},
	},
	"95": {
		day: {
			description: "Thunderstorm",
			image: "http://openweathermap.org/img/wn/11d@2x.png",
		},
		night: {
			description: "Thunderstorm",
			image: "http://openweathermap.org/img/wn/11n@2x.png",
		},
	},
	"96": {
		day: {
			description: "Light Thunderstorms With Hail",
			image: "http://openweathermap.org/img/wn/11d@2x.png",
		},
		night: {
			description: "Light Thunderstorms With Hail",
			image: "http://openweathermap.org/img/wn/11n@2x.png",
		},
	},
	"99": {
		day: {
			description: "Thunderstorm With Hail",
			image: "http://openweathermap.org/img/wn/11d@2x.png",
		},
		night: {
			description: "Thunderstorm With Hail",
			image: "http://openweathermap.org/img/wn/11n@2x.png",
		},
	},
};
