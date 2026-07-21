"use client";
import { useEffect, useState } from "react";

interface Weather {
  temp: number;
  windspeed: number;
  weathercode: number;
}

const WX_CODES: Record<number, { label: string; nautical: string }> = {
  0:  { label: "Clear Sky",       nautical: "Clear and favorable. All hands may relax." },
  1:  { label: "Mostly Clear",    nautical: "Light cloud cover. Visibility good." },
  2:  { label: "Partly Cloudy",   nautical: "Patchy cloud. Maintain watch." },
  3:  { label: "Overcast",        nautical: "Full overcast. Instruments only." },
  45: { label: "Foggy",           nautical: "Dense fog advisory. Reduce speed. Sound horn." },
  48: { label: "Icy Fog",         nautical: "Freezing fog. All hands on deck." },
  51: { label: "Light Drizzle",   nautical: "Light drizzle. Secure loose equipment." },
  61: { label: "Light Rain",      nautical: "Rain in progress. Batten down the hatches." },
  63: { label: "Moderate Rain",   nautical: "Steady rain. Non-essential crew below deck." },
  65: { label: "Heavy Rain",      nautical: "Heavy rain. All crew below. Captain on bridge." },
  71: { label: "Light Snow",      nautical: "Snow on the way. Unprecedented for Austin." },
  80: { label: "Rain Showers",    nautical: "Showers passing through. Brief interruption." },
  95: { label: "Thunderstorm",    nautical: "Storm conditions. Emergency protocols active." },
};

function getWxInfo(code: number) {
  return WX_CODES[code] ?? { label: "Unknown", nautical: "Conditions unclear. Proceed with caution." };
}

export default function WeatherDispatch() {
  const [wx, setWx] = useState<Weather | null>(null);

  useEffect(() => {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=30.2672&longitude=-97.7431&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph")
      .then((r) => r.json())
      .then((d) => {
        const cw = d.current_weather;
        setWx({ temp: Math.round(cw.temperature), windspeed: Math.round(cw.windspeed), weathercode: cw.weathercode });
      })
      .catch(() => {});
  }, []);

  if (!wx) return null;

  const info = getWxInfo(wx.weathercode);

  return (
    <div style={{
      border: "2px solid var(--border)",
      background: "var(--card-bg)",
      padding: "20px 24px",
      position: "relative",
      overflow: "hidden",
      maxWidth: "380px",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "#C0392B" }} />
      <div style={{ position: "absolute", inset: "6px", border: "1px solid var(--border)", pointerEvents: "none", opacity: 0.25 }} />

      <div style={{ fontFamily: "Courier New, monospace", fontSize: "0.5rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#C0392B", marginBottom: "12px" }}>
        Station Report — Austin, TX
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "14px" }}>
        <div>
          <div style={{ fontFamily: "Courier New, monospace", fontSize: "0.48rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "2px" }}>Temp</div>
          <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "1.4rem", color: "var(--fg)", lineHeight: 1 }}>{wx.temp}°</div>
        </div>
        <div>
          <div style={{ fontFamily: "Courier New, monospace", fontSize: "0.48rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "2px" }}>Wind</div>
          <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "1.4rem", color: "var(--fg)", lineHeight: 1 }}>{wx.windspeed}</div>
          <div style={{ fontFamily: "Courier New, monospace", fontSize: "0.45rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>mph</div>
        </div>
        <div>
          <div style={{ fontFamily: "Courier New, monospace", fontSize: "0.48rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "2px" }}>Sky</div>
          <div style={{ fontFamily: "Courier New, monospace", fontSize: "0.6rem", color: "var(--accent)", lineHeight: 1.3 }}>{info.label}</div>
        </div>
      </div>

      <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "0.72rem", color: "var(--muted)", lineHeight: 1.6, borderTop: "1px solid var(--border)", paddingTop: "10px" }}>
        "{info.nautical}"
      </div>
    </div>
  );
}
