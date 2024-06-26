"use client";

import issues from '../data/issues.json' assert { type: 'json' };
import styles from '../issues.module.css'

import { FaGreaterThan, FaLessThan } from "react-icons/fa";
import { SystemMonitoringIssue } from '../data/data';
import { SlOptionsVertical } from "react-icons/sl";
import { MdOutlineFiberNew } from "react-icons/md";
import { TfiInfoAlt } from 'react-icons/tfi';
import { de, id } from 'date-fns/locale';
import { format } from 'date-fns';
import { useState } from 'react';
import Link from 'next/link';
import { getAlertIcon, getAlertIconBig, validateType } from '../helperFunction';
import { useRouter } from 'next/navigation';
import Example from './dropDownMenu';


export const systemMonitoringIssuesArray: SystemMonitoringIssue[] = issues.map(issue => {
    return {
        ...issue,
        status: validateType(issue.status, ['New', 'Open', 'Closed', 'In Progress'], "Open"),
        alertType: validateType(issue.alertType, ['Warning', 'Info', 'Critical'], "Warning"),
        incidentType: validateType(issue.incidentType, ['Performance', 'Storage', 'Overheating', 'Backups', 'Power'], "Performance"),
        severity: validateType(issue.severity, ['Low', 'Medium', 'High'], "Low"),
        timestamp: new Date(issue.timestamp),
        endTime: new Date(issue.endTime),
        lastUpdated: new Date(issue.lastUpdated),
    };
});



const formatDate = (date: string | number | Date) => {
    return format(new Date(date), 'HH:mm dd.MM.yyyy ', { locale: de });
};

/*

function IssueCard({ issue }: { issue: SystemMonitoringIssue }) {
    return (

        <div className="flex flex-wrap justify-between items-center p-6 bg-[#fcf4ff] m-1 border-b w-full rounded-xl shadow-lg hover:bg-[#f2ebf5]">
            {getAlertIcon(issue.alertType)}
            <h3 className="mx-4 text-base font-semibold flex-1 min-w-0 break-words">{issue.title}</h3>
            <p className="mx-4 text-sm flex-1 min-w-0" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{issue.description}</p>
            <p className="mx-4 text-sm flex-none" style={{ minWidth: '80px' }}>{issue.priority} / 10</p>
            <p className="mx-4 text-sm flex-none" style={{ minWidth: '160px' }}>{formatDate(issue.timestamp)}</p>
            <Example />

        </div>
    );
}
    */

function CardsHeader() {
    return (
        <thead className="bg-gray-300">
            <tr>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase dark:text-neutral-500 w-20">Alert Type</th>
                <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Title</th>
                <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Description</th>
                <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500 w-20">Priority</th>
                <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500 w-40">Timestamp</th>
                <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500 w-[5rem]">Option</th> {/* Add padding to the right */}
            </tr>
        </thead>
    );
}



function List({ list }: { list: SystemMonitoringIssue[] }) {
    const router = useRouter();

    const handleRowClick = (id: number) => {
        router.push(`/Issues/${id}`);
    };

    return (

        <table className="w-full table-fixed bg-white border border-gray-200">
            <CardsHeader />
            <tbody>
                {list.map(listIssue => (
                    <tr
                        key={listIssue.id}
                        className="bg-[#fcf4ff] border-b last:border-b-0 hover:bg-[#f2ebf5] m-5 shadow-lg rounded-lg my-2 hover:cursor-pointer"
                        onClick={() => handleRowClick(listIssue.id)}
                    >
                        <td className="px-4 py-2 w-40">{getAlertIcon(listIssue.alertType)}</td>
                        <td className="px-4 py-2 text-base font-semibold truncate">{listIssue.title}</td>
                        <td className="px-4 py-2 text-sm truncate">{listIssue.description}</td>
                        <td className="px-6 text-sm">{listIssue.priority}/10</td>
                        <td className=" text-sm ">{formatDate(listIssue.timestamp)}</td>
                        <td className="text-center"><Example
                            id={listIssue.id}
                            initialFeedback={listIssue.isInitialGiven} /></td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

function Card1({ id, heading, description, icon, className = '', priority, timestamp }: { id: number, heading: string, description: string, icon: React.ReactNode, className?: string, priority: number, timestamp: string }) {

    const extractDescription = (desc: string) => {
        const prefix = "Einleitung";
        if (desc.startsWith(prefix)) {
            desc = desc.slice(prefix.length);  // Remove "Einleitung:"
        }
        const firstNewlineIndex = desc.indexOf('\n');
        if (firstNewlineIndex === -1) return ''; // No newline found, return empty string

        const secondNewlineIndex = desc.indexOf('\n', firstNewlineIndex + 1);
        if (secondNewlineIndex === -1) return ''; // No second newline found, return empty string

        return desc.substring(firstNewlineIndex + 1, secondNewlineIndex).trim();
    };

    const truncatedDescription = extractDescription(description);

    return (
        <Link href={`/Issues/${id}`} className={`gap-4 rounded-xl shadow-sm px-6 py-3 shadow-2xl relative bg-[#fcf4ff] ${className} w-1/3 h-60`}>
            <div className="flex flex-col justify-between h-full space-y-2 flex-grow">
                <MdOutlineFiberNew className="text-red-500 absolute top-0 right-0 text-2xl" style={{ top: '-15px', right: '-15px' }} />
                <div className="space-y-2 flex-grow">
                    <div className="flex justify-between items-center">
                        <h3 className="text-[20px] font-semibold line-clamp-2 overflow-hidden overflow-ellipsis">{heading}</h3>
                        <div className="min-w-max">{icon}</div>
                    </div>
                    <p className="leading-8 font-normal break-words overflow-hidden line-clamp-2">{truncatedDescription}</p>
                </div>
                <div className='flex justify-between mt-auto'>
                    <p>Priority: {priority}/10</p>
                    <p>{timestamp}</p>
                </div>
            </div>

        </Link>
    );
}

export default function IssuesPage() {
    const [openIssues, setOpenIssues] = useState<SystemMonitoringIssue[]>(systemMonitoringIssuesArray.filter(issue => issue.status !== "New").
        sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) // Sorting by most recent
    );
    const [currentIndex, setCurrentIndex] = useState(0);
    const [issues, setIssues] = useState<SystemMonitoringIssue[]>(
        systemMonitoringIssuesArray.filter(issue => issue.status === "New").
            sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) // Sorting by most recent
    );
    const [currentId, setCurrentId] = useState(issues.length > 0 ? issues[currentIndex].id : -1)


    const handleRowClick = (id: number) => {
        router.push(`/Issues/${id}`);
    };
    const handleNext = () => {
        const nextIndex = (currentIndex + 1) % issues.length;
        setCurrentId(issues[nextIndex].id)
        setCurrentIndex(nextIndex);
    };

    const handlePrevious = () => {
        const prevIndex = (currentIndex - 1 + issues.length) % issues.length;
        setCurrentId(issues[prevIndex].id)
        setCurrentIndex(prevIndex);
    };

    const router = useRouter();

    const newIssuePage = () => {
        router.push('/Issues/new')
    }

    const handleDismiss = () => {

        const updateIssues = issues.map(issue => {
            if (issue.id === currentId) {
                const newIssue = { ...issue, status: "Open" as 'Open' };
                setOpenIssues(prev => [...prev, newIssue].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
                return newIssue;
            }
            return issue;
        });

        const newFilteredIssues = updateIssues.filter(issue => issue.status === "New");

        // Sorting open issues
        setIssues(newFilteredIssues);

        if (newFilteredIssues.length > 0) {
            setCurrentIndex(0);
            setCurrentId(newFilteredIssues[0].id);
        } else {
            setCurrentIndex(-1);  // No items left
            setCurrentId(-1);  // No current ID
        }
    };

    return (
        <div className={styles.app}>
            {currentIndex !== -1 &&
                <div className="flex flex-col items-center space-y-4 w-full">
                    <Card1
                        id={issues[currentIndex].id}
                        className={issues.length > 1 ? styles.mainIssue : ''}
                        heading={issues[currentIndex].title}
                        description={issues[currentIndex].description}
                        icon={getAlertIconBig(issues[currentIndex].alertType)}
                        priority={issues[currentIndex].priority}
                        timestamp={formatDate(issues[currentIndex].timestamp)}
                    />
                    <div className="flex justify-between items-center w-full max-w-lg p-10">
                        <button
                            className={`p-2 text-xl bg-gray-200 rounded-full hover:bg-gray-300 ${issues.length > 1 ? '' : 'invisible'}`}
                            onClick={handlePrevious}>
                            <FaLessThan />
                        </button>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            onClick={handleDismiss}>
                            Dismiss
                        </button>
                        <button
                            className={`p-2 text-xl bg-gray-200 rounded-full hover:bg-gray-300 ${issues.length > 1 ? '' : 'invisible'}`}
                            onClick={handleNext}>
                            <FaGreaterThan />
                        </button>
                    </div>
                </div>
            }
            <h3 className="text-5xl font-semibold mb-7">Issues</h3>

            <div className='w-5/6'>
                <div className="flex justify-end mb-4">
                    <button
                        className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-blue-600"
                        onClick={newIssuePage}>
                        New Issue
                    </button>
                </div>
                <List list={openIssues} />
            </div>
        </div>
    )
}