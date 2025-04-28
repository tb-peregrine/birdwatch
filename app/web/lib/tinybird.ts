import { format } from "date-fns"

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
            body: JSON.stringify(data),
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

    const [birds, checklists, locations, species] = await Promise.all([
        fetch(`${TINYBIRD_API_URL}/v0/pipes/get_total_birds.json?${searchParams.toString()}`, {
            headers: { Authorization: `Bearer ${TINYBIRD_API_TOKEN}` },
        }),
        fetch(`${TINYBIRD_API_URL}/v0/pipes/get_total_checklists.json?${searchParams.toString()}`, {
            headers: { Authorization: `Bearer ${TINYBIRD_API_TOKEN}` },
        }),
        fetch(`${TINYBIRD_API_URL}/v0/pipes/get_total_locations.json?${searchParams.toString()}`, {
            headers: { Authorization: `Bearer ${TINYBIRD_API_TOKEN}` },
        }),
        fetch(`${TINYBIRD_API_URL}/v0/pipes/get_total_species.json?${searchParams.toString()}`, {
            headers: { Authorization: `Bearer ${TINYBIRD_API_TOKEN}` },
        }),
    ])

    if (!birds.ok || !checklists.ok || !locations.ok || !species.ok) {
        throw new Error("Failed to fetch total data")
    }

    const [birdsData, checklistsData, locationsData, speciesData] = await Promise.all([
        birds.json(),
        checklists.json(),
        locations.json(),
        species.json(),
    ])

    return {
        total_birds: birdsData.data[0]?.total_birds || 0,
        total_checklists: checklistsData.data[0]?.total_checklists || 0,
        total_locations: locationsData.data[0]?.total_locations || 0,
        total_species: speciesData.data[0]?.total_species || 0,
    } as TotalData
} 