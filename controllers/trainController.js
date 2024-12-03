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
      `SELECT t.*,
            (t.total_seats - IFNULL(SUM(b.status = 'confirmed'), 0)) as available_seats
            FROM trains t
            LEFT JOIN bookings b ON b.train_id = t.id
            WHERE t.source_station = ? AND t.destination_station = ?
            GROUP BY t.id`,
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
