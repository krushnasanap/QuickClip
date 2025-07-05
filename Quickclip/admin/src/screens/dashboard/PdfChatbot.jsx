import React, { useState } from 'react';
import axios from 'axios';
import { RiRobot2Line } from 'react-icons/ri';
import { FaUser } from 'react-icons/fa';

const PdfChatbot = () => {
    const [fileStatus, setFileStatus] = useState("");
    const [fileName, setFileName] = useState(null);
    const [responses, setResponses] = useState([]);
    const [prompt, setPrompt] = useState("");
    const [loadingChatbot, setLoadingChatbot] = useState(false);
    const [pdfSummary, setPdfSummary] = useState("");
    const [conversationContext, setConversationContext] = useState(""); 
    const [chatbotVisible, setChatbotVisible] = useState(false);

    // Handle file upload
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            setFileStatus("Uploading...");

            const formData = new FormData();
            formData.append("pdf", file); 

            try {
                const response = await axios.post("http://localhost:4000/api/quickdash/summarize-pdf", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (response.data.success) {
                    setFileStatus("Uploaded successfully!");
                    setPdfSummary(response.data.summary);
                    setConversationContext(response.data.summary); 
                    setResponses([...responses, "Chatbot: Chat is ready to assist you based on PDF content!"]);
                    setChatbotVisible(true);
                } else {
                    setFileStatus("Upload failed. Please try again.");
                }
            } catch (error) {
                setFileStatus("Error uploading file. Please check your connection.");
                console.error("Error uploading file:", error);
            }
        }
    };

    // Handle chatbot query
    const handlePrompt = async (e) => {
        e.preventDefault();
        setLoadingChatbot(true);

        try {
            const response = await axios.post("http://localhost:4000/api/quickdash/chatbot-query-pdf", {
                userQuery: prompt,
                pdfSummary: conversationContext,
            });

            if (response.data.success) {
                setResponses([...responses, `You: ${prompt}`, `Chatbot: ${response.data.response}`]);
                setConversationContext(prev => prev + " " + response.data.response);
                setPrompt("");
            } else {
                setResponses([...responses, `You: ${prompt}`, "Chatbot: Sorry, I couldn't find an answer."]);
            }
        } catch (error) {
            setResponses([...responses, `You: ${prompt}`, "Chatbot: Error processing your query."]);
        } finally {
            setLoadingChatbot(false);
        }
    };

    // Render HTML safely
    const renderHTML = (response) => {
        return { __html: response };
    };

    // Status bar styles based on fileStatus
    const statusStyles = {
        "Uploading...": "bg-yellow-500 text-white",
        "Uploaded successfully!": "bg-green-600 text-white",
        "Upload failed. Please try again.": "bg-red-600 text-white",
        "Error uploading file. Please check your connection.": "bg-red-600 text-white",
    };

    return (
        <>
            <h2 className="text-2xl font-bold mt-8 text-gray-800 dark:text-gray-100">
                Upload Your PDF Here For Summary
            </h2>
            <div className="content-area mt-6">
                <div className="flex items-center justify-center w-full">
                    <label
                        htmlFor="dropzone-file"
                        className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg
                                className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 16"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                PDF (MAX. 1GB)
                            </p>
                        </div>
                        <input
                            id="dropzone-file"
                            type="file"
                            className="hidden"
                            onChange={handleFileUpload}
                            accept="application/pdf"
                        />
                    </label>
                </div>

                <div className="mt-4">
                    {fileStatus && (
                        <div className={`flex items-center justify-center p-4 ${statusStyles[fileStatus]} font-semibold rounded-md shadow-md`}>
                            {fileStatus === "Uploading..." && (
                                <>
                                    <svg
                                        className="animate-spin h-5 w-5 mr-2 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                        ></path>
                                    </svg>
                                    {fileStatus}
                                </>
                            )}
                            {fileStatus !== "Uploading..." && (
                                <span>{fileStatus}</span>
                            )}
                        </div>
                    )}

                    {fileName && fileStatus === "Uploaded successfully!" && (
                        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                            File uploaded: <span className="font-semibold">{fileName}</span>
                        </p>
                    )}
                </div>
            </div>

            {/* Chatbot UI Section */}
            {chatbotVisible && (
                <div className="chat-container mt-8">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Chatbot</h2>
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

                        <form className="flex items-center gap-2.5 mt-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md" onSubmit={handlePrompt}>
                            <input
                                className="form-input w-full p-2.5 rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-white"
                                type="text"
                                placeholder="Ask me a question..."
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                disabled={loadingChatbot}
                                required
                            />
                            <button
                                type="submit"
                                className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl font-medium rounded-lg text-lg px-5 py-2.5 bg-blue-500 text-white px-4 py-2 rounded-lg disabled:bg-blue-300 disabled:cursor-not-allowed"
                                disabled={loadingChatbot}
                            >
                                {loadingChatbot ? 'Thinking...' : 'Send'}
                            </button>
                            
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default PdfChatbot;
