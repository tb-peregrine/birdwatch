import { format } from "date-fns"

const TINYBIRD_API_URL = process.env.NEXT_PUBLIC_TINYBIRD_API_URL
const TINYBIRD_API_TOKEN = process.env.NEXT_PUBLIC_TINYBIRD_API_TOKEN

export interface TimeseriesData {
    date: string
    count: number
}

export interface TotalData {
    total_birds: number
    total_checklists: number
    total_locations: number
    total_species: number
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
        `${TINYBIRD_API_URL}/v0/pipes/get_timeseries_data.json?${searchParams.toString()}`,
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

    const response = await fetch(
        `${TINYBIRD_API_URL}/v0/pipes/get_total_data.json?${searchParams.toString()}`,
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