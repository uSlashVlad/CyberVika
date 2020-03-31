'use strict';
const Telegraf = require('telegraf');
const advancedAPI = require('./src/dogcat-api');
const randAPI = require('./src/rand-api');
const random = require('./src/random');
const axios = require('axios');
const querystring = require('querystring');
const colors = require('colors');

require('dotenv').config();
const bot = new Telegraf(process.env.BOT_TOKEN);


// Variants of answer on question pattern "Вопрос: <текст>?"
const ansVariants = [
    'Да, конечно',
    'Определённо',
    'Ну конечно же!',
    'В принципе да...',
    'А какой у тебя ответ?',
    'Думаю да',
    'Пока что да',
    'Скорее да, чем нет',
    'Может быть',
    'Затрудняюсь ответить',
    'Не понятно...',
    'Спроси лучше настоящую Вику',
    'Я здесь ничем не помогу',
    'Не думаю',
    'Вряд ли',
    'Точно нет',
    'Ну не знаю...',
    'Да конечно же нет!'
];

const pixApiUrl = 'https://pixabay.com/api/';


bot.use((ctx, next) => {
    // Logging
    //console.log(ctx);
    let date = new Date();
    let str = ('[' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + '] ').dim;
    str += ctx.from.username.cyan + ' > ';

    if (ctx.chat) {
        if (ctx.chat.title !== undefined)
            str += ctx.chat.title.cyan + ': ';
        else
            str += ctx.me.cyan + ': ';
    }

    if (ctx.updateSubTypes[0] === 'text')
        str += ctx.message.text;
    else if (ctx.updateSubTypes.length === 0) {
        if (ctx.updateType === 'edited_message')
            str += '[E] '.yellow + ctx.update.edited_message.text;
        else if (ctx.updateType === 'callback_query')
            str += '[CQ] '.magenta + ctx.update.callback_query.data;
    }
    else
        str += ctx.updateSubTypes[0].red;

    console.log(str);
    next();
});


// Handling /start command
bot.start(ctx => {
    ctx.reply('Hello World!');
});

// Handling /help command
bot.help(ctx => {
    ctx.reply('А?', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Что можешь?', callback_data: 'help_commands' }],
                [{ text: 'О боте', callback_data: 'help_about' }]
            ]
        }
    });
});

bot.command('gay', ctx => {
    let message = `<b>[ Создатель ]</b>
@uslashvlad
<a href="https://github.com/uSlashVlad">GitHub</a> <a href="https://vk.com/uslashvlad">ВК</a>
<i>Не ЧСВ :)</i>`;
    ctx.reply(message, {
        parse_mode: "html",
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Поддержать голодного программиста', url: 'https://qiwi.com/n/VLADN' }]
            ]
        }
    });
});

// Handling /echo command
bot.command('echo', ctx => {
    let input = ctx.message.text;
    let args = input.split(' ');
    args.shift();

    let message;
    if (args.length > 0)
        message = args.join(' ');
    else
        message = 'Нужен текст для вывода';

    ctx.reply(message);
});

// Handling simple /luck command
bot.command('luck', ctx => {
    let res = random.chance(0.5);
    let message = 'Шанс на удар по жопе: <b>0.5</b>\n';

    if (res) {
        message += 'Тебе не повезло, получай по жопе 👋👋👋';
    } else {
        message += 'Тебе повезло, твоя жопа в сохранности';
    }
    
    ctx.reply(message, { parse_mode: "html" });
});

// Handling Advanced API commands
bot.command('adv_cat', ctx => {
    sendFileFromAdvancedApi(ctx, 0);
});
bot.command('adv_dog', ctx => {
    sendFileFromAdvancedApi(ctx, 1);
});

// Handling Simple rand API commands
bot.command('dog', ctx => {
    sendAnimalFromSimpleApi(ctx, 'dog');
});
bot.command('cat', ctx => {
    sendAnimalFromSimpleApi(ctx, 'cat');
});
bot.command('panda', ctx => {
    sendAnimalFromSimpleApi(ctx, 'panda');
});
bot.command('red_panda', ctx => {
    sendAnimalFromSimpleApi(ctx, 'red_panda');
});
bot.command('fox', ctx => {
    sendAnimalFromSimpleApi(ctx, 'fox');
});
bot.command('bird', ctx => {
    sendAnimalFromSimpleApi(ctx, 'bird');
});
bot.command('koala', ctx => {
    sendAnimalFromSimpleApi(ctx, 'koala');
});
bot.command('wink', ctx => {
    sendAnimeFromSimpleApi(ctx, 'wink');
});
bot.command('pat', ctx => {
    sendAnimeFromSimpleApi(ctx, 'pat');
});
bot.command('hug', ctx => {
    sendAnimeFromSimpleApi(ctx, 'hug');
});
bot.command('pikachu', ctx => {
    sendAnimeFromSimpleApi(ctx, 'pikachu');
});
bot.command('meme', ctx => {
    sendMemeFromSimpleApi(ctx);
});


// Handling text messages
bot.on('text', ctx => {
    let text = ctx.message.text;

    // Handling "Вопрос: <текст>?" messages
    if (text.toLowerCase().startsWith('вопрос:') && text.endsWith('?')) {
        ctx.reply(random.arrElem(ansVariants));
    }
    // Doesn't work with simple Telegram bot API
    else if (text.toLowerCase().startsWith('кто: ') && text.endsWith('?')) {
        ctx.reply('А это пока что не работает :)');
    }
});

// Pixabay search
bot.inlineQuery(/pix\s.+/, async ctx => {
    let input = ctx.inlineQuery.query.split(' ');
    input.shift();

    let query = input.join(' ');
    if (query === '' || query === undefined) return;

    let urlBody = {
        key: process.env.PIX_API_KEY,
        q: query
    };
    let _url = pixApiUrl + '?' + querystring.stringify(urlBody);
    let result = await loadDataFromPixabay(_url);

    ctx.answerInlineQuery(result);
});


// Handling actions of /help command
bot.action('help_commands', (ctx, next) => {
    let message = `<b>[ Комманды ]</b>
    
-основные-
/start - <i>"Hello World!"</i>
/help - <i>помощь</i>
/gay - <i>меню моего чсв</i>
/echo <code>[текст]</code> - <i>бот выведет текст</i>
/luck - <i>рандомно даст/не даст по жопе</i>

-рандомные апи-
продвинутое апи:
/adv_cat <code>~photo|gif~</code> - <i>фотка/гифка кота из продвинутого апи</i>
/adv_dog <code>~photo|gif~</code> - <i>фотка/гифка собакена из продвинутого апи</i>
простое апи:
/cat - <i>фотка котика с случайным факте о котиках</i>
/dog - <i>фотка пёсика с случайным факте о пёсиках</i>
/panda - <i>фотка панды с случайным факте о пандах</i>
/red_panda - <i>фотка красной панды с случайным факте о пандах</i>
/fox -<i> фотка лисы с случайным факте о лисах</i>
/bird - <i>фотка птички с случайным факте о птичках</i>
/koala - <i>фотка коалы с случайным факте о коалах</i>
/wink /pat /hug - <i>аниме гифки</i>
/pikachu - <i>ПИКАЧУ!!! гифка</i>
/meme - <i>рандомный мем на пендоском языке (пока тупые мемы)</i>

-запросы-
<i>Это можно делать не только из беседы или в личной переписке с ботом.
Для того, чтобы они работали нужно начать диалог с ботом.
Пока что запросы работают только с сервисом <b>Pixabay</b></i>.
@cybervika_bot pix <code>[текст]</code>

-другое-
Вопрос: <code>[текст]</code>? - <i>бот как-нибудь отвечает в варианте да/нет</i>`;

    ctx.editMessageText(message, { parse_mode: "html" }).then(() => {
        ctx.answerCbQuery().then(next());
    })
});
bot.action('help_about', (ctx, next) => {
    let date = new Date();
    let message = `Всё сделано ради <a href="https://new.umschool.net/core/profile/">Умскула</a>

<b>[ О боте ]</b>
Бот создан специально для беседы <b>Дети Вики</b>
Узнать функционал можно через меню команды /help
<a href="https://github.com/uSlashVlad/CyberVika">Исходный код</a>

<b>[ Сторонние API ]</b>
<a href="https://some-random-api.ml/">Простое рандомное АПИ</a>
<a href="https://api.thecatapi.com/">АПИ с котиками</a>
<a href="https://api.thedogapi.com/">АПИ с пёсиками</a>
<a href="https://pixabay.com/service/about/api/">Pixabay API</a>
<b>Серверное время: ${date.getHours()} : ${date.getMinutes()} : ${date.getSeconds()}</b>`;

    ctx.editMessageText(message, { parse_mode: "html" }).then(() => {
        ctx.answerCbQuery().then(next());
    });
});

// Actions of animals votes
bot.action('cat_upvote', ctx => {
    handleVoteForFileFromAdvancedApi(ctx, 0, 1);
});
bot.action('cat_downvote', ctx => {
    handleVoteForFileFromAdvancedApi(ctx, 0, 0);
});
bot.action('dog_upvote', ctx => {
    handleVoteForFileFromAdvancedApi(ctx, 1, 1);
});
bot.action('dog_downvote', ctx => {
    handleVoteForFileFromAdvancedApi(ctx, 1, 0);
});


bot.launch().then(() => {
    advancedAPI.bot = bot;
    console.log('Bot has been started!'.green)
});


// Loading data from Pixabay using HTTP GET request
async function loadDataFromPixabay(url) {
    return new Promise(resolve => {
        axios.get(url).then(res => {
            let data = res.data.hits;

            resolve(data.map((item, index) => {
                return {
                    type: 'photo',
                    id: String(index),
                    photo_url: item.webformatURL,
                    thumb_url: item.previewURL
                }
            }));
        });
    })
}

// Sending message with picture from Simple rand API
async function sendAnimalFromSimpleApi(ctx, type) {
    await bot.telegram.sendChatAction(ctx.chat.id, 'upload_photo');

    let imgRes = await randAPI.loadDataFromApi('image', type);
    let url = imgRes.data.link;
    let factRes = await randAPI.loadDataFromApi('fact', type);
    let fact = 'Случайный факт: ' + factRes.data.fact;


    if (url.endsWith('.jpg') || url.endsWith('.png')) {
        await ctx.replyWithPhoto(url, { caption: fact });
    }
    else if (url.endsWith('.gif')) {
        await ctx.sendAnimation(ctx.chat.id, url, { caption: fact })
    }

    console.log('Фото: '.blue + url + '\n' + fact.dim);
}

// Sending message with animation from Simple rand API
async function sendAnimeFromSimpleApi(ctx, type) {
    await bot.telegram.sendChatAction(ctx.chat.id, 'upload_video');

    let gifRes = await randAPI.loadDataFromApi('anime', type);
    let gif = gifRes.data.link;

    await bot.telegram.sendAnimation(ctx.chat.id, gif);
    console.log('Anime gif: '.dim + gif)
}

// Sending message with meme from Simple rand API
async function sendMemeFromSimpleApi(ctx) {
    await bot.telegram.sendChatAction(ctx.chat.id, 'upload_photo');

    let imgRes = await randAPI.loadDataFromApi('meme');
    let data = imgRes.data;
    let caption = data.caption + ' [' + data.category + ']';

    await ctx.replyWithPhoto(data.image, {
        caption: caption
    });
    console.log('Meme: '.blue + data.image + '\n' + caption.dim);
}

// Sending file from Advanced Dog/Cat API
async function sendFileFromAdvancedApi(ctx, type) {
    let apiParams = advancedAPI.getApiParams(type);

    // Processing arguments
    let text = ctx.message.text;
    let args = text.split(' ');
    args.shift();

    // Processing formats
    let photoType = 'jpg,png';
    if (args.length === 0 || args[0].toLowerCase() === 'photo') {
        photoType = 'jpg,png';
        await bot.telegram.sendChatAction(ctx.chat.id, 'upload_photo');
    }
    else if (args[0].toLowerCase() === 'gif') {
        photoType = 'gif';
        await bot.telegram.sendChatAction(ctx.chat.id, 'upload_video');
    }
    else {
        await ctx.reply('Неправильный аргумент');
        return;
    }

    // Making HTTP GET request in ./src/dogcat-api.js
    let result = await advancedAPI.loadFileFromAdvancedApi(apiParams.url, apiParams.key, {
        'mime_types': photoType,
        'size': 'small',
        'sub_id': ctx.from.username,
        'limit': 1
    }); //console.log(result);

    // Processing data
    let url = result.data[0].url;
    if (url.endsWith('.jpg') || url.endsWith('.png')) {
        // If result is image
        await ctx.replyWithPhoto(url, {
            caption: result.data[0].id,
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: '❤', callback_data: apiParams.typeEN + '_upvote' },
                        { text: '🤢', callback_data: apiParams.typeEN + '_downvote' }
                    ]
                ]
            }
        });
    }
    else if (url.endsWith('.gif')) {
        // If result is animation
        await bot.telegram.sendAnimation(ctx.chat.id, result.data[0].url, {
            caption: result.data[0].id,
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: '❤', callback_data: apiParams.typeEN + '_upvote' },
                        { text: '🤢', callback_data: apiParams.typeEN + '_downvote' }
                    ]
                ]
            }
        });
    }

    console.log('Фото ' + apiParams.typeRU + 'а: ' + result.data[0].url);
}

// Handling votes from message with dog/cat image from Advanced API
async function handleVoteForFileFromAdvancedApi(ctx, type, value) {
    let apiParams = advancedAPI.getApiParams(type);

    let result = await advancedAPI.voteForFileFromAdvancedApi(apiParams.url, apiParams.key, {
        image_id: ctx.update.callback_query.message.caption,
        sub_id: ctx.update.callback_query.from.username,
        value: value
    });
    if (result.status === 200)
        await ctx.answerCbQuery('Вы проголосовали ' + ((value === 1) ? 'за' : 'против') + ' этого ' + apiParams.typeRU + 'а!');
    else
        await ctx.answerCbQuery('Произошла ошибка ' + result.status + ' на стороне API');
}

