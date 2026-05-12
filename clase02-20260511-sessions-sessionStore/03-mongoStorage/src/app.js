import express from 'express';
import sessions from "express-session"
import MongoStore from "connect-mongo"
import { config } from './config/config.js';
import bcrypt from "bcrypt"
import crypto from "crypto"
import { auth } from './middleware/auth.js';

const PORT=3000;

const app=express();

app.use(sessions({
    secret: config.SECRET,
    saveUninitialized: true, 
    resave: true, 
    cookie: {
        httpOnly: true, 
        maxAge: 1000 * 60 * 5,
    }, 
    store: MongoStore.create({
        mongoUrl: config.MONGO_URL, 
        dbName: config.DB_NAME, 
        ttl: 60 * 5, 
        // collectionName: "misSessions",
    })
}))
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("./public"))


app.get('/',(req,res)=>{

    if(req.session.contador){
        req.session.contador++
    }else{
        req.session.contador=1
    }

    res.setHeader('Content-Type','application/json');
    return res.status(200).json({payload:`Home Page. Visitas: ${req.session.contador}`});
})

let usuarios=[
    {id:1, nombre:"Luciana", email:"luciana@test.com", password:"123", rol:"user"},
    {id:2, nombre:"Juan", email:"juan@test.com", password:"123", rol:"user"},
    {id:3, nombre:"Romina", email:"romina@test.com", password:"123", rol:"admin"},
]

usuarios=usuarios.map(u=>{
    return {
        ...u,   // ... son aquí SPREAD
        hashConCrypto: crypto.createHmac("sha256", "password123").update(u.password).digest("hex"), 
        password: bcrypt.hashSync(u.password, 10)
    }
})

console.log(usuarios)


app.post("/login", (req, res)=>{

    let {email, password}=req.body
    if(!email || !password){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`password | email son requeridos`})
    }

    let usuario=usuarios.find(u=>u.email==email)
    if(!usuario){
        res.setHeader('Content-Type','application/json');
        return res.status(401).json({error:`Credenciales inválidas`})
    }

    if(!bcrypt.compareSync(password, usuario.password)){
        res.setHeader('Content-Type','application/json');
        return res.status(401).json({error:`Credenciales inválidas`})
    }

    req.session.usuario=usuario

    res.setHeader('Content-Type','application/json');
    return res.status(200).json({payload:"Login exitoso para "+usuario.nombre});
})

app.get("/logout", (req, res)=>{

    req.session.destroy(error=>{
        if(error){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`Error al procesar logout`})
        }

        res.setHeader('Content-Type','application/json');
        return res.status(200).json({payload:"Logout exitoso...!!!"});
    })
})


app.get("/perfil", auth ,(req, res)=>{



    res.setHeader('Content-Type','application/json');
    return res.status(200).json({payload: `Perfil ${req.session.usuario.nombre}`});
    // return res.status(200).json({payload: `Perfil `});
})

const server=app.listen(PORT,()=>{
    console.log(`Server escuchando en puerto ${PORT}`);
});
