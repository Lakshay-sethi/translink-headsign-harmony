import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

app.get("/proxy/gtfs", async (req, res) => {
  const apiUrl = `https://gtfsapi.translink.ca/v3/gtfsposition?apikey=${process.env.TRANSLINK_API_KEY}`;
  try {
    const response = await fetch(apiUrl, {
      headers: { "Accept": "application/x-protobuf" },
    });
    const buffer = await response.arrayBuffer();
    res.set("Content-Type", "application/x-protobuf");
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error("Error in proxy:", error);
    res.status(500).send("Error fetching GTFS data");
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});