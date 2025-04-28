import { v4 as uuidv4 } from "uuid"

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