export const MAX_QUERY_LENGTH: number;
export const MAX_DAILY_LOG_LENGTH: number;
export const MAX_CLOCK_NOTE_LENGTH: number;

export function clockInOut(options: {
  action: string;
  location: { lat: number; lng: number } | null;
  note?: string;
  token: string;
}): Promise<any>;

export function submitDailyLog(
  log: {
    customer: string;
    jobNumber: string;
    hours: number;
    workCompleted: string;
    issues: string;
    photos?: string[];
  },
  token: string
): Promise<any>;

export function askPhoenixAI(
  query: string,
  agents?: string[],
  token?: string | null
): Promise<any>;

export function getCurrentLocation(): Promise<{ lat: number; lng: number } | null>;

