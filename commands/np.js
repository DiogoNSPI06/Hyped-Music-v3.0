const Discord = require('discord.js');

module.exports.run = async (client, message, args, color, config) => {
  const { channel } = message.member.voice;

  if (!channel) {
    return message.channel.send(config.reply.outVoice);
  }

  const serverQueue = message.client.queue.get(message.guild.id);

  if (!serverQueue) {
    return message.channel.send("❌ | Não há nada tocando!");
  }

  const embed = new Discord.MessageEmbed()
  .setTitle("🎵 | Tocando agora:")
  .setDescription(`${serverQueue.songs[0].title}`)
  .setThumbnail(serverQueue.songs[0].thumbnail)
  .setColor(color);

  message.reply(embed)
}