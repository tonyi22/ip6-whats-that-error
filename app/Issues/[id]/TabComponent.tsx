import React, { useState } from 'react';

export function TabComponent() {
    const [activeTab, setActiveTab] = useState('comments'); // 'comments' oder 'attachments'

    return (
        <div className='bg-white border-black border rounded-lg shadow-xl min-h-[50px] col-span-3 row-span-2 relative'>

            <div className='p-1 absolute top-0 left-1 transform -translate-y-full bg-white border border-black rounded-t-lg'>
                <button
                    className={`px-2 py-1 text-xs ${activeTab === 'comments' ? 'bg-gray-300 text-black rounded-lg' : 'bg-white text-gray-500'}`}
                    onClick={() => setActiveTab('comments')}
                >
                    C
                </button>

                <button
                    className={`px-2 py-1 text-xs ${activeTab === 'attachments' ? 'bg-gray-300 text-black rounded-lg' : 'bg-white text-gray-500'}`}
                    onClick={() => setActiveTab('attachments')}
                >
                    A
                </button>
            </div>

            {activeTab === 'comments' && (
                <div className="p-4">
                    <p>Comments content here</p>
                </div>
            )}

            {activeTab === 'attachments' && (
                <div className="p-4">
                    <p>Attachments content here</p>
                </div>
            )}

        </div>
    );
}

export default TabComponent;
