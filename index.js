const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const cors = require("cors");
require("dotenv").config();

app.use(cors());
app.use(express.json());

console.log(process.env.DB_USERNAME);

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.3f1y3cg.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const collegesCollection = client.db("collegeDB").collection("colleges");


    app.get("/all-colleges", async(req, res) => {
        const classes = await collegesCollection.find().toArray();
        res.send(classes)
    })
    
    app.get("/searchColleges/:search", async(req, res) => {
        const searchText = req.params.search
        const searchColleges = await collegesCollection.find({collegeName: {$regex: searchText, $options: "i"}}).toArray();
        res.send(searchColleges)
    })
    app.get('/threeColleges', async (req, res) => {
        const threeColleges = await  collegesCollection.find().limit(3).toArray();
        res.send(threeColleges)
    })
    app.get('/college-details/:id', async (req, res) => {
      const id = req.params.id;
      const singleCollege = await collegesCollection.findOne({_id: new ObjectId(id)});
      res.send(singleCollege);
    })











    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('my college server is running!')
})

app.listen(port, () => {
  console.log(`my college server listening on port ${port}`)
})