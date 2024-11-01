import { Listener } from "@sapphire/framework";
import { GuildMember } from "discord.js";

export class GuildMemberRemove extends Listener {
  public run(member: GuildMember) {
    this.container.logger.info(`[GUILD MEMBER REMOVE] ${member.user.tag} (${member.id}) left ${member.guild.name} (${member.guild.id}).`);
  }
}