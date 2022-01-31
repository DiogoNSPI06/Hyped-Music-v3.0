const Discord = require('discord.js');
const express = require('express');
const localDB = require('quick.db');
const fs = require('fs');

const app = express()

const config = require('./config.json')
const color = config.color
const prefix = config.prefix

const client = new Discord.Client({ disableEveryone: true, disabledEvents: ["TYPING_START"] })

//Debug
client.on("warn", info => console.log(info));

client.on("error", console.error)

client.commands = new Discord.Collection()
client.prefix = config.prefix
client.queue = new Map();
client.vote = new Map();

const TOKEN = process.env.TOKEN
const PORT = process.env.PORT
const YT_API = process.env.YOUTUBE_API_KEY

// Evento ready & status
client.on("ready", () => {
  console.log('✅| Pronto para tocar música!')
  let activities = [
    `🎵 - Utilize ${config.prefix}help para obter ajuda!`
    ],
    i = 0;
  setInterval( () => client.user.setActivity(`${activities[i++ % activities.length]}`, {
        type: "STREAMING", url: "https://twitch.tv/diogo06221"
      }), 100 * 60); 
  client.user.setStatus("online").catch(console.error);
})

client.on("message", message => {
  if(message.author.bot) return;
  if(!message.guild) return;

  if(message.content.startsWith(config.prefix)) {
    const args = message.content
        .trim().slice(prefix.length)
        .split(/ +/g);
    let command = args.shift().toLowerCase();

    if(command === "p") command = "play"
    if(command === "l") command = "lyrics"
    if(command === "s") command = "stop"

    //✅ -> Error Message
    const embederror = new Discord.MessageEmbed()
    .setTitle(":x: | Erro! ")
    .setDescription(`> Não achei o comando: \`${command}\``)
    .setTimestamp()
    .setColor('RED')
    .setFooter("© HypedGroupCode");

    try {
      const commandFile = require(`./commands/${command}.js`)
      commandFile.run(client, message, args, color, config);
      console.log(`${message.guild.name}: ${message.author.tag} Usou ${command} no #${message.channel.name}`)
    } catch(err) {
      console.error('❌| Erro:' + err)
      message.reply(embederror)
    }
  }
})

//Porta express
app.get("/", (request, response) => {
  const ping = new Date();
  response.send(`<html><head><style>
    body {
        background-color: #2C2F33;
        font-family: 'Roboto', sans-serif;
    }

    .outer-container {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: #23272A;
        box-shadow: 0px 0px 10px #1B1E21;
        border-radius: 50px;
        width: 45%;
    }

    .plasma {
        color: #ffffff;
        font-size: 70px;
        margin: 0;
        font-weight: 400;
        text-align: center;
    }

    .ends {
        color: #ffffff;
        font-size: 35px;
        margin: 0;
        text-align: center;
    }

    .date {
        color: #99AAB5;
        font-size: 25px;
        margin: 0;
        padding-bottom: 50px;
        text-align: center;
    }

    .logo {
        max-width: 100%;
        height: auto;
        width: auto\9;
        margin: 0;
    }
</style>

<link href="https://fonts.googleapis.com/css2?family=Roboto&amp;display=swap" rel="stylesheet">
<link rel="shortcut icon" type="image/x-icon" href="https://static.wixstatic.com/media/a926b2_cfc2b507c19546d88a6a2231b832b022%7Emv2.png/v1/fill/w_32%2Ch_32%2Clg_1%2Cusm_0.66_1.00_0.01/a926b2_cfc2b507c19546d88a6a2231b832b022%7Emv2.png">

<title>Status Do Hyped</title>

</head><body><div class="outer-container" wfd-id="0">
    <div class="container" wfd-id="1">
        <img src="https://botlist.hypeds.com/img/logo.png" class="logo">
        <p class="plasma">Status Do Hyped</p>
        <p class="ends" id="ends">Status Da Host: Online</p>
        <p class="date" id="date">Status Do Site: Online</p>
    </div>
</div>
</body></html>`)
  ping.setHours(ping.getHours() -3 );
  console.log(`⚠️ | Ping recebido às ${ping.getUTCHours()}:${ping.getUTCMinutes()}:${ping.getUTCSeconds()}`);
})
app.listen(PORT)

//Código de ! Diogo06🐾#1337 não disturbe
client.login(TOKEN);