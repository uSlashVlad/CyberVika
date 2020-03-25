const axios = require('axios');

const api_url = 'https://some-random-api.ml/';
const apis = {
    facts: {
        dog: 'facts/dog',
        cat: 'facts/cat',
        panda: 'facts/panda',
        fox: 'facts/fox',
        bird: 'facts/bird',
        koala: 'facts/koala'
    },
    images: {
        dog: 'img/dog',
        cat: 'img/cat',
        panda: 'img/panda',
        red_panda: 'img/red_panda',
        bird: 'img/birb',
        fox: 'img/fox',
        koala: 'img/koala'
    },
    anime: {
        wink: 'animu/wink',
        pat: 'animu/pat',
        hug: 'animu/hug',
        pikachu: 'pikachuimg'
    },
    meme: 'meme'
};

(function () {

    module.exports.loadDataFromApi = async function (type1, type2) {
        return new Promise(resolve => {
            resolve(axios.get(generateURL(type1, type2)));
        });
    };

    function generateURL(mainType, addType) {
        switch (mainType) {
            case 'fact':
                switch (addType) {
                    case 'dog':
                        return api_url + apis.facts.dog;
                    case 'cat':
                        return api_url + apis.facts.cat;
                    case 'red_panda':
                        return api_url + apis.facts.panda;
                    case 'panda':
                        return api_url + apis.facts.panda;
                    case 'fox':
                        return api_url + apis.facts.fox;
                    case 'bird':
                        return api_url + apis.facts.bird;
                    case 'koala':
                        return api_url + apis.facts.koala;
                    default:
                        return;
                }
            case 'image':
                switch (addType) {
                    case 'dog':
                        return api_url + apis.images.dog;
                    case 'cat':
                        return api_url + apis.images.cat;
                    case 'panda':
                        return api_url + apis.images.panda;
                    case 'red_panda':
                        return api_url + apis.images.red_panda;
                    case 'fox':
                        return api_url + apis.images.fox;
                    case 'bird':
                        return api_url + apis.images.bird;
                    case 'koala':
                        return api_url + apis.images.koala;
                    default:
                        return;
                }
            case 'anime':
                switch (addType) {
                    case 'wink':
                        return api_url + apis.anime.wink;
                    case 'pat':
                        return api_url + apis.anime.pat;
                    case 'hug':
                        return api_url + apis.anime.hug;
                    case 'pikachu':
                        return api_url + apis.anime.pikachu;
                    default:
                        return;
                }
            case 'meme':
                return api_url + apis.meme;
        }
    }
}());