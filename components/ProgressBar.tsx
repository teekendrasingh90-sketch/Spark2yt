
import React from 'react';

interface ProgressBarProps {
    progress: number;
    text: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, text }) => {
    return (
        <div className="w-full max-w-md mx-auto">
            <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                    <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-sky-400 bg-sky-900">
                            {text}
                        </span>
                    </div>
                    <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-sky-400">
                            {Math.round(progress)}%
                        </span>
                    </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-slate-700">
                    <div
                        style={{ width: `${progress}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-sky-500 transition-all duration-500 ease-out"
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default ProgressBar;
