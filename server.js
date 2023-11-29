const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList } = require("graphql");

const app = express();
const port = 3000;

const seriesData = [
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

// Define a GraphQL type for Series
const SeriesType = new GraphQLObjectType({
  name: "Series",
  fields: () => ({
    title: { type: GraphQLString },
    year: { type: GraphQLString },
    genre: { type: GraphQLString },
    seasons: { type: GraphQLString },
  }),
});

// Define a Root Query for GraphQL
const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    series: {
      type: new GraphQLList(SeriesType),
      resolve: () => seriesData,
    },
    seriesByTitle: {
      type: SeriesType,
      args: {
        title: { type: GraphQLString },
      },
      resolve: (parent, args) =>
        seriesData.find((s) => s.title.toLowerCase() === args.title.toLowerCase()),
    },
  },
});

// Create a GraphQL schema
const schema = new GraphQLSchema({
  query: RootQuery,
});

// GraphQL endpoint
app.use("/graphql", graphqlHTTP({ schema, graphiql: true }));

// Function to find a series by title
const findSeriesByTitle = (title) => {
  return seriesData.find((s) => s.title.toLowerCase() === title.toLowerCase());
};

// REST endpoint to get all series
app.get("/api/series", (req, res) => {
  res.json(seriesData);
});

// REST endpoint to get a specific series by title
app.get("/api/series/:title", (req, res) => {
  const requestedTitle = req.params.title;
  const foundSeries = findSeriesByTitle(requestedTitle);

  if (foundSeries) {
    res.json(foundSeries);
  } else {
    res.status(404).send("Series not found");
  }
});

// REST endpoint to get specific property (title, year, genre, seasons)
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
