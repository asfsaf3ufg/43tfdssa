import "dotenv/config";
import {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} from "discord.js";

import { getSession, clearSession } from "./session.js";
import { startWeb } from "./web.js";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

/* Slash Command */
const commands = [
  {
    name: "pfp",
    description: "Ändert Profile Image oder Banner Image",
    options: [
      {
        name: "imagename",
        description: "z.B. 2o0hyjv4cgmbugj8igwqr26hh.jpg",
        type: 3,
        required: true
      }
    ]
  }
];

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);
await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });

function normalizeImageName(input) {
  return input.trim().replace(/^https?:\/\/.*\//, "").replace(/[^a-zA-Z0-9_.-]/g, "");
}

client.on("interactionCreate", async (interaction) => {
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName !== "pfp") return;

    const session = getSession(interaction.user.id);
    if (!session) {
      // 🔗 Login-Link nur einmal
      return interaction.reply({
        content: `🔐 Bitte zuerst einloggen:\n${process.env.BASE_URL}/login?discordId=${interaction.user.id}`,
        ephemeral: true
      });
    }

    let imageName = normalizeImageName(interaction.options.getString("imagename"));
    if (!imageName.endsWith(".jpg")) {
      return interaction.reply({
        content: "❌ Nur .jpg Bildnamen erlaubt",
        ephemeral: true
      });
    }

    // Buttons für Profile/Banner
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`profile_${imageName}`)
        .setLabel("Profile Image")
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId(`banner_${imageName}`)
        .setLabel("Banner Image")
        .setStyle(ButtonStyle.Secondary)
    );

    return interaction.reply({
      content: `🖼️ **${imageName}** auswählen als:`,
      components: [row],
      ephemeral: true
    });
  }

  if (interaction.isButton()) {
    const session = getSession(interaction.user.id);
    if (!session) {
      return interaction.reply({ content: "❌ Session abgelaufen", ephemeral: true });
    }

    const [type, imageName] = interaction.customId.split("_");
    clearSession(interaction.user.id); // optional: 1x pro Login

    return interaction.reply({
      content:
        type === "profile"
          ? `✅ Profile Image → **${imageName}**`
          : `🖼️ Banner Image → **${imageName}**`,
      ephemeral: true
    });
  }
});

client.login(process.env.DISCORD_TOKEN);
startWeb(process.env.PORT);
