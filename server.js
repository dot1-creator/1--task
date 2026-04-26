const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'data', 'db.json');

if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
}
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify({tasks:[],employees:[],changelog:[],nid:1,eid:100}));
}

app.use(express.json({limit:'5mb'}));
app.use(express.static(path.join(__dirname,'public')));

function readDB(){
  try{return JSON.parse(fs.readFileSync(DB_PATH,'utf8'));}
  catch{return{tasks:[],employees:[],changelog:[],nid:1,eid:100};}
}
function writeDB(data){
  fs.writeFileSync(DB_PATH,JSON.stringify(data,null,2));
}

app.get('/api/data',(req,res)=>{
  res.json(readDB());
});

app.post('/api/data',(req,res)=>{
  const db=req.body;
  if(!db||typeof db!=='object') return res.status(400).json({error:'Invalid data'});
  writeDB(db);
  res.json({ok:true});
});

app.listen(PORT,()=>{
  console.log('Redakcja Zadania running on port '+PORT);
});
