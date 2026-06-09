import jwt from "jsonwebtoken"

// export const auth=(req, res, next)=>{
//     // header
//     // if(!req.headers.authorization){
//     if(!req.cookies.cookietoken){
//         res.setHeader('Content-Type','application/json');
//         return res.status(401).json({error:`No hay usuarios autenticados`})
//     }

//     // BEARER adlfaksj8.asd8fasd8fas.asdf8asdfas8df
//     // let token=req.headers.authorization.split(" ")[1]
//     let token=req.cookies.cookietoken

//     try {
//         let usuario=jwt.verify(token, "Secret123")    
//         req.user=usuario    
//     } catch (error) {
//         res.setHeader('Content-Type','application/json');
//         return res.status(401).json({error:`Credenciales invalidas - ${error.message}`})
//     }

//     next()

// }

export const isAdmin=(req, res, next)=>{
    if(!req.user || !req.user.rol || req.user.rol!="admin" ){
        res.setHeader('Content-Type','application/json');
        return res.status(403).json({error:`Privilegios insuficientes`})
    }

    next()
}

export const isUser=(req, res, next)=>{
    if(!req.user || !req.user.rol || req.user.rol!="user" ){
        res.setHeader('Content-Type','application/json');
        return res.status(403).json({error:`Privilegios insuficientes`})
    }

    next()
}

export const auth=(permisos=[])=>{
    return (req, res, next)=>{
        if(permisos.includes("public") || permisos.includes("PUBLIC")) {
            return next()
        }

        // preguntar por los permisos
        if(!req.user || !req.user.rol || !permisos.includes(req.user.rol) ){
            res.setHeader('Content-Type','application/json');
            return res.status(403).json({error:`Privilegios insuficientes`})
        }

        next()
    }
}