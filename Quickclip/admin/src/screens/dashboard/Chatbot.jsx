import React, { useState } from "react";
import axios from "axios";
import { FaUser } from "react-icons/fa";
import { RiRobot2Line } from "react-icons/ri";

function Chatbot() {
    const [videoUrl, setVideoUrl] = useState('');
    const [videoTitle, setVideoTitle] = useState('');  // Store the video title
    const [videoSummary, setVideoSummary] = useState(''); // Store the video summary
    const [isChatbotVisible, setIsChatbotVisible] = useState(false);
    const [prompt, setPrompt] = useState("");
    const [responses, setResponses] = useState(["How can I help you?"]);
    const [isLoading, setIsLoading] = useState(false);  // State for chatbot generation loading
    const [loadingChatbot, setLoadingChatbot] = useState(false);

    const handleGenerateResponse = async () => {
        // Check if video URL is provided
        if (!videoUrl) {
            alert("Please enter a YouTube video URL.");
            return;
        }

        setIsLoading(true);  // Set loading to true when generating chatbot

        try {
            // Send the YouTube video URL to the backend for processing
            const response = await axios.post("http://localhost:4000/api/quickdash/dash-summarize-video/", {
                videoUrl
            });

            if (response.data.success) {
                setIsChatbotVisible(true);
                setResponses(["Chatbot is ready to assist you based on the video content!"]);

                // Store the title and summary from the response
                setVideoTitle(response.data.title);
                setVideoSummary(response.data.summary);

            } else {
                alert("Failed to process the video. Please try again.");
            }
        } catch (error) {
            console.error("Error fetching video content:", error);
            alert("Error fetching video content. Please try again.");
        } finally {
            setIsLoading(false);  // Stop loading when done
        }
    };

    const handlePrompt = async (e) => {
        e.preventDefault();
        if (!prompt) return;

        setLoadingChatbot(true);

        try {
            // Send the prompt, video title, and summary to the chatbot query handler
            const response = await axios.post("http://localhost:4000/api/quickdash/dash-handle-chatbotquery/", {
                userQuery: prompt,           // Send the prompt as 'userQuery'
                videoTitle,                  // Send the stored video title
                videoSummary                 // Send the stored video summary
            });

            // Assuming the response has a structure like { response: "..." }
            setResponses((prevResponses) => [...prevResponses, `You: ${prompt}`, `Chatbot: ${response.data.response}`]);
            setPrompt(""); // Clear the input field
        } catch (error) {
            console.error("Error:", error);
            alert("There was an error processing your request. Please try again.");
        } finally {
            setLoadingChatbot(false);
        }
    };

    const renderHTML = (htmlString) => {
        return { __html: htmlString };
    };

    return (
        <>
            <div className="flex flex-col items-center p-5">
                <h1 className="text-5xl font-bold mb-10 text-white">YouTube Video Chatbot</h1>

                <form className="w-full max-w-mb mb-6">
                    <div className="flex flex-col mb-4">
                        <label htmlFor="videoUrl" className="mb-2 text-lg font-semibold text-gray-300">
                            Enter YouTube Video URL:
                        </label>
                        <input
                            type="text"
                            id="videoUrl"
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                            className="border border-gray-700 bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 w-full"
                            placeholder="https://www.youtube.com/watch?v=example"
                            required
                        />
                    </div>

                    <button
                        type="button"
                        onClick={handleGenerateResponse}
                        className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition duration-200 w-half"
                    >
                        {isLoading ? <div className="flex items-center">
                            <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                            </svg>
                            Generating...
                        </div> : "Generate Chatbot"} {/* Show 'Generating...' while loading */}
                    </button>
                </form>
            </div>

            {/* Conditional rendering for the chatbot */}
            {isChatbotVisible && (
                <div>
                    {responses.map((response, index) => (
                        <div key={index} className={`flex items-start gap-2.5 mt-3 ${index % 2 === 0 ? '' : 'flex-row-reverse'}`}>
                            {index % 2 === 0 ? (
                                <RiRobot2Line className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 p-2" />
                            ) : (
                                <FaUser className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 p-2" />
                            )}
                            <div
                                className={`flex flex-col w-full max-w-[500px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-lg dark:bg-gray-700 ${index % 2 === 0 ? 'rounded-l-lg rounded-br-lg' : 'rounded-r-lg rounded-bl-lg'
                                    }`}
                            >
                                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-white">{index % 2 === 0 ? 'Chatbot' : 'You'}</span>
                                    <span className="text-lg font-normal text-gray-500 dark:text-gray-400">
                                        {new Date().toLocaleTimeString('en-US', {
                                            hour: 'numeric',
                                            minute: 'numeric',
                                            hour12: true,
                                        })}
                                    </span>
                                </div>
                                <div className="text-lg font-normal py-2.5 text-gray-900 dark:text-white" dangerouslySetInnerHTML={renderHTML(response)}></div>
                            </div>
                        </div>
                    ))}

                    {/* Chat input form */}
                    <form className="flex items-center gap-2.5 mt-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg dark:shadow-dark-lg" onSubmit={handlePrompt}>
                        <input
                            type="text"
                            placeholder="Ask a question about the video"
                            className="w-full px-4 py-2.5 text-lg text-gray-900 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)} // Updates the input field
                        />
                        <button
                            type="submit" // Form is submitted when the button is clicked
                            className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl font-medium rounded-lg text-lg px-5 py-2.5"
                            disabled={loadingChatbot} // Disable when waiting for response
                        >
                            {loadingChatbot ? "Thinking..." : "Send"}
                        </button>
                    </form>

                </div>
            )}
        </>
    );
}

export default Chatbot;
