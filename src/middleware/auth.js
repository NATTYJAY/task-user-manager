const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth  = async(req,res,next) => {
    try{
        /**Remove the bearer from the header jus to get only the token */
        const token = req.header('Authorization').replace('Bearer ','')
        const verify = jwt.verify(token, 'myKey')
        const user = await User.findOne({ _id: verify._id, 'tokens.token': token })
        if(!user){
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
    }catch(e){
        res.status(401).send({error: 'Please authenticate'})
    }
}

module.exports = auth