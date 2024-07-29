const mysql = require('mysql')
const config = require('./config.json')

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});
connection.connect((err) => err && console.log(err));

/******************
 * WARM UP ROUTES *
 ******************/

// Route 1: GET /author/:type
const author = async function(req, res) {
  // TODO (TASK 1): replace the values of name and pennKey with your own
  const name = 'Xin Sun';
  const pennKey = '77821283';

  // checks the value of type the request parameters
  // note that parameters are required and are specified in server.js in the endpoint by a colon (e.g. /author/:type)
  if (req.params.type === 'name') {
    // res.send returns data back to the requester via an HTTP response
    res.send(`Created by ${name}`);
  } else if (req.params.type === 'pennkey') {
    // TODO (TASK 2): edit the else if condition to check if the request parameter is 'pennkey' and if so, send back response 'Created by [pennkey]'
    res.send(`Created by ${pennKey}`);
  } else {
    // we can also send back an HTTP status code to indicate an improper request
    res.status(400).send(`'${req.params.type}' is not a valid author type. Valid types are 'name' and 'pennkey'.`);
  }
}

// // Route 2: GET /random
// const random = async function(req, res) {
//   // you can use a ternary operator to check the value of request query values
//   // which can be particularly useful for setting the default value of queries
//   // note if users do not provide a value for the query it will be undefined, which is falsey
//   const explicit = req.query.explicit === 'true' ? 1 : 0;

//   // Here is a complete example of how to query the database in JavaScript.
//   // Only a small change (unrelated to querying) is required for TASK 3 in this route.
//   connection.query(`
//     SELECT *
//     FROM Songs
//     WHERE explicit <= ${explicit}
//     ORDER BY RAND()
//     LIMIT 1
//   `, (err, data) => {
//     if (err || data.length === 0) {
//       // If there is an error for some reason, or if the query is empty (this should not be possible)
//       // print the error message and return an empty object instead
//       console.log(err);
//       // Be cognizant of the fact we return an empty object {}. For future routes, depending on the
//       // return type you may need to return an empty array [] instead.
//       res.json({});
//     } else {
//       // Here, we return results of the query as an object, keeping only relevant data
//       // being song_id and title which you will add. In this case, there is only one song
//       // so we just directly access the first element of the query results array (data)
//       // TODO (TASK 3): also return the song title in the response
//       res.json({
//         song_id: data[0].song_id,
//         title: data[0].title,
//         // explicit: data[0].explicit
//       });
//     }
//   });
// }

/********************************
 * BASIC Covid Related INFO ROUTES *
 ********************************/

const pharmacy_general_info = async function(req, res) {
  // given pharmacy, return all store count by each state
  const page = req.query.page;
  const pageSize = req.query.page_size ?? 10;
  const offset = page ? (page - 1) * pageSize : 0;
 
  connection.query(`
SELECT
    loc_name,
    city,
    state,
    GROUP_CONCAT(med_name ORDER BY med_name SEPARATOR '; ') AS med_names,
    category,
    longitude,
    latitude
FROM
    Pharmacy
GROUP BY
    loc_name,
    city,
    state,
    category,
    longitude,
    latitude
    LIMIT ${pageSize} OFFSET ${offset};
  
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
      // console.log('API Data:', data);
    }
  });
}

// const search_pharmacy_info = async function(req, res) {
//     // return all pharmacy info that match the given search query with parameters defaulted to those specified in API spec ordered by loc_name (ascending)
//     // Some default parameters have been provided for you, but you will need to fill in the rest
//     const state_name = req.query.state_name ?? '%';
  
//     connection.query(`
//       SELECT loc_name,
//               city,
//               state,
//               GROUP_CONCAT(med_name ORDER BY med_name SEPARATOR '; ') AS med_names,
//               category,
//               longitude,
//               latitude
//       FROM Pharmacy
//       WHERE state LIKE '%${state}%' 
//       GROUP BY
//               loc_name,
//               city,
//               state,
//               category,
//               longitude,
//               latitude
//   `, (err, data) => {
//       if (err || data.length === 0) {
//         console.log(err);
//         res.json([]);
//       } else {
//         res.json(data);
//       }
//     });
  
//   }

  const search_pharmacy_info = async function(req, res) {
    const state_name = req.query.state_name ?? '%'; 
    // Prepare your SQL query using parameter placeholders to prevent SQL injection
    const sqlQuery = `
        SELECT loc_name,
               city,
               state,
               GROUP_CONCAT(med_name ORDER BY med_name SEPARATOR '; ') AS med_names,
               category,
               longitude,
               latitude
        FROM Pharmacy
        WHERE state LIKE ?
        GROUP BY loc_name, city, state, category, longitude, latitude
    `;

    // Execute the query safely by passing the parameters separately
    connection.query(sqlQuery, [state_name], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Internal server error' });
        } else if (data.length === 0) {
            res.status(404).json([]);  // Send an empty array with a 404 status if no results found
        } else {
            res.json(data);  // Send the fetched data if found
        }
    });
}




const pharmacy_store_count = async function(req, res) {
  // given pharmacy, return all store count by each state
  const page = req.query.page;
  const pageSize = req.query.page_size ?? 10;
  const offset = page ? (page - 1) * pageSize : 0;
 
  connection.query(`
  SELECT state, COUNT(DISTINCT store_id) AS provider_count
  FROM Pharmacy
  GROUP BY state
  ORDER BY COUNT(store_id) DESC
    LIMIT ${pageSize} OFFSET ${offset};
  
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
      // console.log('API Data:', data);
    }
  });
}




const fully_vaccination_count = async function(req, res) {
  // given state_vaccination_data, return all people vaccination count by each state
  const page = req.query.page;
  const pageSize = req.query.page_size ?? 10;
  const offset = page ? (page - 1) * pageSize : 0;
 
  connection.query(`
 SELECT state_name, MAX(people_fully_vaccinated) AS total_fully_vaccinated
  FROM State_Vaccination_Data
  WHERE state_name != 'United States'
  GROUP BY state_name
  ORDER BY MAX(people_fully_vaccinated) DESC
  LIMIT ${pageSize} OFFSET ${offset};
  
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}



const fully_vaccination_count_date = async function(req, res) {
  // given a state, output the vaccine count and date
  const state_name = req.params.state_name

  connection.query(`
  SELECT svd.state_name, svd.people_fully_vaccinated, svd.date
  FROM State_Vaccination_Data svd
  JOIN (
    SELECT state_name, MAX(people_fully_vaccinated) AS max_vaccinated
    FROM State_Vaccination_Data
    WHERE state_name != 'United States'
    GROUP BY state_name
  ) max_svd ON svd.state_name = max_svd.state_name AND svd.people_fully_vaccinated = max_svd.max_vaccinated
  ORDER BY svd.people_fully_vaccinated DESC;

`, [state_name], (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// 2024-07-23 by Yuling

const max_covid_data = async function(req, res) {
  connection.query(`
  SELECT country_name,
         MAX(total_deaths) AS max_deaths,
         MAX(total_cases) AS max_cases
  FROM COVID_Case_Country
  WHERE country_name NOT LIKE '%income%' AND country_name != 'World'
  GROUP BY country_name;
  `, (err, data) => {
      if (err || data.length === 0) {
          console.log(err);
          res.json({});
      } else {
          res.json(data);
      }
  });
}

const density_death_relation = async function(req, res) {
  connection.query(`
  SELECT p.Country, p.\`Density(P/Km²)\`, MAX(c.total_deaths) AS max_total_deaths
  FROM WorldPopulation2023 p
  JOIN COVID_Case_Country c ON p.Country = c.country_name
  GROUP BY p.Country, p.\`Density(P/Km²)\`
  ORDER BY p.\`Density(P/Km²)\` DESC;
  `, (err, data) => {
      if (err || data.length === 0) {
          console.log(err);
          res.json({});
      } else {
          res.json(data);
      }
  });
}

const vaccination_case_fatality_analysis = async function(req, res) {
  connection.query(`
  WITH MaxVaccineDates AS (
      SELECT country_id, MAX(date) AS max_vaccination_date FROM Country_Vaccination_Data GROUP BY country_id
  ), MaxCaseDates AS (
      SELECT country_id, MAX(date) AS max_case_date FROM COVID_Case_Country GROUP BY country_id
  )
  SELECT
      cvd.country_name,
      cvd.date AS vaccination_date,
      cvd.total_vaccinations,
      cvd.people_vaccinated,
      cvd.people_fully_vaccinated,
      cc.date AS case_date,
      cc.total_cases,
      cc.total_deaths,
      ROUND((cc.total_deaths / NULLIF(cc.total_cases, 0)) * 100, 2) AS case_fatality_rate,
      ROUND((cvd.people_fully_vaccinated / NULLIF(wrp.Population2023, 0)) * 100, 2) AS fully_vaccinated_percentage,
      ROUND((cvd.total_vaccinations / NULLIF(wrp.Population2023, 0)) * 100, 2) AS vaccination_coverage_percentage
  FROM
      Country_Vaccination_Data cvd
  JOIN
      MaxVaccineDates mvd ON cvd.country_id = mvd.country_id AND cvd.date = mvd.max_vaccination_date
  JOIN
      COVID_Case_Country cc ON cvd.country_id = cc.country_id
  JOIN
      MaxCaseDates mcd ON cc.country_id = mcd.country_id AND cc.date = mcd.max_case_date
  JOIN
      WorldPopulation2023 wrp ON cvd.country_name = wrp.Country
  WHERE
      cc.total_cases > 10000
  ORDER BY
      case_fatality_rate DESC;
  `, (err, data) => {
      if (err || data.length === 0) {
          console.log(err);
          res.json({});
      } else {
          res.json(data);
      }
  });
}


/************************
 * ADVANCED INFO ROUTES *
 ************************/

// // Route 7: GET /top_songs
// const top_songs = async function(req, res) {
//   const page = req.query.page;
//   // TODO (TASK 8): use the ternary (or nullish) operator to set the pageSize based on the query or default to 10
//   const pageSize = req.query.page_size ?? 10;

//   if (!page) {
//     // TODO (TASK 9)): query the database and return all songs ordered by number of plays (descending)
//     // Hint: you will need to use a JOIN to get the album title as well
//       connection.query(`
//       SELECT s.song_id, s.title, s.album_id, a.title AS album, s.plays
//       FROM Songs s
//       JOIN Albums a on s.album_id = a.album_id
//       ORDER BY plays DESC

//     `, (err, data) => {
//         if (err || data.length === 0) {
//           console.log(err);
//           res.json([]);
//         } else {
//           res.json(data);
//         }
//       });
//   } else {
//     // TODO (TASK 10): reimplement TASK 9 with pagination
//     // Hint: use LIMIT and OFFSET (see https://www.w3schools.com/php/php_mysql_select_limit.asp)
//     const offset = (page-1) * pageSize;
//     connection.query(`
//     SELECT s.song_id, s.title, s.album_id, a.title AS album, s.plays
//     FROM Songs s
//     JOIN Albums a on s.album_id = a.album_id
//     ORDER BY plays DESC
//     LIMIT ${pageSize} OFFSET ${offset}`, 
//     (err, data) => {
//       if (err || data.length === 0) {
//         console.log(err);
//         res.json([]);
//       } else {
//         res.json(data);
//       }
//     });
//   }
// }




// // Route 8: GET /top_albums
// const top_albums = async function(req, res) {
//   // TODO (TASK 11): return the top albums ordered by aggregate number of plays of all songs on the album (descending), with optional pagination (as in route 7)
//   // Hint: you will need to use a JOIN and aggregation to get the total plays of songs in an album
//   const page = req.query.page;
//   // TODO (TASK 8): use the ternary (or nullish) operator to set the pageSize based on the query or default to 10
//   const pageSize = req.query.page_size ?? 10;
//   const offset = page ? (page - 1) * pageSize : 0;

//   connection.query(`
//     SELECT a.album_id, a.title, SUM(s.plays) AS plays
//     FROM Albums a
//     JOIN Songs s ON a.album_id = s.album_id
//     GROUP BY a.album_id, a.title
//     ORDER BY plays DESC
//     ${page ? `LIMIT ${pageSize} OFFSET ${offset}` : ""}

// `, (err, data) => {
//     if (err || data.length === 0) {
//       console.log(err);
//       res.json({});
//     } else {
//       res.json(data);
//     }
//   });
// }


// // Route 9: GET /search_albums
// const search_songs = async function(req, res) {
//   // TODO (TASK 12): return all songs that match the given search query with parameters defaulted to those specified in API spec ordered by title (ascending)
//   // Some default parameters have been provided for you, but you will need to fill in the rest
//   const title = req.query.title ?? '%';
//   const durationLow = req.query.duration_low ?? 60;
//   const durationHigh = req.query.duration_high ?? 660;
//   const playsLow = req.query.plays_low ?? 0;
//   const playsHigh = req.query.plays_high ?? 1100000000;
//   const energyLow = req.query.energy_low ?? 0;
//   const energyHigh = req.query.energy_high ?? 1;
//   const danceabilityLow = req.query.danceability_low ?? 0;
//   const danceabilityHigh = req.query.danceability_high ?? 1;
//   const valenceLow = req.query.valence_low ?? 0;
//   const valenceHigh = req.query.valence_high ?? 1;
//   const explicit = req.query.explicit === 'true' ? 1 : 0;

//   connection.query(`
//     SELECT *
//     FROM Songs
//     WHERE title LIKE '%${title}%' AND
//           duration BETWEEN ${durationLow} AND ${durationHigh} AND
//           plays BETWEEN ${playsLow} AND ${playsHigh} AND
//           energy BETWEEN ${energyLow} AND ${energyHigh} AND
//           danceability BETWEEN ${danceabilityLow} AND ${danceabilityHigh} AND
//           valence BETWEEN ${valenceLow} AND ${valenceHigh} AND
//           explicit <= ${explicit}
//     ORDER BY title ASC
// `, (err, data) => {
//     if (err || data.length === 0) {
//       console.log(err);
//       res.json([]);
//     } else {
//       res.json(data);
//     }
//   });

// }



module.exports = {
  author,
  pharmacy_store_count,
  pharmacy_general_info,
  search_pharmacy_info,
  fully_vaccination_count,
  fully_vaccination_count_date,
  max_covid_data,
  density_death_relation,
  vaccination_case_fatality_analysis,
  // add more routes

}
