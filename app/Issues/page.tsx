"use client";

import issues from '../data/issues.json' assert { type: 'json' };
import styles from '../issues.module.css'

import { FaGreaterThan, FaLessThan } from "react-icons/fa";
import { SystemMonitoringIssue } from '../data/data';
import { SlOptionsVertical } from "react-icons/sl";
import { MdOutlineFiberNew } from "react-icons/md";
import { TfiInfoAlt } from 'react-icons/tfi';
import { de } from 'date-fns/locale';
import { format } from 'date-fns';
import { useState } from 'react';
import Link from 'next/link';
import { getAlertIcon, getAlertIconBig, validateType } from '../helperFunction';


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
    return format(new Date(date), 'dd.MM.yyyy HH:mm:ss', { locale: de });
};

function IssueCard({ issue }: { issue: SystemMonitoringIssue }) {
    return (
        <div className="flex flex-wrap justify-between items-center p-6 bg-[#fcf4ff] m-1 border-b w-full rounded-xl shadow-lg hover:bg-[#f2ebf5]">
            {getAlertIcon(issue.alertType)}
            <h3 className="mx-4 text-base font-semibold flex-1 min-w-0 break-words">{issue.title}</h3>
            <p className="mx-4 text-sm flex-1 min-w-0" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{issue.description}</p>
            <p className="mx-4 text-sm flex-none" style={{ minWidth: '80px' }}>{issue.priority} / 10</p>
            <p className="mx-4 text-sm flex-none" style={{ minWidth: '160px' }}>{formatDate(issue.timestamp)}</p>
            <SlOptionsVertical className="text-gray-500 text-2xl" />
        </div>
    );
}

function CardsHeader() {
    return (
        <div className="flex justify-between items-center p-6 bg-white border-b w-full rounded-t-xl shadow-lg">
            <span className="text-lg font-bold">Alert Type</span>
            <span className="mx-4 text-lg font-semibold flex-none min-w-0">Title</span>
            <span className="text-lg font-bold mx-4 flex-none" style={{ minWidth: '80px' }}>Description</span>
            <span className="text-lg font-bold mx-4 flex-none" style={{ minWidth: '80px' }}>Priority</span>
            <span className="text-lg font-bold mx-4 flex-none" style={{ minWidth: '160px' }}>Timestamp</span>
            <span className="text-lg font-bold">Options</span>
        </div>
    );
}

function List({ list }: { list: SystemMonitoringIssue[] }) {
    return (
        <div className="flex flex-col w-5/6 gap-4">
            <CardsHeader />
            <div className="space-y-4">
                {list.map(listIssue => (
                    <Link key={listIssue.id} href={`/Issues/${listIssue.id}`}>
                        <IssueCard issue={listIssue} />
                    </Link>
                ))}
            </div>
        </div >
    );
}

function Card1({ heading, description, icon, className = '', priority, timestamp }: { heading: string, description: string, icon: React.ReactNode, className?: string, priority: number, timestamp: string }) {

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
        <div className={`flex flex-col gap-4 rounded-xl shadow-sm p-6 shadow-2xl relative bg-[#fcf4ff] ${className} w-96`}>
            <MdOutlineFiberNew className="text-red-500 absolute top-0 right-0 text-3xl" style={{ top: '-15px', right: '-15px' }} />
            <div className="flex gap-4">
                <div className="min-w-max">{icon}</div>
                <div className="space-y-2 flex-grow">
                    <h3 className="text-[26px] font-semibold">{heading}</h3>
                    <p className="leading-8 text-gray-500 font-normal break-words overflow-hidden">{truncatedDescription}</p>
                    <p className="text-gray-600">Priority: {priority}</p>  {/* New */}
                    <p className="text-gray-600">Timestamp: {timestamp}</p>  {/* New */}
                </div>
            </div>
        </div>
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
                <div className="flex flex-col items-center space-y-4">
                    <Card1
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

            <List list={openIssues} />
        </div>
    )
}