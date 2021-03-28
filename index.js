const express = require('express');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const app = express();
app.use(cors());
app.use(express.json());
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.acxxo.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const productCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTION}`);
  
    app.post('/addProducts', (req, res) => {
        const products = req.body;
        productCollection.insertMany(products)
        .then(result => {
            console.log(result)
        })
    })

    //load all data from database
    app.get('/products', (req, res) => {
        productCollection.find({}).toArray((err, documents) => {
            res.send(documents)
        })
    })

    //load single data from database
    app.get(`/product/:key`, (req, res) => {
        productCollection.find({key: req.params.key})
        .toArray((err, documents) => {
            res.send(documents[0])
        })
    })

    app.post('/savedProducts', (req, res) => {
        const savedProducts = req.body;
        productCollection.find({key: {$in: savedProducts}})
        .toArray((err, documents) => {
            res.send(documents)
        })
    })

});


app.listen(8080)