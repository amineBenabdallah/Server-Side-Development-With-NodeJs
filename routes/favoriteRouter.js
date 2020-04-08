const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const favoriteRouter = express.Router();
const authenticate = require('../authenticate');
const cors = require('./cors');

const Favorites = require('../models/favorite');

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req,res)=>{res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req,res,next) => {
    Favorites.find({"user":req.user.id})
    .populate('user')
    .populate('dishes')
    .then((favorite)=>{
        res.statusCode = 200;
        res.setHeader('content-type','application/json');
        res.json(favorite);
    },(err)=>next(err))
    .catch(err=>next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser,(req,res,next) => {
    Favorites.findOne({"user":req.user.id})
    .then((favorite)=>{
        if(!favorite){
            Favorites.create({user:req.user._id,dishes: req.body})
            .then((favorite)=>{
                res.statusCode = 200;
                res.setHeader('content-type','application/json');
                res.json(favorite);
            },(err)=>next(err))
        }
        else{
            for(var i=0; i < req.body.length;i++){
                if(favorite.dishes.indexOf(req.body[i]._id) < 0){
                    favorite.dishes.push(req.body[i]);
                }
            }
            favorite.save()
            .then((favorite)=>{
                Favorites.findById(favorite._id)
                .then((favorite)=>{
                    res.statusCode = 200;
                    res.setHeader('content-type','application/json');
                    res.json(favorite);
                },(err)=>next(err))
                .catch(err=>next(err));
            },(err)=>next(err))
            .catch(err=>next(err));
        }
    },(err)=>next(err))
    .catch(err=>next(err));
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    Favorites.findOneAndDelete({"user":req.user.id})
    .then((result)=>{
        res.statusCode = 200;
        res.setHeader('content-type','application/json');
        res.json(result);
    },(err)=>next(err))
    .catch(err=>next(err));
});

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req,res)=>{res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req,res,next) => {
    Favorites.find({"user":req.user.id})
    .then((favorite)=>{
        if(!favorite){
            res.statusCode = 200;
            res.setHeader('content-type','application/json');
            return res.json({"exists":false, "favorite": favorite});
        }
        else{
            if(favorite.dishes.indexOf(req.params.dishId) < 0){
                res.statusCode = 200;
                res.setHeader('content-type','application/json');
                return res.json({"exists":false, "favorite": favorite});
            }
            else{
                res.statusCode = 200;
                res.setHeader('content-type','application/json');
                return res.json({"exists":true, "favorite": favorite});
            }
        }
    },(err)=>next(err))
    .catch(err=>next(err));
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    Favorites.find({"user":req.user.id})
        .then((favorite)=>{
                if(favorite && favorite.dishes.id(req.params.dishId)){
                        favorite.dishes.id(req.params.dishId).remove();
                        favorite.save()
                        .then((favorite)=>{
                            Favorites.findById(favorite._id)
                                .then((favorite)=>{
                                    res.statusCode=200;
                                    res.setHeader('content-type','application/json');
                                    res.json(dish);
                                });
                        },err=>{next(err)});
                }
                else {
                    err = new Error('dish ' + req.params.dishId + 'not found');
                    res.statusCode = 404;
                    return next(err);
                }
        },(err)=>next(err))
        .catch((err)=>next(err));
});

module.exports = favoriteRouter;