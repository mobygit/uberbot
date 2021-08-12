const commando = require('discord.js-commando');
const Discord = require('discord.js');
const path = require('path');

const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');

const Koa = require('koa');
const _ = require('koa-route');
const app = new Koa();

const { oneLine } = require('common-tags');

const client = new commando.Client({
	owner: process.env.OWNER_ID || '158327940311023616',
	prefix: undefined
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


client
	
	.on('ready', () => {
		console.log('ready!');
		client.user.setStatus('available');
		client.user.setActivity({
			name: `${client.guilds.cache.size} servers | do @${client.username} help`,
			type: 'STREAMING',
			url: 'https://uberbot.xyz'
		});
	})
	.on('disconnect', () => { console.warn('Disconnected!'); })
	.on('reconnecting', () => { console.warn('Reconnecting...'); })
	.on('commandError', (cmd, err) => {
		if(err instanceof commando.FriendlyError) return;
		console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
	})
	.on('commandBlocked', (msg, reason) => {
		console.log(oneLine`
			Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''}
			blocked; ${reason}
		`);
	})
	.on('commandPrefixChange', (guild, prefix) => {
		console.log(oneLine`
			Prefix ${prefix === '' ? 'removed' : `changed to ${prefix || 'the default'}`}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
	})


client.setProvider(
    sqlite.open({ filename: 'database.db', driver: sqlite3.Database }).then(db => new commando.SQLiteProvider(db))
).catch(console.error);

app.use(_.get('/', async ctx => {
	ctx.body = 'Bot is up!'
}));

client.login(process.env.TOKEN);
app.listen(process.env.PORT || 5000);

