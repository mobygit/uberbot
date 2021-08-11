describe('Discord', function() {
	it('should be able to successfully authenticate', function() {
		var Discord = require('discord.js');
		let client = new Discord.Client();
		client.login('MzU0MzU4MDA3Mzc2NjQyMDQ4.Wa2znA.lIQZrJSSBMs655GHTTKen25jsmM');
	});
});
