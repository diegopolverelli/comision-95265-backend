import { Router } from 'express';
import bcrypt from "bcrypt"
import { UsuariosManagerMongo } from '../dao/UsuariosManagerMONGO.js';
export const router=Router()

const usersDAO=new UsuariosManagerMongo()

router.post('/register', async(req,res)=>{

    let {nombre, email, password}=req.body
    if(!nombre || !email || !password){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`nombre email password son requeridos`})
    }

    try {
        let existe=await usersDAO.getBy({email})
        if(existe){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`Ya existen usuarios registrados con email ${email}`})
        }
        // resto validaciones pertinentes

        password=bcrypt.hashSync(password, 10)

        let nuevoUsuario=await usersDAO.create({
            nombre, email, password
        })
    
        res.setHeader('Content-Type','application/json')
        res.status(201).json({message:"Registro exitoso para "+nombre, nuevoUsuario})
    } catch (error) {
        console.log(error)
        res.setHeader('Content-Type','application/json');
        return res.status(500).json({error:`Internal Server Error`})
    }
})

router.post("/login", async(req, res)=>{
    let {email, password}=req.body

    // validaciones 
    if(!email || !password){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`email password son requeridos`})
    }

    try {
        // validaciones requeridas
        let usuario=await usersDAO.getBy({email})
        if(!usuario){
            res.setHeader('Content-Type','application/json');
            return res.status(401).json({error:`Credenciales inválidas`})
        }

        if(!bcrypt.compareSync(password, usuario.password)){
            res.setHeader('Content-Type','application/json');
            return res.status(401).json({error:`Credenciales inválidas`})
        }

        // eliminar datos sensibles que puedan estar en el objeto
        delete usuario.password

        req.session.usuario=usuario

        res.setHeader('Content-Type','application/json');
        return res.status(200).json({message: `Login correcto para ${usuario.nombre}`, usuario});
    } catch (error) {
        
    }

})

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