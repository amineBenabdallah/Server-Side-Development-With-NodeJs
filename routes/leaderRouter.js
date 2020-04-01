const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    res.end('Will send you all the leaders!');

})
.post((req,res,next) => {
    res.end('Will add the leader: ' + req.body.name + ' with the detail: ' + req.body.description);

})
.put((req,res,next) => {
    res.statusCode = 403;
    res.end('PUT not supported on /leaders');

})
.delete((req,res,next) => {
    res.end('Will delete all the leaders!');
});

leaderRouter.route('/:leaderId')
.get((req,res,next) => {
    res.end('Will send you the leader: ' + req.params.leaderId);

})
.post((req,res,next) => {
    res.statusCode = 403;
    res.end('POST not supported on /leaders');
})
.put((req,res,next) => {
    res.write('Updating the leader: ' + req.params.leaderId + '\n');
    res.end('will update the leader: ' + req.body.name + ' with the details: ' + req.body.description);

})
.delete((req,res,next) => {
    res.end('Will delete the leader: ' + req.params.leaderId);
});

module.exports = leaderRouter;