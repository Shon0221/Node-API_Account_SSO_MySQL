var cluster = require('cluster');
var workers = {};

if (cluster.isMaster) {
    // CPU number
    var numCPUs = require('os').cpus().length;
    console.log('CPU ' + numCPUs);

    // Create a worker for each CPU
    for (var i = 0; i < numCPUs; i++) {
        worker = cluster.fork();
        workers[worker.pid] = worker;
    }

    cluster.on('online', function(worker) {
        // logger.info('Worker ' + worker.process.pid + ' is online.');
        console.log('Worker ' + worker.process.pid + ' is online.');
    });

    cluster.on('exit', function(worker, code, signal) {
        // logger.warn('worker ' + worker.process.pid + ' died.');
        console.log('worker ' + worker.process.pid + ' died.');
        // delete workers[worker.pid];
        // worker = cluster.fork();
        // workers[worker.pid] = worker;
    });
} else {
    /**
     * Module dependencies.
     */
    var express = require('express'),
        bodyParser = require("body-parser"),
        connectDomain = require('connect-domain'),
        fs = require("fs"),
        logger = require('morgan'),
        session = require('express-session');

    var httpsExpress = express();
    var port = process.env.PORT || 58989;

    var http = express();
    var portOfHTTP = process.env.PORT || 9999;

    var host = '192.168.10.4';
    // var host = '192.168.0.102';

    // Https Configuration
    httpsExpress.use(express.static(__dirname + '/public'));
    httpsExpress.use(logger('dev'));
    httpsExpress.use(bodyParser.text({ defaultCharset: 'utf-8' }));
    httpsExpress.use(connectDomain());

    // Added for error: request entity too large --start
    httpsExpress.use(bodyParser.json({ limit: '64mb' }));
    httpsExpress.use(bodyParser.urlencoded({ limit: '64mb', extended: true }));
    // Added for error: request entity too large --end

    // Http Configuration
    http.use(express.static(__dirname + '/public'));
    http.use(logger('dev'));
    http.use(bodyParser.text({ defaultCharset: 'utf-8' }));
    http.use(connectDomain());
    http.use(session({
        resave: false, // don't save session if unmodified
        saveUninitialized: false, // don't create session until something stored
        secret: 'shhhh, very secret'
    }));

    // Added for error: request entity too large --start
    http.use(bodyParser.json({ limit: '64mb' }));
    http.use(bodyParser.urlencoded({ limit: '64mb', extended: true }));
    // Added for error: request entity too large --end

    // console.log("HTTPS sever started " + port);
    config = {
        key: fs.readFileSync('./ssl/ryans-key.key').toString(),
        cert: fs.readFileSync('./ssl/ryans-cert.cert').toString()
    };

    httpsServer = require('https').createServer(config, httpsExpress).listen(port, host, function() {
        // logger.info("HTTPS sever started " + port);
    });

    httpsServer.timeout = 5000;

    http.listen(portOfHTTP, function() {
        // logger.info("HTTP sever started " + portOfHTTP);
    });

    // Routes
    require('./routes/RoutesOfHttps.js')(httpsExpress);
    require('./routes/RoutesOfHttp.js')(http);
}