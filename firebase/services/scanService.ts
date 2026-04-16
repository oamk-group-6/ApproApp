import {doc, getDoc, runTransaction, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Scan } from "../types/scan"

export const scanQrCode = async (userId: string, qrCodeId: string, eventId: string): Promise<{ success: boolean; message: string}> => {
    try {
        const qrRef = doc(db, "qrcodes", qrCodeId);
        const qrSnap = await getDoc(qrRef);

        if (!qrSnap.exists()) {
            return {
                success: false, 
                message: "QR code does not exist",
            };
        }

        const qrData = qrSnap.data();

        if (!qrData.active) {
            return {
                success: false,
                message: "QR code is inactive",
            };
        }

        if (qrData.eventId !== eventId) {
            return {
                success: false,
                message: "QR ei kuulu tähän tapahtumaan",
            };
        }

        if (!qrData.barId) {
            return {
                success: false,
                message: "QR missing barId",
            };
        }

        const stampId = `${qrData.barId}_${eventId}`
        const stampRef = doc(db, "users", userId, "stamps", stampId)

        const scanId = `${userId}_${qrData.barId}_${eventId}`;
        const scanRef = doc(db, "scans", scanId)

        await runTransaction(db, async (transaction) => {
            const scanSnap = await transaction.get(scanRef)

            if (scanSnap.exists()) {
                throw new Error("QR code already scanned");
            }

            const stampSnap = await transaction.get(stampRef);

            if (stampSnap.exists()) {
                throw new Error("Leima jo olemassa tässä tapahtumassa");
            }

            const scanData: Omit<Scan, "scannedAt"> & { scannedAt: any } = {
                userId,
                qrId: qrCodeId,
                barId: qrData.barId,
                eventId: eventId,
                scannedAt: serverTimestamp(),
            };

            transaction.set(scanRef, scanData);

            transaction.set(stampRef, {
                barId: qrData.barId,
                eventId: eventId,
                createdAt: serverTimestamp()
            })
        });

        return {
            success: true,
            message: "Scan successful",
        };
    } catch (error: any) {
        console.error("Error scanning QR:", error);

        return {
            success: false,
            message: error.message || "Scan failed"
        };
    }
};