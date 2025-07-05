import React, { useState } from 'react';
import axios from 'axios';

const Websum = () => {
  const [webUrl, setWebUrl] = useState('');  // URL input state
  const [response, setResponse] = useState('');  // Response state
  const [loading, setLoading] = useState(false);  // Loading state
  const [error, setError] = useState('');  // Error state

  const handleGenerateSummary = async () => {
    setLoading(true);  // Start loading state
    setError('');  // Reset error message
    setResponse('');  // Reset response

    try {
      // Adjust the Axios POST request URL to match your backend endpoint
      const res = await axios.post('http://localhost:4000/api/quickdash/summarize-web-document', { url: webUrl });
      
      const formattedResponse = formatResponse(res.data.summary);  // Format the response summary
      setResponse(formattedResponse);  // Set the formatted summary in response
    } catch (err) {
      setError('Error generating summary: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);  // Stop loading state
    }
  };

  // Function to format response text with headings, lists, and paragraphs
  const formatResponse = (text) => {
    return text.split('\n').map((line, index) => {
      if (line.startsWith('Section:')) {
        return (
          <h3 key={index} className="font-bold text-xl text-blue-500 mb-2">
            {line}
          </h3>
        );
      } else if (line.startsWith('-')) {
        return (
          <li key={index} className="ml-4 text-gray-300 list-disc">
            {line.substring(1).trim()}
          </li>
        );
      } else {
        return (
          <p key={index} className="mb-2 ml-4 text-gray-300 indent-8">
            {line}
          </p>
        );
      }
    });
  };

  return (
    <div className="flex flex-col items-center p-5">
      <h1 className="text-5xl font-bold mb-10 text-white">Website Summarizer</h1>

      <form className="w-full max-w-mb mb-6">
        <div className="flex flex-col mb-4">
          <label htmlFor="webUrl" className="mb-2 text-lg font-semibold text-gray-300">
            Enter Any Website URL:
          </label>
          <input
            type="text"
            id="webUrl"
            value={webUrl}
            onChange={(e) => setWebUrl(e.target.value)}
            className="border border-gray-700 bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 w-full"
            placeholder="https://www.website.com"
            required
          />
        </div>

        <button
          type="button"
          onClick={handleGenerateSummary}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition duration-200 w-half"
          disabled={loading}  // Disable button while loading
        >
          {loading ? (
            <div className="flex items-center">
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
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
              Generating...
            </div>
          ) : (
            'Generate Response'
          )}
        </button>
      </form>

      {response && (
        <div className="mt-5 w-full max-w-mb p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-2 text-white">Summary</h2>
          <div className="space-y-3">{response}</div> {/* Display formatted response */}
        </div>
      )}

      {error && (
        <div className="mt-5 w-full max-w-md p-4 bg-red-600 border border-red-700 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-2 text-white">Error</h2>
          <p className="text-gray-300">{error}</p>
        </div>
      )}
    </div>
  );
};

export default Websum;
