var assert = require('assert');         describe('Discord', function() {                it('should be able to successfully authenticate', function() {
                var discord = require('discord.js');
                new Discord.Client()                            .login(process.env.TOKEN);                                      });                             });
~
