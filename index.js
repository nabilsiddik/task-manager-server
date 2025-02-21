const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;


const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://my-project-22db9.firebaseapp.com",
    "https://my-project-22db9.web.app",
  ],
  credentials: true,
  optionalSuccessStatus: 200,
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.3u9wf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// Create MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {

    // await client.connect();
    const taskCollection = client.db("task-manager").collection("tasks");

    app.get("/", (req, res) => {
      res.send("Servicer is running perfectly");
    });


    // Post a task
    app.post('/task', async(req, res) => {
      const task = req.body

      const result = await taskCollection.insertOne({
        ...task,
        timeStamp: new Date(),
        category: 'to-do'
      })
      res.send(result)
    })

    // get all tasks
    app.get('/tasks', async(req, res) => {
      const result = await taskCollection.find().toArray()
      res.send(result)
    })


  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



