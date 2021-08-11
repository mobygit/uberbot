const { stripIndents, oneLine } = require('common-tags');
const { MessageEmbed, Permissions } = require('discord.js');
const commando = require('discord.js-commando');
const { util, Command } = commando;
const { disambigation } = util;

function toWord(str) {
	var finalResult = result.charAt(0).toUpperCase() + result.slice(1);
}

function generateHelp(command, prefix) {
	let help = new MessageEmbed()
		.setColor('#0099ff')
		.setAuthor('uberbot help', this.client.user.avatarURL(), 'https://uberbot.xyz/')
		.setTitle(`${prefix}${command.name}${command.nsfw ? ' (NSFW)' : ''}${command.guildOnly ? ' (Only usuable in servers)' : ''}`)
		.setDescription(prefix.description)
		.addField('Aliases', command.aliases
			.map(alias => `${prefix}${alias}`)
			.join(', ')
		)
		.addField('Details', command.details)
		.addField('Examples', `\`\`\`${command.examples.join('\n')}\`\`\``)
		.setTimestamp()
		.setFooter(`Message autogenerated by uberbot, DM ${this.client.owners[0].tag} if you have any issues.`, this.client.user.avatarURL());

	
	return help
}

module.exports = class HelpCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'help',
			group: 'util',
			memberName: 'help',
			aliases: ['commands', 'cmds'],
			description: 'Displays a list of available commands, or detailed information for a specified command.',
		details: oneLine`
				The command may be part of a command name or a whole command name.
				If it isn't specified, all available commands will be listed.`,
			examples: ['help', 'help prefix'],
			guarded: true,

			args: [
				{
					key: 'command',
					prompt: 'Which command would you like to view the help for?',
					type: 'string',
					default: ''
				}
			]
		});
	}

	async run(msg, args) {
		const commands = this.client.registry.findCommands(args.command, false, msg)
			.filter(command => !command.hidden)
			.filter(command => command.ownerOnly && this.client.isOwner(msg.author))


		const invite = await this.client.generateInvite({
			permissions: [
    				Permissions.FLAGS.ADMINISTRATOR
  			],
  			scopes: ['bot'],
		})

		let prefix = this.client.commandPrefix || process.env.PREFIX ||
'!';
		const groups = [...new Set(commands.map((command) => command.options.group))];
		const showAll = !args.command || args.command && args.command.toLowerCase() === 'all';
        
		if (showAll || commands.length <= 15 && commands.length > 0) {	
			const embed = new MessageEmbed()
				.setColor('#0099ff')
				.setDescription(`Run ${prefix}help <command> for more details on a command`)
				.setTitle(`${!args.command ? 'General ' : ''}Help${args.command ? ` (filtered by ${args.command})` : ``}`)
				.setAuthor('uberbot Help', this.client.user.avatarURL(), 'https://uberbot.xyz/')
				.setTimestamp()

				.setFooter(`Message autogenerated by uberbot, DM ${this.client.owners[0].tag} if you have any issues.`, this.client.user.avatarURL())
			.addFields(groups
				.map((group) => {
                        		return {
										name: group,
                            		value: commands
							.filter(command => command.group === group)
							.map(command => `\`${command.name}\``)							.join(", ")
										}
				})
					.concat([
						{
							name: "Useful Links",
							value: `[Invite Me](${invite})`,
						}
                    		
		    		])
			)

			if (msg.channel.type !== 'dm') msg.reply('Sent you a DM with information.');
			return await msg.direct({ embed })		
		} else if (commands.length > 15) {
			return await msg.reply('Be more specific!  Multiple commands with that name were found.')
		} else if (commands.length === 1) {
			if (this.client.isOwner(msg.author)) {
				return await msg.direct(generateHelp(commands[0], prefix))	
			}
		} else {
			
				return await msg.reply(`Can't find command by the of ${args.command}! Use ${msg.usage(
					null, msg.channel.type === 'dm' ? null : undefined, msg.channel.type === 'dm' ? null : undefined
					)} to view the list of all commands.`)	
		}
	}
};
