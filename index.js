const Commando = require('discord.js-commando');
const Discord = require('discord.js');
const path = require('path');

const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');

const client = new Commando.Client({
	owner: process.env.OWNER_ID,
	prefix: process.env.PREFIX | '!'
});


client.registry
	.registerGroups([
        	['fun', 'Fun Commands'],
		['util', 'Utility Commands'],
        	['commands', 'Uncategorized Commands'],
		['mod', 'Moderation-related Commands']
	])
	.registerDefaultTypes()
    	.registerCommandsIn(path.join(__dirname, 'commands'));
	// .registerTypesIn(path.join(__dirname, 'types'));

client
	.on('ready', () => {
		console.log('ready!');
		client.user.setStatus('available');
		client.user.setActivity({
			name: `${client.guilds.cache.size} servers | do !help`,
			type: 'STREAMING',
			url: 'https://uberbot.xyz'
		});
	});

client.setProvider(
    sqlite.open({ filename: 'database.db', driver: sqlite3.Database }).then(db => new Commando.SQLiteProvider(db))
).catch(console.error);

client.login(process.env.TOKEN);

