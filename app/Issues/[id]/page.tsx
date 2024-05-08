import React from 'react';
import { IoWarningOutline } from "react-icons/io5";
import { systemMonitoringIssuesArray } from '../page';
import { SystemMonitoringIssue } from '../../data/data';





function IssueView({ params }: { params: { id: string } }) {

    const issue = systemMonitoringIssuesArray.find(issue => issue.id === Number(params.id))!;

    return (
        <div className="mx-4 my-8">

            <div className='bg-gray-200 border border-black  rounded-lg shadow-xl grid grid-cols-1 sm:grid-cols-9 grid-rows-1 sm:grid-rows-6 gap-x-10 gap-y-10 p-5 grid-flow-row-dense mx-4 my-8'>

                <div className='flex min-h-[50px] col-span-3 justify-center items-center'>
                    <div className='bg-white p-2 border-black border rounded-lg shadow-xl flex justify-center items-center'>
                        <h2> Titel: {issue.title} </h2>
                    </div>
                </div>
                <div className='flex min-h-[50px] col-span-1'>
                    <div className='bg-white border-black border rounded-lg shadow-xl flex justify-center items-center'>
                        <IoWarningOutline className='text-4xl text-yellow-500' />
                    </div>
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
        </div >
    );
};

export default IssueView;
