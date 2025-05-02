import React, { useEffect, useState, useCallback } from "react";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import bgimg from "../assets/purple-cyborg.jpg";
import RotatingText from './RotatingText'

const HomePage = () => {

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

    const [file, setFile] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [fileType, setFileType] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Cleanup video preview URLs when component unmounts
    useEffect(() => {
        return () => {
            if (videoPreview) {
                URL.revokeObjectURL(videoPreview);
            }
        };
    }, [videoPreview]);

    const handleFile = useCallback(async (selectedFile) => {
        setFile(selectedFile);
        setPrediction(null); // Reset previous prediction

        // Determine file type
        const fileType = selectedFile.type.split('/')[0];
        setFileType(fileType);

        // Create video preview URL if it's a video
        if (fileType === 'video') {
            setVideoPreview(URL.createObjectURL(selectedFile));
        } else {
            setVideoPreview(null);
        }

        const formData = new FormData();
        formData.append("image", selectedFile); // Keep the field name as "image" for backend compatibility

        console.warn(formData);
        setIsAnalyzing(true);

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
            setPrediction(data);
            submitResults(selectedFile.name, fileType, data.result, data.confidence);
        } catch (error) {
            console.error("Error:", error);
            setPrediction({
                result: "Error",
                confidence: 0,
                explanation: "Unable to process file: " + error.message,
                mediaType: fileType
            });
        } finally {
            setIsAnalyzing(false);
        }
    }, []);

    const submitResults = async (filename, fileType, prediction, confidence) => {

        const user = getAuth().currentUser;

        const result = {
            userId: user.uid,
            filename,
            fileType,
            prediction,
            confidence,
            timestamp: serverTimestamp(),
        };

        try {
            await addDoc(collection(db, "results"), result);
            console.log("Result submitted successfully");
        } catch (error) {
            console.error("Error submitting result:", error);
            throw error;
        }
    }

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

    // Renders the video prediction result
    const renderVideoPrediction = () => (
        <div className={`text-center p-4 rounded-lg ${prediction.result === "Real" ? "bg-green-900" :
            prediction.result === "Error" ? "bg-yellow-900" : "bg-red-900"}`}>
            <div className="flex items-center justify-center mb-2">
                {prediction.result === "Real" ? (
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
                ) : prediction.result === "Error" ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-yellow-400 w-6 h-6 mr-2"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
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
                <span className="text-xl font-bold">{prediction.result}</span>
            </div>
            {prediction.result !== "Error" ? (
                <>
                    <p className="text-sm">
                        {prediction.result === "Real"
                            ? `This ${prediction.mediaType || fileType || "content"} appears to be authentic.`
                            : `This ${prediction.mediaType || fileType || "content"} may be artificially generated.`}
                    </p>
                    <div className="mt-4">
                        <p className="mb-3 text-sm text-purple-200">Confidence: {prediction.confidence.toFixed(2)}%</p>
                        <p className="text-sm text-purple-200">Explanation: {prediction.explanation}</p>
                    </div>
                </>
            ) : (
                <p className="text-sm text-yellow-200">{prediction.explanation}</p>
            )}
        </div>
    );

    return (
        <div className="relative flex flex-col justify-center bg-gradient-to-r from-black to-[#340258] items-center min-h-screen p-6 mx-auto">
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

                    {/* Video Preview */}
                    {fileType === 'video' && videoPreview && (
                        <div className="mt-4">
                            <p className="text-purple-300 mb-2">Video Preview:</p>
                            <video
                                src={videoPreview}
                                className="w-full rounded-lg"
                                controls
                                style={{ maxHeight: '200px' }}
                            />
                        </div>
                    )}

                    {file && isAnalyzing && (
                        <div className="text-center text-purple-300">
                            <div className="flex justify-center items-center space-x-2">
                                <svg className="animate-spin h-5 w-5 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Analyzing {fileType === 'video' ? 'video' : 'image'}...</span>
                            </div>
                            {fileType === 'video' && (
                                <p className="text-xs mt-2">Video analysis may take longer due to frame processing</p>
                            )}
                        </div>
                    )}

                    {prediction && !isAnalyzing && (
                        <>
                            {/* Video-specific result display */}
                            {(prediction.mediaType === 'video' || fileType === 'video') && (
                                renderVideoPrediction()
                            )}

                            {/* Image-specific result display with heatmap */}
                            {(prediction.mediaType === 'image' || (fileType === 'image' && prediction.heatmap)) && (
                                <div className="rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm transition-all duration-300 hover:shadow-purple-500/30">
                                    {/* Result banner that changes color based on result */}
                                    <div
                                        className={`py-3 px-6 flex items-center justify-between ${prediction.result === "Real"
                                            ? "bg-gradient-to-r from-green-600 to-green-500"
                                            : "bg-gradient-to-r from-red-600 to-red-500"
                                            }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            {prediction.result === "Real" ? (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                    className="text-white w-8 h-8"
                                                >
                                                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                                                </svg>
                                            ) : prediction.result === "Error" ? (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                    className="text-white w-8 h-8"
                                                >
                                                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                                                </svg>
                                            ) : (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                    className="text-white w-8 h-8"
                                                >
                                                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                            <span className="text-2xl font-bold text-white">
                                                {prediction.result === "Real" ? "Authentic Content" : "Potentially AI-Generated"}
                                            </span>
                                        </div>

                                        <div className="flex items-center bg-black/30 px-3 py-1 rounded-full">
                                            <span className="mr-2 text-white font-medium">Confidence:</span>
                                            <span className={`font-bold ${prediction.result === "Real" ? "text-green-300" : "text-red-300"}`}>
                                                {prediction.confidence.toFixed(2)}%
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-b from-purple-900/40 to-blue-900/40 p-6">
                                        <div className="grid md:grid-cols-2 gap-8">
                                            {/* Left column - Image and confidence */}
                                            <div className="space-y-6">
                                                <div className="relative group rounded-lg overflow-hidden ring-2 ring-purple-500/50 shadow-xl">
                                                    {/* Animated glow effect */}
                                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-blue-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>

                                                    {/* Glass container for image */}
                                                    <div className="relative backdrop-blur-sm bg-black/50 p-2 rounded-lg">
                                                        <img
                                                            src={prediction.heatmap.startsWith('data:')
                                                                ? prediction.heatmap
                                                                : `data:image/jpeg;base64,${prediction.heatmap}`}
                                                            alt="Analysis Heatmap"
                                                            className="w-full rounded-md transition-transform duration-500 group-hover:scale-105"
                                                        />

                                                        {/* Floating badge */}
                                                        <div className="absolute -bottom-1 -right-1 bg-purple-600 text-white text-xs px-3 py-1 rounded-tl-lg rounded-br-lg font-medium shadow-lg">
                                                            Heatmap Analysis
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="relative">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <p className="text-sm text-purple-200 font-medium">Confidence Level</p>
                                                        <div className="flex items-center">
                                                            <div className={`h-3 w-3 rounded-full mr-2 ${prediction.result === "Real" ? "bg-green-500" : "bg-red-500"}`}></div>
                                                            <p className="text-sm font-bold">
                                                                {prediction.confidence.toFixed(2)}%
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Glass effect progress bar container */}
                                                    <div className="w-full h-4 rounded-full bg-black/50 backdrop-blur-sm p-1">
                                                        <div
                                                            className={`h-2 rounded-full transition-all duration-1000 ease-out ${prediction.result === "Real"
                                                                ? "bg-gradient-to-r from-green-500 to-emerald-400"
                                                                : "bg-gradient-to-r from-red-500 to-orange-400"
                                                                }`}
                                                            style={{ width: `${prediction.confidence.toFixed(2)}%` }}
                                                        >
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right column - Explanation */}
                                            <div className="bg-black/40 backdrop-blur-md p-5 rounded-xl border border-purple-500/30 shadow-lg">
                                                <h3 className="text-lg font-semibold mb-4 flex items-center border-b border-purple-500/30 pb-3">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                        className="w-5 h-5 mr-2 text-purple-400"
                                                    >
                                                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                                                    </svg>
                                                    Analysis Details
                                                </h3>

                                                <div className="prose prose-sm prose-invert max-w-none mb-6">
                                                    <p className="text-gray-200 leading-relaxed">{prediction.explanation}</p>
                                                </div>

                                                <div className="mt-6 space-y-4">
                                                    <h4 className="text-sm font-medium flex items-center text-purple-300 mb-2">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                            className="w-4 h-4 mr-2 text-purple-400"
                                                        >
                                                            <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z" clipRule="evenodd" />
                                                        </svg>
                                                        What to look for in the heatmap:
                                                    </h4>

                                                    <ul className="text-sm text-left text-gray-300 space-y-2 pl-4">
                                                        <li className="flex items-start">
                                                            <div className="bg-purple-500/20 p-1 rounded mr-2 mt-0.5">
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-purple-400">
                                                                    <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                                                                    <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                                </svg>
                                                            </div>
                                                            Bright areas show regions the AI focused on when making its decision
                                                        </li>
                                                        <li className="flex items-start">
                                                            <div className="bg-purple-500/20 p-1 rounded mr-2 mt-0.5">
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-purple-400">
                                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                                                </svg>
                                                            </div>
                                                            In fake images, artifacts around edges and unnatural textures are highlighted
                                                        </li>
                                                        <li className="flex items-start">
                                                            <div className="bg-purple-500/20 p-1 rounded mr-2 mt-0.5">
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-purple-400">
                                                                    <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                                                </svg>
                                                            </div>
                                                            In real images, natural facial features receive more balanced attention
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-8 text-center">
                                            <button
                                                onClick={() => window.location.reload()}
                                                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/30 flex items-center mx-auto"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                                                    <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z" clipRule="evenodd" />
                                                </svg>
                                                Analyze Another Image
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
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
        </div>
    )
}

export default HomePage;