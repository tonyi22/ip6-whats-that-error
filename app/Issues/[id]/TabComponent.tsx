import React, { useState } from 'react';

export function TabComponent() {
    const [activeTab, setActiveTab] = useState('comments'); // 'comments' oder 'attachments'

    return (
        <div className='bg-white border-black border rounded-lg shadow-xl min-h-[50px] col-span-3 row-span-2 relative'>

            <div className='p-1 absolute top-1 left-0 transform -translate-y-full bg-gray-50 rounded-t-lg'>
                <button
                    className={`px-2 py-1 text-xs ${activeTab === 'comments' ? 'bg-white text-black rounded-lg' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('comments')}
                >
                    Comm
                </button>

                <button
                    className={`px-2 py-1 text-xs ${activeTab === 'attachments' ? 'bg-white text-black rounded-lg' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('attachments')}
                >
                    Att
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
