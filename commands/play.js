const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const YoutubeAPI = require('simple-youtube-api');
const localDB = require('quick.db');

const YT_API = process.env.YOUTUBE_API_KEY

const youtube = new YoutubeAPI(YT_API);

const { play } = require("../system/music.js")

module.exports.run = async (client, message, args, color, config) => {
  if(!args[0]) {
    return message.reply("❌| Erro de sintaxe: Escreva `hy!play <URL> ou texto`")
  }

  const { channel } = message.member.voice;

  if(!channel) {
    return message.reply(config.reply.outVoice)
  }

  const reqSong = args.join(" ");
  const videoPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
  const playlistPattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/gi;
  const urlCheck = videoPattern.test(args[0]);

  localDB.set(`queue_${message.guild.id}`, reqSong)

  if (!videoPattern.test(args[0]) && playlistPattern.test(args[0])) {
    return message.reply("❌| O bot não consegue tocar playlists ainda")
  }

  const serverQueue = message.client.queue.get(message.guild.id);

  //Construindo a queue
  const queueConstruct = {
    textChannel: message.channel,
    channel,
    connection: null,
    songs: [],
    loop: false,
    volume: 100,
    playing: true
  };

  const voteConstruct = {
    vote: 0,
    voters: []
  }

  let song = null;
  let songData = null;

  if(urlCheck) {
    try {
      songData = await ytdl.getInfo(args[0])

      song = {
        title: songData.videoDetails.title,
        url: songData.videoDetails.video_url,
        duration: songData.videoDetails.lengthSeconds,
        thumbnail: songData.videoDetails.thumbnails[3].url
      } 
    } catch (err) {
      console.error(err)
      message.reply("❌| Não consigo tocar este vídeo.")
    }
  } else {
    try {
      const result = await youtube.searchVideos(reqSong, 1);
      songData = await ytdl.getInfo(result[0].url);

      song = {
        title: songData.videoDetails.title,
        url: songData.videoDetails.video_url,
        duration: songData.videoDetails.lengthSeconds,
        thumbnail: songData.videoDetails.thumbnails[3].url,
      };

    } catch (err) {
      console.log(err)
      if(err.errors[0].domain === "usageLimits") {
        return message.reply("❌| Você está realizando muitas requests. Favor aguardar 1 hora para executar este comando novamente!")
      } 
      message.channel.send(`❌| Minha api está com dificuldades para realizar a request no youtube!`)
    }
  }

  if(serverQueue) {
    if(serverQueue.songs.length > Math.floor(config.queueLimit - 1) && config.queueLimit !== 0) {
      return message.channel.send(`❌| Você não pode adicionar mais do que o limite de **${config.queueLimit}** músicas!`)
    }

    serverQueue.songs.push(song);

    const embed = new Discord.MessageEmbed()
    .setTitle("✅ | Musica Adicionada à playlist!")
    .setDescription(`**[${song.title}](${song.url})**`)
    .setThumbnail(song.thumbnail)
    .setColor(color)
    .setFooter("Likes - " + songData.videoDetails.likes);

    return serverQueue.textChannel.send(embed).catch(console.error);
  } else {
    queueConstruct.songs.push(song);
  }

  if(!serverQueue)
  message.client.queue.set(message.guild.id, queueConstruct);
  message.client.vote.set(message.guild.id, voteConstruct);
  if(!serverQueue) {
    try {
      queueConstruct.connection = await channel.join();
      play(queueConstruct.songs[0], message);
    } catch(err) {
      console.error(`❌| Não pude entrar no canal de voz: ${err}`)
      message.client.queue.delete(message.guild.id);
      await channel.leave();
      return message.reply(`❌| Não pude entrar no canal de voz!`)
    }
  }
}