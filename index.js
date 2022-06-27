const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");

const jointocreate = require("./jointocreate");
jointocreate(client);


client.login(config.token);