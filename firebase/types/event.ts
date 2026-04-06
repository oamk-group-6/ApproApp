

export interface Event {
    id: string
    title: string
    description: string
    date: string
    location: string
    status: 'tuleva' | 'nykyinen' | 'mennyt'
}

export type CreateEvent = Omit<Event, "id">;