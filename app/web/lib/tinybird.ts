const TINYBIRD_API_URL = process.env.NEXT_PUBLIC_TINYBIRD_API_URL
const TINYBIRD_API_TOKEN = process.env.NEXT_PUBLIC_TINYBIRD_API_TOKEN

export interface ChecklistData {
    timestamp: string
    location: string
    species: string
    quantity: number
    checklist_id: string
    user_id?: string
}

export interface TimeseriesData {
    day: string
    species: string
    birds_count: number
}

export interface TotalsData {
    total_birds: number
    total_species: number
    total_checklists: number
    total_locations: number
}

interface FilterParams {
    start_date?: string
    end_date?: string
    location?: string
}

export async function sendChecklistData(sightings: ChecklistData[]) {
    // Convert array of sightings to NDJSON format
    const ndjson = sightings.map(sighting => JSON.stringify(sighting)).join('\n')

    const response = await fetch(
        `${TINYBIRD_API_URL}/v0/events?name=bird_sightings`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${TINYBIRD_API_TOKEN}`,
                "Content-Type": "application/x-ndjson",
            },
            body: ndjson,
        }
    )

    if (!response.ok) {
        throw new Error("Failed to send checklist data")
    }

    return response.json()
}

export async function fetchTimeseriesData(params: FilterParams = {}): Promise<TimeseriesData[]> {
    const queryParams = new URLSearchParams()
    if (params.start_date) queryParams.append('start_date', params.start_date)
    if (params.end_date) queryParams.append('end_date', params.end_date)
    if (params.location) queryParams.append('location', params.location)

    const response = await fetch(
        `${TINYBIRD_API_URL}/v0/pipes/timeseries_species_by_day.json?${queryParams.toString()}`,
        {
            headers: {
                Authorization: `Bearer ${TINYBIRD_API_TOKEN}`,
            },
        }
    )

    if (!response.ok) {
        throw new Error("Failed to fetch timeseries data")
    }

    const data = await response.json()
    return data.data
}

export async function fetchTotalData(params: FilterParams = {}): Promise<TotalsData> {
    const queryParams = new URLSearchParams()
    if (params.start_date) queryParams.append('start_date', params.start_date)
    if (params.end_date) queryParams.append('end_date', params.end_date)
    if (params.location) queryParams.append('location', params.location)

    const response = await fetch(
        `${TINYBIRD_API_URL}/v0/pipes/get_totals.json?${queryParams.toString()}`,
        {
            headers: {
                Authorization: `Bearer ${TINYBIRD_API_TOKEN}`,
            },
        }
    )

    if (!response.ok) {
        throw new Error("Failed to fetch total data")
    }

    const data = await response.json()
    return data.data[0]
} 