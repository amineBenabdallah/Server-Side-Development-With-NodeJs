const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');
var passport = require('passport');

const Dishes = require('../models/dishes');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200); })
.get(cors.cors,(req,res,next) => {
    Dishes.find(req.query)
    .populate('comments.author')
    .then((dishes)=>{
        res.statusCode=200;
        res.setHeader('content-type','application/json');
        res.json(dishes);
    },(err)=>{ next(err)})
    .catch(err=>next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    Dishes.create(req.body)
    .then((dish)=>{
        console.log('Dish created ',dish);
        res.statusCode=200;
        res.setHeader('content-type','application/json');
        res.json(dish);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    res.statusCode = 403;
    res.end('PUT not supported on /dishes');

})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    Dishes.remove({})
    .then((response)=>{
        res.statusCode=200;
        res.setHeader('content-type','application/json');
        res.json(response);
    },(err)=>next(err))
    .catch((err)=>next(err));
});

dishRouter.route('/:dishId')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200); })
.get(cors.cors,(req,res,next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish)=>{
        res.statusCode=200;
        res.setHeader('content-type','application/json');
        res.json(dish);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    res.statusCode = 403;
    res.end('POST not supported on /dishes');
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    Dishes.findByIdAndUpdate(req.params.dishId,{
        $set:req.body
    },{new : true}) //to return the updated dish
    .then((dish)=>{
        res.statusCode=200;
        res.setHeader('content-type','application/json');
        res.json(dish);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((response)=>{
        res.statusCode=200;
        res.setHeader('content-type','application/json');
        res.json(response);
    },(err)=>next(err))
    .catch((err)=>next(err));
});

dishRouter.route('/:dishId/comments')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200); })
.get(cors.cors,(req,res,next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish)=>{
        if(dish){
            res.statusCode=200;
            res.setHeader('content-type','application/json');
            res.json(dish.comments);
        }
        else{
            err = new Error('Dish ' + req.params.dishId + 'not found');
            res.statusCode = 404;
            return next(err);
        }
    },(err)=>{ next(err)})
    .catch(err=>next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        if(dish){
            req.body.author = req.user._id;
            dish.comments.push(req.body);
            dish.save()
            .then((dish)=>{
                Dishes.findById(dish._id)
                    .populate('comments.author')
                    .then((dish)=>{
                        res.statusCode=200;
                        res.setHeader('content-type','application/json');
                        res.json(dish);
                    });
            },err=>{next(err)});
        }
        else{
            err = new Error('Dish ' + req.params.dishId + 'not found');
            res.statusCode = 404;
            return next(err);
        }
        
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.put(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    res.statusCode = 403;
    res.end('PUT not supported on /dishes' + req.params.dishId + '/comments');

})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        if(dish){
            for (var i = (dish.comments.length -1); i >= 0; i--) {
                dish.comments.id(dish.comments[i]._id).remove();
            }
            dish.save()
            .then((dish)=>{
                res.statusCode=200;
                res.setHeader('content-type','application/json');
                res.json(dish);
            },err=>{next(err)});
        }
        else{
            err = new Error('Dish ' + req.params.dishId + 'not found');
            res.statusCode = 404;
            return next(err);
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
});

dishRouter.route('/:dishId/comments/:commentId')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200); })
.get(cors.cors,(req,res,next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish)=>{
        if(dish && dish.comments.id(req.params.commentId)){
            res.statusCode=200;
            res.setHeader('content-type','application/json');
            res.json(dish.comments.id(req.params.commentId));
        }
        else if(dish == null){
            err = new Error('Dish ' + req.params.dishId + 'not found');
            res.statusCode = 404;
            return next(err);
        }
        else {
            err = new Error('comment ' + req.params.commentId + 'not found');
            res.statusCode = 404;
            return next(err);
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    res.statusCode = 403;
    res.end('POST not supported on /dishes/' + req.params.dishId + '/comments/' + req.params.commentId);
})
.put(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        if(dish && dish.comments.id(req.params.commentId)){
            if(req.body.rating){
                dish.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if(req.body.comment){
                dish.comments.id(req.params.commentId).rating = req.body.comment;
            }
            dish.save()
            .then((dish)=>{
                Dishes.findById(dish._id)
                    .populate('comments.author')
                    .then((dish)=>{
                        res.statusCode=200;
                        res.setHeader('content-type','application/json');
                        res.json(dish);
                    });
            },err=>{next(err)});
        }
        else if(dish == null){
            err = new Error('Dish ' + req.params.dishId + 'not found');
            res.statusCode = 404;
            return next(err);
        }
        else {
            err = new Error('comment ' + req.params.commentId + 'not found');
            res.statusCode = 404;
            return next(err);
        }

    },(err)=>next(err))
    .catch((err)=>next(err));
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {   
        Dishes.findById(req.params.dishId)
        .then((dish)=>{
                if(dish && dish.comments.id(req.params.commentId)){
                    if(req.user._id.equals(dish.comments.id(req.params.commentId).author)){
                        dish.comments.id(req.params.commentId).remove();
                        dish.save()
                        .then((dish)=>{
                            Dishes.findById(dish._id)
                                .populate('comments.author')
                                .then((dish)=>{
                                    res.statusCode=200;
                                    res.setHeader('content-type','application/json');
                                    res.json(dish);
                                });
                        },err=>{next(err)});
                    }
                    else{
                        err = new Error('You are not authorized to perform this operation!');
                        err.status=403;
                        return next(err);
                      }
                }
                else if(dish == null){
                    err = new Error('Dish ' + req.params.dishId + 'not found');
                    res.statusCode = 404;
                    return next(err);
                }
                else {
                    err = new Error('comment ' + req.params.commentId + 'not found');
                    res.statusCode = 404;
                    return next(err);
                }
        },(err)=>next(err))
        .catch((err)=>next(err));
});

module.exports = dishRouter;