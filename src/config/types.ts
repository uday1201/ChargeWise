export interface Tab {
    id: string;
    label: string;
    icon?: string;
}

export type SourceType = "wimd" | "solar" | "hydro" | "coal" | "nuclear";

export interface EnergyData {
    Date: string,
    "Day of Week": string,
    Latitude: number,
    Longitude: number,
    Timezone: string,
    "Data Series": EnergyDataPoint[];
}

export interface EnergyDataPoint {
    "% Clean Energy": number;
    Load: number;
    "Price (per kWh)": number; // Price per kilowatt-hour
    "Source (Primary)": string;
    Time: string; // Format: "YYYY-MM-DD HH:MM:SS"
}