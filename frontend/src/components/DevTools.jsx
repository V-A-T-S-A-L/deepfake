import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, query, where, getDocs, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import darcula from 'react-syntax-highlighter/dist/esm/styles/prism/darcula';

const docs = [
    {
        title: "POST /api/health",
        description: "Check if the API and its internal components (model, Firebase, etc.) are operational.",
        request: `POST /api/health`,
        response: `{
    "status": "operational",
    "model_loaded": true,
    "firebase_initialized": true,
    "components": [
      { "name": "model", "status": "operational" },
      { "name": "firebase", "status": "operational" }
    ]
  }`,
        examples: {
            javascript: `
  fetch("https://deepfake-api-t16v.onrender.com/api/health/", {
    method: "POST"
  })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error(err));
        `.trim(),
            python: `
  import requests
  
  url = "https://deepfake-api-t16v.onrender.com/api/health/"
  response = requests.post(url)
  
  print(response.json())
        `.trim()
        }
    },
    {
        title: "POST /api/detect",
        description: "Upload an image file to analyze for deepfake content.",
        request: `POST /api/detect
  Headers:
    X-API-Key: <your-api-key>
  Content-Type: multipart/form-data
  
  Form Data:
    image: File`,
        response: `{
    "status": "success",
    "result": "Real",
    "confidence": 51.2562141418457,
    "explanation": "The image is real. The facial features are natural and well-aligned with the background.",
    "heatmap": "<base64-encoded-image>"
  }`,
        examples: {
            javascript: `
  const apiKey = YOUR_API_KEY;
  const imageFile = document.querySelector('input[type="file"]').files[0]; // File input
  
  const formData = new FormData();
  formData.append("image", imageFile);
  
  fetch("https://deepfake-api-t16v.onrender.com/api/detect/", {
    method: "POST",
    headers: {
      "X-API-Key": apiKey
    },
    body: formData
  })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error(err));
        `.trim(),
            python: `
  import requests
  
  url = "https://deepfake-api-t16v.onrender.com/api/detect/"
  api_key = YOUR_API_KEY
  image_path = "path/to/your/image.jpg"
  
  headers = {
      "X-API-Key": api_key
  }
  files = {
      "image": open(image_path, "rb")
  }
  
  response = requests.post(url, headers=headers, files=files)
  
  print(response.json())
        `.trim()
        }
    }
];

export default function DevTools() {

    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.warn(user.displayName);
                console.warn(user.uid);
            } else {
                navigate("/login");
            }
        });

        // Cleanup listener when component unmounts
        return () => unsubscribe();
    }, [navigate]);

    const [apiKeys, setApiKeys] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [copySuccess, setCopySuccess] = useState('');

    const auth = getAuth();
    const db = getFirestore();

    // Generate random API key
    const generateApiKey = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const keyLength = 32;
        let apiKey = '';

        // Create prefix for API key
        apiKey = 'df_';

        // Generate random string
        for (let i = 0; i < keyLength; i++) {
            apiKey += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return apiKey;
    };

    // Add new API key to Firestore
    const addNewApiKey = async () => {
        try {
            setLoading(true);
            setError(null);

            const user = auth.currentUser;
            if (!user) {
                setError('You must be logged in to generate an API key');
                setLoading(false);
                return;
            }

            const newKey = generateApiKey();

            // Add key to Firestore
            await addDoc(collection(db, 'api_keys'), {
                key: newKey,
                active: true,
                userId: user.uid,
                timestamp: serverTimestamp()
            });

            // Refresh key list
            fetchApiKeys();
            setLoading(false);
        } catch (err) {
            setError('Failed to generate API key: ' + err.message);
            setLoading(false);
        }
    };

    // Fetch API keys for current user
    const fetchApiKeys = async () => {
        try {
            setLoading(true);

            const user = auth.currentUser;
            if (!user) {
                setApiKeys([]);
                setLoading(false);
                return;
            }

            const q = query(
                collection(db, 'api_keys'),
                where('userId', '==', user.uid)
            );

            const snapshot = await getDocs(q);
            const keys = [];

            snapshot.forEach(doc => {
                keys.push({
                    id: doc.id,
                    ...doc.data(),
                    // Convert timestamp to Date object
                    timestamp: doc.data().timestamp?.toDate() || new Date()
                });
            });

            setApiKeys(keys);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch API keys: ' + err.message);
            setLoading(false);
        }
    };

    // Delete API key
    const deleteApiKey = async (keyId) => {
        try {
            setLoading(true);

            await deleteDoc(doc(db, 'api_keys', keyId));

            // Refresh key list
            fetchApiKeys();
        } catch (err) {
            setError('Failed to delete API key: ' + err.message);
            setLoading(false);
        }
    };

    // Copy API key to clipboard
    const copyToClipboard = (key) => {
        navigator.clipboard.writeText(key)
            .then(() => {
                setCopySuccess(`Copied!`);
                setTimeout(() => setCopySuccess(''), 2000);
            })
            .catch(err => {
                setError('Failed to copy: ' + err.message);
            });
    };

    // Load API keys on component mount
    useEffect(() => {
        fetchApiKeys();

        // Set up listener for auth state changes
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                fetchApiKeys();
            } else {
                setApiKeys([]);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-r from-black to-[#340258] text-left text-white font-sans">

            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-black p-6 border-b md:border-b-0 md:border-r border-purple-700">
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-purple-300 mb-4">Developer Tools</h2>
                    <button
                        onClick={addNewApiKey}
                        disabled={loading}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded transition duration-200"
                    >
                        {loading ? 'Generating...' : 'Generate API Key'}
                    </button>
                </div>

                <nav className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">API Reference</h3>
                    {docs.map((doc, idx) => (
                        <a
                            key={idx}
                            href={`#endpoint-${idx}`}
                            className="block text-purple-300 hover:text-purple-500 transition"
                        >
                            {doc.title}
                        </a>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
                {/* API Keys Section */}
                <section className="mb-12 bg-transparent bg-opacity-50 p-4 sm:p-6 rounded-xl shadow-md border border-purple-800">
                    <h2 className="text-2xl text-purple-300 font-bold mb-4">Your API Keys</h2>

                    {error && (
                        <div className="bg-red-900 bg-opacity-30 border border-red-800 text-red-300 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    {copySuccess && (
                        <div className="bg-green-900 bg-opacity-30 border border-green-800 text-green-300 px-4 py-3 rounded mb-4">
                            {copySuccess}
                        </div>
                    )}

                    {apiKeys.length === 0 ? (
                        <div className="text-gray-400 mb-4">
                            {loading ? 'Loading keys...' : 'No API keys found. Generate your first key to get started.'}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-gray-900 bg-opacity-50 rounded-lg overflow-hidden text-sm">
                                <thead>
                                    <tr className="border-b border-purple-800">
                                        <th className="px-4 py-2 text-left text-xs font-medium text-purple-400 uppercase tracking-wider">API Key</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-purple-400 uppercase tracking-wider">Status</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-purple-400 uppercase tracking-wider">Created</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-purple-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {apiKeys.map((apiKey) => (
                                        <tr key={apiKey.id} className="border-b border-gray-800">
                                            <td className="px-4 py-2 whitespace-nowrap font-mono">{apiKey.key.substring(0, 10)}...</td>
                                            <td className="px-4 py-2 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${apiKey.active ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                                                    {apiKey.active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap text-gray-300">
                                                {apiKey.timestamp.toLocaleDateString()} {apiKey.timestamp.toLocaleTimeString()}
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap">
                                                <button onClick={() => copyToClipboard(apiKey.key)} className="text-indigo-400 hover:text-indigo-300 mr-3">
                                                    Copy
                                                </button>
                                                <button onClick={() => deleteApiKey(apiKey.id)} className="text-red-400 hover:text-red-300">
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                {/* API Documentation */}
                <div className="space-y-12">
                    {docs.map((doc, idx) => (
                        <section key={idx} id={`endpoint-${idx}`} className="bg-transparent p-4 sm:p-6 rounded-xl shadow-md border border-purple-800">
                            <h2 className="text-xl text-purple-300 font-semibold mb-2">{doc.title}</h2>
                            <p className="mb-4 text-gray-300">{doc.description}</p>

                            <div className="mb-4">
                                <h3 className="text-purple-400 font-medium mb-1">Request:</h3>
                                <SyntaxHighlighter className="rounded-xl" language="http" style={darcula}>
                                    {doc.request}
                                </SyntaxHighlighter>
                            </div>

                            <div className="mb-4">
                                <h3 className="text-purple-400 font-medium mb-1">Response:</h3>
                                <SyntaxHighlighter className="rounded-xl" language="json" style={darcula}>
                                    {doc.response}
                                </SyntaxHighlighter>
                            </div>

                            <div className="mb-4">
                                <h3 className="text-purple-400 font-medium mb-1">JavaScript Usage:</h3>
                                <SyntaxHighlighter className="rounded-xl" language="javascript" style={darcula}>
                                    {doc.examples.javascript}
                                </SyntaxHighlighter>
                            </div>

                            <div className="mb-4">
                                <h3 className="text-purple-400 font-medium mb-1">Python Usage:</h3>
                                <SyntaxHighlighter className="rounded-xl" language="python" style={darcula}>
                                    {doc.examples.python}
                                </SyntaxHighlighter>
                            </div>
                        </section>
                    ))}
                </div>
            </main>
        </div>
    );
}