const Discord = require('discord.js');
const localDB = require('quick.db');

module.exports.run = async (client, message, args, color, config) => {
  const playlistName = args[0]
  const song = args.slice(1).join(' ')

  if(!playlistName) {
    return message.reply(":x: | Escreva um nome para a playlist. Não utilize espaços!")
  }
  if(!song) {
    return message.reply(":x: | Escreva uma musica para adicionar.")
  }
  if(localDB.get(`playlist_${message.author.id}_${playlistName}.name` === playlistName)) {
    return message.reply(":x: | Esta playlist já existe! Tente outro nome!")
  }

  let random = '';
  let dict = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  for(var i = 0; i < 6; i++) {
    random = random + dict.charAt(Math.floor(Math.random() * dict.length));
  }

  let shareCode = `HMC${random}`

  localDB.set(`playlist_${message.author.id}_${playlistName}`, { name: playlistName, songs: [song], authorID: message.author.id, share: shareCode })

  const embed = new Discord.MessageEmbed()
  .setTitle(":thumbsup: | Playlist criada!")
  .addField("> Nome:", `${playlistName}`, true)
  .addField("> Código de Compartilhamento:", `\`${shareCode}\``)
  .addField("> Como usar?", `Para adicionar mais músicas na playlist use: \`${config.prefix}setsong <musica>\` \n Para tocar esta playlist use: \`${config.prefix}playplaylist ${playlistName}\` \n Para outra pessoa tocar esta playlist use: \`${config.prefix}playplaylist ${shareCode}\``)
  .setColor(color);

  message.reply(embed);
}