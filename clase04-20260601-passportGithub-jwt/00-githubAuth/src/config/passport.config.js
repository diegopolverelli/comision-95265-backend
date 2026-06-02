import passport from "passport"
import githubPassport from "passport-github2"
import local from "passport-local"
import { usuariosModelo } from "../models/usuario.model.js"

import bcrypt from "bcrypt"


export const iniciarPassport=()=>{
    // paso 1
    passport.use("github", new githubPassport.Strategy(
        {
            callbackURL: "http://localhost:3000/api/sessions/callbackGithub", 
            clientID: "Iv23liawGLI11H1n1gTt", 
            clientSecret: "a5123b87c1c5dad29e1661277f6d94c7d57f6f2b",
        }, 
        async(t1, t2, profile, done)=>{
            try {
                // console.log(profile)
                let {name, email}= profile._json
                if(!email){
                    return done(null, false)
                }

                let usuario=await usuariosModelo.findOne({email})
                if(!usuario){
                    usuario=await usuariosModelo.create({nombre: name, email, profile})
                }

                return done(null, usuario)

                // return done(null, {user:"prueba"})
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
                let usuario=await usuariosModelo.findOne({email: username})
                if(!usuario){
                    return done(null, false)
                }

                if(!bcrypt.compareSync(password, usuario.password)){
                    return done(null, false)
                }
                
                return done(null, usuario)
            } catch (error) {
                return done(error)
            }
        }
    ))


    // paso 1' o paso 1bis (SI TRABJO CON SESSIONS)
    passport.serializeUser((user, done)=>{
        return done(null, user)
    })

    passport.deserializeUser((user, done)=>{
        return done(null, user)
    })


}


