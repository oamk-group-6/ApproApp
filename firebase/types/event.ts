

export interface Event {
    id: string
    title: string
    description: string
    date: string
    location: string
    status: 'tuleva' | 'nykyinen' | 'mennyt'
    joinCode: string
    imageUrl: string
}

export type CreateEvent = Omit<Event, "id">;