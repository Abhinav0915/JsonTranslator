import React, { useState } from 'react';
import axios from 'axios';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { FaSpinner } from 'react-icons/fa';

const TranslateJsonPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [languages, setLanguages] = useState('');
  const [keys, setKeys] = useState('');
  const [translationOption, setTranslationOption] = useState('entire');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setSuccess('');
    }
  };

  const handleLanguagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLanguages(e.target.value);
  };

  const handleKeysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeys(e.target.value);
  };

  const handleTranslationOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTranslationOption(e.target.value);
    setKeys('');
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
    formData.append('translation_option', translationOption);
    if (translationOption === 'specific') {
      formData.append('keys', keys);
    }

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
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <div className="w-full max-w-lg p-8 bg-white shadow-lg rounded-xl">
        <h1 className="text-3xl font-semibold text-center text-gray-700 mb-6">JSON File Translator</h1>

        {error && <p className="text-red-600 bg-red-100 p-3 rounded-lg mb-4 text-center">{error}</p>}
        {success && <p className="text-green-600 bg-green-100 p-3 rounded-lg mb-4 text-center">{success}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Upload JSON File</label>
            <div className="border-2 border-gray-300 border-dashed rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer relative">
              <input
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <AiOutlineCloudUpload size={40} className="mx-auto text-gray-500" />
              <span className="mt-2 text-gray-600">{file ? file.name : 'Drag & drop or click to upload'}</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Target Languages</label>
            <input
              type="text"
              value={languages}
              onChange={handleLanguagesChange}
              placeholder="e.g., English, Spanish"
              className="w-full px-4 py-3 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Translation Option</label>
            <div className="flex items-center mb-2">
              <input
                type="radio"
                value="entire"
                checked={translationOption === 'entire'}
                onChange={handleTranslationOptionChange}
                className="mr-2"
              />
              <span>Translate Entire File</span>
            </div>
            <div className="flex items-center mb-4">
              <input
                type="radio"
                value="specific"
                checked={translationOption === 'specific'}
                onChange={handleTranslationOptionChange}
                className="mr-2"
              />
              <span>Translate Specific Keys</span>
            </div>
            {translationOption === 'specific' && (
              <input
                type="text"
                value={keys}
                onChange={handleKeysChange}
                placeholder="e.g., key1, key2"
                className="w-full px-4 py-3 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white font-semibold rounded-lg transition-all ${
              loading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'
            }`}
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
