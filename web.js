import express from "express";
import { setSession } from "./session.js";

const app = express();

app.get("/login", (req, res) => {
  const discordId = req.query.discordId;
  if (!discordId) return res.send("Missing discordId");

  // 🔐 Offizielle Login-Seite
  res.redirect("https://rec.net/login");
});

app.get("/callback", (req, res) => {
  const discordId = req.query.discordId;
  if (!discordId) return res.send("Missing discordId");

  // Session existiert danach für 24h
  setSession(discordId, { loggedIn: true });

  res.send(
    "✅ Login abgeschlossen! Zurück zu Discord, dein Bot kann jetzt automatisch arbeiten."
  );
});

export function startWeb(port) {
  app.listen(port, () => console.log("Webserver läuft auf Port", port));
}
