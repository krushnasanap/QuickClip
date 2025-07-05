import express from "express";
import { dashSummarize, summarizeVideo, handleChatbotQuery, fetchAndAnalyzeComments, summarizePdf, summarizePdfCHAT, handlePDFChatbotQuery, summarizeWebDocument } from "../controllers/dashController.js";

const dashRouter = express.Router();

dashRouter.post("/dash-summarize", dashSummarize);
dashRouter.post("/dash-summarize-video", summarizeVideo);
dashRouter.post("/dash-handle-chatbotquery", handleChatbotQuery);
dashRouter.post("/dash-analyze-comments", fetchAndAnalyzeComments);
dashRouter.post("/summarize-pdf", summarizePdf);
dashRouter.post("/summarize-pdfchat", summarizePdfCHAT); // Route for summarizing the PDF
dashRouter.post("/chatbot-query-pdf", handlePDFChatbotQuery);
dashRouter.post('/summarize-web-document', summarizeWebDocument);


export default dashRouter;
