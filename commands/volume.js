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

  if(!args[0]) {
    return message.channel.send(`✅ | O volume atual é: ${serverQueue.volume}`)
  }

  if(isNaN(args[0])) {
    return message.channel.send("❌ | Use apenas valores numéricos!")
  }

  if(args[0] > 200) {
    return message.channel.send("❌ | Você passou o limite de **200**!")
  }

  serverQueue.volume = args[0]
  serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100)
  message.reply(`✅ | Volume definido para: **${args[0]}**`)
}