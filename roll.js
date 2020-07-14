const isolate = require('./isolate');

module.exports = {
    execute: function (message, bot) {
        let d1 = 0;
        let d2 = 0;
        let d3 = 0;
        let arg = isolate.get(message.content);
        let dice = '';
        let totalRolled = 0;



        switch (arg) {
            case '1d6':
                totalRolled = getNumber(6);
                dice = `${getDiceEmoji(totalRolled, bot)}`;
                break;
            case 'd6':
                totalRolled = getNumber(6);
                dice = `${getDiceEmoji(totalRolled, bot)}`;
                break;
            case '2d6':
                d1 = getNumber(6);
                d2 = getNumber(6);
                totalRolled = d1 + d2;
                dice = `${getDiceEmoji(d1, bot)} ${getDiceEmoji(d2, bot)}`
                break;
            case 'd66':
                d1 = getNumber(6);
                d2 = getNumber(6);
                totalRolled = (d1 * 10) + d2;
                dice = `${getDiceEmoji(d1, bot)} ${getDiceEmoji(d2, bot)}`
                break;
            case 'd666':
                d1 = getNumber(6);
                d2 = getNumber(6);
                d3 = getNumber(6);
                totalRolled = (d1 * 100) + (d2 * 10) + d3;
                dice = `${getDiceEmoji(d1, bot)} ${getDiceEmoji(d2, bot)} ${getDiceEmoji(d3, bot)}`
                break;
            case 'd3':
                totalRolled = getNumber(3);
                dice = `${getDiceEmoji(totalRolled, bot)}`;
                break;
            case 'd2':
                totalRolled = getNumber(2);
                dice = `${getDiceEmoji(totalRolled, bot)}`;
                break;
        }

        if (dice == '') {
            message.channel.send('No.', {
                embed: {
                    title: 'No.',
                    image: {
                        url: 'attachment://file.webp'
                    }
                },
                files: [{
                    attachment: './images/no.webp',
                    name: 'file.webp'
                }]
            });
            return;
        }

        message.channel.send(`${message.author}\nYour ${arg} rolled: ${totalRolled}`);
        message.channel.send(`${dice}`)

    }
}

function getNumber(max) {
    return 1 + Math.floor(Math.random() * max);
}

function getDiceEmoji(face, bot) {
    return bot.emojis.cache.find(e => e.name === `Dice_${face}`).toString();
}

