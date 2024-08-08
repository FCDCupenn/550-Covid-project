const mysql = require('mysql');
const config = require('./config.json');

// Creates MySQL connection using database credential provided in config.json
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db,
});
connection.connect((err) => err && console.log(err));

/******************
 * ] ROUTES *
 ******************/

// Route 1: GET /author/:type
const author = async function (req, res) {
  // TODO (TASK 1): replace the values of name and pennKey with your own
  const name = 'Xin Sun, WenBin Hong, Yilin Wang, Zhe Zhao';
  const pennKey = '77821283';

  // checks the value of type the request parameters
  // note that parameters are required and are specified in server.js in the endpoint by a colon (e.g. /author/:type)
  if (req.params.type === 'name') {
    // res.send returns data back to the requester via an HTTP response
    res.send(`Created by ${name}`);
  } else if (req.params.type === 'pennkey') {
     res.send(`Created by ${pennKey}`);
  } else {
    res
      .status(400)
      .send(
        `'${req.params.type}' is not a valid author type. Valid types are 'name' and 'pennkey'.`
      );
  }
};


const pharmacy_general_info = async function (req, res) {
  // given pharmacy, return all store count by each state
  const page = req.query.page;
  const pageSize = req.query.page_size ?? 10;
  const offset = page ? (page - 1) * pageSize : 0;

  connection.query(
    `
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
  
  `,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
        // console.log('API Data:', data);
      }
    }
  );
};

const pharmacy_selectCity = async function (req, res) {
  // given a state, return all the cities from that state
  const state = req.query.state_name ?? '%';

  connection.query(
    `
  SELECT DISTINCT city
  FROM Pharmacy
  WHERE state LIKE '%${state}%'
  ORDER BY CITY;
    
  `,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
        console.log('Cities are:', data);
      }
    }
  );
};

const pharmacy_search = async function (req, res) {

  const state = req.query.state_name ?? '%';
  const city = req.query.city_name ?? '%';
  const longitude_low = req.query.longitude_low ?? -177;
  const longitude_high = req.query.longitude_high ?? 146;
  const latitude_low = req.query.latitude_low ?? 13;
  const latitude_high = req.query.latitude_high ?? 72;

  connection.query(
    `
    SELECT
        store_id,
        loc_name,
        city,
        state,
        GROUP_CONCAT(med_name ORDER BY med_name SEPARATOR '; ') AS med_names,
        category,
        longitude,
        latitude
    FROM
        Pharmacy
    WHERE
        state LIKE '%${state}%' AND city LIKE '%${city}%' AND
        longitude BETWEEN ${longitude_low} AND ${longitude_high} AND
        latitude BETWEEN ${latitude_low} AND ${latitude_high}
    GROUP BY
        store_id,
        loc_name,
        city,
        state,
        category,
        longitude,
        latitude
    `,
    (err, data) => {
          if (err || data.length === 0) {
            console.log(err);
            res.json([]);
          } else {
            console.log("state is ", state);
            console.log("city is ", city);
            console.log("latitude_low is ", latitude_low);
            console.log("longitude_low is ", longitude_low);
            res.json(data);
          }
        });
};




const pharmacy_store_count = async function (req, res) {
  // given pharmacy, return all store count by each state
  const page = req.query.page;
  const pageSize = req.query.page_size ?? 10;
  const offset = page ? (page - 1) * pageSize : 0;

  connection.query(
    `
  SELECT state, COUNT(DISTINCT store_id) AS provider_count
  FROM Pharmacy
  GROUP BY state
  ORDER BY COUNT(store_id) DESC
    LIMIT ${pageSize} OFFSET ${offset};
  
  `,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
        // console.log('API Data:', data);
      }
    }
  );
};

const fully_vaccination_count = async function (req, res) {
  // given state_vaccination_data, return all people vaccination count by each state
  const page = req.query.page;
  const pageSize = req.query.page_size ?? 10;
  const offset = page ? (page - 1) * pageSize : 0;

  connection.query(
    `
 SELECT state_name, MAX(people_fully_vaccinated) AS total_fully_vaccinated
  FROM State_Vaccination_Data
  WHERE state_name != 'United States'
  GROUP BY state_name
  ORDER BY MAX(people_fully_vaccinated) DESC
  LIMIT ${pageSize} OFFSET ${offset};
  
  `,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    }
  );
};

const fully_vaccination_count_date = async function (req, res) {
  // given a state, output the vaccine count and date
  const state_name = req.params.state_name;

  connection.query(
    `
  SELECT svd.state_name, svd.people_fully_vaccinated, svd.date
  FROM State_Vaccination_Data svd
  JOIN (
    SELECT state_name, MAX(people_fully_vaccinated) AS max_vaccinated
    FROM State_Vaccination_Data
    WHERE state_name != 'United States'
    GROUP BY state_name
  ) max_svd ON svd.state_name = max_svd.state_name AND svd.people_fully_vaccinated = max_svd.max_vaccinated
  ORDER BY svd.people_fully_vaccinated DESC;

`,
    [state_name],
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    }
  );
};

// 2024-07-23 by Yuling

const max_covid_data = async function (req, res) {
  connection.query(
    `
  SELECT country_name,
         MAX(total_deaths) AS max_deaths,
         MAX(total_cases) AS max_cases
  FROM COVID_Case_Country
  WHERE country_name NOT LIKE '%income%' AND country_name != 'World'
  GROUP BY country_name;
  `,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    }
  );
};



const density_death_relation = async function (req, res) {
  connection.query(
    `
  SELECT p.Country, p.\`Density(P/Km²)\`, MAX(c.total_deaths) AS max_total_deaths
  FROM WorldPopulation2023 p
  JOIN COVID_Case_Country c ON p.Country = c.country_name
  GROUP BY p.Country, p.\`Density(P/Km²)\`
  ORDER BY p.\`Density(P/Km²)\` DESC;
  `,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    }
  );
};

const vaccination_date = async function (req, res) {
  connection.query(
    `
    SELECT
      c.country_name,
      cvd.date AS vaccination_date,
      cvd.total_vaccinations,
      cvd.people_vaccinated,
      cvd.people_fully_vaccinated,
      cc.date AS case_date,
      cc.total_cases,
      cc.total_deaths,
      ROUND((cc.total_deaths / NULLIF(cc.total_cases, 0)) * 100, 2) AS case_fatality_rate,
      ROUND((cvd.people_fully_vaccinated / NULLIF(wp.Population2023, 0)) * 100, 2) AS fully_vaccinated_percentage,
      ROUND((cvd.total_vaccinations / NULLIF(wp.Population2023, 0)) * 100, 2) AS vaccination_coverage_percentage
    FROM
      Country_Vaccination_Data cvd
    JOIN
      COVID_Case_Country cc ON cvd.country_id = cc.country_id AND cvd.date = cc.date
    JOIN
      Country c ON cvd.country_id = c.country_id
    JOIN
      WorldPopulation2023 wp ON c.country_name = wp.Country
    WHERE
      cc.total_cases > 10000
    ORDER BY
      case_fatality_rate DESC;
    `,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    }
  );
}

const vaccination_case_fatality_analysis = async function (req, res) {
  connection.query(
    `
    WITH Filtered_CVD AS (
      SELECT
        cvd.country_id,
        c.country_name,
        cvd.date AS vaccination_date,
        cvd.total_vaccinations,
        cvd.people_vaccinated,
        cvd.people_fully_vaccinated
      FROM
        Country_Vaccination_Data cvd
      JOIN
        Country c ON cvd.country_id = c.country_id
      WHERE
        cvd.total_vaccinations > 0
        AND cvd.people_vaccinated > 0
        AND cvd.people_fully_vaccinated > 0
    ), Filtered_CC AS (
      SELECT
        country_id,
        date AS case_date,
        total_cases,
        total_deaths
      FROM
        COVID_Case_Country
      WHERE
        total_cases > 10000
    )
    SELECT
      fcvd.country_name,
      fcvd.vaccination_date,
      fcvd.total_vaccinations,
      fcvd.people_vaccinated,
      fcvd.people_fully_vaccinated,
      fcc.case_date,
      fcc.total_cases,
      fcc.total_deaths,
      ROUND((fcc.total_deaths / NULLIF(fcc.total_cases, 0)) * 100, 2) AS case_fatality_rate,
      ROUND((fcvd.people_fully_vaccinated / NULLIF(wp.Population2023, 0)) * 100, 2) AS fully_vaccinated_percentage,
      ROUND((fcvd.total_vaccinations / NULLIF(wp.Population2023, 0)) * 100, 2) AS vaccination_coverage_percentage
    FROM
      Filtered_CVD fcvd
    JOIN
      Filtered_CC fcc ON fcvd.country_id = fcc.country_id AND fcvd.vaccination_date = fcc.case_date
    JOIN
      WorldPopulation2023 wp ON fcvd.country_name = wp.Country
    ORDER BY
      case_fatality_rate DESC;
    `,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    }
  );
};


const country_covid_data_with_position = async function (req, res) {
  connection.query(

    `SELECT * FROM Country_Case_LatLong WHERE Country != "Europe";
`, (err, data) => {
  if (err || data.length === 0) {
    console.log(err);
    res.json({});
  } else {
    res.json(data);
  }
}
);

}

const state_covid_data = async function (req, res) {
  connection.query(
      `SELECT a.state, a.date, a.cases, a.deaths
FROM States_FipCaseDeath a
INNER JOIN (
    SELECT state, MAX(date) AS MaxDate
    FROM States_FipCaseDeath
    GROUP BY state
) b ON a.state = b.state AND a.date = b.MaxDate
ORDER BY a.state;
`,  
      (err, data) => {
          if (err || data.length === 0) {
              console.error(err);
              res.status(500).json({error: 'Internal server error'});
          } else {
              res.json(data);
          }
      }
  );
}

const county_covid_data = async function (req, res) {
  connection.query(
      `
      SELECT
    c.county_name,
    c.state_name,
    cc.total_avg_cases,
    cc.total_avg_deaths,
    latest_data.cases_avg AS recent_cases_avg,
    latest_data.deaths_avg AS recent_deaths_avg,
    f.cases AS cases,
    f.deaths AS deaths,
    latest_data.latest_date
FROM
    County c
LEFT JOIN
    County_Case cc ON c.county_name = cc.county AND c.state_name = cc.state
LEFT JOIN
    (SELECT
        county_id,
        MAX(date) AS latest_date,
        cases_avg,
        deaths_avg
     FROM
        COVID_Case_County
     GROUP BY
        county_id
    ) latest_data ON c.county_id = latest_data.county_id
LEFT JOIN
    Counties_FipCaseDeath f ON c.county_name = f.county AND c.state_name = f.state AND f.date = latest_data.latest_date
WHERE
    latest_data.latest_date IS NOT NULL
ORDER BY
    c.state_name, c.county_name;
`,  
      (err, data) => {
          if (err || data.length === 0) {
              console.error(err);
              res.status(500).json({error: 'Internal server error'});
          } else {
              res.json(data);
          }
      }
  );
}



const login = (req, res) => {
  // 1. Get the username and password from the request body
  const { username, password } = req.body;

  // 2. Validate the input
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: 'Username and password cannot be empty' });
  }

  // 3. Query the database to verify the username and password
  connection.query(
    'SELECT * FROM users WHERE username = ?',
    [username],
    (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Error querying the database' });
      }

      // 4. If the query result is empty, the username does not exist
      if (data.length === 0) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      // 5. If a user is found, verify the password
      const user = data[0];
      if (user.password !== password) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      // 6. Login successful, return the response
      res.status(200).json({
        message: 'Login successful',
        user: { id: user.id, username: user.username },
      });
    }
  );
};

const signUp = (req, res) => {
  // 1. Get the username and password from the request body
  const { username, password } = req.body;

  // 2. Validate the input
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: 'Username and password cannot be empty' });
  }

  // 3. Query the database to check if the username already exists
  connection.query(
    'SELECT * FROM users WHERE username = ?',
    [username],
    (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Error querying the database' });
      }

      if (data.length > 0) {
        return res.status(409).json({ error: 'Username already exists' });
      }

      // 4. If the username does not exist, insert the new user information into the database
      const insertQuery =
        'INSERT INTO users (username, password) VALUES (?, ?)';
      connection.query(insertQuery, [username, password], (err, data) => {
        if (err) {
          return res.status(500).json({ error: 'Registration failed' });
        }

        // 5. Registration successful, return the response
        res.status(201).json({ message: 'Registration successful' });
      });
    }
  );
};

module.exports = {
  author,
  pharmacy_store_count,
  pharmacy_general_info,
  pharmacy_search,
  pharmacy_selectCity,
  fully_vaccination_count,
  fully_vaccination_count_date,
  max_covid_data,
  density_death_relation,
  vaccination_date,
  vaccination_case_fatality_analysis,
  login,
  signUp,
  country_covid_data_with_position,
  state_covid_data,
  county_covid_data,
  // add more routes
};
