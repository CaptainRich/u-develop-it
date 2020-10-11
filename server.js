

// Import the 'express' module

const express = require( 'express' );
const PORT    = process.env.PORT || 3001;
const app     = express();

// Add the necessary 'middleware'

app.use(express.urlencoded( { extended: false } ));
app.use(express.json());


// Specific routes go here, before the "catch-all 404" response.





  // Address non-supported requests
  app.use((req, res) => {
    res.status(404).end();
  });




// Start the express.js Server on port 3001
app.listen( PORT, () => {
    console.log( `Server running on port ${PORT}` );
});