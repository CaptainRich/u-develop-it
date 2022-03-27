

// Import the 'express' module and the sqlite3 package

const express    = require( 'express' );
const db         = require( './db/database' );            // this is where the database connection is established
const apiRoutes  = require( './routes/apiRoutes') ;       // this loads the index.js file from ./routes/apiRoutes

const PORT       = process.env.PORT || 3001;
const app        = express();

// Add the necessary 'middleware'

app.use(express.urlencoded( { extended: false } ));
app.use(express.json());
app.use('/api', apiRoutes);                              // so we don't need '/api/ in the individual routes

////////////////////////////////////////////////////////////////////////////////////////////
// Address non-supported/not_found requests
app.use((req, res) => {
    res.status(404).end();
});



////////////////////////////////////////////////////////////////////////////////////////////
// Start the express.js Server on port 3001.  Need to make sure this starts after 
// the database connection is established - put this in an event handler.

db.on('open', () => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});