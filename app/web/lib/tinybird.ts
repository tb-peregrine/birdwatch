import { format } from "date-fns"
import { v4 as uuidv4 } from "uuid"

const TINYBIRD_API_URL = process.env.NEXT_PUBLIC_TINYBIRD_API_URL
const TINYBIRD_API_TOKEN = process.env.NEXT_PUBLIC_TINYBIRD_API_TOKEN

export interface TimeseriesData {
    day: string
    species: string
    species_count: number
    birds_count: number
}

export interface TotalData {
    total_birds: number
    total_checklists: number
    total_locations: number
    total_species: number
}

export interface ChecklistData {
    timestamp: string
    location: string
    species: string
    quantity: number
    checklist_id: string
    user_id?: string
}

export async function sendChecklistData(data: ChecklistData) {
    const response = await fetch(
        `${TINYBIRD_API_URL}/v0/events?name=bird_sightings`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${TINYBIRD_API_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                timestamp: data.timestamp,
                location: data.location,
                species: data.species,
                quantity: data.quantity,
                checklist_id: data.checklist_id,
                user_id: data.user_id
            }),
        }
    )

    if (!response.ok) {
        throw new Error("Failed to send checklist data")
    }

    return response.json()
}

export async function fetchTimeseriesData(params: {
    startDate?: Date
    endDate?: Date
    location?: string
    user_id?: string
}) {
    const searchParams = new URLSearchParams()

    if (params.startDate) {
        searchParams.set("start_date", format(params.startDate, "yyyy-MM-dd"))
    }
    if (params.endDate) {
        searchParams.set("end_date", format(params.endDate, "yyyy-MM-dd"))
    }
    if (params.location) {
        searchParams.set("location", params.location)
    }
    if (params.user_id) {
        searchParams.set("user_id", params.user_id)
    }

    const response = await fetch(
        `${TINYBIRD_API_URL}/v0/pipes/timeseries_species_by_day.json?${searchParams.toString()}`,
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
    return data.data as TimeseriesData[]
}

export async function fetchTotalData(params: {
    startDate?: Date
    endDate?: Date
    location?: string
    user_id?: string
}) {
    const searchParams = new URLSearchParams()

    if (params.startDate) {
        searchParams.set("start_date", format(params.startDate, "yyyy-MM-dd"))
    }
    if (params.endDate) {
        searchParams.set("end_date", format(params.endDate, "yyyy-MM-dd"))
    }
    if (params.location) {
        searchParams.set("location", params.location)
    }
    if (params.user_id) {
        searchParams.set("user_id", params.user_id)
    }

    const response = await fetch(
        `${TINYBIRD_API_URL}/v0/pipes/get_totals.json?${searchParams.toString()}`,
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
    return data.data[0] as TotalData
} 