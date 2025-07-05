import React, { useState } from 'react';
import axios from 'axios';

const Pdfsum = () => {
    const [fileStatus, setFileStatus] = useState("");
    const [fileName, setFileName] = useState(null);
    const [summary, setSummary] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isSummaryVisible, setIsSummaryVisible] = useState(false);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            setFileStatus("Uploading...");
            setSummary(null);
            setError(null);
            setIsSummaryVisible(false);
            setLoading(true);

            const formData = new FormData();
            formData.append("pdf", file);

            axios.post("http://localhost:4000/api/quickdash/summarize-pdf", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then((response) => {
                setFileStatus("Uploaded successfully!");
                setSummary(response.data.summary);
                setLoading(false);
            })
            .catch((error) => {
                setFileStatus("Upload failed. Please try again.");
                setError(error.response?.data?.error || "Unknown error occurred.");
                setLoading(false);
                console.error("Error uploading file:", error);
            });
        }
    };

    const handleGenerateResponse = () => {
        if (summary) {
            setLoading(true);
            setIsSummaryVisible(true);
            setLoading(false);
        } else {
            alert("Please wait until the file is processed.");
        }
    };

    const statusStyles = {
        "Uploading...": "bg-yellow-500 text-white",
        "Uploaded successfully!": "bg-green-600 text-white",
        "Upload failed. Please try again.": "bg-red-600 text-white",
    };

    return (
        <>
            <h2 className="text-2xl font-bold mt-8 text-gray-800 dark:text-gray-100">
                Upload Your PDF Here
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
                            {fileStatus === "Uploaded successfully!" && (
                                <span>{fileStatus}</span>
                            )}
                            {fileStatus === "Upload failed. Please try again." && (
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

                {error && (
                    <div className="mt-5 w-full max-w-md p-4 bg-red-600 border border-red-700 rounded-lg shadow-lg">
                        <h2 className="text-lg font-semibold mb-2 text-white">Error</h2>
                        <p className="text-gray-300">{error}</p>
                    </div>
                )}

                <div className="flex mt-6">
                    <button
                        type="button"
                        onClick={handleGenerateResponse}
                        className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition duration-200 w-half"
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="flex items-center">
                                <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                </svg>
                                Generating...
                            </div>
                        ) : (
                            'Show Response'
                        )}
                    </button>
                </div>
            </div>

            {isSummaryVisible && summary && (
                <div className="mt-5 w-full max-w-mb p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
                    <h2 className="text-lg font-semibold mb-2 text-white">Summary</h2>
                    <div className="space-y-3 text-white">
                        {summary.split('\n').map((paragraph, index) => (
                            <p key={index} className="whitespace-pre-wrap">
                                {paragraph.trim()}
                            </p>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default Pdfsum;
