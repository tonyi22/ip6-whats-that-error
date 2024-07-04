import React, { useState } from 'react';

export function TabComponent() {
    const [activeTab, setActiveTab] = useState('comments'); // 'comments' or 'attachments'

    return (
        <div className='mt-8 bg-github-secondary  dark:bg-github-dark-tertiary dark:border-github-primary rounded-lg shadow-xl min-h-[200px] col-span-3 row-span-2 relative bg-gradient-to-b from-gray-50 to-white'>
            <div className='p-1 absolute top-0 left-1 transform -translate-y-full bg-gray-100 dark:bg-github-dark-secondary border rounded-t-lg'>
                <button
                    className={`px-3 py-2 text-xs font-semibold ${activeTab === 'comments' ? 'bg-teal-500 text-white' : 'dark:bg-gray-600 text-dark dark:text-github-secondary'}`}
                    onClick={() => setActiveTab('comments')}
                >
                    Comments
                </button>

                <button
                    className={`px-3 py-2 text-xs font-semibold ${activeTab === 'attachments' ? 'bg-teal-500 text-white' : 'dark:bg-gray-600 text-dark dark:text-github-secondary'}`}
                    onClick={() => setActiveTab('attachments')}
                >
                    Attachments
                </button>
            </div>

            {activeTab === 'comments' && (
                <div className="p-4 dark:text-github-dark-text">
                    <p>Comments content here</p>
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
