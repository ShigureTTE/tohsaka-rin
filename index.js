require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;
const prefix = "~";

bot.login(TOKEN);

bot.on('ready', () => {
    console.info(`Succesfully logged in as ${bot.user.tag}`)
});

bot.on('message', (message) => {
    if (!message.content.startsWith(prefix)) return;

    if (message.content.includes(`${prefix}roll`)) {
        let result = roll(message.content);
        message.channel.send(`${message.author.username}, you rolled: ${result}`);
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
            return `${getNumber(6)}`;
        case 'd6':
            return `${getNumber(6)}`;
        case '2d6':
            d1 = getNumber(6);
            d2 = getNumber(6);
            return `${d1}, ${d2}. Total: ${d1 + d2}`
        case 'd66':
            d1 = getNumber(6);
            d2 = getNumber(6);
            return `${d1}, ${d2}. Total: ${(d1 * 10) + d2}`
        case 'd666':
            d1 = getNumber(6);
            d2 = getNumber(6);
            d3 = getNumber(6);
            return `${d1}, ${d2}, ${d3}. Total: ${(d1 * 100) + (d2 * 10) + d3}`
        case 'd3':
            return `${getNumber(3)}`;
        default:
            return 'dice setting not found.'
    }
}

function getNumber(max) {
    return 1 + Math.floor(Math.random() * max);
}