//#region Requires
const express = require('express');
const app = express();
app.set("view engine", "ejs");
// const path = require ('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 8000;
//#endregion

//#region Middleware
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/assests'));

//#region Mongoose Config
mongoose.connect('mongodb://0.0.0.0:27017/School');
let Students = new mongoose.Schema({
    _id: Number,
    name: String,
    class: Number,
    age: Number
});

let Student = mongoose.model('students', Students);
//#endregion

//#region Requests
mongoose.connection.on('error', () => {
    console.log('cannot connect to Data');
})
mongoose.connection.once('open', () => {
    console.log('connected to DB');
    app.get('/', async (req, res) => {
        let Data = await Student.find();
        // res.json(Data)
        res.render('home.ejs', {
            Data
        })
    });

    app.post('/', async (req, res) => {
        console.log(req.body);
        if (await Student.findById(req.body.id)) {
            const lastRecord = await Student.findOne().sort({
                _id: -1
            });
            const lastId = lastRecord._id;
            console.log(lastId);
            res.send('student already exit insert id after that ' + lastId)
        } else {
            if (isFinite(req.body.id) && isFinite(req.body.class) && isFinite(req.body.age) && !isFinite(req.body.name)) {
                let newData = new Student({
                    _id: req.body.id,
                    name: req.body.name,
                    class: req.body.class,
                    age: req.body.age
                })
                await newData.save()
                res.send('data added')
            } else {
                res.status(400).send('invalid input, name should be char and (id, age, class) should be number')
            }
        }
    });

    app.put('/:id', async (req, res) => {
        if (!isFinite(parseInt(req.params.id))) {
            res.send('Invalid input. Please enter numbers only.')
        } else {
            const studID = await Student.findById(parseInt(req.params.id))
            if (!studID) {
                res.status(404).send("student not found");
            } else {
                if (req.body.name || req.body.class || req.body.age) {
                    studID.name = req.body.name || studID.name;
                    studID.class = req.body.class || studID.class;
                    studID.age = req.body.age || studID.age;
                    await studID.save();
                    res.send('choosen student updated');
                } else {
                    res.status(400).send('no prop match data props')
                }
            }
        }
    })
    app.all("*", (req, res) => {
        res.send("Invalid URL");
    })
});
//#endregion

app.listen(PORT, () => {
    console.log('http://localhost:' + PORT)
});