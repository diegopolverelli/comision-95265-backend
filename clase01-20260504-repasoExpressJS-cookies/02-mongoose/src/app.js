import express from 'express';
import { logger } from './middlewares/log.js';
import { router as productsRouter  } from './routes/productsRouter.js';
import { router as cartsRouter } from './routes/cartsRouter.js';
import { connDB } from './config/db.js';
import { config } from './config/config.js';
const PORT=3000;

const app=express();

// console.log("Prueba")
// console.log('1');
// console.log('2');
// console.log('3');

// console.log('4');
// console.log('5');
// console.log('6');


app.use(logger)
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)

app.get('/', 
    (req, res, next)=>{
        console.log("Middleware 1")

        next()
    }, 
    (req,res)=>{
    
    

    res.setHeader('Content-Type','text/plain');
    res.status(200).send('OK');
})

app.get('/products', (req,res)=>{
    
    

    res.setHeader('Content-Type','text/plain');
    res.status(200).send('Products');
})



app.get('/users', (req,res)=>{
    
    let usuarios=[
        {id:1, nombre:"Luciana", email:"luciana@test.com", password:"123", rol:"user"},
        {id:2, nombre:"Juan", email:"juan@test.com", password:"123", rol:"user"},
        {id:3, nombre:"Romina", email:"romina@test.com", password:"123", rol:"admin"},
    ]
    

    res.setHeader('Content-Type','application/json');
    return res.status(200).json({payload: usuarios});
})

const server=app.listen(PORT,()=>{
    console.log(`Server escuchando en puerto ${PORT}`);
});


connDB(config.MONGO_URL, config.DB_NAME)