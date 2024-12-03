const db = require("../config/database");

exports.bookSeat = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const { trainNumber, bookingDate } = req.body;
    const userId = req.user.id;

    // Check if the train exists and get the seat count

    // HANDLED CONCURRENCY WITH FOR UPDATE HERE
    const [trainData] = await connection.execute(
      `SELECT t.id, t.total_seats, COUNT(b.id) as booked 
       FROM trains t 
       LEFT JOIN bookings b ON b.train_id = t.id AND b.booking_date = ? AND b.status = "confirmed"
       WHERE t.train_number = ? 
       GROUP BY t.id
       FOR UPDATE`,
      [bookingDate, trainNumber]
    );
    console.log(trainData);
    if (!trainData.length) {
      throw new Error("Train not found");
    }

    if (trainData[0].booked >= trainData[0].total_seats) {
      throw new Error("No seats available");
    }

    const seatNumber = trainData[0].booked + 1;
    const [booking] = await connection.execute(
      "INSERT INTO bookings (user_id, train_id, booking_date, seat_number) VALUES (?, ?, ?, ?)",
      [userId, trainData[0].id, bookingDate, seatNumber]
    );
    console.log(booking);
    await connection.commit();
    res.json({
      message: "Booking successful",
      bookingId: booking.insertId,
      seatNumber,
    });
  } catch (error) {
    await connection.rollback();
    res.status(400).json({ error: error.message });
  } finally {
    // const delay = setTimeout(delay, 5000);
    connection.release();
  }
};

exports.getBookingDetails = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;

    const [booking] = await db.execute(
      `SELECT b.*, t.train_number, t.train_name, t.source_station, t.destination_station 
            FROM bookings b
            JOIN trains t ON b.train_id = t.id
            WHERE b.id = ? AND b.user_id = ?`,
      [bookingId, userId]
    );

    if (!booking.length) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json(booking[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
