import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import cors from 'cors';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS to allow requests from frontend
app.use(cors());

app.get('/api/ip', async (req, res) => {
    const ip = req.query.ip || req.headers['x-forwarded-for']?.split(',')[0];
    const apiKey = process.env.IPIFY_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'API key is missing in .env' });
    }

    const url = `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}${ip ? `&ipAddress=${ip}` : ''}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.code === 422 || data.messages) {
            return res.status(400).json({ error: 'Invalid IP address or domain' });
        }

        res.json(data);
    } catch (err) {
        console.error('Error fetching IP data:', err);
        res.status(500).json({ error: 'Failed to fetch IP data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
