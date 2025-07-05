import React, { useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const CommentFilter = () => {
    const [videoUrl, setVideoUrl] = useState('');
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleGenerateResponse = async () => {
        setLoading(true);
        setError(null);

        try {
            const { data } = await axios.post('http://localhost:4000/api/quickdash/dash-analyze-comments/', { videoUrl });

            if (data && data.sentimentPercentages && Array.isArray(data.sentimentPercentages)) {
                setResponse(data);
            } else {
                setError('Invalid response from the server.');
            }
        } catch (err) {
            setError('Failed to analyze comments. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Prepare data for the Pie chart
    const chartData = response ? {
        labels: response.sentimentPercentages.map(item => item.sentiment),
        datasets: [{
            label: 'Sentiment Distribution',
            data: response.sentimentPercentages.map(item => parseFloat(item.percentage)),
            backgroundColor: [
                '#4CAF50', // Positive
                '#FF6384', // Negative
                '#FFCE56', // Neutral
                '#36A2EB', // Joyful
                '#FF9F40', // Sad
                '#C9CBCF'  // Unknown/Other
            ],
            hoverBackgroundColor: [
                '#4CAF50',
                '#FF6384',
                '#FFCE56',
                '#36A2EB',
                '#FF9F40',
                '#C9CBCF'
            ]
        }]
    } : null;

    return (
        <div className="flex flex-col items-center p-5">
            <h1 className="text-5xl font-bold mb-10 text-white">YouTube Video Comment Filter</h1>

            <form className="w-full max-w-full mb-6">
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
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition duration-200 w-half flex items-center justify-center"
                    disabled={loading}
                >
                    {loading ? (
                        <div className="flex items-center">
                            <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                            </svg>
                            Analyzing...
                        </div>
                    ) : (
                        'Generate Response'
                    )}
                </button>
            </form>

            {error && (
                <div className="mt-5 w-full max-w-md p-4 bg-red-600 text-white border border-red-800 rounded-lg shadow-lg">
                    <p>{error}</p>
                </div>
            )}

            {response && (
                <div className="mt-5 w-full max-w-md p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
                    <h2 className="text-lg font-semibold mb-2 text-white">Response</h2>
                    <p className="text-gray-300">Total Comments: {response.totalComments}</p>

                    {/* Render Pie chart if data is available */}
                    {chartData && (
                        <div className="mt-5">
                            <Pie data={chartData} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CommentFilter;
