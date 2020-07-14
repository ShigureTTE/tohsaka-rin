require('dotenv').config();
const Discord = require('discord.js');
const express = require('express');
const https = require('https');

const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;
const prefix = '.';
const app = express();

const roll = require('./roll');
const stack = require('./stack');

enemyTotal = 0;
stackArray = new Array();
currentTurn = "";

bot.login(TOKEN);

bot.on('ready', () => {
    console.info(`Succesfully logged in as ${bot.user.tag}`);
});

bot.on('message', async (message) => {
    if (!message.content.startsWith(prefix)) return;

    if (message.content.startsWith(`${prefix}roll`)) {
        roll.execute(message, bot);
    }

    else if (message.content.startsWith(`${prefix}stack`) && isRole(message, "Maid")){
        stack.execute(message);
    }

    else if (message.content.startsWith(`${prefix}enemy`)) {
        getEnemy(message);
    }
});

function getEnemy(message) {
    let arg = isolateArgument(message.content);

    let url = `${process.env.HOST}${process.env.GET}/${arg}`;

    https.get(url, (res) => {
        let body = '';

        res.on('data', (chunk) => {
            body += chunk;
        });

        res.on('end', () => {
            let object = JSON.parse(body)[0];
            if (object != null || object != undefined){
                message.channel.send(`**${object.name}**\n\nSkill: ${object.skill}\nStamina: ${object.stamina}\nInitiative: ${object.initiative}\nArmour: ${object.armour}\nDamage as: ${object.damage}`);
            }      
            else message.channel.send(`Could not find enemy '${arg}'`)  ;
        });
    });
}

function isRole(msg, role) {
    return msg.member.roles.cache.find(r => r.name === role);
}

function isolateArgument(input) {
    let arg = input.substring(input.indexOf(' ') + 1);
    return arg;
}

app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), () => {
    console.log(`Node Application listening on port ${app.get('port')}`);
});