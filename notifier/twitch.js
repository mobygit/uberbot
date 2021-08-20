const WebSocket = require('ws');
const EventEmitter = require('events');
const moment = require('moment');
const db = require('quick.db');

if (!db.get('twitch_channel')) db.set('twitch_channel', {});

const { getUserFromName, getChannel, getStreams, getUsersById } = require('../util');

const SOCKET_COUNT = 10;
const MAX_TOPICS = 50;

const TWITCH_API_DELAY = 3 * 60;

class TwitchEmitter extends EventEmitter {}

module.exports = function module(client) {
	const twitchEvent = new TwitchEmitter();

	let x = 0;
	const sockets = Array(SOCKET_COUNT)
		.fill({
			socket: new WebSocket('wss://pubsub-edge.twitch.tv/v1'),
			topics: 0,
			lastPong: moment().unix()
		});

	function addChannel(socket, id) {                                                      socket.socket.send(JSON.stringify({                                                     type: 'LISTEN',                                                                 data: {                                                                                 topics: [`broadcast-settings-update.${id}`]                                                                                                             }                                                                       }));                                                                            socket.topics++;                                                        }

	function incomingPubSub(sub, socket) {
		sub = JSON.parse(sub);

		if (sub.type === 'PONG') {
			socket.lastPong = moment().unix();
		};

		if (sub.type !== 'MESSAGE') return;

		let { topic, message } = sub.data;
		let channelId = topic.split('.').pop();

		let channel = db.get(`twitch_channel.${channelId}`);
    		let seconds = Math.round(+new Date() / 1000 - data.server_time);

		if (topic.startsWith('video-playback-by-id')) 
			if (message.type == 'stream-up') {
				if (channel.live) {
										channel.live = false;
					channel.game = message.game;
					channel.ending = true;
					
channel.end_time = data.server_time
					db.set(`twitch_channel.${channelId}`, channel);
					return;
				}

				getChannel(channelId).then(_data => {
					channel.game = _data.game
					channel.status = _data.status
					channel.peak_viewers = 0;
					channel.start_time = data.server_time;

db.set(`twitch_channel.${channelId}`, channel);
					postLiveNotifications(channel);

				});
			}
		}
	}

	function postLiveNotifications(channel) {
		channels.data.forEach(value => {                                                                                                                                                                client.channels.fetch(value.channel).then(textChannel => {                                                                      textChannel.send(`${value.role} ${value.message || `${channel.displayName} Just went live!  Go watch!`} https://www.twitch.tv/${channel.name}`);                                                });
		});
	}

	function bindSocketHandlers(socket) {
		socket.socket.on('message', message => {
			incomingPubSub(message, socket);
		});

		socket.socket.on('open', () => {
			socket.socket.send(JSON.stringify({
				type: 'PING'
			}));

			addChannel(socket, 0);

			x += socket.topics;
			for (let [key, channel] of channels.entries()) {
				if (x % MAX_TOPIC == 0) break;
				addChannel(socket, channel);
				x++;
			};


		});
	}

	function reconnectSocket(socket) {
		socket.reopen = true;
		socket.socket.terminate();

		socket.topics = 0;
		socket.socket = new WebSocket('wss://pubsub-edge.twitch.tv/v1');
	}


	function updateChannels() {
		sockets.forEach(socket => {
			if (socket.ws.readyState == 1) socket.socket.send(JSON.stringify({ type: 'PING' }));

			if (moment().unix() - socket > 90) reconnectSocket(socket);
		});


		let trackedChannels = db.get(`twitch_channels`);
		let checkChannels = Object.keys(trackedChannels);

		let requestChannels = []; let requestUsers = [];

		for (let i = 0; i < checkChannels.length; i += 100) {
			let check = checkChannels.slice(i, i + 100);
			requestChannels.push(getStreams(check));
			requestUsers.push(getUsers(check));

		}

		Promise.all(requestChannels).then(results => {
				let channelIds = [];
				results.forEach(result => channelIds.concat(result));
				
				

				checkChannels.forEach(id => {
					let channel = trackedChannels[id];
					let filteredStreams = channelIds.filter(a => a._data.channel._id == id);
let stream;

            if(filteredStreams.length > 0) stream = filteredStreams[0];

            if (stream) {
                channel.game = stream.game;
                channel.status = stream.channel.status;
                channel.start_date = moment(stream.startDate).unix();
                channel.end_date = moment().unix();
            }

					if (channel.live) {
                if (!stream && moment().unix() - channel.start_date >= TWITCH_API_DELAY) {
                    channel.ending = true;
                    channel.end_date = moment().unix();
		}
            } else {
                if (stream) {
			channel.live = true;
			channel.ending = false;
			postLiveNotifications(channel);
		}
	    }
			});
							});
	}

	let filteredSockets = sockets.filter(socket => socket.topics < MAX_TOPICS);
	filteredSockets.forEach(socket => bindSocketHandlers(socket));

	setInterval(updateChannels, 60 * 1000);
	setTimeout(updateChannels, 4 * 1000);
}
