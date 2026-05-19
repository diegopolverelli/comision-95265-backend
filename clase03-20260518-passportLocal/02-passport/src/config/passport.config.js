import passport from "passport"
import local from "passport-local"
import bcrypt from "bcrypt"
import { UsuariosManagerMongo } from "../dao/UsuariosManagerMONGO.js"

const usersDAO=new UsuariosManagerMongo()

export const iniciarPassport=()=>{

    // paso 1: configurar estrategias
    passport.use("registro", new local.Strategy(
        {
            usernameField: "email",
            // passwordField: "clave",
            passReqToCallback: true
        }, 
        async(req, username, password, done)=>{
            try {
                // logica de registro
                let {nombre}=req.body
                if(!nombre){
                    // res.setHeader('Content-Type','application/json');
                    // return res.status(400).json({error:`nombre email password son requeridos`})
                    return done(null, false)
                }
                
                let existe=await usersDAO.getBy({email: username})
                if(existe){
                    // res.setHeader('Content-Type','application/json');
                    // return res.status(400).json({error:`Ya existen usuarios registrados con email ${email}`})
                    return done(null, false)
                }
                // resto validaciones pertinentes

                password=bcrypt.hashSync(password, 10)

                let nuevoUsuario=await usersDAO.create({
                    nombre, email: username, password
                })

                delete nuevoUsuario.password

                return done(null, nuevoUsuario)
            } catch (error) {
                return done(error)
            }
        }
    ))

    passport.use("login", new local.Strategy(
        {
            usernameField: "email",
        }, 
        async(username, password, done)=>{
            try {
                let usuario=await usersDAO.getBy({email: username})
                if(!usuario){
                    // res.setHeader('Content-Type','application/json');
                    // return res.status(401).json({error:`Credenciales inválidas`})
                    return done(null, false)
                }
        
                if(!bcrypt.compareSync(password, usuario.password)){
                    // res.setHeader('Content-Type','application/json');
                    // return res.status(401).json({error:`Credenciales inválidas`})
                    return done(null, false)
                }
        
                return done(null, usuario)
            } catch (error) {
                return done(error)
            }
        }
    ))

    // paso 1' o paso 1 bis SOLO SI TRABAJO CON SESSIONS
    passport.serializeUser((user, done)=>{
        return done(null, user._id)
    })

    passport.deserializeUser(async(id, done)=>{
        let user=await usersDAO.getBy({_id: id})
        return done(null, user)
    })

    // passport.serializeUser((user, done)=>{
    //     return done(null, user)
    // })
    // passport.deserializeUser((user, done)=>{
    //     return done(null, user)
    // })

}