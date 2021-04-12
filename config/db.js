const mongoose = require('mongoose');

mongoose
  .connect(`mongodb+srv://${process.env.DB_USER_PASS}@cluster0.98ekf.mongodb.net/reseau-social`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.log("Failed to connect to MongoDB", error))