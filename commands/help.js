const Discord = require('discord.js');

module.exports.run = async (client, message, args, color, config) => {
  const embed = new Discord.MessageEmbed()
  .setTitle(`Comandos Do Bot!`)
  .setDescription(`👍|**Meus Comandos Estão Listados Abaixo!**`)
  .addField(`🔧| Comandos Informativos`, `hy!help - Mostra Esse Menu!

  hy!botinfo - Exibe As Informações Do Bot!

  hy!ping - Mostra O Ping Do Bot/Servidor

  hy!serverinfo - Mostra As Informações Do Servidor!`)
  .addField(`🎵| Comandos De Musica`, `hy!play <Musica || URL> - Toca algo para vc!

  hy!lyrics - Envia as lyrics daa musica pesquisada!
    
  hy!skip - Pula para a próxima musica!
    
  hy!loop - Da um loop na atual playlist!
    
  hy!jump - Pule para uma musica que goste na playlist!
    
  hy!volume - Controla o volume da musica
    
  hy!stop - Para a musica e limpa a playlist
    
  hy!pause - Para a Musica
    
  hy!resume - Retoma a musica`)
  .setColor(color)
  .setTimestamp()
  .setFooter(`© HypedGroupCode`)
  message.channel.send(embed).then(msg => {
    msg.react('🎵')
  })
}