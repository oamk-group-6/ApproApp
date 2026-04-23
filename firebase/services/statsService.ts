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

const DEGREES = [
    { name: "Fuksi", required: 1 },
    { name: "Kandi", required: 2 },
    { name: "Maisteri", required: 3 },
    { name: "DI", required: 4 },
    { name: "Professori", required: 5 },
    { name: "Tohtori", required: 6 },
];

export const getDegreeCounts = async () => {
    const scansSnap = await getDocs(collection(db, "scans"));
    const scans = scansSnap.docs.map(d => d.data());

    const degreeCounts: Record<string, number> = {};
    DEGREES.forEach(d => (degreeCounts[d.name] = 0));

    // userId -> eventId -> count
    const userEventMap: Record<string, Record<string, number>> = {};

    scans.forEach(scan => {
        const userId = scan.userId;
        const eventId = scan.eventId;

        if (!userId || !eventId) return;

        if (!userEventMap[userId]) {
            userEventMap[userId] = {};
        }

        if (!userEventMap[userId][eventId]) {
            userEventMap[userId][eventId] = 0;
        }

        userEventMap[userId][eventId]++;
    });

    // käydään läpi kaikki user-event -kombot
    Object.values(userEventMap).forEach(eventMap => {
        Object.values(eventMap).forEach(count => {
            const degree = [...DEGREES]
                .slice()
                .reverse()
                .find(d => count >= d.required);

            if (degree) {
                degreeCounts[degree.name]++;
            }
        });
    });
    const total = Object.values(degreeCounts).reduce((a, b) => a + b, 0);

    const degreePercentages: Record<string, number> = {};

    Object.entries(degreeCounts).forEach(([key, value]) => {
        degreePercentages[key] = total === 0 ? 0 : (value / total) * 100;
    });

    return degreePercentages;
};

export const getCumulativeScansPerEventPerHour = async () => {
    const scansSnap = await getDocs(collection(db, "scans"));
    const scans = scansSnap.docs.map(d => d.data());

    const raw: Record<string, Record<number, number>> = {};

    for (const scan of scans) {
        const eventId = scan.eventId;
        const timestamp = scan.scannedAt;

        if (!eventId || !timestamp) continue;

        const date = timestamp?.toDate?.();
        if (!date) continue;

        const hour = date.getHours();

        if (hour < 10 || hour > 23) continue;

        if (!raw[eventId]) {
            raw[eventId] = {};
            for (let h = 10; h <= 23; h++) {
                raw[eventId][h] = 0;
            }
        }

        raw[eventId][hour]++;
    }
    // 2. cumulative transform
    const result: Record<string, Record<number, number>> = {};

    for (const [eventId, hours] of Object.entries(raw)) {
        result[eventId] = {};

        let runningTotal = 0;

        for (let h = 10; h <= 23; h++) {
            runningTotal += hours[h] || 0;
            result[eventId][h] = runningTotal;
        }
    }

    return result;
};



export const getScansPerHourPerEvent = async () => {
    const scansSnap = await getDocs(collection(db, "scans"));
    const scans = scansSnap.docs.map(d => d.data());

    const result: Record<string, Record<number, number>> = {};

    for (const scan of scans) {
        const eventId = scan.eventId;
        const timestamp = scan.scannedAt;

        if (!eventId || !timestamp) continue;

        const date = timestamp?.toDate?.();
        if (!date) continue;

        const hour = date.getUTCHours() + 2;

        if (hour < 10 || hour > 23) continue;

        if (!result[eventId]) {
            result[eventId] = {};
            for (let h = 10; h <= 23; h++) {
                result[eventId][h] = 0;
            }
        }

        result[eventId][hour]++;
    }

    return result;
};
