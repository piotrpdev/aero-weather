# Aero Weather

Weather app with a [Windows Aero][aero] inspired design.

Design is
["attempt at designing the weather app"][design]
by [kilobyte (@1000kilobytes)](https://x.com/1000kilobytes).

![preview]

## Development

> [!WARNING]
> Only tested on **Windows 11 23H2**.

Make sure you have the [Tauri prerequisites][tauri-pre] installed.

Then run the following:

```bash
npm install
npm run tauri dev
```

## Licenses

This project is licensed under the [GNU GPL v3.0][license].

Made using the following resources:

| Resource                                  | License                           |
|:------------------------------------------|:----------------------------------|
| [kilobyte's Weather App Design][design]   | ?                                 |
| [`tauri-plugin-decorum` Example][decorum] | [MIT][decorum-license]            |
| [WMO Code Descriptions][wmo]              | ?                                 |
| [Nominatim Reverse Geocoding API][geo]    | [ODbL][geo-license][^1] (data)    |
| [Open-Meteo Forecast API][meteo]          | [CC BY 4.0][meteo-license] (data) |
| [Realll Weather Icons][realll]            | ?                                 |
| Weather Backgrounds                       | [Unsplash][unsplash]              |
| [Compass Image][compass]                  | [Freepik Free][freep-license][^2] |

[^1]: OpenStreetMap® is open data, licensed under the
[Open Data Commons Open Database License (ODbL)][geo-license] by the
[OpenStreetMap Foundation (OSMF)][osmf].

[^2]: ["Realistic map compass background"][compass] designed by [Freepik][freepik].

[preview]: ./public/preview.png
[aero]: https://en.wikipedia.org/wiki/Windows_Aero
[tauri-pre]: https://v2.tauri.app/start/prerequisites/
[license]: ./LICENSE
[design]: https://x.com/1000kilobytes/status/1825361813774708910/
[wmo]: https://gist.github.com/stellasphere/9490c195ed2b53c707087c8c2db4ec0c
[geo]: https://nominatim.org/release-docs/latest/api/Overview/
[geo-license]: https://www.openstreetmap.org/copyright
[osmf]: https://osmfoundation.org/
[meteo]: https://open-meteo.com/en/docs
[meteo-license]: https://open-meteo.com/en/license
[decorum]: https://github.com/clearlysid/tauri-plugin-decorum
[decorum-license]: https://github.com/clearlysid/tauri-plugin-decorum/blob/main/LICENSE
[realll]: https://xdaforums.com/t/collection-weather-icon-sets-for-uccw-2-0.1922149/
[unsplash]: https://unsplash.com/license
[compass]: https://www.freepik.com/free-vector/realistic-map-compass-background_1631670.htm
[freepik]: http://www.freepik.com
[freep-license]: http://www.freepik.com/terms_of_use
