const axios = require('axios');
const express = require('express');
const router = express.Router();
const Health = require('../models/health');
require('dotenv').config();

const LAMBDA_API_URL =process.env.URILAMA
// Route to render the symptom logging form
router.get('/analysis', (req, res) => {

  res.render('symptom'); // Render the initial form without data
});
// Route to handle the form submission and save health issue and symptoms
router.post('/', async (req, res) => {
    const { healthIssue, symptoms } = req.body;
    let botReply = '';
  
    
  
    try {
      //call the AI model for the response
      const response = await axios.post(
        LAMBDA_API_URL,
        { prompt: `Give the possible simple causes that could cause the health Problem ${healthIssue}` ,
      
         },
          
         // Send input as a JSON object
        {
            headers: {
                'Content-Type': 'text/plain', // Set Content-Type to application/json
                'Accept': 'application/json'
            }
        }
    );

    // Parse Lambda response
    if (response.data && response.data.body) {
        const lambdaBody = JSON.parse(response.data.body);  // Parse JSON string in `body`
        botReply = lambdaBody.reply || 'Unexpected response format from Lambda.';
    } else {
        botReply = 'Unexpected response format from Lambda.';
    }

    
        // Save the health issue and symptoms to the database
        const healthRecord = new Health({
          healthIssue,
          symptoms,
          possibleCause: botReply,
          // Save yoga recommendation
        });
    
        await healthRecord.save(); // Save to MongoDB
    
        // Send success response or render the page with both bot reply and yoga recommendation
        res.render('symptom', {
          botReply
       
        });
      } catch (err) {
        console.error(err);
        res.render('symptom', {
          error: 'An error occurred while saving the data.',
        });
      }
    });
    


  
      
  
module.exports = router;
