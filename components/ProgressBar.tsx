
import React from 'react';

interface ProgressBarProps {
    progress: number;
    text: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, text }) => {
    const roundedProgress = Math.round(progress);
    return (
        <div className="w-full">
            <div className="flex mb-2 items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">
                    {text}
                </span>
                <span className="text-xs font-semibold text-sky-400">
                    {roundedProgress}%
                </span>
            </div>
            <div className="overflow-hidden h-2.5 text-xs flex rounded-full bg-slate-700" role="progressbar" aria-valuenow={roundedProgress} aria-valuemin={0} aria-valuemax={100}>
                <div
                    style={{ width: `${progress}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-sky-500 transition-all duration-500 ease-out"
                ></div>
            </div>
        </div>
    );
};

export default ProgressBar;
