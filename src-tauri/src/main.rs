// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;

#[cfg(any(target_os = "windows", target_os = "macos"))]
use tauri_plugin_decorum::WebviewWindowExt;

#[cfg(target_os = "windows")]
use window_vibrancy::apply_acrylic;

#[cfg(target_os = "macos")]
use window_vibrancy::apply_vibrancy;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_decorum::init())
        .setup(|app| {
            #[cfg(any(target_os = "windows", target_os = "macos"))]
            {
                // Create a custom titlebar for main window
                // On Windows this will hide decoration and render custom window controls
                // On macOS it expects a hiddenTitle: true and titleBarStyle: overlay
                let main_window = app.get_webview_window("main").unwrap();

                main_window.create_overlay_titlebar().unwrap();

                #[cfg(target_os = "windows")]
                apply_acrylic(&main_window, Some((18, 18, 18, 125)))
                    .expect("Unsupported platform! 'apply_blur' is only supported on Windows");

                // Some macOS-specific helpers
                #[cfg(target_os = "macos")]
                {
                    apply_vibrancy(&main_window, NSVisualEffectMaterial::HudWindow, None, None)
                        .expect(
                            "Unsupported platform! 'apply_vibrancy' is only supported on macOS",
                        );

                    // Set a custom inset to the traffic lights
                    main_window.set_traffic_lights_inset(12.0, 16.0).unwrap();

                    // Make window transparent without privateApi
                    // main_window.make_transparent().unwrap();

                    // Set window level
                    // NSWindowLevel: https://developer.apple.com/documentation/appkit/nswindowlevel
                    main_window.set_window_level(25).unwrap();
                }
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
