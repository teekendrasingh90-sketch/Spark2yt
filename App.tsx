
import React, { useState, useEffect, useCallback } from 'react';
import { AppStatus } from './types';
import LogoUploader from './components/LogoUploader';
import ProgressBar from './components/ProgressBar';
import LinkIcon from './components/icons/LinkIcon';
import AppIcon from './components/icons/AppIcon';
import InfoIcon from './components/icons/InfoIcon';

const PROCESSING_STEPS = [
    { progress: 10, text: "Analyzing website..." },
    { progress: 30, text: "Fetching site metadata..." },
    { progress: 50, text: "Packaging assets..." },
    { progress: 75, text: "Building configuration..." },
    { progress: 90, text: "Signing application..." },
    { progress: 100, text: "Done!" },
];

const App: React.FC = () => {
    const [url, setUrl] = useState<string>('');
    const [appName, setAppName] = useState<string>('');
    const [logo, setLogo] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
    const [progress, setProgress] = useState<number>(0);
    const [progressText, setProgressText] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    
    const isProcessing = status === AppStatus.PROCESSING;

    useEffect(() => {
        if (logo) {
            const objectUrl = URL.createObjectURL(logo);
            setLogoPreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        } else {
            setLogoPreview(null);
        }
    }, [logo]);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (isProcessing) {
            let step = 0;
            const updateProgress = () => {
                setProgress(PROCESSING_STEPS[step].progress);
                setProgressText(PROCESSING_STEPS[step].text);
                step++;
                if (step < PROCESSING_STEPS.length) {
                    timer = setTimeout(updateProgress, 800);
                } else {
                    setTimeout(() => setStatus(AppStatus.SUCCESS), 500);
                }
            };
            updateProgress();
        }
        return () => clearTimeout(timer);
    }, [isProcessing]);

    const handleLogoChange = useCallback((file: File | null) => {
        if (file && file.type.startsWith('image/')) {
            setLogo(file);
        } else {
            setLogo(null);
        }
    }, []);

    const isValidUrl = (urlString: string): boolean => {
        try {
            const newUrl = new URL(urlString);
            return newUrl.protocol === 'http:' || newUrl.protocol === 'https:';
        } catch (e) {
            return false;
        }
    }

    const handleGenerate = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');

        if (!isValidUrl(url)) {
            setErrorMessage('Please enter a valid website URL (e.g., https://example.com)');
            return;
        }
        if (!appName.trim()) {
            setErrorMessage('Please enter an app name.');
            return;
        }
        
        setStatus(AppStatus.PROCESSING);
        setProgress(0);
        setProgressText('');
    };
    
    const handleReset = () => {
        setUrl('');
        setAppName('');
        setLogo(null);
        setStatus(AppStatus.IDLE);
        setProgress(0);
        setErrorMessage('');
    }

    const handleDownload = () => {
        const apkContent = `
App Name: ${appName}
Website URL: ${url}
WebView Engine: Chrome

This is a placeholder configuration file. 
In a real build process, this information would be used by a server to generate a functional APK.
This file is not an installable Android application and will cause a parsing error if you try to open it.
        `;
        const blob = new Blob([apkContent.trim()], { type: 'text/plain' });
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        const sanitizedAppName = appName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        a.download = `${sanitizedAppName || 'app'}.apk`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);
    };

    const renderContent = () => {
        switch (status) {
            case AppStatus.PROCESSING:
                return (
                    <div className="text-center p-8 bg-slate-800 rounded-lg shadow-lg w-full max-w-md animate-fade-in">
                        <h2 className="text-2xl font-bold text-white mb-4">Generating your App...</h2>
                        <p className="text-slate-400 mb-6">Please wait while we wrap your website into a shiny new APK.</p>
                        <ProgressBar progress={progress} text={progressText} />
                    </div>
                );
            case AppStatus.SUCCESS:
                return (
                    <div className="text-center p-8 bg-slate-800 rounded-lg shadow-lg w-full max-w-md animate-fade-in">
                         <h2 className="text-2xl font-bold text-emerald-400 mb-2">Configuration Complete!</h2>
                         <p className="text-slate-400 mb-6">Your app settings have been processed successfully.</p>
                         
                         <div className="bg-slate-900 rounded-lg p-4 flex items-center space-x-4 mb-6">
                            <img src={logoPreview || `https://picsum.photos/seed/${encodeURIComponent(appName)}/128`} alt="App Logo" className="w-16 h-16 rounded-xl object-cover bg-slate-700" />
                            <div className="text-left overflow-hidden">
                                <h3 className="text-lg font-semibold text-white truncate">{appName}</h3>
                                <p className="text-sm text-slate-400 truncate">{url}</p>
                            </div>
                         </div>

                         <div className="space-y-4 mb-6">
                            <button onClick={handleDownload} className="w-full bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500 transition-all duration-300 flex items-center justify-center space-x-2">
                                <span>Download Demo APK</span>
                            </button>
                            <button onClick={handleReset} className="w-full bg-slate-700 text-slate-300 font-bold py-3 px-4 rounded-lg hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-slate-500 transition-all duration-300">
                                <span>Create Another App</span>
                            </button>
                         </div>

                         <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-sm text-slate-300 flex items-start space-x-3">
                            <InfoIcon className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
                            <div className="text-left">
                                <p className="font-semibold text-white">Note: This is a UI Demonstration</p>
                                <p className="text-slate-400 text-xs mt-1">
                                    Generating a functional APK is a complex server-side process. The downloaded file is a placeholder and <strong className="text-amber-400">will not install</strong>. In a real application, your website would be wrapped in a Chrome-based WebView and the real APK would download.
                                </p>
                            </div>
                         </div>
                    </div>
                );
            default: // IDLE or ERROR
                return (
                    <div className="w-full max-w-md p-8 space-y-6 bg-slate-800 rounded-xl shadow-lg">
                        <div>
                            <h2 className="text-center text-3xl font-extrabold text-white">
                                Web to APK Converter
                            </h2>
                            <p className="mt-2 text-center text-sm text-slate-400">
                                Turn any website into an Android app in seconds.
                            </p>
                        </div>
                        <form className="space-y-6" onSubmit={handleGenerate}>
                            <div>
                                <label htmlFor="app-name" className="block mb-2 text-sm font-medium text-slate-300">App Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                       <AppIcon className="h-5 w-5 text-slate-500" />
                                    </div>
                                    <input
                                        id="app-name"
                                        name="app-name"
                                        type="text"
                                        required
                                        className="bg-slate-900 border border-slate-600 text-white text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full pl-10 p-2.5"
                                        placeholder="My Awesome App"
                                        value={appName}
                                        onChange={(e) => setAppName(e.target.value)}
                                        disabled={isProcessing}
                                    />
                                </div>
                            </div>
                             <div>
                                <label htmlFor="url" className="block mb-2 text-sm font-medium text-slate-300">Website URL</label>
                                <div className="relative">
                                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <LinkIcon className="h-5 w-5 text-slate-500" />
                                    </div>
                                    <input
                                        id="url"
                                        name="url"
                                        type="url"
                                        required
                                        className="bg-slate-900 border border-slate-600 text-white text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full pl-10 p-2.5"
                                        placeholder="https://example.com"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        disabled={isProcessing}
                                    />
                                </div>
                            </div>

                            <LogoUploader onLogoChange={handleLogoChange} logoPreview={logoPreview} disabled={isProcessing} />

                            {errorMessage && <p className="text-sm text-red-400 text-center">{errorMessage}</p>}

                            <div>
                                <button type="submit" disabled={isProcessing} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed">
                                    Generate APK
                                </button>
                            </div>
                        </form>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen text-white flex flex-col items-center justify-center p-4 bg-slate-900 font-sans">
            <main className="flex flex-col items-center justify-center w-full flex-1 text-center">
                {renderContent()}
            </main>
            <footer className="w-full max-w-md mx-auto text-center p-4 mt-4 text-xs text-slate-500">
                <p>&copy; {new Date().getFullYear()} WebToApp Generator. All Rights Reserved. (UI Demo)</p>
            </footer>
        </div>
    );
};

export default App;
