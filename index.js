require('dotenv').config();
const Discord = require('discord.js');
const express = require('express');

const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;
const prefix = "~";
const app = express();

totalRolled = 0;
players = new Array();
enemyTotal = 0;
stack = new Array();
currentTurn = "";

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

    else if (message.content.includes(`${prefix}addplayer`) && isRole(message, "Maid")) {
        let arg = isolateArgument(message.content);
        addPlayer(arg);
        message.channel.send(`Added Player: ${arg}`);
    }

    else if (message.content.includes(`${prefix}playerlist`) && isRole(message, "Maid")) {
        message.channel.send(`The current players are: \n${playerList()}`);
    }

    else if (message.content.includes(`${prefix}resetplayers`) && isRole(message, "Maid")) {
        players = new Array();
        message.channel.send('Reset the Player List');
    }

    else if (message.content.includes(`${prefix}setenemies`) && isRole(message, "Maid")) {
        let arg = isolateArgument(message.content);
        enemyTotal = arg;
        message.channel.send(`Enemy tokens set to: ${arg}`);
    }

    else if (message.content.includes(`${prefix}startround`) && isRole(message, "Maid")) {
        newRound();
        message.channel.send(`Created new Initiative Stack with:\n${playerList()} ${enemyTotal} Enemy Token(s)`);
    }

    else if (message.content.includes(`${prefix}nextturn`) && isRole(message, "Maid")) {
        nextTurn();
        if (currentTurn === 'End of Round') message.channel.send(`**End of Round!**`);
        else message.channel.send(`The current initiative goes to: \n${currentTurn}`);
    }

    else if (message.content.includes(`${prefix}delay`) && isRole(message, "Maid")) {
        delayTurn();
        message.channel.send(`Okay! ${currentTurn}'s turn has been delayed`);
    }
});

function delayTurn() {
    stack.push(currentTurn);
}

function nextTurn() {
    let index = Math.floor(Math.random() * stack.length);

    currentTurn = stack[index];

    stack.splice(index, 1);
}

function newRound() {
    stack = new Array();

    players.forEach(player => {
        stack.push(player);
        stack.push(player);
    });

    for (let index = 0; index < enemyTotal; index++) {
        stack.push('Enemy');
    }

    stack.push('End of Round');
}

function playerList() {
    let output = "";
    players.forEach(player => {
        output += `${player}\n`;
    });
    return output;
}

function addPlayer(arg) {
    players.push(arg);
}

function isRole(msg, role) {
    return msg.member.roles.cache.find(r => r.name === role);
}

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
        case 'd2':
            totalRolled = getNumber(2);
            return `${getDiceEmoji(totalRolled)}`;
        default:
            return 'dice setting not found.'
    }
}

function getNumber(max) {
    return 1 + Math.floor(Math.random() * max);
}

function getDiceEmoji(face) {
    return bot.emojis.cache.find(e => e.name === `Dice_${face}`).toString();
}

app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), () => {
    console.log(`Node Application listening on port ${app.get('port')}`);
});