import {fileURLToPath} from 'url';
import { dirname } from 'path';

import passport from 'passport';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;


export const passportCall=estrategia=>function (req, res, next) {
    passport.authenticate(estrategia, function (err, user, info, status) {
        if (err) { return next(err) }  // return done(error)
        if (!user) {
            // return res.redirect('/signin')

            let a=100
            console.log(`${a<20?"menor":"mayor"}`)

            res.setHeader('Content-Type','application/json');
            return res.status(401).json({error:`${info.message?info.message:info.toString()}`})
        }  // return done(null, false)
        // res.redirect('/account');  // return done(null, usuario)
        req.user=user
        next()
    })(req, res, next);
}



