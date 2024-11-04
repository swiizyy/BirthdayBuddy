import { ApplyOptions } from '@sapphire/decorators';
import { isTextBasedChannel } from '@sapphire/discord.js-utilities';
import { ApplicationCommandRegistry, Awaitable, Command } from '@sapphire/framework';
import { ChatInputCommandInteraction, EmbedBuilder, InteractionContextType } from 'discord.js';

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
				.addIntegerOption((option) => option.setName('année').setDescription("L'année de votre anniversaire").setRequired(false))
		);
	}

	public override async chatInputRun(interaction: ChatInputCommandInteraction<'cached'>) {
		if (!this.isValidInteraction(interaction)) {
			return interaction.reply({ content: 'Cette commande ne peut être utilisée que dans les guildes.', ephemeral: true });
		}

		const { day, month, year } = this.extractDateOptions(interaction);

		if (!this.isValidDate(day, month, year)) {
			return interaction.reply({ content: "La date fournie n'est pas valide. Veuillez entrer une date valide.", ephemeral: true });
		}

		try {
			const birthday = await this.upsertBirthday(interaction, day, month, year);
			const embed = this.createBirthdayEmbed(interaction, birthday, day, month, year);
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
		const year = interaction.options.getInteger('année', false) ?? undefined;
		return { day, month, year };
	}

	private upsertBirthday(interaction: ChatInputCommandInteraction<'cached'>, day: number, month: number, year?: number) {
		return this.container.prisma.birthday.upsert({
			where: { userId_guildId: { userId: interaction.user.id, guildId: interaction.guild.id } },
			update: { day, month, year },
			create: { day, month, year, userId: interaction.user.id, guildId: interaction.guild.id }
		});
	}

	private createBirthdayEmbed(interaction: ChatInputCommandInteraction<'cached'>, birthday: any, day: number, month: number, year?: number) {
		const asYear = Boolean(birthday.year);
		const formattedDate = this.formatDate(day, month, year);
		const description = String.raw`
    Cet anniversaire a bien été défini au ${formattedDate}.
    Vous fêterez ${asYear ? `vos ${year} ans` : 'votre prochain anniversaire'} dans ${this.getTimeUntilBirthday(day, month)}.
    `;

		return new EmbedBuilder()
			.setAuthor({
				name: interaction.user.username,
				iconURL: interaction.user.displayAvatarURL()
			})
			.setDescription(description)
			.setFooter({
				text: 'Anniversaire enregistré',
				iconURL: interaction.guild.iconURL() || undefined
			})
			.setTimestamp()
			.setColor('#00FF00');
	}

	private formatDate(day: number, month: number, year?: number): string {
		const formatter = Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' });
		return formatter.format(new Date(year || 2000, month - 1, day));
	}

	private getTimeUntilBirthday(day: number, month: number): string {
		const now = new Date();
		const currentYear = now.getFullYear();
		const birthday = new Date(currentYear, month - 1, day);

		if (birthday < now) {
			birthday.setFullYear(currentYear + 1);
		}

		return `<t:${Math.floor(birthday.getTime() / 1000)}:R>`;
	}

	private isValidDate(day: number, month: number, year?: number): boolean {
		const date = new Date(year || 2000, month - 1, day);
		return date.getDate() === day && date.getMonth() === month - 1;
	}
}
