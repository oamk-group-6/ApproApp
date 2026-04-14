import { Timestamp } from "firebase/firestore";

export interface Scan {
    userId: string
    qrId: string
    barId: string
    scannedAt: Timestamp
}