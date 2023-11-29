const express = require("express");
const app = express();
const port = 3000;

const series = [
  {
    title: "Criminal Code",
    year: "2023",
    genre: "Action",
    seasons: "1 season",
  },
  {
    title: "The Sandman",
    year: "2022",
    genre: "Drama",
    seasons: "1 season",
  },
  {
    title: "Shadow and Bone",
    year: "2021",
    genre: "Drama",
    seasons: "2 seasons",
  },
];

// Function to find a series by title
const findSeriesByTitle = (title) => {
  return series.find((s) => s.title.toLowerCase() === title.toLowerCase());
};

// Endpoint to get all series
app.get("/api/series", (req, res) => {
  res.json(series);
});

// Endpoint to get a specific series by title
app.get("/api/series/:title", (req, res) => {
  const requestedTitle = req.params.title;
  const foundSeries = findSeriesByTitle(requestedTitle);

  if (foundSeries) {
    res.json(foundSeries);
  } else {
    res.status(404).send("Series not found");
  }
});

// Endpoint to get specific property (title, year, genre, seasons)
app.get("/api/series/:title/:property", (req, res) => {
  const requestedTitle = req.params.title;
  const requestedProperty = req.params.property;
  const foundSeries = findSeriesByTitle(requestedTitle);

  if (foundSeries && foundSeries[requestedProperty]) {
    res.json(foundSeries[requestedProperty]);
  } else {
    res.status(404).send("Series or property not found");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
