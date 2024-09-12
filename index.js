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
        const usersCollection = client.db('mindflow').collection('users');

        // Post add and get
        app.post('/add-post', async (req, res) => {
            const query = req.body;
            const result = await postCollection.insertOne(query);
            res.send(result);
        })
        app.get('/post', async (req, res) => {
            const cursor = await postCollection.find().toArray();
            res.send(cursor);
        })

        // User (Add, get, Delete and update role)
        app.post('/add-users', async (req, res) => {
            const user = req.body;
            const quary = { email: user.email }
            const existUser = await usersCollection.findOne(quary);
            if (existUser) {
                return res.send({ message: 'user already in use', insertedId: null })
            }
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })
        app.get('/users', async (req, res) => {
            const result = await usersCollection.find().toArray();
            res.send(result);
        })
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await usersCollection.deleteOne(query);
            res.send(result);
        })
        app.patch('/users/admin/:id', (req, res) => {
            const id = req.params.id;
            const filter = {_id: new ObjectId(id)};
            const updateUser = {
                $set:{
                    role: "admin"
                }
            }
            const result = usersCollection.updateOne(filter, updateUser);
            res.send(result);
        })



    } finally {

    }
}
run().catch(console.dir);