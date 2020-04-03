const querystring = require('querystring');
const axios = require('axios');

const CAT_API_URL = 'https://api.thecatapi.com/';
const DOG_API_URL = 'https://api.thedogapi.com/';

module.exports.getApiParams = function (type) {
    let API_URL;
    let API_KEY = process.env.DOGCAT_API_KEY;
    let animalTypeEN;
    let animalTypeRU;
    switch (type) {
        // Cats
        case 0:
            API_URL = CAT_API_URL;
            animalTypeEN = 'cat';
            animalTypeRU = 'котик';
            break;

        // Dogs
        case 1:
            API_URL = DOG_API_URL;
            animalTypeEN = 'dog';
            animalTypeRU = 'пёсик';
            break;

        default:
            console.log('[ TYPE ERROR IN sendFileFromAdvancedApi() ]');
            return;
    }

    return {
        url: API_URL,
        key: API_KEY,
        typeEN: animalTypeEN,
        typeRU: animalTypeRU
    };
};

module.exports.loadFileFromAdvancedApi = async function (api_url, api_key, body) {
    return new Promise(resolve => {
        let _url = api_url + 'v1/images/search?' + querystring.stringify(body);

        resolve(axios({
            method: 'get',
            url: _url,
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': api_key
            }
        }));
    });
};

module.exports.voteForFileFromAdvancedApi = async function (api_url, api_key, body) {
    return new Promise(resolve => {
        let _url = api_url + 'v1/votes';

        resolve(axios({
            method: 'post',
            url: _url,
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': api_key
            },
            data: body
        }));
    })
};
