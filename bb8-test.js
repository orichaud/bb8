var cylon = require('cylon');
var program = require('commander');

program
    .version('0.0.1')
    .option('-u, --uuid <UUID>', 'set UUID of Blutooth device')
    .parse(process.argv);

var uuid;

if (program.uuid) {
    uuid = program.uuid;
    console.log('UUID given: ' + uuid);
} else {
    console.error("No UUID has been specified. Exiting");
    process.exit(1);
}

cylon.robot({
    connections: {
        bluetooth: {
            adaptor: 'central',
            uuid: uuid,
            module: 'cylon-ble'
        }
    },

    devices: {
        bb8: {
            driver: 'ollie' // Assuming a Ollie device, could be a Sphero too
        }
    },

    display: function(err, data) {
        if (err) {
            console.log("Error:", err);
        } else {
            console.log("Data:", data);
        }
    },

    work: function(my) {
        my.bb8.wake(function(err, data) {
            console.log("BB-8 - Wake up");

            after(100, function() {
                my.bb8.setRGB(0x0000FF);
                console.log("BB-8 - Light on");
            });
            after(1000, function() {
                my.bb8.setRGB(0xFFFFFF);
                console.log("BB-8 - Light on");
            });
            after(2000, function() {
                my.bb8.setRGB(0xFF0000);
                console.log("BB-8 - Light on");
            });

            after(10000, function() {
                my.bb8.stop();
                process.exit(0)
                console.log("BB-8 - Robot stopped, exiting");
            });

            every((1).second(), function() {
                my.bb8.roll(60, Math.floor(Math.random() * 360));
            });
        });
    }
}).start();
