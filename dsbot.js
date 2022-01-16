const Discord = require("discord.js");
//const bot = new Discord.Client();
const path = require("path");
const fs = require("fs");
let config = require("./config.json");
const ytdl = require("ytdl-core")
const bot = new Discord.Client({ intents: [Discord.Intents.FLAGS.DIRECT_MESSAGES, Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MEMBERS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_VOICE_STATES] });
let state = false;
let chIdToLock;
let users = [501025824686866464, 852656239292055632, 316978528761544704, 390876463580315650, 506449663042256899]

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`);
    bot.generateInvite(["ADMINISTRATOR"]).then(link => {console.log(link)})
});

bot.on('guildCreate', (guild) => {
    console.log(`Bot joined server ${guild.id}`);
});

bot.on('message', message =>
{
    if (message.author.bot) return;
    if (!message.content.startsWith(config.prefix)) return;
    const commandBody = message.content.slice(config.prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();
    let connection = null;
    switch(command)
    {
        case "delete":
            let channels = message.guild.channels.cache.array();
            channels.forEach(channel => {
                if(message.guild.members.cache.get(channel.name)) channel.delete();
            });
            break;
        case "kick":
            if(message.member.hasPermission("KICK_MEMBERS"))
            {
                message.mentions.members.first().kick(args[1]);
            }
            break;
        case "start":
            users.forEach(user => {
                if(message.author.id == user){
                    message.reply('started')
                    .then(msg => {
                        msg.delete({ timeout: 2000 /*time unitl delete in milliseconds*/});
                        message.delete({ timeout: 2000 /*time unitl delete in milliseconds*/})
                        state = true;
                    })
                }
            })
            break;
    }
});

bot.on('voiceStateUpdate', (oldMember, newMember) => {
    console.log(chIdToLock);
    if(oldMember.channel == null && newMember.channel != null)
    {
        users.forEach(user => {
            if(newMember.id == user) chIdToLock = newMember.channel.id;
        })

        if(state && newMember.channel.id == chIdToLock) {
            let kick = true;
            users.forEach(user => {
                if(newMember.id == user) kick = false;
            })
            if(kick) newMember.setChannel(null);
        }
    }
    else if(oldMember.channel != null && newMember.channel == null)
    {
        users.forEach(user => {
            if(oldMember.id == user) chIdToLock = null;
        })
        if(oldMember.channel.parent == null) return;
    }
});

bot.login(config.discord_token);