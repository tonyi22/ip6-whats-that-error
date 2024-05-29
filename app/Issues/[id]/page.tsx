'use client'
import React, { useState } from 'react';

import { systemMonitoringIssuesArray } from '../page';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { TabComponent } from './TabComponent';
import './detailView.css';
import Link from 'next/link';
import { getAlertIcon, getSeverityColor } from '@/app/helperFunction';

function IssueView({ params }: { params: { id: string } }) {

    //helper function to format date
    const formatDate = (date: string | number | Date) => {
        return format(new Date(date), 'dd.MM.yyyy HH:mm:ss', { locale: de });
    };



    //function to change the color depending on severity


    const issue = systemMonitoringIssuesArray.find(issue => issue.id === Number(params.id))!;

    return (
        <div className="mx-10 my-10 bg-github-tertiary dark:bg-github-dark-background text-black dark:text-github-dark-text">
            <h3 className="p-10 text-5xl font-semibold m-7 flex justify-center items-center">Issue Detailansicht</h3>

            <div className="grid grid-cols-3 grid-rows-[auto, 1fr, 1fr, 1fr] gap-4">
                <div className="flex flex-col justify-center flex-none">
                    <div className="flex justify-around items-center flex-none p">
                        <div className="flex-none max-w-xs break-words">
                            <h3 className="text-xl font-semibold">{issue.title}</h3>
                        </div>
                        <div className="flex-none">
                            {getAlertIcon(issue.alertType)}
                        </div>
                    </div>
                </div>


                <div className="flex flex-col justify-around flex-none">
                    <div className="flex justify-between items-center p-4 flex-none">
                        <div className="flex-none">
                            <p>Severity: <span className={`${getSeverityColor(issue.severity)} rounded-xl p-2`}>{issue.severity}</span></p>
                        </div>
                        <div className="flex-none">
                            <p>Status: <span className='bg-gray-200 dark:bg-gray-500  rounded-xl p-2'>{issue.status}</span></p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-around flex-none">
                    <div className="flex justify-between items-center p-4 flex-none">
                        <div className="flex-none">
                            <p>Incident type: <span className='bg-gray-200 dark:bg-gray-500  rounded-xl p-2'>{issue.incidentType}</span></p>
                        </div>
                        <div className="flex-none">
                            <p>Priority: <span className='bg-gray-200 dark:bg-gray-500  rounded-xl p-2'>{issue.priority}/10</span></p>
                        </div>
                    </div>
                </div>





                <div className='bg-github-secondary dark:bg-github-dark-tertiary max-w-l rounded-lg shadow-md min-h-[200px] col-span-1 row-span-1 p-4'>
                    <p className='font-bold pb-2'>Description</p>
                    <p style={{ wordBreak: 'break-word', whiteSpace: 'pre-line' }}>{issue.description}</p>
                </div>


                <div className='bg-github-secondary dark:bg-github-dark-tertiary max-w-l rounded-lg shadow-md min-h-[200px] col-span-1 row-span-1 p-4'>
                    <p className='font-bold pb-2'>Affected Systems</p>
                    <div className="space-y-1">
                        {issue.affectedSystems.map((system, index) => (
                            <p key={index}> - {system}</p>
                        ))}
                    </div>
                </div>

                <div className='bg-github-secondary dark:bg-github-dark-tertiary rounded-lg shadow-md min-h-[150px] col-span-1 row-span-2 p-4'>
                    <p className='font-bold pb-2 ' >Info</p>
                    <div className='grid grid-cols-2 gap-2'>
                        <p className='text-gray-600 dark:text-gray-400'>Creator:</p>
                        <p className='text-right'>{issue.creator}</p>

                        <p className='text-gray-600 dark:text-gray-400'>Timestamp:</p>
                        <p className='text-right'>{formatDate(issue.timestamp)}</p>

                        <p className='text-gray-600 dark:text-gray-400'>Issue Nr.:</p>
                        <p className='text-right'>{issue.id}</p>

                        <p className='text-gray-600 dark:text-gray-400'>Duration:</p>
                        <p className='text-right'>{issue.duration}</p>

                        <p className='text-gray-600 dark:text-gray-400'>End time:</p>
                        <p className='text-right'>{formatDate(issue.endTime)}</p>

                        <p className='text-gray-600 dark:text-gray-400'>Last updated:</p>
                        <p className='text-right'>{formatDate(issue.lastUpdated)}</p>
                    </div>
                </div>




                <div className='bg-github-secondary dark:bg-github-dark-tertiary max-w-l rounded-lg shadow-md min-h-[200px] col-span-1 row-span-1 p-4'>
                    <p className='p-2 font-bold'>Impact</p>
                    <p className='p-1'> - {issue.impact}</p>
                </div>



                <div className='bg-github-secondary dark:bg-github-dark-tertiary max-w-l rounded-lg shadow-md min-h-[200px] col-span-1 row-span-1 p-4'>
                    <p className='p-2 font-bold'>Preventative Measures</p>
                    <p className='p-1'> - {issue.preventativeMeasures}</p>
                </div>

                <TabComponent />

                <div className='col-start-3 col-span-1'>
                    <div className='flex justify-end'>
                        <Link href={`/Issues/${issue.id}/feedback`}>
                            <button className='bg-github-primary dark:bg-github-dark-primary text-white p-2 rounded-lg shadow-md'>Close and Feedback</button>
                        </Link>
                    </div>
                </div>


            </div>

            {/* 

            <div className='rounded-lg  grid grid-cols-3 sm:grid-cols-9 grid-rows-3 sm:grid-rows-7 gap-x-10 gap-y-20 p-5 grid-flow-row-dense dark:border-github-primary'>

                <div className='flex min-h-[50px]'>
                    <div className='p-2 bg-github-tertiary dark:bg-github-dark-tertiary rounded-lg shadow-md'>
                        <p>Titel</p>
                        <p>{issue.title}</p>
                    </div>
                </div>


                <div className='flex -translate-x-9 min-h-[50px] col-span-1 justify-center items-center'>
                    <div className='p-1 col-span-1 bg-github-secondary dark:bg-github-dark-tertiary rounded-lg shadow-md flex justify-center items-center'>
                        {getAlertIcon(issue.alertType)}
                    </div>
                </div>

                <div className="flex -translate-x-9 min-h-[50px] justify-center col-span-1 items-center ">
                    <div className='p-2 bg-github-secondary dark:bg-github-dark-tertiary rounded-lg shadow-md min-h-[50px] flex justify-center items-center'>
                        <p>{issue.status}</p>
                    </div>
                </div>

                <div className='whitespace-nowrap flex justify-center col-span-3 items-center max-w-l'>
                    <div className='p-2 bg-github-secondary dark:bg-github-dark-tertiary  rounded-lg shadow-md min-h-[50px] flex justify-center items-center'>
                        <p>Severity: <span className={`${getSeverityColor(issue.severity)} rounded-xl p-2`}>{issue.severity}</span></p>
                    </div>
                </div>

                <div className='bg-github-secondary dark:bg-github-dark-tertiary rounded-lg shadow-md min-h-[450px] col-span-3 row-span-4 p-4'>
                    <p className='font-bold text-center mb-4'>Info</p>
                    <div className='space-y-10'>
                        <p>Creator: {issue.creator}</p>
                        <p>Timestamp: {formatDate(issue.timestamp)}</p>
                        <p>Issue Nr. {issue.id}</p>
                        <p>Duration: {issue.duration}</p>
                        <p>End time: {formatDate(issue.endTime)}</p>
                        <p>Last updated: {formatDate(issue.lastUpdated)}</p>
                    </div>
                </div>

                <div className='flex min-h-[50px] col-span-3'>
                    <div className='p-2 bg-github-secondary dark:bg-github-dark-tertiary rounded-lg shadow-md flex justify-center items-center'>
                        <p>Incident type: <span className='bg-gray-200 dark:bg-gray-500  rounded-xl p-2'>{issue.incidentType}</span></p>
                    </div>
                </div>

                <div className='flex min-h-[50px] col-span-3'>
                    <div className='p-2 bg-github-secondary dark:bg-github-dark-tertiary  rounded-lg shadow-md flex justify-center items-center'>
                        <p>Priority: <span className='bg-gray-200 dark:bg-gray-500  rounded-xl p-2'>{issue.priority}/10</span></p>
                    </div>
                </div>

                <div className='bg-github-secondary dark:bg-github-dark-tertiary rounded-lg shadow-md min-h-[50px] col-span-3 row-span-2'>
                    <p className='p-2 font-bold'>Impact</p>
                    <p className='p-1'> - {issue.impact}</p>
                </div>



                <div className='bg-github-secondary dark:bg-github-dark-tertiary  rounded-lg shadow-md min-h-[50px] col-span-3 row-span-2'>
                    <p className='p-2 font-bold'>Preventative Measures</p>
                    <p className='p-1'> - {issue.preventativeMeasures}</p>
                </div>

                <div className='bg-github-secondary dark:bg-github-dark-tertiary  rounded-lg shadow-md min-h-[50px] col-span-3 row-span-2'>
                    <p className='p-2 font-bold'>Description</p>
                    <p className='p-1'> - {issue.description}</p>
                </div>

                <div>
                    <div className="h-100">&nbsp;</div>

                    <TabComponent />
                </div>


                <div className='col-span-9'>
                    <div className='flex justify-end'>
                        <Link href={`/Issues/${issue.id}/feedback`}>
                            <button className='bg-github-primary dark:bg-github-dark-primary text-white p-2 rounded-lg shadow-md'>Close and Feedback</button>
                        </Link>
                    </div>
                </div>
            </div>*/}
        </div >
    );
}

export default IssueView;
