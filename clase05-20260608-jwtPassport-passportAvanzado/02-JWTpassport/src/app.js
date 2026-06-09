import express from 'express';
import fs from 'fs'
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { auth } from './middleware/auth.js';
import cookieParser from "cookie-parser"
import passport from 'passport';
import { iniciarPassport } from './config/passport.config.js';
const PORT=3000;

const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())

// paso 2
iniciarPassport()
// passport.use("current2", new passportJWT.Strategy())
app.use(passport.initialize())
// app.use(passport.session())  // solo si usamos Sessions...!!!

app.use(express.static("./public"))

app.get('/',(req,res)=>{
    res.setHeader('Content-Type','text/plain');
    res.status(200).send('OK');
})

let usuarios=[]
if(fs.existsSync('./src/usuarios.json')){
    usuarios=JSON.parse(fs.readFileSync('./src/usuarios.json','utf-8'))
}

app.post('/registro',(req,res)=>{
    let {nombre, email, password}=req.body
    if(!nombre || !email || !password) return res.status(400).send({error:'Ingrese todos los datos'})

    let usuario=usuarios.find(u=>u.email===email)
    if(usuario) return res.status(400).send({error:`El usuario ${email} ya existe en la DB`})

    let id=1
    if(usuarios.length>0) id=usuarios[usuarios.length-1].id+1

    usuario={
        id, 
        nombre, 
        email, 
        password: bcrypt.hashSync(password, 10), 
        rol: "user"
    }

    usuarios.push(usuario)

    fs.writeFileSync('./src/usuarios.json',JSON.stringify(usuarios,null,5))

    res.json({
        usuarioCreado:usuario
    })
})

app.post('/login',(req,res)=>{
    let {email, password}=req.body
    if(!email || !password) return res.status(400).send({error:'Ingrese email y password'})

    usuarios=JSON.parse(fs.readFileSync('./src/usuarios.json','utf8'))

    let usuario=usuarios.find(u=>u.email===email)
    if(!usuario) return res.status(400).send({error:`Error credenciales`})
    
    if(!bcrypt.compareSync(password, usuario.password)) return res.status(400).send({error:`Error credenciales`})

    // req.session.usuario=usuario

    // el usuario tiene que carecer de datos sensibles
    let userToken={
        id: usuario.id, 
        email: usuario.email, 
        nombre: usuario.nombre,
        rol: usuario.rol, 
    }

    // .lean() find()  plain object
    let token=jwt.sign(userToken, "Secret123", {expiresIn: "1h"})

    res.cookie("cookietoken", token, {maxAge: 1000 * 60 * 60, httpOnly: true})
    return res.status(200).json({
        usuarioLogueado: userToken,
        // token
    })

})

app.get("/error", (req, res)=>{

    res.setHeader('Content-Type','application/json');
    return res.status(401).json({error: "Error al autenticar... "});
})

// app.get('/usuario', auth, (req,res)=>{
// paso 3
app.get('/usuario', passport.authenticate("current", {session: false, failureRedirect: "/error"}), (req,res)=>{

    // si passport.authenticate sale OK, deja un req.user en la request

    res.setHeader('Content-Type','application/json');
    res.status(200).json({
        mensaje:'Perfil usuario',
        datosUsuario: req.user
    });
});

const server=app.listen(PORT,()=>{
    console.log(`Server escuchando en puerto ${PORT}`);
});
