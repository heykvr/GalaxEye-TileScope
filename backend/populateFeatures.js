const mongoose = require("mongoose");
const fs = require("fs");


const filePath = "./features.json";


const mongoURI = "mongodb://mongo:27017/geoData";


const featureSchema = new mongoose.Schema({
  type: { type: String, required: true },
  properties: { fill: { type: String, required: true } },
  geometry: {
    type: { type: String, required: true },
    coordinates: { type: [[[Number]]] },
  },
});

const Feature = mongoose.model("Feature", featureSchema);

async function storeData() {
  try {

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));


    await Feature.insertMany(jsonData.features);
    console.log("Data successfully stored in MongoDB");

    await mongoose.connection.close();
  } catch (error) {
    console.error("Error:", error);
  }
}

storeData();