import { format } from "date-fns"

const TINYBIRD_API_URL = process.env.NEXT_PUBLIC_TINYBIRD_API_URL
const TINYBIRD_API_TOKEN = process.env.NEXT_PUBLIC_TINYBIRD_API_TOKEN

interface TimeseriesData {
    day: string
    species: string
    species_count: number
    birds_count: number
}

interface TotalData {
    total_birds?: number
    total_checklists?: number
    total_locations?: number
    total_species?: number
}

interface BirdSighting {
    timestamp: string
    species: string
    location: string
    quantity: number
    checklist_id: string
    user_id: string
}

export async function sendBirdSightings(sightings: BirdSighting[]) {
    const ndjson = sightings.map(sighting => JSON.stringify(sighting)).join("\n")

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
        throw new Error("Failed to send bird sightings")
    }

    return response.json()
}

export async function fetchTimeseriesData(params: {
    startDate?: Date
    endDate?: Date
    locations?: string[]
}) {
    const searchParams = new URLSearchParams()

    if (params.startDate) {
        searchParams.set("start_date", format(params.startDate, "yyyy-MM-dd"))
    }
    if (params.endDate) {
        searchParams.set("end_date", format(params.endDate, "yyyy-MM-dd"))
    }
    if (params.locations?.length) {
        searchParams.set("location", params.locations.join(","))
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
    locations?: string[]
}) {
    const searchParams = new URLSearchParams()

    if (params.startDate) {
        searchParams.set("start_date", format(params.startDate, "yyyy-MM-dd"))
    }
    if (params.endDate) {
        searchParams.set("end_date", format(params.endDate, "yyyy-MM-dd"))
    }
    if (params.locations?.length) {
        searchParams.set("location", params.locations.join(","))
    }

    const [birdsResponse, checklistsResponse, locationsResponse, speciesResponse] = await Promise.all([
        fetch(
            `${TINYBIRD_API_URL}/v0/pipes/get_total_birds.json?${searchParams.toString()}`,
            {
                headers: {
                    Authorization: `Bearer ${TINYBIRD_API_TOKEN}`,
                },
            }
        ),
        fetch(
            `${TINYBIRD_API_URL}/v0/pipes/get_total_checklists.json?${searchParams.toString()}`,
            {
                headers: {
                    Authorization: `Bearer ${TINYBIRD_API_TOKEN}`,
                },
            }
        ),
        fetch(
            `${TINYBIRD_API_URL}/v0/pipes/get_total_locations.json?${searchParams.toString()}`,
            {
                headers: {
                    Authorization: `Bearer ${TINYBIRD_API_TOKEN}`,
                },
            }
        ),
        fetch(
            `${TINYBIRD_API_URL}/v0/pipes/get_total_species.json?${searchParams.toString()}`,
            {
                headers: {
                    Authorization: `Bearer ${TINYBIRD_API_TOKEN}`,
                },
            }
        ),
    ])

    if (!birdsResponse.ok || !checklistsResponse.ok || !locationsResponse.ok || !speciesResponse.ok) {
        throw new Error("Failed to fetch total data")
    }

    const [birdsData, checklistsData, locationsData, speciesData] = await Promise.all([
        birdsResponse.json(),
        checklistsResponse.json(),
        locationsResponse.json(),
        speciesResponse.json(),
    ])

    return {
        total_birds: birdsData.data[0]?.total_birds,
        total_checklists: checklistsData.data[0]?.total_checklists,
        total_locations: locationsData.data[0]?.total_locations,
        total_species: speciesData.data[0]?.total_species,
    } as TotalData
} 