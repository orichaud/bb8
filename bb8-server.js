var express = require('express');
var cylon = require('cylon');
var program = require('commander');
var events = require('events');

function buildEnv() {
    program
        .version('0.0.1')
        .option('-u, --uuid <UUID>', 'set UUID of Blutooth device')
        .option('-p, --port <Port>', 'set port to listen to')
        .parse(process.argv);

    var uuid;
    var port = 8080

    if (program.uuid) {
        uuid = program.uuid;
        console.log('UUID given: ' + uuid);
    } else {
        console.error('No UUID has been specified. Exiting');
        process.exit(1);
    }
    if (program.port) {
        port = program.port;
        console.log('Port given: ' + port);
    } else {
        console.error('No port has been defined. Default port used: ' + port);
    }
    return {
        uuid: uuid,
        port: port,
        eventEmitter: new events.EventEmitter()
    };
}

function buildApp(env) {
    var app = express();
    app.disable('x-powered-by');

    app.get('/color/:color', function(req, res) {
        env.eventEmitter.emit('color', {
                color: req.params.color
            },
            res);
    });
    app.get('/roll/:speed-:heading', function(req, res) {
        env.eventEmitter.emit('roll', {
                speed: req.params.speed,
                heading: req.params.heading
            },
            res);
    });
    app.get('/status', function(req, res) {
        env.eventEmitter.emit('status', {},
            res);
    });
    app.get('/ping', function(req, res) {
        env.eventEmitter.emit('ping', {},
            res);
    });

    return app;
}

function buildRobot(env) {
    var robot = cylon.robot({
        connections: {
            bluetooth: {
                adaptor: 'central',
                uuid: env.uuid,
                module: 'cylon-ble'
            }
        },
        devices: {
            battery: {
                driver: "ble-battery-service"
            },
            deviceInfo: {
                driver: "ble-device-information"
            },
            generic: {
                driver: "ble-generic-access"
            },
            bb8: {
                driver: 'ollie'
            } // Assuming a Ollie device, could be a Sphero too
        },

        onColor: function(event, res) {
            this.bb8.setRGB(event.color);
            console.log('<color> event processed - ' + event.color);
            res.json(event);
        },

        onRoll: function(event, res) {
            console.log('<roll> event processed - ' + event);
            res.json(event);
        },

        onStatus: function(event, res) {
            console.log('<status> event processed - ' + event);

            this.generic.getDeviceName(function(err, data) {
                console.log(data)
                
            });

            res.json({
                status: 'ok'
            });
        },

        onPing: function(event, res) {
            this.bb8.ping(function(err, data) {
                console.log(err || "data: " + data);
                res.json({
                    data: data
                });
            });
        },

        work: function(my) {
            my.bb8.wake(function(err, data) {
                console.log('BB-8 - Wake up');
                my.bb8.setRGB(0x000000);

                env.eventEmitter.on('color', my.onColor);
                env.eventEmitter.on('roll', my.onRoll);
                env.eventEmitter.on('status', my.onStatus);
                env.eventEmitter.on('ping', my.onPing);

                every((30).second(), function() {
                    console.log('BB-8 is alive');
                });
            });
            console.log('Quitting work function - all events registered');
        }
    });
    return robot;
}

var env = buildEnv();
var app = buildApp(env);
var robot = buildRobot(env);

robot.start();
app.listen(env.port);

console.log('Server listenting on port: ' + env.port);
