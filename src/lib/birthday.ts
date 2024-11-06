import { Birthday } from '@prisma/client';
import { container } from '@sapphire/framework';
import { ChatInputCommandInteraction, time } from 'discord.js';

export function formatDate(birthday: Date): string {
	const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
	return birthday.toLocaleDateString('fr-FR', options);
}

export function getTimeUntilBirthday(day: number, month: number): string {
	const now = new Date();
	const currentYear = now.getFullYear();
	let nextBirthday = new Date(currentYear, month - 1, day);

	if (now > nextBirthday) {
		nextBirthday = new Date(currentYear + 1, month - 1, day);
	}

	const timestamp = Math.floor(nextBirthday.getTime() / 1000);
	return time(timestamp, 'R');
}

export function getAge(birthday: Date): number {
	const now = new Date();
	let age = now.getFullYear() - birthday.getFullYear();
	const monthDiff = now.getMonth() - birthday.getMonth();
	const dayDiff = now.getDate() - birthday.getDate();

	if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
		age--;
	}

	return age;
}

export function isValidDate(day: number, month: number, year: number): boolean {
	const date = new Date(year, month - 1, day);
	return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

export function upsertBirthday(
	interaction: ChatInputCommandInteraction<'cached'>,
	day: number,
	month: number,
	year: number,
	hideYear: boolean
): Promise<Birthday> {
	const userId = interaction.user.id;
	const birthdayDate = new Date(year, month - 1, day);

	return container.prisma.birthday.upsert({
		where: { userId_guildId: { userId, guildId: interaction.guild.id } },
		update: { birthday: birthdayDate, hideYear },
		create: { userId, guildId: interaction.guild.id, birthday: birthdayDate, hideYear }
	});
}
