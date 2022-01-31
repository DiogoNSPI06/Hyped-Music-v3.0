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

  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
}