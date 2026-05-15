import { useEffect, useState } from "react";
import { CmsSettings, getSettings } from "./cms";

let cachedSettings: CmsSettings | null = null;
let inFlight: Promise<CmsSettings> | null = null;

export function useCmsSettings() {
  const [settings, setSettings] = useState<CmsSettings | null>(cachedSettings);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cachedSettings) {
      return;
    }

    if (!inFlight) {
      inFlight = getSettings().then((data) => {
        cachedSettings = data;
        return data;
      });
    }

    inFlight
      .then((data) => {
        setSettings(data);
      })
      .catch((err) => {
        setError(
          err instanceof Error ? err.message : "Failed to load settings",
        );
      });
  }, []);

  return { settings, error };
}
