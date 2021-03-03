const express = require('express');
const routes = require('./routes');

const app = express();

app.use(express.json());

app.get('/',(req,res)=>{
    res.json({
        message:"hello world"
    })
});

app.use('/api',routes);

const PORT=process.env.API_PORT;

app.listen(PORT,()=>{
    console.log(`listening on PORT ${PORT}`);
});