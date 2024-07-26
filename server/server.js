const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();
app.use(
  cors({
    origin: '*',
  })
);
app.use(express.json());

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js
// app.get('/author/:type', routes.author);
// app.get('/random', routes.random);
// app.get('/song/:song_id', routes.song);
// app.get('/album/:album_id', routes.album);
// app.get('/albums', routes.albums);
// app.get('/album_songs/:album_id', routes.album_songs);
// app.get('/top_songs', routes.top_songs);
// app.get('/top_albums', routes.top_albums);
// app.get('/search_songs', routes.search_songs);

app.get('/author/:type', routes.author);

app.get('/pharmacy', routes.pharmacy_general_info);
app.get('/pharmacy_store_count', routes.pharmacy_store_count);
app.get('/fully_vaccination_count', routes.fully_vaccination_count);
app.get(
  '/state_vaccination_data/:state_name',
  routes.fully_vaccination_count_date
);
app.get('/max_covid_data', routes.max_covid_data);
app.get('/density_death_relation', routes.density_death_relation);
app.get(
  '/vaccination_case_fatality_analysis',
  routes.vaccination_case_fatality_analysis
);

// app.get('/top_songs', routes.top_songs);
// app.get('/top_albums', routes.top_albums);
// app.get('/search_songs', routes.search_songs);

/**
 * auth
 */
app.post('/login', routes.login);
app.post('/signUp', routes.signUp);

app.listen(config.server_port, () => {
  console.log(
    `Server running at http://${config.server_host}:${config.server_port}/`
  );
});

module.exports = app;
