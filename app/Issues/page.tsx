"use client";

import { ReactNode, useState } from 'react';
import issues from '../data/issues.json' assert { type: 'json' };;
import styles from '../issues.module.css'
import {
    IoWarningOutline
} from "react-icons/io5";
import {
    FaGreaterThan,
    FaLessThan
} from "react-icons/fa";

function validateType<T>(value: any, validValues: T[], defaultValue: T): T {
    return validValues.includes(value) ? value : defaultValue;
}

const systemMonitoringIssuesArray: SystemMonitoringIssue[] = issues.map(issue => {

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

/*
function List({ list }: { list: SystemMonitoringIssue[] }) {
    return (
        <div className={styles.issueList}>

            {list.slice(1).map(issue => (
                <div key={issue.id} className={styles.issueCard}>
                    <h2>{issue.title}</h2>
                    <p>{issue.description}</p>
                </div>
            ))}
        </div>
    )
}*/

function IssueCard({ issue }: { issue: SystemMonitoringIssue }) {
    return (
        <div className="flex flex-col gap-2 rounded-xl shadow-lg p-6 bg-white">
            <div className="flex items-center gap-4">
                <div className="shrink-0"> <IoWarningOutline /></div>
                <div>
                    <h3 className="text-xl font-semibold">{issue.title}</h3>
                    <p className="text-sm text-gray-500">{issue.description}</p>
                </div>
            </div>
            <div className="mt-4">
                <p><strong>Impact:</strong> {issue.impact}</p>
                <p><strong>Affected Systems:</strong> {issue.affectedSystems.join(', ')}</p>
                <p><strong>Alert Type:</strong> {issue.alertType}</p>
                <p><strong>Incident Type:</strong> {issue.incidentType}</p>
                <p><strong>Priority:</strong> {issue.priority}</p>
                <p><strong>Severity:</strong> {issue.severity}</p>
                <p><strong>Last Updated:</strong> {issue.lastUpdated.toLocaleString()}</p>
                <p><strong>Preventative Measures:</strong> {issue.preventativeMeasures}</p>
            </div>
        </div>
    );
}
function List({ list }: { list: SystemMonitoringIssue[] }) {
    return (
        <div className="grid gap-6 grid-cols-3">
            {list.map(listIssue => (
                <IssueCard issue={listIssue} />
            ))}
        </div>
    );
}

function Card1({ heading, description, icon, className = '' }: { heading: string, description: string, icon: ReactNode, className?: string }) {
    return (
        <div className={`flex gap-4 rounded-xl shadow-sm p-6 shadow-2xl ${className}`}>
            <div className="min-w-max">{icon}</div>
            <div className="space-y-2">
                <h3 className="text-[22px] font-semibold">{heading}</h3>
                <p className="leading-8 text-gray-500 font-normal">{description}</p>
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
                        className={`bg-[#fcf4ff] w-full max-w-lg shadow-lg ${issues.length > 1 ? styles.mainIssue : ''}`}
                        heading={issues[currentIndex].title}
                        description={issues[currentIndex].description}
                        icon={<IoWarningOutline size="2.5rem" className="text-[#D566FF]" />}
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
            <h3 className="text-5xl font-semibold text-left m-7">Issues</h3>
            <List list={openIssues} />
        </div>
    )
}