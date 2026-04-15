import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

export const getStats = async () => {
    const scansSnap = await getDocs(collection(db, "scans"))
    const barsSnap = await getDocs(collection(db, "bars"))

    const scans = scansSnap.docs.map(d => d.data())
    const bars = barsSnap.docs.map(d => ({
        id: d.id,
        ...d.data()
    }))
    return { scans, bars }
}

export const scansPerBar = (scans: any[]) => {
    const counts: Record<string, number> = {}

    scans.forEach(scan => {
        const barId = scan.barId

        if(!counts[barId]) {
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