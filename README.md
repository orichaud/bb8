Git:
* [https://github.com/orichaud/bb8](https://github.com/orichaud/bb8)

Install or NPM modules:
```sh
npm -g install cylon
npm -g install cylon-ble
npm -g install cylon-sphero
npm -g install noble
npm -g install sphero
npm -g install serialport

```

Environment for node:
```sh
export NODE_PATH=/usr/local/lib:/usr/local/lib/node_modules
```

Scan the Bluetooth devices, however this only gives the UUID and not the BLE address:
```sh
cylon-ble-scan
```
If the BLE address is required, the solution is to use the Noble advertisement example to find the BLE address:
```sh
node /usr/local/lib/node_modules/noble/examples/advertisement-discovery.js
```

Accessing the Sphero SDK:

* GitHub: [https://github.com/orbotix/sphero.js](https://github.com/orbotix/sphero.js)
* Cylon / Sphero: [http://cylonjs.com/documentation/platforms/sphero/](http://cylonjs.com/documentation/platforms/sphero/)

The current implementation relies on Cylon.js / Sphero. The implementation assumes the BB-8 is close to Ollie by Sphero.
