const Mqtt = require('mqtt');

function makeChangesToMqttClient(client) {

	var topics = [];

	// Add a default listener
	client.addListener('message', (topic, message) => {
	
		// Returns a match if two paths are equal (including variables)
		function isMatch(A, B) {
			var args = {};
	
			var A = A.split('/');
			var B = B.split('/');
	
			if (A.length != B.length)
				return null;
	
			for (let i = 0; i < A.length; i++) {
				if (A[i] != B[i]) {
					let match = B[i].match(/^:([a-zA-Z0-9]+)$/);
	
					if (!match)
						return null;
	
					args[match[1]] = A[i];
				}
			}
	
			return args;
		}

		// Should it be converted?
		message = message.toString();

		// If a topic is matched, emit an event to the registered topic
		topics.forEach((item) => {
			let match = isMatch(topic, item);

			if (match) {
				client.emit(item, topic, message, match);
			}

		});

	});

	// Override on() so we may record topics
	client.on = function(topic, fn) {
		// Add topic
		topics.push(topic);

		// And add to listeners
		client.addListener(topic, fn);
	}

	return client;
}

function connect(host, options) {
	return makeChangesToMqttClient(Mqtt.connect(host, options));
}

module.exports.connect = connect;
module.exports.MqttClient = Mqtt.MqttClient;
module.exports.Client = Mqtt.MqttClient;
module.exports.Store = Mqtt.Store;

