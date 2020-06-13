require('dotenv').config();
const Discord = require('discord.js');
const express = require('express');

const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;
const prefix = "~";
const app = express();

totalRolled = 0;

bot.login(TOKEN);

bot.on('ready', () => {
    console.info(`Succesfully logged in as ${bot.user.tag}`)
});

bot.on('message', (message) => {
    if (!message.content.startsWith(prefix)) return;

    if (message.content.includes(`${prefix}roll`)) {
        let result = roll(message.content);
        message.channel.send(`${message.author.username}, you rolled: ${totalRolled}`);
        message.channel.send(`${result}`);
    }
});

function isolateArgument(input) {
    let command = input.substring(0, input.indexOf(' '));
    let arg = input.substring(input.indexOf(' ') + 1);
    return arg;
}

function roll(input) {
    let arg = isolateArgument(input);
    let d1 = 0;
    let d2 = 0;
    let d3 = 0;

    switch (arg) {
        case '1d6':
            totalRolled = getNumber(6);
            return `${getDiceEmoji(totalRolled)}`;
        case 'd6':
            totalRolled = getNumber(6);
            return `${getDiceEmoji(totalRolled)}`;
        case '2d6':
            d1 = getNumber(6);
            d2 = getNumber(6);
            totalRolled = d1 + d2;
            return `${getDiceEmoji(d1)} ${getDiceEmoji(d2)}`          
        case 'd66':
            d1 = getNumber(6);
            d2 = getNumber(6);
            totalRolled = (d1 * 10) + d2;
            return `${getDiceEmoji(d1)} ${getDiceEmoji(d2)}`
        case 'd666':
            d1 = getNumber(6);
            d2 = getNumber(6);
            d3 = getNumber(6);
            totalRolled = (d1 * 100) + (d2 * 10) + d3;
            return `${getDiceEmoji(d1)} ${getDiceEmoji(d2)} ${getDiceEmoji(d3)}`
        case 'd3':
            totalRolled = getNumber(3);
            return `${getDiceEmoji(totalRolled)}`;
        default:
            return 'dice setting not found.'
    }
}

function getNumber(max) {
    return 1 + Math.floor(Math.random() * max);
}

function getDiceEmoji(face){
    return bot.emojis.cache.find(e => e.name === `Dice_${face}`).toString();
}

app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), () => {{
    console.log(`Node Application listening on port ${app.get('port')}`);
}});