const db = require("../config/database");

exports.addTrain = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const {
      trainNumber,
      trainName,
      sourceStation,
      destinationStation,
      totalSeats,
      trainDate,
    } = req.body;

    if (
      !trainNumber ||
      !trainName ||
      !sourceStation ||
      !destinationStation ||
      !totalSeats ||
      !trainDate
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const [existingTrain] = await connection.execute(
      "SELECT * FROM trains WHERE train_number = ? AND train_date = ?",
      [trainNumber, trainDate]
    );

    if (existingTrain.length > 0) {
      return res
        .status(400)
        .json({ error: "Train number already exists for this date" });
    }

    await connection.execute(
      "INSERT INTO trains (train_number, train_name, source_station, destination_station, total_seats, train_date) VALUES (?, ?, ?, ?, ?, ?)",
      [
        trainNumber,
        trainName,
        sourceStation,
        destinationStation,
        totalSeats,
        trainDate,
      ]
    );

    res.status(201).json({ message: "Train added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  } finally {
    connection.release();
  }
};

exports.getAvailability = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const { sourceStation, destinationStation } = req.body;

    if (!sourceStation || !destinationStation) {
      return res
        .status(400)
        .json({ error: "Source and destination stations are required" });
    }

    const [trains] = await connection.execute(
      `SELECT trains.id, 
              trains.train_number, 
              trains.train_name, 
              trains.source_station, 
              trains.destination_station, 
              trains.total_seats, 
              trains.created_at, 
              trains.train_date,
              (trains.total_seats - COALESCE(SUM(bookings.status = 'confirmed'), 0)) AS available_seats
       FROM trains 
      LEFT JOIN bookings ON bookings.train_id = trains.id AND bookings.status = 'confirmed'
       WHERE trains.source_station = ? AND trains.destination_station = ?
       GROUP BY trains.id`,
      [sourceStation, destinationStation]
    );

    res.json(trains);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    connection.release();
  }
};
exports.getAvailabilityAll = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const [trains] = await connection.execute(
      `SELECT trains.id, 
              trains.train_number, 
              trains.train_name, 
              trains.source_station, 
              trains.destination_station, 
              trains.total_seats, 
              trains.created_at, 
              trains.train_date,
              (trains.total_seats - COALESCE(SUM(bookings.status = 'confirmed'), 0)) AS available_seats
       FROM trains 
        LEFT JOIN bookings ON bookings.train_id = trains.id AND bookings.status = 'confirmed'
       GROUP BY trains.id`
    );

    res.json(trains);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    connection.release();
  }
};
