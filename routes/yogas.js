const axios = require('axios');
const express = require('express');
const router = express.Router();
const YogaRecommendation = require('../models/yoga');
require('dotenv').config();

const LAMBDA_API_URL =process.env.URILAMA;
const AntroURI = process.env.STURI;
router.get('/yoga',(req,res)=>
{
    res.render('yoga');

})

router.post('/', async (req, res) => {
    const { healthIssue } = req.body;
    let botReply = '';
  
    
  
    try {
      //call the AI model for the response
      const response = await axios.post(
        LAMBDA_API_URL,
        { prompt: `Give the yoga practices to cure ${healthIssue}` ,
      
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
        const yogaRec = new YogaRecommendation({
          problem:healthIssue,
    
          recommendedYogaPractices : botReply,
          // Save yoga recommendation
        });
    
        await yogaRec.save(); // Save to MongoDB
    
        // Send success response or render the page with both bot reply and yoga recommendation
        res.render('yoga', {
          botReply,
          healthIssue,
          imageUrl:null
        });
      } catch (err) {
        console.error(err);
        res.render('yoga', {
          error: 'An error occurred while saving the data.',
        });
      }
    });



    router.get('/generateImg', async (req, res) => {
        const { poseName, problem } = req.query;
      
        try {
          // Make a GET request to the Lambda function via API Gateway, passing the poseName as a query parameter
          const response = await axios.get(
            AntroURI,
            {
              params: { prompt: `image for the yoga pose ${poseName}` },
            }
          );
      
          // Extract the presigned URL from the Lambda response
          const imageUrl = response.data.body;

          const yogaRec = await YogaRecommendation.findOneAndUpdate(
            { problem: problem },  // Search for the document based on 'problem' (or any unique field)
            { imageUrl: imageUrl },  // Update the 'imageUrl' field
            { new: true, upsert: true }  // 'new: true' returns the updated document, 'upsert: true' creates a new one if not found
        );
          // Respond with the image URL
          res.render('yoga', {
            botReply: yogaRec.recommendedYogaPractices, // Display the previous yoga practices
            healthIssue: problem, // Pass the health issue back to the template
            imageUrl: imageUrl, // Show the generated image URL
            poseName
        });
        } catch (error) {
          console.error('Error generating image:', error);
          res.status(500).json({ message: 'Error generating image.', error: error.message });
        }
      });


module.exports = router;
