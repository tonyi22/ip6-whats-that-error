'use client'
import React, { useState } from 'react';
import { IoWarningOutline } from "react-icons/io5";
import { PiWarningOctagonBold } from "react-icons/pi";
import { TfiInfoAlt } from "react-icons/tfi";
import { systemMonitoringIssuesArray } from '../page';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { TabComponent } from './TabComponent';
import './detailView.css';
import Link from 'next/link';

function IssueView({ params }: { params: { id: string } }) {

    //helper function to format date
    const formatDate = (date: string | number | Date) => {
        return format(new Date(date), 'dd.MM.yyyy HH:mm:ss', { locale: de });
    };

    //function to show the correct icon depending on the alert type
    const getAlertIcon = (alertType: string) => {
        switch (alertType) {
            case 'Warning':
                return <IoWarningOutline className='text-4xl text-yellow-500 dark:text-yellow-300' />;
            case 'Critical':
                return <PiWarningOctagonBold className='text-4xl text-red-500 dark:text-red-300' />;
            case 'Info':
            default:
                return <TfiInfoAlt className='text-4xl text-blue-500 dark:text-blue-300' />;
        }
    };

    //function to change the color depending on severity
    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'Low':
                return 'bg-green-500 dark:bg-green-700';
            case 'Medium':
                return 'bg-yellow-500 dark:bg-yellow-700';
            case 'High':
                return 'bg-red-500 dark:bg-red-700';
            default:
                return 'bg-gray-500 dark:bg-gray-700';
        }
    };

    const issue = systemMonitoringIssuesArray.find(issue => issue.id === Number(params.id))!;

    return (
        <div className="mx-4 bg-github-tertiary dark:bg-github-dark-background text-black dark:text-github-dark-text">
            <h3 className="p-10 text-5xl font-semibold m-7 flex justify-center items-center">Issue Detailansicht</h3>

            <div className='rounded-lg  grid grid-cols-1 sm:grid-cols-9 grid-rows-1 sm:grid-rows-7 gap-x-10 gap-y-20 p-5 grid-flow-row-dense dark:border-github-primary'>

                <div className='flex min-h-[50px] col-span-1'>
                    <div className='text-xl p-2 bg-github-tertiary dark:bg-github-dark-tertiary rounded-lg shadow-md flex flex-col'>
                        <p className='text-lg'>Titel</p>
                        <p className='text-xl'>{issue.title}</p>
                    </div>
                </div>


                <div className='flex -translate-x-9 min-h-[50px] col-span-1 justify-center items-center'>
                    <div className='p-1 col-span-1 bg-github-secondary dark:bg-github-dark-tertiary rounded-lg shadow-md flex justify-center items-center'>
                        {getAlertIcon(issue.alertType)}
                    </div>
                </div>

                <div className="flex -translate-x-9 min-h-[50px] justify-center col-span-1 items-center ">
                    <div className='p-2 bg-github-secondary dark:bg-github-dark-tertiary rounded-lg shadow-md min-h-[50px] flex justify-center items-center'>
                        <p>open</p>
                    </div>
                </div>

                <div className='whitespace-nowrap flex justify-center col-span-3 items-center max-w-l'>
                    <div className='p-2 bg-github-secondary dark:bg-github-dark-tertiary  rounded-lg shadow-md min-h-[50px] flex justify-center items-center'>
                        <p>Severity: <span className={`${getSeverityColor(issue.severity)} rounded-xl p-2`}>{issue.severity}</span></p>
                    </div>
                </div>

                <div className='bg-github-secondary dark:bg-github-dark-tertiary  rounded-lg shadow-md min-h-[50px] col-span-3 row-span-4 p-1'>
                    <p className='font-bold flex justify-center items-center'>Info</p>
                    <h2 className='flex'>- Creator: {issue.creator}</h2>
                    <h2 className='flex'>- Timestamp: {formatDate(issue.timestamp)}</h2>
                    <h2 className='flex'>- Issue Nr. {issue.id}</h2>
                    <h2 className='flex'>- Duration: {issue.duration}</h2>
                    <h2 className='flex'>- End time: {formatDate(issue.endTime)}</h2>
                    <h2 className='flex'>- Last updated: {formatDate(issue.lastUpdated)}</h2>
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
                    <p className='p-2 font-bold'>Affected Systems</p>
                    <div className="space-y-1">
                        {issue.affectedSystems.map((system, index) => (
                            <p className='p-1' key={index}> - {system}</p>
                        ))}
                    </div>
                </div>

                <div className='bg-github-secondary dark:bg-github-dark-tertiary  rounded-lg shadow-md min-h-[50px] col-span-3 row-span-2'>
                    <p className='p-2 font-bold'>Preventative Measures</p>
                    <p className='p-1'> - {issue.preventativeMeasures}</p>
                </div>

                <div className='bg-github-secondary dark:bg-github-dark-tertiary  rounded-lg shadow-md min-h-[50px] col-span-3 row-span-2'>
                    <p className='p-2 font-bold'>Description</p>
                    <p className='p-1'> - {issue.description}</p>
                </div>

                <TabComponent />

                <div className='col-span-9'>
                    <div className='flex justify-end'>
                        <Link href={`/Issues/${issue.id}/feedback`}>
                            <button className='bg-github-primary dark:bg-github-dark-primary text-white p-2 rounded-lg shadow-md'>Close and Feedback</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default IssueView;
