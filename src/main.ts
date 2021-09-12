/**
 * Mpore API
 *
 * @version 1.0.0
 * @author Mpore Team <devs@mpore.xyz>
 * @license MIT
 * 
**/

// Dependencies
import express from 'express';
const app = express(), port = process.env.PORT || 3000;

// Routes
import auth from './routes/auth.routes';
app.use(auth);

// Server
app.listen(port, () => { console.log(`Listening on port ${port}`) });