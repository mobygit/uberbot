const Discord = require('discord.js-commando');

const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');

const Koa = require('koa');
const _ = require('koa-route');

const client = new Discord.Client({
	owner = process.env.OWNER_ID,
	prefix: '!'
});

describe('Discord', function () {
	it('should be able to register defaults', function () {
		client.registry
			.registerDefaults();
			
	});
	it('should be able to register commands'), function () {
		client.registry
			.registerCommandsIn(path.join(__dirname, '../commands'))
	});
	it('should be able to load the database', function () {
		
	});
	it('should be able to successfully authenticate', function () {
		client
			.login(process.env.TOKEN);
	});
});

var app;

describe('Webserver', function() {
	it('should be able to create an app', function() {
		app = new Koa();
	});

	it('should be able to route', function() {
		app.use(_.get('/', 'This is a test server.');
	});

	it('should be able to listen', function() {
		app.listen(process.env.PORT || 8080);
	});
});
