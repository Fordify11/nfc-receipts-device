// pages/api/create-token.js
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { nanoid } from "nanoid"; // make sure to install this!

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { items, total, terminal } = req.body;

    if (!items || !total || !terminal) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const token = nanoid(16);

    const docRef = await addDoc(collection(db, "transactions"), {
      token,
      terminal,
      total,
      items,
      used: false,
      createdAt: Timestamp.now(),
    });

    return res.status(200).json({
      success: true,
      token,
      url: `https://nfc-receipts.vercel.app/r/${token}`,
      id: docRef.id,
    });
  } catch (error) {
    console.error("Error adding document:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
