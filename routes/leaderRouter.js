const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const cors = require('./cors');

const leaderRouter = express.Router();
const Leaders = require('../models/leaders');

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    Leaders.find({})
    .then((leaders)=>{
        res.statusCode = 200;
        res.setHeader('content-type','application/json');
        res.json(leaders);
    },(err)=>next(err))
    .catch(err=>next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    Leaders.create(req.body)
    .then(leader=>{
        console.log('promotion created .');
        res.statusCode = 200;
        res.setHeader('content-type','application/json');
        res.json(leader);
    },(err)=>next(err))
    .catch(err=>next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    res.statusCode = 403;
    res.end('PUT not supported on /leaders');

})
.delete(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    Leaders.remove({})
    .then(resp=>{
        res.statusCode = 200;
        res.setHeader('content-type','application/json');
        res.json(resp);
    },(err)=>next(err))
    .catch(err=>next(err));
});

leaderRouter.route('/:leaderId')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    Leaders.findById(req.params.leaderId)
    .then((leader)=>{
        res.statusCode = 200;
        res.setHeader('content-type','application/json');
        res.json(leader);
    },(err)=>next(err))
    .catch(err=>next(err));

})
.post(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    res.statusCode = 403;
    res.end('POST not supported on /leaders');
})
.put(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    Leaders.findByIdAndUpdate(req.params.leaderId,{
        $set:req.body
    },{new:true})
    .then((leader)=>{
        res.statusCode = 200;
        res.setHeader('content-type','application/json');
        res.json(leader);
    },(err)=>next(err))
    .catch(err=>next(err));

})
.delete(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    Leaders.findByIdAndDelete(req.params.leaderId)
    .then((resp)=>{
        res.statusCode = 200;
        res.setHeader('content-type','application/json');
        res.json(resp);
    },(err)=>next(err))
    .catch(err=>next(err));
});

module.exports = leaderRouter;