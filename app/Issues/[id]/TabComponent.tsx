import React, { useState } from 'react';


export function TabComponent() {
    const [activeTab, setActiveTab] = useState('comments'); // 'comments' or 'attachments'
    const [comments, setComments] = useState('');

    const handleCommentsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setComments(e.target.value);
    };

    return (
        <div className='bg-github-secondary dark:bg-github-dark-tertiary dark:border-github-primary rounded-lg shadow-l col-span-2 row-span-1 bg-gradient-to-b from-[#fcf1fa] to-[#f7ebff]'>
            <div className='p-1  bg-gray-100 dark:bg-github-dark-secondary rounded-t-lg'>
                <button
                    className={`rounded-lg px-3 py-2 text-xs font-semibold ${activeTab === 'comments' ? 'bg-teal-500 text-white' : 'dark:bg-gray-600 text-dark dark:text-github-secondary'}`}
                    onClick={() => setActiveTab('comments')}
                >
                    Comments
                </button>

                <button
                    className={`rounded-lg px-3 py-2 text-xs font-semibold ${activeTab === 'attachments' ? 'bg-teal-500 text-white' : 'dark:bg-gray-600 text-dark dark:text-github-secondary'}`}
                    onClick={() => setActiveTab('attachments')}
                >
                    Attachments
                </button>
            </div>

            {activeTab === 'comments' && (
                <div className="p-4 dark:text-github-dark-text">
                    <textarea
                        value={comments}
                        onChange={handleCommentsChange}
                        className="w-full h-40 p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                        placeholder="Enter your comments here"
                    />
                </div>
            )}

            {activeTab === 'attachments' && (
                <div className="p-4 dark:text-github-dark-text">
                    <p>Attachments content here</p>
                </div>
            )}
        </div>
    );
}

export default TabComponent;
