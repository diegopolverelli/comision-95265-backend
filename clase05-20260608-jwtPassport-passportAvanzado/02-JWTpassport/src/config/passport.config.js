import passport from "passport"
import passportJWT from "passport-jwt"

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
                return done(null, contenidoToken)
            } catch (error) {
                return done(error)
            }
        }
    ))



    // paso 1' o 1bis   SOLO SI USAMOS SESSIONS

    // passport.serializeUser()
    // passport.deserializeUser()

}