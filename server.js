// ==========================================
//  SEVA24 – TWILIO SMS SERVER (100% Working)
// ==========================================
import express from "express";
import cors from "cors";
import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Twilio Config
const client = twilio(
    process.env.ACCOUNT_SID,
    process.env.AUTH_TOKEN
);

// Root test
app.get("/", (req, res) => {
    res.send("✅ Seva24 Twilio SMS Server Running Successfully");
});

// SEND SMS API
app.post("/send-sms", async (req, res) => {
    try {
        const { mobile, message } = req.body;

        console.log("📩 Incoming SMS Request:", req.body);

        if (!mobile || !message) {
            return res.json({
                success: false,
                message: "Mobile number and message required"
            });
        }

        // Convert to +91 format
        let phone = mobile.toString();
        if (!phone.startsWith("+91")) {
            phone = "+91" + phone;
        }

        // Send SMS via Twilio
        const response = await client.messages.create({
            body: message,
            to: phone,
            from: process.env.TWILIO_PHONE
        });

        console.log("✅ Twilio SMS Sent:", response.sid);

        return res.json({
            success: true,
            sid: response.sid,
            message: "SMS sent successfully"
        });

    } catch (err) {
        console.log("❌ Twilio SMS Error:", err.message);

        return res.json({
            success: false,
            error: err.message
        });
    }
});

// Start Server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Twilio SMS Server Running on port ${PORT}`);
});
