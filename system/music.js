const ytdlDiscord = require("ytdl-core-discord");
const Discord = require("discord.js");
const localDB = require('quick.db');

const config = require('../config.json')

module.exports = {
  async play(song, message) {
    const queue = message.client.queue.get(message.guild.id);

    if(!song) {
      queue.channel.leave();
      message.client.queue.delete(message.guild.id);
    }

    queue.connection.on("disconnect", () => {
      queue.channel.leave();
      message.client.queue.delete(message.guild.id);
      localDB.delete(`queue_${message.guild.id}`)
      return queue.textChannel
        .send("❌ | A musica parou!")
        .catch(console.error);
    })

    try {
      var stream = await ytdlDiscord(song.url, {
        highWaterMark: 1 << 25
      });
    } catch (error) {
      if (queue) {
        queue.songs.shift();
        module.exports.play(queue.songs[0], message);
      }
    }

    const dispatcher = queue.connection
      .play(stream, { type: "opus" })
      .on("finish", () => {
        if (queue.loop) {
          let lastsong = queue.songs.shift();
          queue.songs.push(lastsong);
          module.exports.play(queue.songs[0], message);
        } else {
          queue.songs.shift();
          module.exports.play(queue.songs[0], message);
        }
      })
    .on("error", console.error);
    
    dispatcher.setVolumeLogarithmic(queue.volume / 100);
    const embed = new Discord.MessageEmbed()
    .setTitle("🎵 | Tocando agora:")
    .setDescription(`**[${song.title}](${song.url})**`)
    .setThumbnail(song.thumbnail)
    .setColor(config.color);

    queue.textChannel.send(embed).catch(err => message.channel.send("❌ | Não posso tocar esta musica!"))
  }
}