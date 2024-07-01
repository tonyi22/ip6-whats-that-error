"use client";

import styles from '../issues.module.css'

import { FaGreaterThan, FaLessThan } from "react-icons/fa";
import { SystemMonitoringIssue } from '../data/data';
import { MdOutlineFiberNew } from "react-icons/md";
import { de } from 'date-fns/locale';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAlertIcon, getAlertIconBig, validateType } from '../helperFunction';
import { useRouter } from 'next/navigation';
import Example from './dropDownMenu';
import issuesJson from '../data/issues.json' assert { type: 'json' };

const formatDate = (date: string | number | Date) => {
    return format(new Date(date), 'HH:mm dd.MM.yyyy ', { locale: de });
};

const loadIssues = (): SystemMonitoringIssue[] => {
    const storedIssues = localStorage.getItem('issues'); // Correct key
    if (storedIssues) {
        return JSON.parse(storedIssues);
    } else {
        const issues: SystemMonitoringIssue[] = issuesJson.map(issue => {
            return {
                ...issue,
                status: validateType(issue.status, ['New', 'Open', 'Closed', 'In Progress'], "Open"),
                alertType: validateType(issue.alertType, ['Warning', 'Info', 'Critical'], "Warning"),
                incidentType: validateType(issue.incidentType, ['Performance', 'Storage', 'Overheating', 'Backups', 'Power', 'Data Integrity', 'Connection', 'Query', 'Monitoring', 'Network',
                    'Authentication', 'Resources', 'Processes', 'Configuration', 'Data Export', 'Documentation', 'Startup', 'Demonstration', 'Communication', 'Data Import', 'Security'], "Performance"),
                severity: validateType(issue.severity, ['Low', 'Medium', 'High'], "Low"),
                timestamp: new Date(issue.timestamp),
                endTime: new Date(issue.endTime),
                lastUpdated: new Date(issue.lastUpdated),
            };
        });
        localStorage.setItem('issues', JSON.stringify(issues));
        return issues;
    }
};

const saveIssues = (issues: SystemMonitoringIssue[]) => {
    localStorage.setItem('issues', JSON.stringify(issues)); // Correct key
}

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
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(true);
    const [openIssues, setOpenIssues] = useState<SystemMonitoringIssue[]>([]);
    const [newIssues, setNewIssues] = useState<SystemMonitoringIssue[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentId, setCurrentId] = useState<number | null>(null);

    const handleNext = () => {
        const nextIndex = (currentIndex + 1) % newIssues.length;
        setCurrentId(newIssues[nextIndex].id)
        setCurrentIndex(nextIndex);
    };

    useEffect(() => {
        const loadedIssues = loadIssues();
        console.log("Loaded issues:", loadedIssues);
        setOpenIssues(loadedIssues.filter(issue => issue.status !== "New").sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
        setNewIssues(loadedIssues.filter(issue => issue.status === "New").sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
        setIsLoading(false);
    }, []); // Run only once on mount

    useEffect(() => {
        if (newIssues.length > 0) {
            setCurrentId(newIssues[0].id);
        }
    }, [newIssues]);

    const handlePrevious = () => {
        const prevIndex = (currentIndex - 1 + newIssues.length) % newIssues.length;
        setCurrentId(newIssues[prevIndex].id)
        setCurrentIndex(prevIndex);
    };

    const newIssuePage = () => {
        router.push('/Issues/new')
    }

    const handleDismiss = () => {
        if (newIssues.length > 0) {
            const updatedNewIssues = newIssues.filter(issue => issue.id !== currentId);
            const dismissedIssue = newIssues.find(issue => issue.id === currentId);

            if (dismissedIssue) {
                // Update both openIssues and newIssues before saving
                const newOpenIssue = { ...dismissedIssue, status: "Open" as 'Open' };
                setOpenIssues(prevOpenIssues => [...prevOpenIssues, newOpenIssue].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
                setNewIssues(updatedNewIssues);
                saveIssues([...updatedNewIssues, ...openIssues, newOpenIssue]); // Save updated issues to localStorage
            }

            if (updatedNewIssues.length > 0) {
                setCurrentIndex(0);
                setCurrentId(updatedNewIssues[0].id);
            } else {
                setCurrentIndex(-1);
                setCurrentId(null); // Use null instead of -1
            }
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.app}>
            {newIssues.length > 0 && currentId !== null &&
                <div className="flex flex-col items-center space-y-4 w-full">
                    <Card1
                        id={newIssues[currentIndex].id}
                        className={newIssues.length > 1 ? styles.mainIssue : ''}
                        heading={newIssues[currentIndex].title}
                        description={newIssues[currentIndex].description}
                        icon={getAlertIconBig(newIssues[currentIndex].alertType)}
                        priority={newIssues[currentIndex].priority}
                        timestamp={formatDate(newIssues[currentIndex].timestamp)}
                    />
                    <div className="flex justify-between items-center w-full max-w-lg p-10">
                        <button
                            className={`p-2 text-xl bg-gray-200 rounded-full hover:bg-gray-300 ${newIssues.length > 1 ? '' : 'invisible'}`}
                            onClick={handlePrevious}>
                            <FaLessThan />
                        </button>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            onClick={handleDismiss}>
                            Dismiss
                        </button>
                        <button
                            className={`p-2 text-xl bg-gray-200 rounded-full hover:bg-gray-300 ${newIssues.length > 1 ? '' : 'invisible'}`}
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
