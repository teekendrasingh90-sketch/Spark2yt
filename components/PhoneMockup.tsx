
import React, { useState } from 'react';
import AppIcon from './icons/AppIcon';

interface PhoneMockupProps {
    url: string;
    appName: string;
    logoUrl: string | null;
}

const PhoneMockup: React.FC<PhoneMockupProps> = ({ url, appName, logoUrl }) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className="relative mx-auto border-gray-800 bg-gray-800 border-[8px] rounded-[2.5rem] h-[550px] w-[270px] shadow-xl">
            <div className="w-[130px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
            <div className="h-[40px] w-[3px] bg-gray-800 absolute -left-[10px] top-[100px] rounded-l-lg"></div>
            <div className="h-[40px] w-[3px] bg-gray-800 absolute -left-[10px] top-[150px] rounded-l-lg"></div>
            <div className="h-[60px] w-[3px] bg-gray-800 absolute -right-[10px] top-[120px] rounded-r-lg"></div>
            <div className="rounded-[2rem] overflow-hidden w-full h-full bg-slate-900 mockup-screen">
                {isLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-slate-400">
                        <div className="w-8 h-8 border-4 border-slate-600 border-t-sky-500 rounded-full animate-spin mb-4"></div>
                        <p className="text-sm">Loading Preview...</p>
                        <p className="text-xs text-slate-500 max-w-[90%] truncate">{url}</p>
                    </div>
                )}
                <iframe
                    src={url}
                    title={appName}
                    onLoad={() => setIsLoading(false)}
                    className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                    sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
                />
            </div>
        </div>
    );
};

export default PhoneMockup;
