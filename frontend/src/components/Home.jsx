import React, { useEffect, useState, useCallback } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import bgimg from "../assets/purple-cyborg.jpg";
import RotatingText from './RotatingText'

const HomePage = () => {

    const navigate = useNavigate();

    const handleUpload = () => {
        if (!file) return;

        setIsUploading(true);
        setUploadSuccess(null);

        // Simulating file upload delay
        setTimeout(() => {
            setIsUploading(false);
            setUploadSuccess(true);
        }, 2000); // Replace with actual file upload logic
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.warn(user.displayName);
            } else {
                navigate("/login");
            }
        });

        // Cleanup listener when component unmounts
        return () => unsubscribe();
    }, [navigate]);

    const [file, setFile] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFile = useCallback(async (selectedFile) => {
        setFile(selectedFile);
        setPrediction(null); // Reset previous prediction

        const formData = new FormData();
        formData.append("image", selectedFile);

        try {
            const response = await fetch("http://127.0.0.1:8000/api/predict/", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Prediction API failed");
            }

            const data = await response.json();
            console.warn(data);
            setPrediction(data); // Expected response: { prediction: "Real" | "Deepfake" }
            console.warn(data.heatmap);
        } catch (error) {
            console.error("Error:", error);
            setPrediction("Error: Unable to process file");
        }
    }, []);

    const handleDragEnter = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback(
        (e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile) {
                handleFile(droppedFile);
            }
        },
        [handleFile]
    );

    const handleFileChange = useCallback(
        (e) => {
            const selectedFile = e.target.files[0];
            if (selectedFile) {
                handleFile(selectedFile);
            }
        },
        [handleFile]
    );

    return (
        <div className="relative flex flex-col justify-center bg-gradient-to-r from-black to-[#340258] items-center min-h-screen p-6 mx-auto"
        // style={{
        //     backgroundImage: `url(${bgimg})`,
        //     backgroundSize: "cover",
        //     backgroundPosition: "center",
        // }}
        >
            <div className="inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/40 min-h-screen absolute"></div>
            <div className="relative text-center lg:mt-10 text-white bg-purple-dark rounded-lg lg:min-w-xl w-full sm:max-w-md sm:w-11/12 md:w-1/2">
                <h1 className="font-extrabold mb-6 text-purple-light">Veracity.AI</h1>
                <div className="mb-15 flex mx-auto justify-center items-center">
                    <h2 className="mr-3 text-4xl">Analyse</h2>
                    <RotatingText
                        texts={['Images', 'Videos', 'Audio']}
                        mainClassName="px-2 sm:px-2 md:px-3 bg-purple-500 font-bold font-serif text-white overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
                        staggerFrom={"last"}
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "-120%" }}
                        staggerDuration={0.025}
                        splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                        transition={{ type: "spring", damping: 30, stiffness: 400 }}
                        rotationInterval={2000}
                    />
                </div>
                <p className="text-lg mb-4">Upload a file for deepfake detection analysis.</p>

                <div className="space-y-6 backdrop-blur-sm">
                    <div
                        className={`border-2 border-dashed rounded-lg p-16 text-center transition-colors ${isDragging ? "border-purple-300 bg-purple-900 bg-opacity-10" : "border-purple-500"
                            }`}
                        onDragEnter={handleDragEnter}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <label htmlFor="file-upload" className="cursor-pointer">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mx-auto h-20 w-20 text-purple-400 mb-4"
                            >
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                            <span className="text-lg font-medium hover:text-purple-400">{file ? file.name : "Click to upload or drag and drop"}</span>
                            <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                className="sr-only"
                                onChange={handleFileChange}
                                accept="image/*,video/*"
                            />
                        </label>
                    </div>
                    {file && !prediction && <div className="text-center text-purple-300">Analyzing...</div>}
                    {prediction && (
                        <div className={`rounded-lg overflow-hidden border ${prediction.result === "Real" ? "border-green-500 bg-green-900/20" : "border-red-500 bg-red-900/20"} p-6`}>
                            <div className="flex items-center justify-center mb-4">
                                {prediction.result === "Real" ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-green-400 w-8 h-8 mr-3"
                                    >
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                        <polyline points="22 4 12 14.01 9 11.01" />
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-red-400 w-8 h-8 mr-3"
                                    >
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="12" y1="8" x2="12" y2="12" />
                                        <line x1="12" y1="16" x2="12.01" y2="16" />
                                    </svg>
                                )}
                                <span className="text-2xl font-bold">
                                    {prediction.result === "Real" ? "Authentic Content" : "Potentially AI-Generated"}
                                </span>
                            </div>

                            <div className="grid md:grid-rows-2 gap-6">
                                {/* Left column - Image and confidence */}
                                <div className="space-y-4">
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 opacity-75 rounded-lg blur-sm group-hover:opacity-100 transition-opacity"></div>
                                        <div className="relative bg-black/40 p-1 rounded-lg">
                                            <img
                                                src={prediction.heatmap.startsWith('data:')
                                                    ? prediction.heatmap
                                                    : `data:image/jpeg;base64,${prediction.heatmap}`}
                                                alt="Analysis Heatmap"
                                                className="w-full rounded-md"
                                            />
                                        </div>
                                        <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                                            Heatmap Analysis
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <p className="text-sm text-purple-200 mb-2">Confidence Score:</p>
                                        <div className="w-full bg-gray-700 rounded-full h-4">
                                            <div
                                                className={`h-4 rounded-full ${prediction.result === "Real" ? "bg-green-500" : "bg-red-500"}`}
                                                style={{ width: `${prediction.confidence.toFixed(2)}%` }}
                                            >
                                            </div>
                                        </div>
                                        <p className="text-right text-sm mt-1 font-medium">
                                            {prediction.confidence.toFixed(2)}%
                                        </p>
                                    </div>
                                </div>

                                {/* Right column - Explanation */}
                                <div className="bg-black/30 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="w-5 h-5 mr-2 text-purple-400"
                                        >
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <line x1="12" y1="16" x2="12" y2="12"></line>
                                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                        </svg>
                                        Analysis Details
                                    </h3>

                                    <div className="prose prose-sm prose-invert max-w-none">
                                        <p className="text-gray-300">{prediction.explanation}</p>
                                    </div>

                                    <div className="mt-6">
                                        <h4 className="text-sm font-medium text-purple-300 mb-2">What to look for in the heatmap:</h4>
                                        <ul className="text-sm text-left text-gray-300 space-y-1 list-disc pl-4">
                                            <li>Bright areas show regions the AI focused on when making its decision</li>
                                            <li>In fake images, artifacts around edges and unnatural textures are highlighted</li>
                                            <li>In real images, natural facial features receive more balanced attention</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 text-center">
                                <button
                                    onClick={() => window.location.reload()}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
                                >
                                    Analyze Another Image
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="relative mt-8 backdrop-blur-lg bg-opacity-20 rounded-lg p-6 w-full sm:w-11/12 md:w-1/2 lg:w-1/3">
                <h2 className="justify-center text-xl font-semibold mb-4 flex items-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-6 h-6 mr-2 text-purple-400"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                    A Friendly Heads-Up
                </h2>
                <div className="space-y-4 grid-cols-3 text-purple-300 text-left">
                    <div className="bg-opacity-30 p-4 rounded-lg border border-purple-500 flex items-start">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-5 h-5 mr-2 mt-1 flex-shrink-0 text-purple-400"
                        >
                            <polyline points="9 11 12 14 22 4" />
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                        </svg>
                        <span>
                            Our deepfake detector is pretty smart, but it's not perfect. Sometimes it might get things wrong, just like humans do!
                        </span>
                    </div>

                    <div className="bg-opacity-30 p-4 rounded-lg border border-purple-500 flex items-start">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-5 h-5 mr-2 mt-1 flex-shrink-0 text-purple-400"
                        >
                            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                        </svg>
                        <span>
                            If you're using this for something important, it's a good idea to double-check the results or ask for a second opinion.
                        </span>
                    </div>

                    <div className="bg-opacity-30 p-4 rounded-lg border border-purple-500 flex items-start">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-5 h-5 mr-2 mt-1 flex-shrink-0 text-purple-400"
                        >
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        <span>
                            Remember, technology is always improving. What's hard to detect today might be easier to spot tomorrow!
                        </span>
                    </div>
                </div>
            </div>

        </div >
    )
}

export default HomePage;
