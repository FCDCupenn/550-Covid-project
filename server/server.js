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

app.get('/author/:type', routes.author);
app.get('/pharmacy', routes.pharmacy_general_info);
app.get('/pharmacy_store_count', routes.pharmacy_store_count);
app.get('/pharmacy_search', routes.pharmacy_search);
app.get('/pharmacy_selectCity', routes.pharmacy_selectCity);
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
app.get(
  '/vaccination_date',
  routes.vaccination_date
);
app.get('/covid-country-data', routes.country_covid_data_with_position);
app.get('/covid-data', routes.state_covid_data);
app.get('/covid-data-county', routes.county_covid_data)



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
