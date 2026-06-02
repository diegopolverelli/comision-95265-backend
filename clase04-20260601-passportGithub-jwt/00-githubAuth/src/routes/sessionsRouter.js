import { Router } from 'express';
import passport from 'passport';
export const router=Router()

router.get("/error", (req, res)=>{

    res.setHeader('Content-Type','application/json');
    return res.status(400).json({error:`Error al autenticar`})
})

// paso 3
router.get('/github', passport.authenticate("github", {}))
router.get('/callbackGithub', passport.authenticate("github", {failureRedirect: "/api/sessions/error"}), 
    (req, res)=>{

        // si passport.authenticate sale bien... deja una property user en la request

        // quitar datos sensibles
        let userSession={
            _id: req.user._id, 
            nombre: req.user.nombre, 
            email: req.user.email,
        }
        req.session.usuario=userSession

        res.setHeader('Content-Type','application/json');
        return res.status(200).json({payload:"login exitoso", user: req.user});
    }
)


router.get("/logout", (req, res)=>{

    req.session.destroy(error=>{
        if(error){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`Error al procesar logout`})
        }

        res.setHeader('Content-Type','application/json');
        return res.status(200).json({payload:"Logout exitoso"});
    })
})

router.post(
    "/login", 
    passport.authenticate("login", {failureRedirect: "/api/sessions/error"}),
    (req, res)=>{

        // quitar datos sensibles
        let userSession={
            _id: req.user._id, 
            nombre: req.user.nombre, 
            email: req.user.email,
        }
        req.session.usuario=userSession

        res.setHeader('Content-Type','application/json');
        return res.status(200).json({payload:"Login exitoso", usuario: userSession});
    }
 )
