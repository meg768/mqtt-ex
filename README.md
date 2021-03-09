# mqtt-ex
A replacement for MQTT.js (https://www.npmjs.com/package/mqtt) which
also supports message routing for specific topics.

Simply call the **on** function with the topic you want to handle.

## Example

```javascript

var Mqtt = require('mqtt-ex');
var client = Mqtt.connect(host, options);

...

// Subscribe to the topics you want, just as you would using MQTT.js
client.subscribe('homey/devices/#');

...

// Perform specific tasks on each topic
client.on('homey/devices/:device/onoff', (topic, message, args) => {
	console.log(`Lightbulb/socket ${args.device} is set to state ${message}`);
});

client.on('homey/devices/:device/alarm_motion', (topic, message, args) => {
	console.log(`Sensor ${args.device} is set to state ${message}`);
});

client.on('homey/devices/:device/:capability', (topic, message, args) => {
	console.log(`Device ${args.device}:${args.capability} is set to ${message}`);
});

// You may also receive messages as usual...
client.on('message', (topic, message) => {
	console.log(`Message ${message.toString()} from topic ${topic}`);
});

```
