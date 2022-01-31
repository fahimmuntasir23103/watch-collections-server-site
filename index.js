const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

//Middleware//
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tntzi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {

          try {
                    await client.connect(()=>{
                              console.log("connect")
                    });

                    const database = client.db('watch_services')
                    const servicesCollection = database.collection('watch');

                    // Get API 
                    app.get('/watch', async (req, res) => {
                              const cursor = servicesCollection.find({}).limit(6);
                              const booking = await cursor.toArray();
                              res.send(booking);
                    })
                    //get all data
                    app.get('/watches', async (req, res) => {
                              const cursor = servicesCollection.find({});
                              const booking = await cursor.toArray();
                              res.send(booking);
                    })

                    // GET Single Service
                    app.get('/watch/:id', async (req, res) => {
                              const id = req.params.id;
                              console.log('getting specific service', id);
                              const query = { _id: ObjectId(id) };
                              const services = await servicesCollection.findOne(query);
                              res.json(services);
                    })



                    //  POST API
                    app.post('/watch', async (req, res) => {
                              const booking = req.body;
                              console.log('hit the post api', booking);


                              const result = await servicesCollection.insertOne(booking);
                              console.log(result);
                              res.json(result)
                    })
                    //Delete Api
                    app.delete('/cart/:id', async (req, res) => {
                              const id = req.params.id;
                              const query = { _id: ObjectId(id) };
                              const result = await servicesCollection.deleteOne(query);
                              res.json(result);
                    })
                    ///
                    app.put('/users/admin', async(req, res) =>{
                              const user = req.body;
                              console.log('put', user);
                              const filter ={ email: user.email};
                              const updateDoc = {$set: {role: 'admin'}};
                              const result = await usersCollection.updateOne(filter, updateDoc);
                              res.json(result);
                    })

          }
          finally {
                    // await client.close();
          }

}
run().catch(console.dir);


app.get('/', (req, res) => {
          res.send('the watch server site running')
});

app.listen(port, () => {
          console.log('Server running at port', port);
})