// ============================================
//  SEVA 24 – FULL SMS SERVER (FAST2SMS)
//  WITH ERROR & SUCCESS LOGS FOR RENDER
// ============================================

import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ============================================
//  ROOT CHECK ROUTE
// ============================================
app.get("/", (req, res) => {
    res.send("✅ Seva24 SMS Server Running Successfully");
});

// ============================================
//  SEND SMS API
// ============================================
app.post("/send-sms", async (req, res) => {
    try {
        const { mobile, message } = req.body;

        // Log request (Render will show this)
        console.log("📩 Incoming SMS Request:", req.body);

        if (!mobile || !message) {
            console.log("❌ Missing fields");
            return res.json({
                success: false,
                message: "Mobile & Message required",
            });
        }

        // Remove +91 if present
        const cleanNumber = mobile.replace("+91", "");

        // Fast2SMS API Key
        const apiKey = process.env.FAST2SMS_API_KEY;

        if (!apiKey) {
            console.log("❌ FAST2SMS_API_KEY missing in environment");
            return res.json({ success: false, message: "API Key missing" });
        }

        // ==== Call Fast2SMS API ====
        const response = await axios.post(
            "https://www.fast2sms.com/dev/bulkV2",
            {
                route: "v3",
                sender_id: "TXTIND", // ⚠ Replace with your approved DLT sender ID
                message: message,
                language: "english",
                numbers: cleanNumber,
            },
            {
                headers: {
                    authorization: apiKey,
                },
            }
        );

        // Success Log (visible in Render)
        console.log("✅ SMS Sent Successfully:", response.data);

        return res.json({
            success: true,
            message: "SMS Sent Successfully",
            data: response.data,
        });

    } catch (err) {
        // Error Log (visible in Render)
        console.log("❌ SMS Sending Error:", err.message);

        return res.json({
            success: false,
            message: "Error sending SMS",
            error: err.message,
        });
    }
});

// ============================================
//  START SERVER
// ============================================
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
    console.log(`🚀 Seva24 SMS Server Live on Port ${PORT}`);
});
