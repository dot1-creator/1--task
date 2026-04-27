const express = require(‘express’);
const { MongoClient } = require(‘mongodb’);
const path = require(‘path’);

const app = express();
const PORT = process.env.PORT || 3000;

const MONGO_URL = ‘mongodb+srv://dziatkovolha_db_user:A5NvtGIHiZejdn5D@cluster0.n9goava.mongodb.net/?appName=Cluster0’;
const DB_NAME = ‘redakcja’;
const COL_NAME = ‘data’;

let col = null;

async function connectDB() {
try {
const client = new MongoClient(MONGO_URL);
await client.connect();
col = client.db(DB_NAME).collection(COL_NAME);
console.log(‘MongoDB połączony!’);
const existing = await col.findOne({id: ‘main’});
if (!existing) {
await col.insertOne({
id: ‘main’,
tasks: [],
employees: [
{id:‘szef’, name:‘Szef’,    color:’#c8421a’},
{id:‘aga’,  name:‘Aga’,     color:’#2a7a4b’},
{id:‘gzh’,  name:‘Grzegorz’,color:’#1a4a8a’},
{id:‘olya’, name:‘Ola’,     color:’#7c3aed’},
{id:‘eva’,  name:‘Ewa’,     color:’#c86a1a’},
],
changelog: [],
nid: 1,
eid: 100
});
console.log(‘Domyślne dane utworzone’);
}
} catch(err) {
console.error(‘Błąd MongoDB:’, err.message);
}
}

app.use(express.json({limit: ‘10mb’}));
app.use(express.static(path.join(__dirname, ‘public’)));

app.get(’/api/data’, async (req, res) => {
try {
if (!col) return res.status(503).json({error: ‘Baza niedostępna’});
const doc = await col.findOne({id: ‘main’});
if (!doc) return res.status(404).json({error: ‘Brak danych’});
const {_id, id, …data} = doc;
res.json(data);
} catch(err) {
res.status(500).json({error: err.message});
}
});

app.post(’/api/data’, async (req, res) => {
try {
if (!col) return res.status(503).json({error: ‘Baza niedostępna’});
const data = req.body;
if (!data || typeof data !== ‘object’) return res.status(400).json({error: ‘Złe dane’});
await col.updateOne(
{id: ‘main’},
{$set: {…data, id: ‘main’}},
{upsert: true}
);
res.json({ok: true});
} catch(err) {
res.status(500).json({error: err.message});
}
});

connectDB().then(() => {
app.listen(PORT, () => {
console.log(’RED.ZADANIA działa na porcie ’ + PORT);
});
});
