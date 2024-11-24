const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const dbName = 'geoData'; 
const collectionName = 'features'; 


app.post('/api/tiles/intersect', async (req, res) => {
  try {
    const { aoi } = req.body;
    console.log("aoi",aoi);
    if (!aoi || !aoi.coordinates) {
      return res.status(400).json({ error: 'Invalid AOI' });
    }

    
    await client.connect();
    const db = client.db(dbName);
    const collections = await db.listCollections().toArray();
  
    console.log('Collections:', collections.map(col => col.name));
    const tilesCollection = db.collection(collectionName);

 
    const query = {
      geometry: {
        $geoIntersects: {
          $geometry: {
            type: 'Polygon',
            coordinates: aoi.coordinates,
          },
        },
      },
    };


    const tiles = await tilesCollection.find(query).toArray();

    res.json(tiles);
  } catch (error) {
    console.error('Error finding intersecting tiles:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await client.close();
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
