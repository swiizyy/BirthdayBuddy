import { Listener } from '@sapphire/framework';
import { Guild } from 'discord.js';


export class UserEvent extends Listener {
  public run(guild: Guild) {
    this.container.prisma.guild.delete({ where: { id: guild.id } });
    this.container.logger.info(`[GUILD LEAVE] ${guild.name} (${guild.id}) removed the bot.`);
  }
}