const { google } = require("googleapis");
const express = require("express");
const app = express();
const cors = require('cors');
require('dotenv').config()



app.use(cors());

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const REDIRECT_URI = process.env.GOOGLE_CLIENT_REDIRECT_URI
const PORT = process.env.PORT | 3001;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
  

  app.get("/rest/v1/calendar/init", (req, res) => {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: ["https://www.googleapis.com/auth/calendar.readonly"],
    });
    res.redirect(authUrl);
  });
  
  app.get("/rest/v1/calendar/redirect/", async (req, res) => {
    try {
      const { code } = req.query;
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

  app.get('/', (req, res)=>{
    res.send("Welcome to the Node app");
  })

app.listen(PORT, () => {
  console.log("Listening on port 3000");
});
