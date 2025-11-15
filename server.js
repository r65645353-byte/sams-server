// ============================
//  SMS SERVER (FAST2SMS)
// ============================
import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ============================
//  SEND SMS API (POST)
// ============================
app.post("/send-sms", async (req, res) => {
    try {
        const { mobile, message } = req.body;

        if (!mobile || !message) {
            return res.json({ success: false, message: "Mobile & Message required" });
        }

        const apiKey = process.env.FAST2SMS_API_KEY;

        const response = await axios.post(
            "https://www.fast2sms.com/dev/bulkV2",
            {
                route: "v3",
                sender_id: "TXTIND",
                message: message,
                language: "english",
                numbers: mobile
            },
            {
                headers: {
                    "authorization": apiKey,
                    "Content-Type": "application/json"
                }
            }
        );

        return res.json({ success: true, data: response.data });

    } catch (err) {
        return res.json({ success: false, error: err.message });
    }
});

// ============================
//  START SERVER
// ============================
app.listen(process.env.PORT, () =>
    console.log(`🚀 SMS Server running on port ${process.env.PORT}`)
);
