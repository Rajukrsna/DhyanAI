const express = require('express');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const Health = require('../models/health');
const YogaRecommendation = require('../models/yoga');
const axios = require('axios');
const app = express();
const router = express.Router();

// Utility function to download image from URL and return its path
const downloadImage = async (imageUrl) => {
    const response = await axios({
        method: 'get',
        url: imageUrl,
        responseType: 'stream'
    });

    const imagePath = path.join(__dirname, 'temp_image.jpg');
    const writer = fs.createWriteStream(imagePath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', () => resolve(imagePath));
        writer.on('error', reject);
    });
};

router.get('/generate-report', async (req, res) => {
    try {
        // Fetch health records from MongoDB (the 'health' collection now)
        const healthRecords = await Health.find();

        // Fetch yoga recommendations from MongoDB (the 'yogaRecommendations' collection now)
        const yogaRecommendations = await YogaRecommendation.find();

        // Initialize PDF document and file path
        const doc = new PDFDocument();
        const filePath = path.join(__dirname, 'Health_Report.pdf');
        const writeStream = fs.createWriteStream(filePath);

        // Pipe PDF document to file
        doc.pipe(writeStream);

        // Add Title
        doc.fontSize(22).font('Helvetica-Bold').text('Health Report', { align: 'center', color: 'blue' });
        doc.moveDown(2); // Add space after title

        // Check if there are any health records
        if (healthRecords.length === 0) {
            doc.fontSize(14).text("No health records available.", { align: 'center', italics: true });
        } else {
            // Loop through health records and add to PDF
            healthRecords.forEach(record => {
                doc.fontSize(14).font('Helvetica-Bold').text(`Health Issue: ${record.healthIssue}`);
                doc.fontSize(12).font('Helvetica').text(`Symptoms: ${record.symptoms || 'None'}`);
                doc.text(`Analysis: ${record.possibleCause || 'No analysis available'}`, { italics: true });
                doc.moveDown(1); // Add some space
            });
        }

        // Check if there are any yoga recommendations
        if (yogaRecommendations.length === 0) {
            doc.fontSize(14).text("No yoga recommendations available.", { align: 'center', italics: true });
        } else {
            // Add yoga recommendations to the PDF
            doc.fontSize(16).font('Helvetica-Bold').text('Yoga Recommendations', { underline: true });
            doc.moveDown(1); // Add space after section title

            for (const recommendation of yogaRecommendations) {
                doc.fontSize(14).font('Helvetica-Bold').text(`Recommendation Date: ${recommendation.recommendationDate.toDateString()}`);
                doc.fontSize(12).font('Helvetica').text(`Problem: ${recommendation.problem || 'No specific problem'}`);
                doc.text(`Recommended Yoga Practices: ${recommendation.recommendedYogaPractices.join(', ')}`, { italics: true });
                doc.moveDown(1); // Add space between each recommendation

                // If an image URL is provided, download and add the image
                if (recommendation.imageUrl) {
                    try {
                        const imagePath = await downloadImage(recommendation.imageUrl);
                        doc.image(imagePath, { width: 200, align: 'center' }).moveDown(1);  // Add some space after image
                        fs.unlink(imagePath, (err) => {
                            if (err) console.error("Error deleting temp image:", err);
                        });
                    } catch (err) {
                        console.error("Error downloading image:", err);
                        doc.text("Image not available.", { italics: true });
                    }
                }
            }
        }

        doc.end();

        // Wait until PDF is fully written to file
        writeStream.on('finish', () => {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename="Health_Report.pdf"');

            res.download(filePath, 'Health_Report.pdf', (err) => {
                if (err) {
                    console.error("Error downloading PDF:", err);
                    return res.status(500).send("Error downloading report");
                }
                // Delete file after download
                fs.unlink(filePath, (unlinkErr) => {
                    if (unlinkErr) console.error("Error deleting PDF after download:", unlinkErr);
                });
            });
        });

        // Handle write stream error
        writeStream.on('error', (error) => {
            console.error("Error writing PDF:", error);
            res.status(500).send("Error generating PDF report");
        });

    } catch (error) {
        console.error("Error generating report:", error);
        res.status(500).send("Error generating report");
    }
});

module.exports = router;
