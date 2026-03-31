

export interface User {
    uid: string
    email: string
    createdAt: Date
    role: "basic" | "admin"
}