import { Router } from 'express';
export const router=Router()

router.get('/',(req,res)=>{

    const carts=[]

    res.setHeader('Content-Type','application/json')
    res.status(200).json({carts})
})