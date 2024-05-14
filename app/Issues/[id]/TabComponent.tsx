import React, { useState } from 'react';

export function TabComponent() {
    const [activeTab, setActiveTab] = useState('comments'); // 'comments' or 'attachments'

    return (
        <div className='mt-8 bg-gray-600  dark:bg-github-dark-tertiary border border-gray-700 dark:border-github-primary rounded-lg shadow-xl min-h-[200px] col-span-3 row-span-2 relative'>
            <div className='p-1 absolute top-0 left-1 transform -translate-y-full bg-gray-500 dark:bg-github-dark-secondary border rounded-t-lg'>
                <button
                    className={`px-3 py-2 text-xs font-semibold ${activeTab === 'comments' ? 'bg-teal-500 text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-github-secondary'}`}
                    onClick={() => setActiveTab('comments')}
                >
                    Comments
                </button>

                <button
                    className={`px-3 py-2 text-xs font-semibold ${activeTab === 'attachments' ? 'bg-teal-500 text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-github-secondary'}`}
                    onClick={() => setActiveTab('attachments')}
                >
                    Attachments
                </button>
            </div>

            {activeTab === 'comments' && (
                <div className="p-4 text-gray-900 dark:text-github-dark-text">
                    <p>Comments content here</p>
                </div>
            )}

            {activeTab === 'attachments' && (
                <div className="p-4 text-gray-900 dark:text-github-dark-text min-h-[150px]">
                    <p>Attachments content here</p>
                </div>
            )}
        </div>
    );
}

export default TabComponent;
