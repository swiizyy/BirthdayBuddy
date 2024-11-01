import { Listener } from "@sapphire/framework";
import { GuildMember } from "discord.js";

export class UserListener extends Listener {
  public run(member: GuildMember) {
    this.container.logger.info(`[GUILD MEMBER ADD] ${member.user.tag} (${member.id}) joined ${member.guild.name} (${member.guild.id}).`);
  }
}