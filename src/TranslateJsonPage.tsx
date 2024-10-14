import React, { useState } from 'react';
import axios from 'axios';
import { AiOutlineCloudUpload } from 'react-icons/ai'; // Cloud icon for file upload
import { FaSpinner } from 'react-icons/fa'; // Spinner icon for loading

const TranslateJsonPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [languages, setLanguages] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setSuccess(''); // Reset success message when new file is uploaded
    }
  };

  const handleLanguagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLanguages(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!file || !languages) {
      setError('Please upload a file and enter target languages.');
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('translate_to', languages);

    try {
      const response = await axios.post('http://localhost:8000/translate_json_files/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `translated_files.zip`);
      document.body.appendChild(link);
      link.click();
      setSuccess('File translated and ready for download!');
    } catch (error) {
      setError('An error occurred during translation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <div className="w-full max-w-md p-8 bg-gradient-to-r from-purple-50 via-blue-50 to-teal-100 shadow-xl rounded-3xl">
        <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">JSON Translator</h1>

        {/* Error Message */}
        {error && <p className="text-red-600 bg-red-100 p-3 rounded-lg mb-4 text-center">{error}</p>}
        {success && <p className="text-green-600 bg-green-100 p-3 rounded-lg mb-4 text-center">{success}</p>}

        <form onSubmit={handleSubmit}>
          {/* File Upload */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Upload JSON File</label>
            <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-100 hover:bg-gray-200 transition duration-200 cursor-pointer flex flex-col items-center justify-center">
              <input
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
                id="file-upload"
              />
              <AiOutlineCloudUpload size={50} className="text-gray-500" />
              <span className="mt-2 text-sm text-gray-600">{file ? file.name : 'Drag and drop or click to upload'}</span>
            </div>
          </div>

          {/* Target Languages */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Target Languages (comma-separated)</label>
            <input
              type="text"
              value={languages}
              onChange={handleLanguagesChange}
              placeholder="e.g., Hindi, English, Tamil"
              className="block w-full p-3 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
              loading ? 'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700'
            } shadow-lg transform hover:scale-105`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <FaSpinner className="animate-spin mr-2" />
                Translating...
              </div>
            ) : (
              'Translate'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TranslateJsonPage;
