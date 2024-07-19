import React, { useState } from 'react';
import { MdCancel } from "react-icons/md";
import { FaSpinner } from "react-icons/fa"; // Import a spinner icon from react-icons

interface CommandState {
    isLoading: boolean;
    results: string[];
    executed: boolean;
}

interface TerminalProps {
    commands: string[];
    onExecute: (command: string) => Promise<string>;
    commandResponses: string[][]; // Updated to array of arrays for multiple responses
}

const Terminal: React.FC<TerminalProps> = ({ commands, onExecute, commandResponses }) => {
    const [commandStates, setCommandStates] = useState<CommandState[]>(
        commands.map(() => ({ isLoading: false, results: [], executed: false }))
    );
    const [isExecuting, setIsExecuting] = useState(false);

    const handleExecute = async (index: number) => {
        const newCommandStates = [...commandStates];
        newCommandStates[index].isLoading = true;
        setCommandStates(newCommandStates);
        setIsExecuting(true);

        const responses = commandResponses[index];
        let responseIndex = 0;

        const interval = setInterval(() => {
            if (responseIndex < responses.length) {
                newCommandStates[index].results.push(responses[responseIndex]);
                setCommandStates([...newCommandStates]);
                responseIndex++;
            } else {
                clearInterval(interval);
                newCommandStates[index].isLoading = false;
                newCommandStates[index].executed = true;
                setCommandStates(newCommandStates);
                setIsExecuting(false);
            }
        }, 2000);
    };

    return (
        <div className="terminal">
            <div className="terminal-content">
                {commands.map((command, index) => (
                    <div key={index} className="command mb-4 p-2">
                        <div className="flex items-center">
                            <span className="prompt mr-2">$ </span>
                            <div className="flex-grow max-w-lg"><span className="text-red-500">sudo</span> {command}</div>
                            <button
                                onClick={() => handleExecute(index)}
                                className={`ml-4 font-bold py-1 px-3 rounded w-24 h-8 flex items-center justify-center ${isExecuting || commandStates[index].executed
                                    ? 'bg-gray-500 text-white cursor-not-allowed'
                                    : 'bg-green-500 hover:bg-green-700 text-white'
                                    }`}
                                disabled={isExecuting || commandStates[index].executed}
                            >
                                {commandStates[index].isLoading ? (
                                    <FaSpinner className="animate-spin" />
                                ) : (
                                    'Execute'
                                )}
                            </button>
                        </div>
                        <div className="result mt-2 text-sm max-w-lg text-white">
                            {commandStates[index].results.map((result, resIndex) => (
                                <div key={resIndex}>{result}</div>
                            ))}
                        </div>
                        {index < commands.length - 1 && <hr className="my-4 border-gray-700" />}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Terminal;
