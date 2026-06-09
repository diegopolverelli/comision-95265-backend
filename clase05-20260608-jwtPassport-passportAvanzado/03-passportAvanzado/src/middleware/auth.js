import jwt from "jsonwebtoken"

export const auth=(req, res, next)=>{
    // header
    // if(!req.headers.authorization){
    if(!req.cookies.cookietoken){
        res.setHeader('Content-Type','application/json');
        return res.status(401).json({error:`No hay usuarios autenticados`})
    }

    // BEARER adlfaksj8.asd8fasd8fas.asdf8asdfas8df
    // let token=req.headers.authorization.split(" ")[1]
    let token=req.cookies.cookietoken

    try {
        let usuario=jwt.verify(token, "Secret123")    
        req.user=usuario    
    } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(401).json({error:`Credenciales invalidas - ${error.message}`})
    }

    next()

}