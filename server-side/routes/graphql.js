var express = require("express");
var router = express.Router();
const { graphqlHTTP } = require("express-graphql");
const schema = require("../resources/schema");

// graphql router
router.use(
  "/",
  graphqlHTTP({
    graphiql: true,
    schema: schema,
    rootValue: { hello: () => "hello world" },
  })
);

module.exports = router;
