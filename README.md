# Introduction
CyberVika is a bit simple telegram bot fully written on **Node JS** for our telegram chat "Дети Вики".
Base of this bot was created for 1 day.
Now this bot can:
- handle simple commands like **/start**, **/help**, **/echo**
- handle chat messages like in pattern **Вопрос:** _текст_**?**
- work with this APIs:
  - [Some random APIs](https://some-random-api.ml/)
  - [Cat](https://api.thecatapi.com/) and [Dog](https://api.thedogapi.com/) APIs
  - [Pixabay API](https://pixabay.com/service/about/api/)
  
## Modules
This Node JS project requires this modules:
1) [Telegraf](https://github.com/telegraf/telegraf) `npm i telegraf`
2) [Axios](https://github.com/axios/axios) `npm i axios`
3) [DotEnv](https://github.com/motdotla/dotenv) `npm i dotenv`
4) [colors](https://github.com/Marak/colors.js) `npm i colors`

## How to start
If needed all modules was installed, you could start this bot, but:
- You need **TG bot token**. You can get it in chat with **@BotFather** by creating _new bot_
- You need **Pixabay API token**. You will get it [on this page](https://pixabay.com/api/docs/) after registration [here](https://pixabay.com/service/about/api/)
- You need **Dog/Cat API token**. You will get it after [registration here](https://thecatapi.com/signup).
- After all this you must create **.env** file and place there
```dotenv
BOT_TOKEN='<Telegram bot token>'
DOGCAT_API_KEY='<Dog/Cat API token>'
PIX_API_KEY='<Pixabay API token>'
```
- Use `npm run start` or `node index.js` to start bot