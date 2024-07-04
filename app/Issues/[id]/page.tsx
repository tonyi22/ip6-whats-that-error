'use client'
import React, { useEffect, useState, useRef } from 'react';
import { IoArrowBackOutline } from "react-icons/io5";


import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { FaCaretDown, FaCheck } from 'react-icons/fa';
import { TabComponent } from './TabComponent';
import './detailView.css';
import Link from 'next/link';
import { compareSort, getAlertIcon, getSeverityColor, validateType, formatDate } from '@/app/helperFunction';
import { SystemMonitoringIssue } from '@/app/data/data';

const loadIssuesFromLocalStorage = (): SystemMonitoringIssue[] => {
    const storedIssues = localStorage.getItem('issues');
    if (storedIssues) {
        return JSON.parse(storedIssues);
    }
    return [];
};

const saveIssuesToLocalStorage = (issues: SystemMonitoringIssue[]) => {
    localStorage.setItem('issues', JSON.stringify(issues));
};

const systemsList = [
    'WebServer-01', 'DatabaseServer-01', 'StorageSystem-01', 'NetworkSwitch-01', 'LoadBalancer-01',
    'BackupServer-01', 'MonitoringSystem-01', 'AuthenticationServer-01', 'APIGateway-01', 'Firewall-01',
    'VirtualizationServer-01', 'DNSServer-01', 'EmailServer-01', 'ApplicationServer-01', 'ERPSystem-01',
    'CRMSystem-01', 'FileServer-01', 'ProxyServer-01', 'DevelopmentServer-01', 'TestServer-01'
];

function IssueView({ params }: { params: { id: string } }) {
    const alertTypes = ['Critical', 'Warning', 'Info', 'None']; // Define your alert types here
    const severityTypes = ['Low', 'Medium', 'High']; // Define your alert types here
    const statusTypes = ['New', 'Open', 'Closed', 'In Progress']; // Define your alert types here
    const incidentTypes = ['Performance', 'Storage', 'Overheating', 'Backups', 'Power', 'Data Integrity', 'Connection', 'Query', 'Monitoring', 'Network',
        'Authentication', 'Resources', 'Processes', 'Configuration', 'Data Export', 'Documentation', 'Startup', 'Demonstration', 'Communication', 'Data Import', 'Security', 'other'];
    const priorities = Array.from({ length: 10 }, (_, i) => i + 1);

    const [isEditMode, setEditMode] = useState(false);
    const [issue, setIssue] = useState<SystemMonitoringIssue | null>(null);
    const [issueCopy, setIssueCopy] = useState<SystemMonitoringIssue | null>(null);

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);



    const handleAddSystem = (system: string) => {
        setIssue(prev => {
            if (!prev) return prev;
            if (!prev.affectedSystems.includes(system)) {
                return {
                    ...prev,
                    affectedSystems: [...prev.affectedSystems, system]
                };
            }
            return prev;
        });
    };

    const handleSystemChange = (index: number, value: string) => {
        setIssue(prev => {
            if (!prev) return prev;
            const updatedSystems = [...prev.affectedSystems];
            updatedSystems[index] = value;
            return {
                ...prev,
                affectedSystems: updatedSystems
            };
        });
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const issues = loadIssuesFromLocalStorage();
        const foundIssue = issues.find(issue => issue.id === Number(params.id));
        if (foundIssue) {
            setIssue(foundIssue);
        } else {
            console.log(`Issue with ID ${params.id} not found`);
        }
    }, [params.id]);

    const handleRemoveSystem = (index: number) => {
        setIssue(prev => {
            if (!prev) return prev;

            const updatedSystems = prev.affectedSystems.filter((_, i) => i !== index);
            return {
                ...prev,
                affectedSystems: updatedSystems
            };
        });
    };

    const toggleDropdown = () => {
        setDropdownOpen(prev => !prev);
    };

    const handleEdit = () => {
        setIssueCopy(JSON.parse(JSON.stringify(issue))); // Create a deep copy of the issue
        setEditMode(true);
    };

    const handleCancel = () => {
        setIssue(issueCopy!); // Revert to the original issue
        setEditMode(false);
    };

    const handleSave = () => {
        if (issue) {
            const issues = loadIssuesFromLocalStorage();
            const index = issues.findIndex(i => i.id === issue.id);
            if (index !== -1) {
                issues[index] = issue;
                saveIssuesToLocalStorage(issues);
            }
        }
        setEditMode(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setIssue(prev => {
            if (!prev) return prev;

            let newValue: any = value;

            if (name === 'priority') {
                newValue = parseInt(value, 10);
            } else if (name === 'status') {
                newValue = validateType(value, statusTypes, prev.status);
            } else if (name === 'alertType') {
                newValue = validateType(value, alertTypes, prev.alertType);
            } else if (name === 'incidentType') {
                newValue = validateType(value, incidentTypes, prev.incidentType);
            } else if (name === 'severity') {
                newValue = validateType(value, severityTypes, prev.severity);
            }

            return {
                ...prev,
                [name]: newValue,
            };
        });
    };

    if (!issue) {
        return <div className="mx-10 my-10 text-black dark:text-github-dark-text">Issue not found</div>;
    }

    return (
        <div className="mx-10 my-10 bg-github-tertiary dark:bg-github-dark-background text-black dark:text-github-dark-text">

            <div className='flex items-center justify-between'>
                <Link href={`/Issues`}>
                    <button className="bg-github-primary dark:bg-github-dark-primary dark:text-white my-1 flex items-center font-bold text-3xl">
                        <IoArrowBackOutline className="mr-2" />
                    </button>
                </Link>

                {!issue.isInitialGiven && (
                    <Link href={`/Issues/${issue.id}/initial-feedback`}>
                        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>
                            Give Initial Feedback
                        </button>
                    </Link>
                )}

            </div>

            <div className='my-7'>
                {isEditMode ? (
                    <div className='w-1/2   '>
                        <p className='font-bold pb-2'>Title</p>
                        <input
                            maxLength={70}
                            type="text"
                            name="title"
                            value={issue.title}
                            onChange={handleInputChange}
                            className="editable-input "
                        />
                    </div>
                ) : (
                    <h3 className="  text-3xl font-semibold">{issue.title}</h3>
                )}
            </div>

            <div className="flex justify-between items-center mb-5">

                <div >
                    {isEditMode ? (
                        <p>Alert type:
                            <select
                                name="alertType"
                                value={issue.alertType}
                                onChange={handleInputChange}
                                className="input mx-2 border border-grey-800"
                            >
                                {alertTypes.map(type => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </p>
                    ) : (
                        getAlertIcon(issue.alertType)
                    )}

                </div>

                <div>
                    <p>Severity:
                        {isEditMode ? (
                            <select
                                name="severity"
                                value={issue.severity}
                                onChange={handleInputChange
                                }
                                className="input mx-2 border border-grey-800"
                            >
                                {severityTypes.map(type => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>

                        ) : (
                            <span className={`${getSeverityColor(issue.severity)} rounded-xl p-2 m-2`}>
                                {issue.severity}</span>
                        )}
                    </p>
                </div>

                <div>
                    <p>Status:
                        <select
                            name="status"
                            value={issue.status}
                            onChange={handleInputChange}
                            className="input mx-2 border border-grey-800"
                        >
                            {statusTypes.map(type => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </p>
                </div>


                <div>
                    <p>Incident type:
                        {isEditMode ? (
                            <select
                                name="incidentType"
                                value={issue.incidentType}
                                onChange={handleInputChange}
                                className="input mx-2 border border-grey-800"
                            >
                                {incidentTypes.sort(compareSort).map(type => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>


                        ) : (
                            <span className='bg-gray-200 dark:bg-gray-500 rounded-xl p-2 m-2'>
                                {issue.incidentType}
                            </span>
                        )}
                    </p>
                </div>
                <div>
                    <p>Priority:
                        {isEditMode ? (
                            <select
                                name="priority"
                                value={issue.priority}
                                onChange={handleInputChange
                                }
                                className="input mx-2 border border-grey-800"
                            >
                                {priorities.map(priority => (
                                    <option key={priority} value={priority}>
                                        {priority}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <span className='bg-gray-200 dark:bg-gray-500 rounded-xl p-2 m-2 font-semibold'>
                                {`${issue.priority}/10`}
                            </span>
                        )}
                    </p>
                </div>

            </div>

            <div className="grid grid-cols-3 grid-rows-[auto, 1fr, 1fr, 1fr] gap-4">

                <div className='bg-github-secondary dark:bg-github-dark-tertiary max-w-l rounded-lg shadow-md min-h-[200px] col-span-1 row-span-2 p-4 bg-gradient-to-b from-gray-50 to-white'>
                    <p className='font-bold pb-2'>Description</p>
                    {isEditMode ? (
                        <textarea
                            name="description"
                            value={issue.description}
                            onChange={handleInputChange}
                            className="editable-input"
                        />
                    ) : (
                        <p
                            className="max-h-96 overflow-y-auto"
                            style={{ wordBreak: 'break-word', whiteSpace: 'pre-line', maxHeight: '1050px' }}
                        >
                            {issue.description}
                        </p>
                    )}
                </div>

                <div className='bg-github-secondary dark:bg-github-dark-tertiary max-w-l rounded-lg shadow-md min-h-[200px] col-span-1 row-span-1 p-4 bg-gradient-to-b from-gray-50 to-white '>
                    <p className='font-bold pb-2'>Affected Systems</p>
                    <div className="space-y-1">
                        {isEditMode ? (
                            <>
                                <div className="relative" ref={dropdownRef}>
                                    <div
                                        className="input cursor-pointer"
                                        onClick={toggleDropdown}
                                    >
                                        Wähle die Systeme aus
                                        <FaCaretDown className="absolute top-3 right-3 pointer-events-none" />
                                    </div>
                                    {dropdownOpen && (
                                        <div className="absolute bg-white border border-gray-300 rounded-lg mt-1 w-full z-10 max-h-60 overflow-y-auto">
                                            {systemsList.map(system => (
                                                <div
                                                    key={system}
                                                    className="cursor-pointer px-4 py-2 hover:bg-gray-100 flex justify-between items-center"
                                                    onClick={() => handleAddSystem(system)}
                                                >
                                                    <span>{system}</span>
                                                    {issue.affectedSystems.includes(system) && <FaCheck className="text-blue-500" />}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="mt-2">
                                    {issue.affectedSystems.map((system, index) => (
                                        <div key={index} className="flex items-center mb-2">
                                            <span className="flex-grow">{system}</span>
                                            <button type="button" onClick={() => handleRemoveSystem(index)} className="ml-2 text-red-500">Remove</button>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            issue.affectedSystems.length > 0 ? (
                                issue.affectedSystems.map((system, index) => (
                                    <p key={index} style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}> - {system}</p>
                                ))
                            ) : (
                                <p>No affected systems</p> // Or leave it empty if you prefer
                            )
                        )}
                    </div>
                </div>

                <div className='bg-github-secondary dark:bg-github-dark-tertiary rounded-lg shadow-md min-h-[150px] col-span-1 row-span-1 p-4 bg-gradient-to-b from-gray-50 to-white'>
                    <p className='font-bold pb-2'>Info</p>
                    <div className='grid grid-cols-2 gap-2'>
                        <p className='text-gray-600 dark:text-gray-400'>Creator:</p>
                        <p className='text-right'>{issue.creator}</p>



                        <p className='text-gray-600 dark:text-gray-400'>Issue Nr.:</p>
                        <p className='text-right'>{issue.id}</p>

                        <p className='text-gray-600 dark:text-gray-400'>Duration:</p>
                        <p className='text-right'>{issue.duration} h</p>

                        <p className='text-gray-600 dark:text-gray-400'>Timestamp:</p>
                        <p className='text-right'>{formatDate(issue.timestamp)}</p>

                        <p className='text-gray-600 dark:text-gray-400'>Last updated:</p>
                        <p className='text-right'>{formatDate(issue.lastUpdated)}</p>

                        <p className='text-gray-600 dark:text-gray-400'>End time:</p>
                        {/* <p className='text-right'>{formatDate(issue.endTime)}</p> */}
                        <p className='text-right'>--:--</p>



                    </div>
                </div>

                <div className='bg-github-secondary dark:bg-github-dark-tertiary max-w-l rounded-lg shadow-md min-h-[200px] col-span-1 row-span-1 p-4 bg-gradient-to-b from-gray-50 to-white'>
                    <p className='p-2 font-bold'>Impact</p>
                    {isEditMode ? (
                        <textarea
                            name="impact"
                            value={issue.impact}
                            onChange={handleInputChange}
                            className="editable-input"

                        />
                    ) : (
                        <p className='p-2' style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>{issue.impact}</p>
                    )}
                </div>

                <div className='bg-github-secondary dark:bg-github-dark-tertiary max-w-l rounded-lg shadow-md min-h-[200px] col-span-1 row-span-1 p-4 bg-gradient-to-b from-gray-50 to-white'>
                    <p className='p-2 font-bold'>Preventative Measures</p>
                    {isEditMode ? (
                        <textarea
                            name="preventativeMeasures"
                            value={issue.preventativeMeasures}
                            onChange={handleInputChange}
                            className="editable-input"
                        />
                    ) : (
                        <p className='p-1' style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}> - {issue.preventativeMeasures}</p>
                    )}
                </div>

                <TabComponent />

                <div className='col-start-3 col-span-1'>
                    <div className='flex justify-end space-x-4'>
                        {isEditMode ? (
                            <div className='space-x-4'>
                                <button onClick={handleCancel} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Cancel</button>
                                <button onClick={handleSave} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Save</button>

                            </div>
                        ) : (
                            <div className="flex justify-end space-x-4">
                                <button onClick={handleEdit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Edit</button>
                                <Link href={`/Issues/${issue.id}/feedback`}>
                                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Close and Feedback</button>
                                </Link>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div >
    );
}

export default IssueView;
