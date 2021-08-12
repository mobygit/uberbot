const { stripIndents, oneLine } = require('common-tags');
const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const urban = require('urban');

function searchDefinition(word) {
	return new Promise((resolve, reject) => {
		urban(word).first(json => resolve(json));
	});
}

module.exports = class Urban extends Command {
	constructor(client) {
		super(client, {
			name: 'urban',
			group: 'fun',
			memberName: 'urban',
			aliases: ['ud', 'urbandictionary'],
			description: 'Looks up a definition on urban dictionary',
			examples: ['urban edward', 'ud john', 'ud eduardo picasso'],
			args: [
				{
					key: 'word',
					name: 'word',
					prompt: 'What word would you like to look up?',
					type: 'string',
					infinite: false
				}
			]
		});
	}

	async run(msg, args) {
		const { word } = args;

		if (word) {
			msg.channel.send('Searching... :mag_right:')
				.then(msg => msg.delete({ timeout: 2500 }));

			let definition = await searchDefinition(word);

			console.log(definition);

			return msg.channel.send(new MessageEmbed()
					.setAuthor('Urban Dictionary', 'https://urbandictionary.com/')
					.setTitle(definition.word)
					.addField('Defintion', `**${definition.definition}**`)
					.addField('Example', `*${definition.example}*`));
		} else {
			return msg.reply('Failed to find definition!');
		}
	}
}
