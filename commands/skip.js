const Discord = require('discord.js');

module.exports.run = async (client, message, args, color, config) => {

  const { channel } = message.member.voice;

  if(!channel) {
    return message.reply(config.reply.outVoice)
  }

  const serverQueue = message.client.queue.get(message.guild.id);
  const vote = message.client.vote.get(message.guild.id);

  if (!serverQueue) {
    return message.channel.send("❌ | Não há nada tocando!");
  }
  
  const vcVote = Math.floor(message.guild.me.voice.channel.members.size / 2)
  const okie = Math.floor(message.guild.me.voice.channel.members.size / 2 - 1)

  if(!message.member.hasPermission("ADMINISTRATOR") || message.author.id !== config.owner.id) {
    if(vote.vote > okie) {
      serverQueue.connection.dispatcher.end();
      message.channel.send("✅ | Pulando a musica")
    }

    if(vote.voters.includes(message.author.id)) {
      return message.reply("❌ | Você já votou")
    }

    if(vcVote === 2) {
      serverQueue.connection.dispatcher.end();
      message.channel.send("✅ | Pulando a musica")
    }

    vote.vote++
    vote.voters.push(message.author.id)
    return message.channel.send(`❌ | Você precisa votar para pular a música, já temos: ${Math.floor(vcVote - vote.vote)} votos`)
  }
  serverQueue.connection.dispatcher.end();
  message.channel.send("✅ | Pulando a musica")
}