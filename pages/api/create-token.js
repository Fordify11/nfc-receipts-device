import { db } from "@/lib/firebase";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { nanoid } from "nanoid";

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

    // ✅ Use token as the Firestore document ID
    await setDoc(doc(db, "transactions", token), {
      terminal,
      total,
      items,
      used: false,
      createdAt: Timestamp.now()
    });

    return res.status(200).json({
      success: true,
      token,
      url: `https://nfc-receipts.vercel.app/r/${token}`,
      id: token, // Same as doc ID
    });
  } catch (error) {
    console.error("Error creating receipt:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
