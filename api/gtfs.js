import fetch from "node-fetch";

export default async function handler(req, res) {
  const apiUrl = `https://gtfsapi.translink.ca/v3/gtfsposition?apikey=${process.env.TRANSLINK_API_KEY}`;

  try {
    const response = await fetch(apiUrl, {
      headers: { "Accept": "application/x-protobuf" },
    });

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();
    res.setHeader("Content-Type", "application/x-protobuf");
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error("Error in serverless function:", error);
    res.status(500).json({ error: "Error fetching GTFS data" });
  }
}