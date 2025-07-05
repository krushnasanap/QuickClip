// Import required modules
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import PdfReader from "pdfreader"; // Import pdfreader package
import multer from "multer";
import fs from 'fs';
import path from 'path';

// Initialize GoogleGenerativeAI instance with your API key
// const genAI = new GoogleGenerativeAI("AIzaSyDuC7b3V4V-BhFC9083BRP53GNhAllGlYQ");
// const genAI = new GoogleGenerativeAI("AIzaSyCciJzDBszuJg0-RYMDNo2u2efJwABfkBs");
const genAI = new GoogleGenerativeAI("AIzaSyCetBxNpYl-jORv9BeukN1bwDRXbUSSPJI");

// Function to fetch video details from YouTube Data API
const fetchVideoData = async (videoId) => {
    const apiKey = "AIzaSyCXWmAapdjRYTxnmiwVUUAAgjkNHVzVy5U"; // Replace with your YouTube Data API key
    const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`;

    try {
        const response = await axios.get(url);
        const videoData = response.data.items[0].snippet; // Extract video snippet
        return {
            title: videoData.title,
            description: videoData.description,
        };
    } catch (error) {
        throw new Error("Error fetching video data: " + error.message);
    }
};

// Controller function to handle the YouTube summary request
const dashSummarize = async (req, res) => {
    const { videoUrl } = req.body; // Extract video URL from the request body

    // Check if video URL is provided
    if (!videoUrl) {
        return res.status(400).json({ success: false, error: 'Video URL is required.' });
    }

    // Extract video ID from the URL
    const videoId = videoUrl.split('v=')[1]?.split('&')[0];
    if (!videoId) {
        return res.status(400).json({ success: false, error: 'Invalid video URL.' });
    }

    try {
        // Step 1: Fetch video data
        const { title, description } = await fetchVideoData(videoId);

        // Step 2: Generate summary using the Gemini model
        const prompt = `From now you are a Youtube video summarizer, Please give proper explanation the following YouTube video: Title: ${title}. Description: ${description}, Give Direct response with proper indentation`;

        // Get the model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        // Generate content using the model
        const result = await model.generateContent(prompt);

        // Safely extract the response text
        const summary = await result.response.text(); // Adjust this if necessary to access the summary

        // Step 3: Return the summary
        res.status(200).json({
            success: true,
            summary: summary.trim()
        });
    } catch (error) {
        console.error('Error generating summary:', error);
        res.status(500).json({ success: false, error: 'Failed to generate summary' });
    }
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Controller to fetch and summarize video
const summarizeVideo = async (req, res) => {
    const { videoUrl } = req.body; // Extract video URL from the request body

    // Check if video URL is provided
    if (!videoUrl) {
        return res.status(400).json({ success: false, error: 'Video URL is required.' });
    }

    // Extract video ID from the URL
    const videoId = videoUrl.split('v=')[1]?.split('&')[0];
    if (!videoId) {
        return res.status(400).json({ success: false, error: 'Invalid video URL.' });
    }

    try {
        // Step 1: Fetch video data
        const { title, description } = await fetchVideoData(videoId);

        // Step 2: Generate summary using the Gemini model
        const prompt = `From now you are a Youtube video summarizer. Please give a proper explanation of the following YouTube video: Title: ${title}. Description: ${description}. Give a direct response with proper indentation.`;

        // Get the model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        // Generate content using the model
        const result = await model.generateContent(prompt);

        // Safely extract the response text
        const summary = await result.response.text();

        // Step 3: Return the summary
        res.status(200).json({
            success: true,
            summary: summary.trim(),
            title: title
        });
    } catch (error) {
        console.error('Error generating summary:', error);
        res.status(500).json({ success: false, error: 'Failed to generate summary' });
    }
};

// Controller for handling chatbot queries
const handleChatbotQuery = async (req, res) => {
    const { userQuery, videoTitle, videoSummary } = req.body; // Extract user query, video title, and summary from the request body

    // Check if all required data is provided
    if (!userQuery || !videoTitle || !videoSummary) {
        return res.status(400).json({ success: false, error: 'User query, video title, and video summary are required.' });
    }

    try {
        // Construct the prompt for the chatbot
        const prompt = `You are a chatbot trained on the following YouTube video. Title: ${videoTitle}. Summary: ${videoSummary}. Respond to the user's query: ${userQuery}`;

        // Get the model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        // Generate response using the model
        const result = await model.generateContent(prompt);

        // Safely extract the response text
        const response = await result.response.text();

        // Step 3: Return the chatbot response
        res.status(200).json({
            success: true,
            response: response.trim()
        });
    } catch (error) {
        console.error('Error generating chatbot response:', error);
        res.status(500).json({ success: false, error: 'Failed to generate chatbot response' });
    }
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





// Controller function to fetch comments from YouTube and analyze sentiment using the Gemini API
const fetchAndAnalyzeComments = async (req, res) => {
    const { videoUrl } = req.body; // Get the video URL from request body

    // Validate the video URL and extract the video ID
    const videoId = getVideoIdFromUrl(videoUrl);
    if (!videoId) {
        return res.status(400).json({ success: false, message: "Invalid YouTube URL." });
    }

    try {
        // Fetch YouTube comments using YouTube Data API
        const comments = await fetchYouTubeComments(videoId);

        // Check if any comments were retrieved
        if (comments.length === 0) {
            return res.status(200).json({ success: true, message: "No comments found." });
        }

        // Analyze comments using the Gemini API for sentiment analysis
        const sentimentResults = await analyzeCommentsWithGemini(comments);

        // Calculate percentage of each sentiment category
        const totalComments = sentimentResults.length;
        const sentimentCounts = sentimentResults.reduce((acc, result) => {
            acc[result.sentiment] = (acc[result.sentiment] || 0) + 1;
            return acc;
        }, {});

        const sentimentPercentages = Object.entries(sentimentCounts).map(([sentiment, count]) => ({
            sentiment,
            percentage: ((count / totalComments) * 100).toFixed(2),
        }));

        // Return the sentiment percentages
        return res.status(200).json({
            success: true,
            totalComments,
            sentimentPercentages,
        });

    } catch (error) {
        console.error("Error fetching or analyzing comments:", error);
        return res.status(500).json({ success: false, message: "Error processing the request." });
    }
};

// Function to extract video ID from YouTube URL
const getVideoIdFromUrl = (url) => {
    try {
        const urlObj = new URL(url);
        return urlObj.searchParams.get("v");
    } catch (error) {
        console.error("Error parsing URL:", error);
        return null;
    }
};

// Function to fetch comments from YouTube using the YouTube Data API
const fetchYouTubeComments = async (videoId) => {
    const apiKey = "AIzaSyCXWmAapdjRYTxnmiwVUUAAgjkNHVzVy5U"; // YouTube API key from environment variable
    const comments = [];
    let nextPageToken = "";

    try {
        // Loop to fetch all pages of comments
        do {
            const { data } = await axios.get('https://www.googleapis.com/youtube/v3/commentThreads', {
                params: {
                    part: 'snippet',
                    videoId,
                    pageToken: nextPageToken,
                    maxResults: 100, // Fetch 100 comments at a time
                    key: apiKey
                }
            });

            // Extract comments from response
            const fetchedComments = data.items.map(item => item.snippet.topLevelComment.snippet.textDisplay);
            comments.push(...fetchedComments);
            nextPageToken = data.nextPageToken;
        } while (nextPageToken);

        return comments;
    } catch (error) {
        console.error("Error fetching YouTube comments:", error);
        throw new Error("Failed to fetch YouTube comments.");
    }
};

// Function to send comments to the Gemini model for sentiment analysis
const analyzeCommentsWithGemini = async (comments) => {
    const apiKey = "AIzaSyCciJzDBszuJg0-RYMDNo2u2efJwABfkBs"; // Gemini API key from environment variable
    const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // Get the Gemini model

    const sentimentResults = [];

    for (const comment of comments) {
        const prompt = `Analyze the sentiment of the youtube comments and classify it as one of the following categories: Joyful, Sad, or Neutral.\nYoutube Comments: "${comment}"\nSentiment:`;

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const sentiment = response.text().trim(); // Get the sentiment output
            sentimentResults.push({ comment, sentiment }); // Store sentiment result
        } catch (error) {
            console.error("Error analyzing comment:", error);
            sentimentResults.push({ comment, sentiment: 'Unknown' }); // Fallback for errors
        }
    }

    return sentimentResults;
};

//////////////////////////////////////////////////////////////////////////////////////////
// Multer setup to handle PDF uploads
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage }).single('pdf');

// Function to extract text from a PDF using pdfreader
const extractTextFromPdf = async (filePath) => {
    return new Promise((resolve, reject) => {
        let pdfText = '';

        const reader = new PdfReader.PdfReader();

        // Read the PDF file content
        reader.parseFileItems(filePath, (err, item) => {
            if (err) {
                reject("Error reading PDF file: " + err);
            } else if (!item) {
                // End of file, resolve the accumulated text
                resolve(pdfText);
            } else if (item.text) {
                // Add the text to the pdfText variable
                pdfText += item.text + ' ';
            }
        });
    });
};


const summarizePdf = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ success: false, error: 'Error uploading the PDF.' });
        }

        const pdfPath = req.file.path;

        try {
            // Step 1: Extract text from the uploaded PDF
            const pdfText = await extractTextFromPdf(pdfPath);

            // Step 2: Generate summary using the Gemini model
            const prompt = `From now you are a PDF summarizer. Please summarize the following content: ${pdfText}`;

            // Get the model
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

            // Generate content using the model
            const result = await model.generateContent(prompt);

            // Safely extract the response text
            // Here we adjust the extraction method based on your needs
            if (result.response && result.response.candidates && result.response.candidates.length > 0) {
                const summary = await result.response.text(); // Adjust this if necessary to access the summary

                // Step 3: Return the summary
                res.status(200).json({
                    success: true,
                    summary: summary.trim()
                });
            } else {
                console.error('Unexpected response structure:', result);
                res.status(500).json({ success: false, error: 'Failed to generate summary' });
            }
        } catch (error) {
            console.error('Error generating summary:', error);
            res.status(500).json({ success: false, error: 'Failed to generate summary' });
        } finally {
            // Clean up the uploaded PDF file
            fs.unlinkSync(pdfPath);
        }
    });
};


///////////////////////////////////////////////////////////////////////////////////////////////////

const summarizePdfCHAT = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ success: false, error: 'Error uploading the PDF.' });
        }

        const pdfPath = req.file.path;

        try {
            // Step 1: Extract text from the uploaded PDF
            const pdfText = await extractTextFromPdf(pdfPath);

            // Step 2: Generate summary using the Gemini model
            const prompt = `From now you are a PDF summarizer. Please summarize the following content: ${pdfText}`;

            // Get the model
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

            // Generate content using the model
            const result = await model.generateContent(prompt);

            // Safely extract the response text
            if (result.response && result.response.candidates && result.response.candidates.length > 0) {
                const summary = result.response.text(); // Access the summary correctly


                // Step 3: Return the summary
                res.status(200).json({
                    success: true,
                    summary: summary.trim()
                });
            } else {
                console.error('Unexpected response structure:', result);
                res.status(500).json({ success: false, error: 'Failed to generate summary' });
            }
        } catch (error) {
            console.error('Error generating summary:', error);
            if (error.response) {
                console.error('API Response:', error.response.data);
                return res.status(error.response.status).json({ success: false, error: error.response.data.error });
            }
            res.status(500).json({ success: false, error: 'Failed to generate summary' });
        } finally {
            // Clean up the uploaded PDF file
            fs.unlinkSync(pdfPath);
        }
    });
};


const handlePDFChatbotQuery = async (req, res) => {
    const { userQuery, pdfSummary } = req.body; // Extract user query and PDF summary from the request body

    // Check if all required data is provided
    if (!userQuery || !pdfSummary) {
        return res.status(400).json({ success: false, error: 'User query and PDF summary are required.' });
    }

    try {
        // Construct the prompt for the chatbot
        const prompt = `You are a chatbot trained on the following PDF summary. Respond to the user's query: ${userQuery} Summary: ${pdfSummary}`;

        // Get the model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        // Generate response using the model
        const result = await model.generateContent(prompt);

        // Safely extract the response text
        const response = await result.response.text(); // Adjusted to extract response properly

        // Step 3: Return the chatbot response
        res.status(200).json({
            success: true,
            response: response.trim()
        });
    } catch (error) {
        console.error('Error generating chatbot response:', error);
        res.status(500).json({ success: false, error: 'Failed to generate chatbot response' });
    }
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////

const summarizeWebDocument = async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ success: false, error: 'URL is required.' });
    }

    let attempts = 0;
    const maxAttempts = 3; // Number of retry attempts

    while (attempts < maxAttempts) {
        try {
            // Create the prompt
            const prompt = `You are a documentation summarizer. Please summarize the content from the following link: ${url}`;

            // Get the model
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

            // Generate content using the model
            const result = await model.generateContent(prompt);

            // Extract the summary
            if (result.response && result.response.candidates && result.response.candidates.length > 0) {
                const summary = result.response.text();

                // Send the summary
                return res.status(200).json({ success: true, summary: summary.trim() });
            } else {
                console.error('Unexpected response structure:', result);
                return res.status(500).json({ success: false, error: 'Failed to generate summary' });
            }
        } catch (error) {
            console.error(`Error generating summary on attempt ${attempts + 1}:`, error);

            if (error.status === 500 && attempts < maxAttempts - 1) {
                // Retry on internal server error
                attempts++;
                continue;
            }

            return res.status(500).json({ success: false, error: 'Failed to generate summary' });
        }
    }
};



// Explicitly export the function
export { dashSummarize, summarizeVideo, handleChatbotQuery, fetchAndAnalyzeComments, summarizePdf, summarizePdfCHAT, handlePDFChatbotQuery, summarizeWebDocument };
