import React, { useState } from 'react';

interface CommandState {
    isLoading: boolean;
    result: string;
    executed: boolean;
}

interface TerminalProps {
    commands: string[];
    onExecute: (command: string) => Promise<string>;
}

const Terminal: React.FC<TerminalProps> = ({ commands, onExecute }) => {
    const [commandStates, setCommandStates] = useState<CommandState[]>(
        commands.map(() => ({ isLoading: false, result: '', executed: false }))
    );
    const [isExecuting, setIsExecuting] = useState(false);

    const handleExecute = async (index: number) => {
        const newCommandStates = [...commandStates];
        newCommandStates[index].isLoading = true;
        newCommandStates[index].result = 'Loading...';
        setCommandStates(newCommandStates);
        setIsExecuting(true);

        const result = await onExecute(commands[index]);
        newCommandStates[index].isLoading = false;
        newCommandStates[index].result = result;
        newCommandStates[index].executed = true;
        setCommandStates(newCommandStates);
        setIsExecuting(false);
    };

    return (
        <div className="terminal bg-black text-green-400 font-mono p-4 rounded-lg mt-4 border border-gray-600">
            <div className="terminal-content">
                {commands.map((command, index) => (
                    <div key={index} className="command mb-4 p-2">
                        <div className="flex items-center">
                            <span className="prompt mr-2">$ </span>
                            <div className="flex-grow max-w-lg">
                                <span className="text-red-500">sudo </span>{command}
                            </div>
                            <button
                                onClick={() => handleExecute(index)}
                                className={`ml-20 bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded ${isExecuting || commandStates[index].executed ? 'bg-gray-500 cursor-not-allowed' : ''}`}
                                disabled={commandStates[index].isLoading || isExecuting || commandStates[index].executed}
                            >
                                Execute
                            </button>
                        </div>
                        <div className="result mt-2 max-w-lg text-white">
                            {commandStates[index].result}
                        </div>
                        {index < commands.length - 1 && <hr className="my-4 border-gray-700" />}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Terminal;
