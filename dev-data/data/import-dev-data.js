const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Tour = require("./../../models/tourModel");

dotenv.config({ path: "./.env" });

const DB = process.env.DATABASE.replace("<password>", process.env.DB_PASSWORD);

mongoose
	.connect(DB, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("DB connection successful!");
	})
	.catch((err) => {
		console.log("database connection failed. exiting now");
		console.log(err);
		process.exit(1);
	});

// read json file synchronously using
const tours = JSON.parse(
	fs.readFileSync(`${__dirname}/tours.json`, "utf-8")
);

//IMPORT DATA INTO DB
const importData = async () => {
	try {
		await Tour.create(tours);
		console.log("Data successfully loaded");
	} catch (err) {
		console.log(err);
	}
	process.exit();
};

// delete all existing data from db
const deleteData = async () => {
	try {
		await Tour.deleteMany();
		console.log("Data successfully deleted!");
	} catch (err) {
		console.log(err);
	}
	process.exit();
};

// console.log(process.argv);
if (process.argv[2] === "--import") {
	importData();
} else if (process.argv[2] === "--delete") {
	deleteData();
}
