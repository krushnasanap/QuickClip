const Dashboard = () => {
  return (
    <div className="content-area p-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Dashboard Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {/* YouTube Video Summarizer */}
        <a 
          href="/summarizer" 
          className="transform transition-transform duration-300 hover:scale-105 bg-white shadow-md rounded-lg p-5 border border-gray-200 dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg"
        >
          <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">YouTube Video Summarizer</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Summarize your YouTube videos quickly by entering the video link.
          </p>
        </a>

        {/* YouTube Chatbot */}
        <a 
          href="/chatbot" 
          className="transform transition-transform duration-300 hover:scale-105 bg-white shadow-md rounded-lg p-5 border border-gray-200 dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg"
        >
          <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">YouTube Chatbot</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Interact with a chatbot powered by the content of your YouTube videos.
          </p>
        </a>

        {/* YouTube Comment Filter */}
        <a 
          href="/commentfilter" 
          className="transform transition-transform duration-300 hover:scale-105 bg-white shadow-md rounded-lg p-5 border border-gray-200 dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg"
        >
          <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">YouTube Comment Filter</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Analyze the sentiment of comments based on a YouTube video link.
          </p>
        </a>

        {/* PDF Summarizer */}
        <a 
          href="/pdfsum" 
          className="transform transition-transform duration-300 hover:scale-105 bg-white shadow-md rounded-lg p-5 border border-gray-200 dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg"
        >
          <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">PDF Summarizer</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Upload your PDFs and get concise summaries instantly.
          </p>
        </a>

        {/* PDF Chatbot */}
        <a 
          href="/pdfchatbot" 
          className="transform transition-transform duration-300 hover:scale-105 bg-white shadow-md rounded-lg p-5 border border-gray-200 dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg"
        >
          <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">PDF Chatbot</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Engage with a chatbot that understands your uploaded PDFs.
          </p>
        </a>

        {/* Website Summarizer */}
        <a 
          href="/websummarizer" 
          className="transform transition-transform duration-300 hover:scale-105 bg-white shadow-md rounded-lg p-5 border border-gray-200 dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg"
        >
          <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Website Summarizer</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Get summaries of any webpage by entering its link.
          </p>
        </a>
      </div>
    </div>
  );
};

export default Dashboard;
