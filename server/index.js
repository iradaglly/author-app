const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
const mongoose = require("mongoose");
app.use(bodyParser.json());
app.use(cors());
const dotenv = require("dotenv");
dotenv.config();

//  Mongo DB connection
DB_CONNECTION = process.env.DB_CONNECTION;
DB_PASSWORD = process.env.DB_PASSWORD;
mongoose
  .connect(DB_CONNECTION.replace("<password>", DB_PASSWORD))
  .then(() => console.log("Mongo DB Connected!"));

// Author Schema
const AuthorSchema = new mongoose.Schema({
  name: String,
  birthYear: Number,
  genre: String,
  isMale: String,
  isDead: String,
  imageUrl: String,
});

// Author Model
const AuthorModel = mongoose.model("Authors", AuthorSchema);

// Get
app.get("/authors", async (req, res) => {
  const { name } = req.query;
  const authors = await AuthorModel.find();
  if (name === undefined) {
    res.status(200).send(authors);
  } else {
    res
      .status(200)
      .send(
        authors.filter((x) =>
          x.name.toLowerCase().trim().includes(name.toLowerCase().trim())
        )
      );
  }
});

// Get by ID
app.get("/authors/:id", async (req, res) => {
  const id = req.params.id;
  const author = await AuthorModel.findById(id);
  if (!author) {
    res.status(204).send("author not found!");
  } else {
    res.status(200).send(author);
  }
});

// Post
app.post("/authors", async (req, res) => {
  const { name, birthYear, genre, isMale, isDead, imageUrl } = req.body;
  const newAuthor = new AuthorModel({
    name: name,
    birthYear: birthYear,
    genre: genre,
    isMale: isMale,
    isDead: isDead,
    imageUrl: imageUrl,
  });
  await newAuthor.save();
  res.status(201).send("created");
});

// Put
app.put("/authors/:id", async (req, res) => {
  const id = req.params.id;
  const { name, birthYear, genre, isMale, isDead, imageUrl } = req.body;
  const existedAuthor = await AuthorModel.findByIdAndUpdate(id, {
    name: name,
    birthYear: birthYear,
    genre: genre,
    isMale: isMale,
    isDead: isDead,
    imageUrl: imageUrl,
  });
  if (existedAuthor == undefined) {
    res.status(404).send("author not found!");
  } else {
    res.status(200).send(`${name} updated successfully!`);
  }
});

PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`NODE APP listening on port ${PORT}`);
});
