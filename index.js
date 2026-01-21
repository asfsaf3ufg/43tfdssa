import "dotenv/config";
import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import { getSession, clearSession } from "./session.js";
import { startWeb } from "./web.js";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands = [
  {
    name: "pfp",
    description: "Setzt dein RecRoom Profilbild",
    options: [
      {
        name: "imagename",
        type: 3,
        description: "z.B. 2o0hyjv4cgmbugj8igwqr26hh.jpg",
        required: true
      }
    ]
  }
];

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

await rest.put(
  Routes.applicationCommands(process.env.CLIENT_ID),
  { body: commands }
);

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "pfp") {
    const session = getSession(interaction.user.id);

    if (!session) {
      return interaction.reply({
        content: `Bitte einloggen:\n${process.env.BASE_URL}/login?discordId=${interaction.user.id}`,
        ephemeral: true
      });
    }

    const imageName = interaction.options.getString("imagename");

    // ⚠️ HIER würde der echte API‑Request passieren
    // PUT accounts.rec.net/account/me/profileimage

    clearSession(interaction.user.id);

    await interaction.reply({
      content: `✅ Profilbild "${imageName}" würde jetzt gesetzt werden.`,
      ephemeral: true
    });
  }
});

client.login(process.env.DISCORD_TOKEN);
startWeb(process.env.PORT);
