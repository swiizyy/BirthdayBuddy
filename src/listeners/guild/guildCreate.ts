import { Listener } from '@sapphire/framework';
import { Guild } from 'discord.js';

export class UserEvent extends Listener {
  public run(guild: Guild) {
    this.container.prisma.guild.upsert({
      where: { id: guild.id },
      create: {
        id: guild.id,
      },
      update: {},
    });

    this.container.logger.info(`[GUILD JOIN] ${guild.name} (${guild.id}) added the bot.`);
  }
}