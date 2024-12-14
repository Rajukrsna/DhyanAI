const axios = require('axios');
const express = require('express');
const router = express.Router();
const YogaRecommendation = require('../models/yoga');
const Nutrition = require('../models/Nutrition');
const authenticateToken = require('../middlewares/auth');
const User= require('../models/User');
require('dotenv').config();


const LAMBDA_API_URL =process.env.URILAMA;
const AntroURI = process.env.STURI;

router.get('/', authenticateToken, async(req,res)=>
{ 
  //console.log(req.user.userId)
   let nutritionEntry = await Nutrition.findOne({user:req.user.userId});
const user= await User.findById(req.user.userId);
  // //console.log(nutritionEntry)

    res.render('yoga', { user ,nutritionData: nutritionEntry});

})

// Endpoint for chatbot interactions using Meta-Llama-3.3-70B-Instruct
router.post("/sanas", async (req, res) => {
  try {
//console.log(req.body);
//console.log(req.headers);
    const healthProblem = req.body.issue;  // Get the extracted content (ingredients, etc.)
    
//console.log(extractedIngredients);
    // Create the prompt for recipe generation
   const prompt = `You are an AI yoga guide. Given the following health problem, generate 3 suitable yogasanas. The output should be structured in the following JSON format:

    {
      "yogasanas": [
        {
          "name": "{Yogasana Name}",
          "benefits": [
            "{Benefit 1}",
            "{Benefit 2}",
            "{Benefit 3}"
          ],
          "instructions": "{Step-by-step instructions to perform the yogasana}"
        },
        {
          "name": "{Yogasana Name}",
          "benefits": [
            "{Benefit 1}",
            "{Benefit 2}",
            "{Benefit 3}"
          ],
          "instructions": "{Step-by-step instructions to perform the yogasana}"
        },
        {
          "name": "{Yogasana Name}",
          "benefits": [
            "{Benefit 1}",
            "{Benefit 2}",
            "{Benefit 3}"
          ],
          "instructions": "{Step-by-step instructions to perform the yogasana}"
        }
      ]
    }
    
    **Health Problem Provided**: ${healthProblem}
    
    Ensure each yogasana includes:
    1. A relevant name for the yogasana.
    2. A list of 3 benefits for the provided health problem.
    3. Clear, step-by-step instructions to perform the yogasana.
    
    Respond only with the proper JSON structure.`;
    

    // Step 4: Pass the extracted content and the user's question to the text model
    const response = await axios.post(
      "https://api.sambanova.ai/v1/chat/completions",
      {
        stream: true,
        model: "Meta-Llama-3.3-70B-Instruct",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt },
        ],
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    //console.log( response.data);

    const lines = response.data.split('\n');

const dataLines = lines.filter(line => line.startsWith('data:'));

const jsonData = dataLines.map(line => {
  const cleanLine = line.replace(/^data:\s*/, '');
  return cleanLine !== '[DONE]' ? JSON.parse(cleanLine) : null;
}).filter(entry => entry !== null);
let accumulatedDelta = '';

jsonData.forEach(chunk => {
  if (chunk.choices[0].delta.content) {
    accumulatedDelta += chunk.choices[0].delta.content;
  }
});

//console.log(accumulatedDelta); 
res.json({ accumulatedDelta});


  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error in chatbot response");
  }
});


    router.get('/generateImg',authenticateToken, async (req, res) => {
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
          let nutritionEntry = await Nutrition.findOne({user:req.user.userId});

          res.render('yoga', {
            nutritionData:nutritionEntry,
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
