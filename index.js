require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const port = process.env.port || 7000;


const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('client server ok')
})

app.listen(port, () => {
    console.log('port is running:', port);
})

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@express-explore.use1c.mongodb.net/?retryWrites=true&w=majority&appName=express-explore`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


async function run() {
    try {
        await client.connect();
        const postCollection = client.db('mindflow').collection('post');

        app.post('/post', async (req, res) => {
            const query = req.body;

            const result = await postCollection.insertOne(query);
            res.send(result);
        })

        app.get('/post', async(req, res) => {
            const cursor = await postCollection.find().toArray();
            res.send(cursor);
        })



    } finally {

    }
}
run().catch(console.dir);