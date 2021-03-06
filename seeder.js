const fs = require('fs');
const colors = require('colors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Loading env var
dotenv.config({ path: './config/config.env' });

// Load Model Bootcamp
const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');
const User = require('./models/User');
const Review = require('./models/Review');

// Connecting to DB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
});

const bootcampsData = JSON.parse(
    fs.readFileSync(__dirname + '/_data/bootcamps.json', 'utf-8')
);

const coursesData = JSON.parse(
    fs.readFileSync(__dirname + '/_data/courses.json', 'utf-8')
);

const usersData = JSON.parse(
    fs.readFileSync(__dirname + '/_data/users.json', 'utf-8')
);

const reviewData = JSON.parse(
    fs.readFileSync(__dirname + '/_data/reviews.json', 'utf-8')
);

const importData = async() => {
    try {
        await Bootcamp.create(bootcampsData);
        await Course.create(coursesData);
        await User.create(usersData);
        await Review.create(reviewData);
        console.log('Data imported...'.green.inverse);
        process.exit();
    } catch (err) {
        console.error(err);
    }
};

// Delete Data
const deleteData = async() => {
    try {
        await Bootcamp.deleteMany();
        await Course.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log('Data deleted...'.red.inverse);
        process.exit();
    } catch (err) {
        console.error(err);
    }
};

// accessing the process.argv object of node.js
if (process.argv[2] === '-i') importData();
else if (process.argv[2] === '-d') deleteData();