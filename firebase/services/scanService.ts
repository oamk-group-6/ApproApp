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

        const scanId = `${userId}_${qrCodeId}`;
        const scanRef = doc(db, "scans", scanId)

        const stampRef = doc(db, "users", userId, "stamps", qrData.barId)

        await runTransaction(db, async (transaction) => {
            const scanSnap = await transaction.get(scanRef)

            if (scanSnap.exists()) {
                throw new Error("QR code already scanned");
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
                eventId: eventId || null,
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