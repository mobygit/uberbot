const Commando = require('discord.js-commando');
const Discord = require('discord.js');
const path = require('path');

const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');

const client = new Commando.Client({
	owner: '158327940311023616',
	prefix: '!'
});

client.registry
	.registerGroups([
        	['fun', 'Fun commands'],
		['util', 'Utility commands'],
        	['commands', 'Uncategorized commands'],
		['mod', 'Moderator commands']
	])
	.registerDefaultTypes()
    	.registerCommandsIn(path.join(__dirname, 'commands'))
	.registerTypesIn(path.join(__dirname, 'types'));

client
	.on('ready', () => {
		console.log('ready!');
		bot.user.setStatus('available');
		client.user.setActivity({
			name: `${client.guilds.size} servers | do !help`,
			type: "STREAMING",
			url: "https://uberbot.xyz",
		});
	});
	
client.setProvider(
    sqlite.open({ filename: 'database.db', driver: sqlite3.Database }).then(db => new Commando.SQLiteProvider(db))
).catch(console.error);

client.login(process.env.TOKEN);

