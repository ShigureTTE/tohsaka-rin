const isolate = require('./isolate');

players = new Array();
enemyTokens = 0;
henchmanTokens = 0;

stackArray = new Array();
currentTurn = '';

module.exports = {
    execute: function (message) {
        let arg = isolate.get(message.content);

        console.log(arg);

        if (arg.includes('add')) {
            addPlayer(arg, message);
        }

        else if (arg.includes('list')) {
            stackList(message);
        }

        else if (arg.includes('set')) {
            setTokens(arg, message);
        }

        else if (arg == 'r') {
            resetPlayers(message);
        }

        else if (arg.includes('create') || arg.includes('new')) {
            newRound(message);
        }

        else if (arg.includes('next')) {
            nextTurn(message);
        }

        else if (arg.includes('delay')) {
            delayTurn(message);
        }
    }
}

function delayTurn(message){
    stackArray.push(currentTurn);
    message.channel.send(`Okay! ${currentTurn}'s turn has been delayed`);
}

function nextTurn(message){
    let index = Math.floor(Math.random() * stackArray.length);

    currentTurn = stackArray[index];

    stackArray.splice(index, 1);

    if (currentTurn === '@end') message.channel.send(`**End of Round!**`);
    else message.channel.send(`The current initiative goes to: \n${currentTurn}`);
}

function newRound(message) {
    stackArray = new Array();

    players.forEach(player => {
        stackArray.push(player);
        stackArray.push(player);
    });

    for (let index = 0; index < enemyTokens; index++) {
        stackArray.push('Enemy / NPC');
    }

    for(let index = 0; index < henchmanTokens; index++){
        stackArray.push('Henchman');
    }

    stackArray.push('@end');

    message.channel.send('Created new stack with:\n');
    stackList(message);
}

function addPlayer(input, message) {
    let arg = isolate.get(input);
    players.push(arg);
    message.channel.send(`Added Player: ${arg}`);
}

function resetPlayers(message) {
    players = new Array();
    message.channel.send('Reset the Player List');
}

function stackList(message) {
    let output = "";
    players.forEach(player => {
        output += `${player} (2 Tokens)\n`;
    });
    output += `\nEnemy / NPC Tokens: ${enemyTokens}\n`;
    output += `Henchman Tokens: ${henchmanTokens}`;

    message.channel.send(output);
}

function setTokens(input, message) {
    let arg = isolate.get(input);

    if (arg.includes('npc') || arg.includes('enemy')) {
        enemyTokens = isolate.get(arg);
        message.channel.send(`Enemy / NPC Tokens set to: ${enemyTokens}`);
    }

    else if (arg.includes('henchman')) {
        henchmanTokens = isolate.get(arg);
        message.channel.send(`Henchman Tokens set to: ${henchmanTokens}`);
    }
}