const { Command } = require('discord.js-commando');
const { getUser } = require('../../util');

const { Database } = require("quickmongo");                                     const db = new Database(process.env.MONGO_URI);

module.exports = class Twitch extends Command {
	constructor(client) {
		super(client, {
			name: 'notifytwitch',
			group: 'notifications',
			memberName: 'twitch',

			aliases: ['twitchlive', '!tracktwitch'],
			description: `Used to notify whenever a twitch channel hgoes live!`,
			examples: ['!notifytwitch forsen #general @everyone', '!twitchlive xqcow #live @twitch', '!tracktwitch nickmercs #announcements @here'],
			args: [{
				name: 'twitch',
				key: 'twitch',
				type: 'string',
				prompt: 'What twitch channel would you like to track?',
				validate: async val => {
					let id = getUser(val);
if (!id) return `Unable to find twitch channel ${val}`;
				
				return true;
				}
			}, {
				name: 'channel',
				type: 'text-channel',
				prompt: 'Where would you like the announcements to be posted?',
				key: 'channel',
			}, {
				name: 'role',
				key: 'role',
				type: 'role',
				prompt: 'What role would you like to mention?',
				default: ''
			}, {
				name: 'message',
				key: 'message',
				type: 'string',
				prompt: 'what message would you like?',
				default: ''
			}]
		});
	}

	async run(message, args) {
		const twitchChannel = await getUser(args.twitch);
		const textChannel = args.channel;
		const role = args.role;

		if (!db.get('twitch_channels')) db.set('twitch_channels', {});
		if (!db.get(`twitch_channels.${twitchChannel.id}`)) db.set(`twitch_channels.${twitchChannel.id}`, {data: []});
		db.push(`twitch_channels.${twitchChannel.id}.data`, {role: `<@&${role.id}>`, message: args.message, channel: textChannel.id});
		message.reply('Successfully tracking twitch channel!');

	}
}
