const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const promotionRouter = express.Router();
const authenticate = require('../authenticate');

const Promotions = require('../models/promotions');

promotionRouter.use(bodyParser.json());

promotionRouter.route('/')
.get((req,res,next) => {
    Promotions.find({})
    .then((promotions)=>{
        res.statusCode = 200;
        res.setHeader('content-type','application/json');
        res.json(promotions);
    },(err)=>next(err))
    .catch(err=>next(err));

})
.post(authenticate.verifyUser,(req,res,next) => {
    Promotions.create(req.body)
    .then(promotion=>{
        console.log('promotion created .');
        res.statusCode = 200;
        res.setHeader('content-type','application/json');
        res.json(promotion);
    },(err)=>next(err))
    .catch(err=>next(err));

})
.put(authenticate.verifyUser,(req,res,next) => {
    res.statusCode = 403;
    res.end('PUT not supported on /promotions');

})
.delete(authenticate.verifyUser,(req,res,next) => {
    Promotions.remove({})
    .then(resp=>{
        res.statusCode = 200;
        res.setHeader('content-type','application/json');
        res.json(resp);
    },(err)=>next(err))
    .catch(err=>next(err));
});

promotionRouter.route('/:promoId')
.get((req,res,next) => {
    Promotions.findById(req.params.promoId)
    .then((promotion)=>{
        res.statusCode = 200;
        res.setHeader('content-type','application/json');
        res.json(promotion);
    },(err)=>next(err))
    .catch(err=>next(err));

})
.post(authenticate.verifyUser,(req,res,next) => {
    res.statusCode = 403;
    res.end('POST not supported on /promotions');
})
.put(authenticate.verifyUser,(req,res,next) => {
    Promotions.findByIdAndUpdate(req.params.promoId,{
        $set:req.body
    },{new:true})
    .then((promotion)=>{
        res.statusCode = 200;
        res.setHeader('content-type','application/json');
        res.json(promotion);
    },(err)=>next(err))
    .catch(err=>next(err));
})
.delete(authenticate.verifyUser,(req,res,next) => {
    Promotions.findByIdAndDelete(req.params.promoId)
    .then((resp)=>{
        res.statusCode = 200;
        res.setHeader('content-type','application/json');
        res.json(resp);
    },(err)=>next(err))
    .catch(err=>next(err));
});

module.exports = promotionRouter;