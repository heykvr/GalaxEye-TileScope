const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
const mongoURI = process.env.DATABASE_URL || `mongodb://mongo:27017/geoData`;

const featureSchema = new mongoose.Schema({
  type: { type: String, required: true },
  properties: {
    fill: { type: String, required: true },
  },
  geometry: {
    type: { type: String, required: true },
    coordinates: { type: [[[Number]]], required: true },
  },
});

const Feature = mongoose.model("Feature", featureSchema);

async function connectDB() {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

app.post("/api/tiles/intersect", async (req, res) => {
  try {
    const { aoi } = req.body;
    if (!aoi || !aoi.coordinates) {
      return res.status(400).json({ error: "Invalid AOI" });
    }

    const query = {
      geometry: {
        $geoIntersects: {
          $geometry: {
            type: "Polygon",
            coordinates: aoi.coordinates,
          },
        },
      },
    };

    const tiles = await Feature.find(query);
    res.json(tiles);
  } catch (error) {
    console.error("Error finding intersecting tiles:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on port ${PORT}`);
});
