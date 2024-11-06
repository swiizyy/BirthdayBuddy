import { Birthday } from '@prisma/client';
import { ApplyOptions } from '@sapphire/decorators';
import { isTextBasedChannel } from '@sapphire/discord.js-utilities';
import { ApplicationCommandRegistry, Awaitable, Command } from '@sapphire/framework';
import { ChatInputCommandInteraction, EmbedBuilder, InteractionContextType } from 'discord.js';
import { formatDate, getAge, getTimeUntilBirthday, isValidDate, upsertBirthday } from '../lib/birthday';

@ApplyOptions<Command.Options>({
	description: 'Enregistrez votre anniversaire'
})
export class RegisterBirthday extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry): Awaitable<void> {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.setContexts(InteractionContextType.Guild)
				.addIntegerOption((option) => option.setName('jour').setDescription('Le jour de votre anniversaire').setRequired(true))
				.addIntegerOption((option) => option.setName('mois').setDescription('Le mois de votre anniversaire').setRequired(true))
				.addIntegerOption((option) => option.setName('année').setDescription("L'année de votre anniversaire").setRequired(true))
				.addBooleanOption((option) => option.setName('masquer-année').setDescription("Masquer l'année de naissance").setRequired(false))
		);
	}

	public override async chatInputRun(interaction: ChatInputCommandInteraction<'cached'>) {
		if (!this.isValidInteraction(interaction)) {
			return interaction.reply({ content: 'Cette commande ne peut être utilisée que dans les guildes.', ephemeral: true });
		}

		const { day, month, year, hideYear } = this.extractDateOptions(interaction);

		if (!isValidDate(day, month, year)) {
			return interaction.reply({ content: "La date fournie n'est pas valide. Veuillez entrer une date valide.", ephemeral: true });
		}

		try {
			const birthday = await upsertBirthday(interaction, day, month, year, hideYear);
			const embed = this.createBirthdayEmbed(interaction, birthday);
			return interaction.reply({ embeds: [embed], ephemeral: true });
		} catch (error) {
			console.error("Erreur lors de l'enregistrement de l'anniversaire :", error);
			return interaction.reply({
				content: "Une erreur s'est produite lors de l'enregistrement de votre anniversaire. Veuillez réessayer plus tard.",
				ephemeral: true
			});
		}
	}

	private isValidInteraction(interaction: ChatInputCommandInteraction<'cached'>): boolean {
		return isTextBasedChannel(interaction.channel) && Boolean(interaction.guild);
	}

	private extractDateOptions(interaction: ChatInputCommandInteraction<'cached'>) {
		const day = interaction.options.getInteger('jour', true);
		const month = interaction.options.getInteger('mois', true);
		const year = interaction.options.getInteger('année', true);
		const hideYear = interaction.options.getBoolean('masquer-année', false) ?? false;
		return { day, month, year, hideYear };
	}

	private createBirthdayEmbed(interaction: ChatInputCommandInteraction<'cached'>, { birthday, hideYear }: Birthday) {
		const formattedDate = formatDate(birthday);
		const ageText = hideYear ? `vos ${getAge(birthday)} ans` : `votre anniversaire`;
		const timeUntilBirthday = getTimeUntilBirthday(birthday.getDate(), birthday.getMonth() + 1);
		const description = `Cet anniversaire sur ce serveur a bien été défini au ${formattedDate} sur ce serveur.\nVous fêterez ${ageText} dans ${timeUntilBirthday} !`;

		return new EmbedBuilder()
			.setAuthor({
				name: interaction.user.username,
				iconURL: interaction.user.displayAvatarURL()
			})
			.setDescription(description)
			.setFooter({
				text: "Système d'anniversaire",
				iconURL: interaction.guild.iconURL() || undefined
			})
			.setTimestamp()
			.setColor('#00FF00');
	}
}
