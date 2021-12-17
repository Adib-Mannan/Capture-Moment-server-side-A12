const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3uvbd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("CaptureMoment");
        const productsCollection = database.collection("products");
        const ordersCollection = database.collection("orders");
        const reviewsCollection = database.collection("reviews");
        const usersCollection = database.collection("users");

        // products GeT APi
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray()
            res.send(products);
        })
        // find one product Dynamic API
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const package = await productsCollection.findOne(query);
            res.send(package);
        });
        // Post Product Api 
        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await productsCollection.insertOne(product);
            res.json(result)
        })
        // Delete Product Api
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await productsCollection.deleteOne(query);
            res.json(result)
        })
        // Order POST API 
        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders)
        })
        // Order Post Api 
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.json(result)
        })
        // Delete order Api
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await ordersCollection.deleteOne(query);
            res.json(result)
        })
        // Review get api 
        app.get('/reviews', async (req, res) => {
            const cursor = reviewsCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews)
        })
        // Review post api 
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewsCollection.insertOne(review);
            res.json(result);
        })
        // User add post 
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result);
        });
        // Google user Put 
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = {
                $set: user
            };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        })
        // Admin Role 
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email }
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        });
        // Admin Check 
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin })
        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
