import passport from "passport"
import passportJWT from "passport-jwt"
import local from "passport-local"
import bcrypt from "bcrypt"
import fs from "fs"


const buscaToken=req=>{
    let token=null

    if(req.cookies.cookietoken){
        console.log(`Encontró cookie con token en passport...!!!`)
        token=req.cookies.cookietoken
    }

    return token
}

export const iniciarPassport=()=>{

    // paso 1
    passport.use("current", new passportJWT.Strategy(
        {
            secretOrKey: "Secret123", 
            jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([buscaToken])
        },
        async(contenidoToken, done)=>{   // contenidoToken o usuario
            try {
                // done(null, false)
                if(contenidoToken.nombre=="Juan"){
                    return done(null, false, {message:"El usuario Juan tiene el acceso temporalmente inhabilitado. Contacte con admin"})
                }
                return done(null, contenidoToken)
            } catch (error) {
                return done(error)
            }
        }
    ))

    passport.use("registro", new local.Strategy(
        {
            usernameField: "email", 
            passReqToCallback: true
        }, 
        async(req, username, password, done)=>{
            try {
                let usuarios = []
                if (fs.existsSync('./src/usuarios.json')) {
                    usuarios = JSON.parse(fs.readFileSync('./src/usuarios.json', 'utf-8'))
                }

                let { nombre, } = req.body
                if (!nombre ) { // return res.status(400).send({ error: 'Ingrese todos los datos' })
                    return done(null, false, {message: 'Ingrese todos los datos (nombre es requerido)'})
                }
            
                let usuario = usuarios.find(u => u.email === username)
                if (usuario) { //return res.status(400).send({ error: `El usuario ${email} ya existe en la DB` })
                    return done(null, false, {message: `El usuario ${username} ya existe en la DB`})
                }
            
                let id = 1
                if (usuarios.length > 0) id = usuarios[usuarios.length - 1].id + 1
            
                usuario = {
                    id,
                    nombre,
                    email: username,
                    password: bcrypt.hashSync(password, 10),
                    rol: "user"
                }
            
                usuarios.push(usuario)
            
                fs.writeFileSync('./src/usuarios.json', JSON.stringify(usuarios, null, 5))
            
                return done(null, usuario)
                            
            } catch (error) {
                return done(error)
            }
        }
    ))


    // paso 1' o 1bis   SOLO SI USAMOS SESSIONS

    // passport.serializeUser()
    // passport.deserializeUser()

}