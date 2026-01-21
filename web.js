import express from "express";
import { setSession } from "./session.js";

const app = express();

app.get("/login", (req, res) => {
  const discordId = req.query.discordId;
  if (!discordId) return res.send("Missing ID");

  // ⚠️ HIER würde bei echten Bots der Login‑Flow stattfinden
  // Ich leite NUR weiter (keine Cookies, kein Token)

  res.redirect("https://rec.net/login");
});

app.get("/callback", (req, res) => {
  // ⚠️ Platzhalter
  // Seriöse Bots würden hier prüfen, ob Login erfolgreich war

  setSession(req.query.discordId, { loggedIn: true });
  res.send("Login abgeschlossen. Du kannst zurück zu Discord.");
});

export function startWeb(port) {
  app.listen(port, () =>
    console.log("Webserver läuft auf Port", port)
  );
}
