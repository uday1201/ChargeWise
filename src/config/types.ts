export interface Tab {
    id: string;
    label: string;
    icon?: string;
}

export type SourceType = "Wind" | "Solar" | "Hydro" | "Fossil" | "Nuclear";

export interface EnergyData {
    "% Clean Energy": number;
    Date: string; // Format: "YYYY-MM-DD"
    "Day of Week": string; // Example: "Monday"
    Latitude: number;
    "Load (0-100%)": number;
    Longitude: number;
    "Price (per kWh)": number; // Price per kilowatt-hour
    "Source (Primary)": SourceType;
    Time: string; // Format: "YYYY-MM-DD HH:MM:SS"
    Timezone: string; // Example: "UTC"
}