const express = require('express');
const bodyParser = require('body-parser');

const promotionRouter = express.Router();

promotionRouter.use(bodyParser.json());

promotionRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    res.end('Will send you all the promotions!');

})
.post((req,res,next) => {
    res.end('Will add the promotion: ' + req.body.name + ' with the detail: ' + req.body.description);

})
.put((req,res,next) => {
    res.statusCode = 403;
    res.end('PUT not supported on /promotions');

})
.delete((req,res,next) => {
    res.end('Will delete all the promotions!');
});

promotionRouter.route('/:promoId')
.get((req,res,next) => {
    res.end('Will send you the promotion: ' + req.params.promoId);

})
.post((req,res,next) => {
    res.statusCode = 403;
    res.end('POST not supported on /promotions');
})
.put((req,res,next) => {
    res.write('Updating the promotion: ' + req.params.promoId + '\n');
    res.end('will update the promotion: ' + req.body.name + ' with the details: ' + req.body.description);

})
.delete((req,res,next) => {
    res.end('Will delete the promotion: ' + req.params.promoId);
});

module.exports = promotionRouter;