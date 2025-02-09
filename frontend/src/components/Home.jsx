import React, { useEffect, useState, useCallback } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import bgimg from "../assets/purple-cyborg.jpg";

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

    const handleFile = useCallback((selectedFile) => {
        setFile(selectedFile);
        // Simulate prediction (replace with actual API call in a real application)
        setTimeout(() => {
            const randomPrediction = Math.random() > 0.5 ? "Real" : "Deepfake";
            setPrediction(randomPrediction);
        }, 1500);
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
            <div className="relative text-center lg:mt-10 text-white bg-purple-dark rounded-lg max-w-lg w-full sm:max-w-md sm:w-11/12 md:w-1/2">
                <h1 className="text-4xl font-bold mb-6 text-purple-light">Veracity.AI</h1>
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
                        <div className={`text-center p-4 rounded-lg ${prediction === "Real" ? "bg-green-900" : "bg-red-900"}`}>
                            <div className="flex items-center justify-center mb-2">
                                {prediction === "Real" ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-green-400 w-6 h-6 mr-2"
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
                                        className="text-red-400 w-6 h-6 mr-2"
                                    >
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="12" y1="8" x2="12" y2="12" />
                                        <line x1="12" y1="16" x2="12.01" y2="16" />
                                    </svg>
                                )}
                                <span className="text-xl font-bold">{prediction}</span>
                            </div>
                            <p className="text-sm">
                                {prediction === "Real"
                                    ? "This content appears to be authentic."
                                    : "This content may be artificially generated."}
                            </p>
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
                <div className="space-y-4 text-purple-300 text-left">
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

        </div>
    )
}

export default HomePage;
