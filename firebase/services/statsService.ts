import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

export const getStats = async () => {
    const scansSnap = await getDocs(collection(db, "scans"))
    const barsSnap = await getDocs(collection(db, "bars"))
    const qrSnap = await getDocs(collection(db, "qrcodes"))
    const eventsSnap = await getDocs(collection(db, "events"))

    const scans = scansSnap.docs.map(d => d.data())

    const bars = barsSnap.docs.map(d => ({
        id: d.id,
        ...d.data()
    }))

    const qrcodes = qrSnap.docs.map(d => ({
        id: d.id,
        ...d.data()
    }))

    const events = eventsSnap.docs.map(d => ({
        id: d.id,
        ...d.data()
    }))

    return { scans, bars, qrcodes, events }
}

export const scansPerBar = (scans: any[]) => {
    const counts: Record<string, number> = {}

    scans.forEach(scan => {
        const barId = scan.barId

        if (!counts[barId]) {
            counts[barId] = 0
        }

        counts[barId]++
    })
    return counts
}

export const mapBarNames = (
    counts: Record<string, number>,
    bars: any[]
) => {
    return Object.entries(counts).map(([barId, count]) => {
        const bar = bars.find(b => b.id === barId)

        return {
            name: bar?.name || "Tuntematon",
            count,
        }
    })
}

export const scansPerEvent = (
    scans: any[],
    qrcodes: any[]
) => {
    const qrToEvent: Record<string, string> = {}

    qrcodes.forEach(qr => {
        console.log("QR:", qr)
        qrToEvent[qr.id] = qr.eventId
    })

    const counts: Record<string, number> = {}

    scans.forEach(scan => {
        const eventId = qrToEvent[scan.qrId]
        if (!eventId) return

        if (!counts[eventId]) {
            counts[eventId] = 0
        }
        counts[eventId]++
    })
    return counts
}

export const mapEventNames = (
    counts: Record<string, number>,
    events: any[]
) => {
    return Object.entries(counts).map(([eventId, count]) => {
        const event = events.find(e => e.id === eventId)

        return {
            name: event?.title || "Tuntematon tapahtuma",
            count,
        }
    })
}

export const getTopEvents = (data: any[], limit: number = 5) => {
    return data
        .sort((a, b) => b.count - a.count)
        .slice(0, limit)
}