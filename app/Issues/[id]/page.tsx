'use client'
import React, { useState } from 'react';
import { IoWarningOutline } from "react-icons/io5";
import { systemMonitoringIssuesArray } from '../page';
import { SystemMonitoringIssue } from '../../data/data';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { TabComponent } from './TabComponent';




function IssueView({ params }: { params: { id: string } }) {

    const [activeTab, setActiveTab] = useState('comments');

    //helper function to format date
    const formatDate = (date: string | number | Date) => {
        return format(new Date(date), 'dd.MM.yyyy HH:mm:ss', { locale: de });
    };

    const issue = systemMonitoringIssuesArray.find(issue => issue.id === Number(params.id))!;

    return (
        <div className="mx-4 my-8">
            <p className="justify-center items-center flex">Detailansicht eines Issues</p>

            <div className='bg-gray-200 border border-black rounded-lg shadow-xl grid grid-cols-1 sm:grid-cols-9 grid-rows-1 sm:grid-rows-6 gap-x-10 gap-y-10 p-5 grid-flow-row-dense mx-4 my-8'>

                <div className='flex min-h-[50px] col-span-3 justify-center items-center'>
                    <div className='p-2 bg-white p-2 border-black border rounded-lg shadow-xl flex justify-center items-center'>
                        <p> Titel: {issue.title} </p>
                    </div>
                </div>

                <div className='flex min-h-[50px] col-span-1 justify-center items-center'>
                    <div className='p-1 col-span-1 bg-white border-black border rounded-lg shadow-xl flex justify-center items-center'>
                        <IoWarningOutline className='text-4xl text-yellow-500' />
                    </div>
                </div>

                <div className="flex min-h-[50px] justify-center items-center ">
                    <div className='p-2 bg-white border-black border rounded-lg shadow-xl min-h-[50px] flex justify-center items-center'>
                        <p>open</p>
                    </div>
                </div>

                <div className='flex min-h-[50px] justify-center items-center'>
                    <div className='bg-yellow-500 border-black border rounded-lg shadow-xl min-h-[50px] flex justify-center items-center'>
                        <p>Severity: {issue.severity} </p>
                    </div>
                </div>

                <div className='bg-white border-black border rounded-lg shadow-xl min-h-[50px] col-span-3 row-span-4 p-1'>
                    <p className='flex justify-center items-center'>Info</p>

                    <h2 className='flex'>Creator: {issue.creator}</h2>
                    <h2 className='flex'>Timestamp: {formatDate(issue.timestamp)}</h2>
                    <h2 className='flex'>Issue Nr. {issue.id}</h2>
                    <h2 className='flex'>Duration: {issue.duration}</h2>
                    <h2 className='flex'>End time: {formatDate(issue.endTime)}</h2>
                    <h2 className='flex'>Last updated: {formatDate(issue.lastUpdated)}</h2>

                </div>

                <div className='bg-white border-black border rounded-lg shadow-xl min-h-[50px] col-span-3 flex justify-center items-center' >
                    <p>Incident type: <span className='bg-gray-200 border border-gray-500 rounded p-2'>{issue.incidentType}</span></p>
                </div>


                <div className='bg-white border-black border rounded-lg shadow-xl min-h-[50px] col-span-3 flex justify-center items-center' >
                    <p>Priority: {issue.priority}/10</p>
                </div>


                <div className='bg-white border-black border rounded-lg shadow-xl min-h-[50px] col-span-3 row-span-2'>
                    <p className='p-2'>Impact</p>
                    <br></br>
                    <p> {issue.impact}</p>
                </div>


                <div className='bg-white border-black border rounded-lg shadow-xl min-h-[50px] col-span-3 row-span-2'>
                    <p className='p-2'>Affected Systems</p>
                    <br></br>
                    <p> {issue.affectedSystems}</p>
                </div>

                <div className='bg-white border-black border rounded-lg shadow-xl min-h-[50px] col-span-3 row-span-2'>
                    <p className='p-2'>Preventative Measures</p>
                    <br></br>
                    <p> {issue.preventativeMeasures}</p>
                </div>

                <div className='bg-white border-black border rounded-lg shadow-xl min-h-[50px] col-span-3 row-span-2'>
                    <p className='p-2'>Description</p>
                    <br></br>
                    <p> {issue.description}</p>
                </div>


                <TabComponent />
            </div>
        </div >
    );
};

export default IssueView;
