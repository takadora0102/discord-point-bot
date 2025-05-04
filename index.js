const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
require('dotenv').config(); // .envファイルからトークン読み込み

// Botの設定
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

// スラッシュコマンド登録
const commands = [
  new SlashCommandBuilder().setName('point').setDescription('自分のポイントを確認します')
];

const rest = new REST({ version: '10' }).setToken(TOKEN);
rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands })
  .then(() => console.log('✅ スラッシュコマンド登録完了'))
  .catch(console.error);

// Bot起動時
client.once('ready', () => {
  console.log(`🤖 起動完了：${client.user.tag}`);
});

// コマンド処理
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const userId = interaction.user.id;

  // ポイントデータを読み込み
  const raw = fs.readFileSync('./data/points.json');
  const points = JSON.parse(raw);

  // 該当ユーザーのポイントがなければ0で初期化
  if (!points[userId]) {
    points[userId] = { points: 0 };
    fs.writeFileSync('./data/points.json', JSON.stringify(points, null, 2));
  }

  const userPoints = points[userId].points;

  await interaction.reply(`あなたのポイントは ${userPoints}pt です！`);
});

client.login(TOKEN);
