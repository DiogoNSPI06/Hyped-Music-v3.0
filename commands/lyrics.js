const lyrics = require('genius-lyrics');
const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async (client, message, args,  color, config) => {
  const Client = new lyrics.Client();

  const serverQueue = message.client.queue.get(message.guild.id);

  if (!serverQueue) {
    const embd = new Discord.MessageEmbed()
    embd.setAuthor("❌| Bot não está tocando nada")
    return message.channel.send(embd);
  }
  
  try {
    const search = await Client.songs.search(`${db.get(`queue_${message.guild.id}`)}`);
    const firstSong = search[0]
    const lyric = await firstSong.lyrics();

    const embed = new Discord.MessageEmbed()
    .setTitle(`🎵| Lyrics da musica: ${serverQueue.songs[0].title}`)
    .setDescription(lyric)
    .setColor(color)
    .setFooter(`-> Powered by GENIUS <-`)
    message.channel.send(embed).then(m => m.react('🎵'))

  } catch (err) {
    message.reply("❌ | Não achei lyrics para está musica!")
  }
}