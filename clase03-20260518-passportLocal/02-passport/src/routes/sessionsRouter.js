import { Router } from 'express';
import bcrypt from "bcrypt"
import { UsuariosManagerMongo } from '../dao/UsuariosManagerMONGO.js';
import passport from 'passport';
export const router=Router()

const usersDAO=new UsuariosManagerMongo()

// router.post('/register', async(req,res)=>{

//     let {nombre, email, password}=req.body
//     if(!nombre || !email || !password){
//         res.setHeader('Content-Type','application/json');
//         return res.status(400).json({error:`nombre email password son requeridos`})
//     }

//     try {
//         let existe=await usersDAO.getBy({email})
//         if(existe){
//             res.setHeader('Content-Type','application/json');
//             return res.status(400).json({error:`Ya existen usuarios registrados con email ${email}`})
//         }
//         // resto validaciones pertinentes

//         password=bcrypt.hashSync(password, 10)

//         let nuevoUsuario=await usersDAO.create({
//             nombre, email, password
//         })
    
//         res.setHeader('Content-Type','application/json')
//         res.status(201).json({message:"Registro exitoso para "+nombre, nuevoUsuario})
//     } catch (error) {
//         console.log(error)
//         res.setHeader('Content-Type','application/json');
//         return res.status(500).json({error:`Internal Server Error`})
//     }
// })

router.get("/error", (req, res)=>{
    res.setHeader('Content-Type','application/json');
    return res.status(400).json({error:`Error al autenticar...`})
})

router.post(
    "/register", 
    // paso 3
    passport.authenticate("registro", {failureRedirect: "/api/sessions/error"}),
    async(req, res)=>{

        // si passport.authenticate sale bien deja una property user
        // en la req
        // Vamos a tener un req.user

        res.setHeader('Content-Type','application/json')
        res.status(201).json({message:"Registro exitoso para "+req.user.nombre, nuevoUsuario: req.user})
        // res.status(201).json({message:"Registro exitoso para "+req.user.nombre, nuevoUsuario: {name: req.user.nombre, _id: req.user.id, email: req.user.email}})
    }
)

// router.post("/login", async(req, res)=>{
//     let {email, password}=req.body

//     // validaciones 
//     if(!email || !password){
//         res.setHeader('Content-Type','application/json');
//         return res.status(400).json({error:`email password son requeridos`})
//     }

//     try {
//         // validaciones requeridas
//         let usuario=await usersDAO.getBy({email})
//         if(!usuario){
//             res.setHeader('Content-Type','application/json');
//             return res.status(401).json({error:`Credenciales inválidas`})
//         }

//         if(!bcrypt.compareSync(password, usuario.password)){
//             res.setHeader('Content-Type','application/json');
//             return res.status(401).json({error:`Credenciales inválidas`})
//         }

//         // eliminar datos sensibles que puedan estar en el objeto
//         delete usuario.password

//         req.session.usuario=usuario

//         res.setHeader('Content-Type','application/json');
//         return res.status(200).json({message: `Login correcto para ${usuario.nombre}`, usuario});
//     } catch (error) {
        
//     }

// })

router.post(
    "/login",
    // paso 3:
    passport.authenticate("login", {failureRedirect: "/api/sessions/error"}),
    (req, res)=>{

        let {user}=req
        delete user.password

        req.session.usuario=user

        res.setHeader('Content-Type','application/json');
        return res.status(200).json({message: `Login correcto para ${user.nombre}`, usuario: user});
        
    }
)

router.get("/logout", (req, res)=>{
    req.session.destroy(error=>{
        if(error){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`Error al procesar logout`})
        }

        res.setHeader('Content-Type','application/json');
        return res.status(200).json({message: "Logout exitoso"});
    })
})