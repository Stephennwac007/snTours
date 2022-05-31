const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });
const app = require("./app");

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DB_PASSWORD);

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

// console.log(process.env);
const PORT = process.env.PORT || 3006;

app.listen(PORT, () => {
	console.log(`server is listening on port ${PORT}...`);
});

// const testTour = new Tour({
// 	name: "The Camp bummer",
// 	price: 490,
// });

// testTour
// 	.save()
// 	.then((doc) => {
// 		console.log('successfully saved!!!'); 
// 		console.log(doc);
// 	})
// 	.catch((err) => {
// 		console.log(`ERROR : ${err}`);
// 	});
