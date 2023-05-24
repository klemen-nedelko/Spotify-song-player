const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const SpotifyWebApi = require('spotify-web-api-node');
const lyricsFinder = require('lyrics-finder');


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.post("/refresh", (req, res) => {
    const refreshToken = req.body.refreshToken;
    console.log("hi")
    const spotifyApi = new SpotifyWebApi({
        redirectUri:'http://localhost:5173',
        clientId:'ce24afed0dc84569943866aaa98c165f',
        clientSecret:'e18f9cf8047347fea61ee48991076532',
      refreshToken,
    })
  
    spotifyApi
      .refreshAccessToken()
      .then(data => {
        res.json({
          accessToken: data.body.accessToken,
          expiresIn: data.body.expiresIn,
        })
      })
      .catch(err => {
        console.log(err)
        res.sendStatus(400)
      })
  })

app.post("/login", (req, res) => {
    const code = req.body.code
    const spotifyApi = new SpotifyWebApi({
        redirectUri:'http://localhost:5173',
        clientId:'ce24afed0dc84569943866aaa98c165f',
        clientSecret:'e18f9cf8047347fea61ee48991076532'
    })
  
    spotifyApi
      .authorizationCodeGrant(code)
      .then(data => {
        res.json({
          accessToken: data.body.access_token,
          refreshToken: data.body.refresh_token,
          expiresIn: data.body.expires_in,
        })
      })
      .catch((err) => {
        res.sendStatus(400)
      })
  })

  app.get('/lyrics', async(req, res) => {
    const lyrics = await lyricsFinder(req.query.artist, req.query.track) || "No Lyrics found";
    res.json({lyrics})
  })

  app.listen(3001);