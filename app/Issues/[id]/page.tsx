import React from 'react';
import { IoWarningOutline } from "react-icons/io5";



const IssueDetailPage = () => {
    return (
        <div className="mx-4 my-8"> {/* Horizontaler Abstand von 1rem, vertikaler Abstand von 2rem */}
            {/* <h1 className="bg-purple-500 text-font-2xl">Issue Details</h1> */}
            <p>qpijd</p>
            <div className='grid grid-cols-9 grid-rows-6 gap-x-10 gap-y-10 grid-flow-row-dense'>

                <div className='bg-white border-black border rounded-lg shadow-xl min-h-[50px] col-span-3' />
                <div className='bg-white border-black border rounded-lg shadow-xl min-h-[50px] flex justify-center items-center'>
                    <IoWarningOutline className='text-4xl text-yellow-500' />
                </div>
                <div className='bg-white border-black border rounded-lg shadow-xl min-h-[50px] flex justify-center items-center'>
                    <p>open</p>
                </div>
                <div className='bg-white border-black border rounded-lg shadow-xl min-h-[50px]' />
                <div className='bg-white border-black border rounded-lg shadow-xl min-h-[50px] col-span-3 row-span-4' />
                <div className='bg-white border-black border rounded-lg shadow-xl min-h-[50px] col-span-3' />
                <div className='bg-white border-black border rounded-lg shadow-xl min-h-[50px] col-span-3' />
                <div className='bg-white border-black border rounded-lg shadow-xl min-h-[50px] col-span-3 row-span-2' />
                <div className='bg-white border-black border rounded-lg shadow-xl min-h-[50px] col-span-3 row-span-2' />
                <div className='bg-white border-black border rounded-lg shadow-xl min-h-[50px] col-span-3 row-span-2' />
                <div className='bg-white border-black border rounded-lg shadow-xl min-h-[50px] col-span-3 row-span-2' />
                <div className='bg-white border-black border rounded-lg shadow-xl min-h-[50px] col-span-3 row-span-2' />
            </div>
        </div>
    );
};

export default IssueDetailPage;
