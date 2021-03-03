const Router=require('express').Router
const user= require('./user');

const routes = Router();

routes.use('/user',user)

module.exports= routes;