import { Router } from 'express';
import { auth } from '../middleware/auth.js';
export const router=Router()

router.get('/',(req,res)=>{

    res.status(200).render('home')
})

router.get('/login',(req,res)=>{

    res.status(200).render('login')
})

router.get('/profile', auth, (req,res)=>{

    res.status(200).render('profile', {
        nombre: req.session.usuario.nombre, 
        email: req.session.usuario.email
    })
})