const { google } = require("googleapis");
const express = require("express");
const app = express();
const cors = require('cors');


app.use(cors());

const oAuth2Client = new google.auth.OAuth2(
    "792384898936-17eq4677ondom7fk2i7bqbai5dvh55vu.apps.googleusercontent.com",
    "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",
    "http://localhost:3000"
);
  
  app.get("/rest/v1/calendar/init", (req, res) => {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: ["https://www.googleapis.com/auth/calendar.readonly"],
    });
    console.log(authUrl);
    res.redirect(authUrl);
  });
  
  app.get("/rest/v1/calendar/redirect/", async (req, res) => {
    try {
      const { code } = req.query;
      console.log(code);
      const { tokens } = await oAuth2Client.getToken(code);
      oAuth2Client.setCredentials(tokens);
  
      const calendar = google.calendar({ version: "v3", auth: oAuth2Client });
      const events = await calendar.events.list({
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: "startTime",
      });
  
      // Return a list of events
      res.send(events.data.items);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });

app.listen(3001, () => {
  console.log("Listening on port 3000");
});
