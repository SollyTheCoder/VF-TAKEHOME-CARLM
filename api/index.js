import mysql from 'mysql'
import express from 'express'
import cors from 'cors'
import { areEmptyValues } from './functions.js';

var con = mysql.createConnection({
  host: "127.0.0.1",
  port: 3306,
  database: 'business',
  user: "root",
  password: "example"
});

const app = express();
const PORT = 5000;

app.use(express.json());
app.listen(PORT, () => {
  console.log(`SERVER : http://localhost:${PORT}`);
  con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
  });
})

app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,PUT,POST,DELETE',
  credentials: true,
}));

//CREATE
app.post('/device', (req, res) => {

  const { name, warehouse_addition_time, fee, linked_industry } = req.body;

  if (areEmptyValues([name, warehouse_addition_time, fee, linked_industry])) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  if (warehouse_addition_time < 0) return res.status(400).json({ error: 'Warehouse time must be positive' });
  if (fee < 0) return res.status(400).json({ error: 'Fee must be positive' });

  const sql_query = `INSERT INTO devices (name, warehouse_addition_time, fee, linked_industry) VALUES ('${name}', ${warehouse_addition_time}, ${fee}, '${linked_industry}')`;
  con.query(sql_query, (err, result) => {
    if (err) throw err
    res.send(result)
  })
});

// READ
app.get("/device", (req, res) => {
  const sql_query = `SELECT * FROM devices`
  con.query(sql_query, (err, result) => {
    if (err) throw err
    res.send(result)
  })
})
app.get("/device/:deviceId", (req, res) => {
  const deviceId = req.params.deviceId;
  const sql_query = `SELECT * FROM devices WHERE devices.id = '${deviceId}'`
  con.query(sql_query, (err, result) => {
    if (err) throw err
    res.send(result)
  })
})

// UPDATE
app.put('/device/:id', (req, res) => {
  const deviceId = req.params.id;
  const { name, warehouse_addition_time, fee, linked_industry } = req.body;

  if (areEmptyValues([name, warehouse_addition_time, fee, linked_industry])) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  if (warehouse_addition_time < 0) return res.status(400).json({ error: 'Warehouse time must be positive' });
  if (fee < 0) return res.status(400).json({ error: 'Fee must be positive' });

  const sql_query = `UPDATE devices SET name = '${name}', warehouse_addition_time = ${warehouse_addition_time}, fee = ${fee}, linked_industry = '${linked_industry}' WHERE id = ${deviceId}`;

  con.query(sql_query, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error updating device.');
    } else {
      if (result.affectedRows === 0) {
        // If no rows were affected, it means the device with the specified ID was not found
        res.status(404).send('Device not found.');
      } else {
        res.status(200).send('Device updated successfully.');
      }
    }
  });
});

// DELETE
app.delete('/device/:id', (req, res) => {
  const deviceId = req.params.id;

  // Assuming you have a MySQL connection named 'con'
  const sql_query = `DELETE FROM devices WHERE id = ${deviceId}`;

  con.query(sql_query, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error deleting device.');
    } else {
      if (result.affectedRows === 0) {
        // If no rows were affected, it means the device with the specified ID was not found
        res.status(404).send('Device not found.');
      } else {
        res.status(200).send('Device deleted successfully.');
      }
    }
  });
});


//CREATE
app.post('/industry', (req, res) => {
  const { name } = req.body;

  if (areEmptyValues([name])) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const sql_query = `INSERT INTO industries (name) VALUES ('${name}')`;
  con.query(sql_query, (err, result) => {
    if (err) throw err
    res.send(result)
  })
});

// READ
app.get("/industry", (req, res) => {
  const sql_query = `SELECT * FROM industries`
  con.query(sql_query, (err, result) => {
    if (err) throw err
    res.send(result)
  })
})

app.get("/industry/:industryId", (req, res) => {
  const industryId = req.params.industryId;
  const sql_query = `SELECT * FROM industries WHERE industries.id = '${industryId}'`
  con.query(sql_query, (err, result) => {
    if (err) throw err
    res.send(result)
  })
})

// UPDATE
app.put('/industry/:id', (req, res) => {
  const industryId = req.params.id;
  const { name } = req.body;

  if (areEmptyValues([name])) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const sql_query = `UPDATE industries SET name = '${name}' WHERE id = ${industryId}`;

  con.query(sql_query, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error updating industry.');
    } else {
      if (result.affectedRows === 0) {
        res.status(404).send('Industry not found.');
      } else {
        res.status(200).send('Industry updated successfully.');
      }
    }
  });
});

// DELETE
app.delete('/industry/:id', (req, res) => {
  const industryId = req.params.id;

  const sql_query = `DELETE FROM industries WHERE id = ${industryId}`;

  con.query(sql_query, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error deleting industry.');
    } else {
      if (result.affectedRows === 0) {
        res.status(404).send('Industry not found.');
      } else {
        res.status(200).send('Industry deleted successfully.');
      }
    }
  });
});
