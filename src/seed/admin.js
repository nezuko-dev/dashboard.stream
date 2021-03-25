const seeder = require("mongoose-seed");
require("dotenv").config();
var data = [
  {
    model: "admin",
    documents: [
      {
        name: "admin",
        "email.value": "admin@email.com",
        password: "password",
        role: "admin",
      },
    ],
  },
];
seeder.connect(
  process.env.MONGO,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  () => {
    // Load Mongoose models
    seeder.loadModels(["src/models/admin.js"]);
    // Clear specified collections
    console.log("Removing all admins");
    seeder.clearModels(["admin"], () => {
      // Callback to populate DB once collections have been cleared
      seeder.populateModels(data, () => {
        console.log(data[0].documents);
        seeder.disconnect();
      });
    });
  }
);
