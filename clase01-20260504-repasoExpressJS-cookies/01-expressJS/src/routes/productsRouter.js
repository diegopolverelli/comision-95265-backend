import { Router } from 'express';
export const router=Router()

router.use((req, res, next)=>{
    console.log(`Middleware nivel router`)

    next()
})

router.get('/',(req,res)=>{
    let productos=[]
    

    res.setHeader('Content-Type','application/json')
    res.status(200).json({productos })
})