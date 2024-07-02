'use client'
import React, { useEffect, useState } from 'react';

import { IoArrowBackOutline } from "react-icons/io5";
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { TabComponent } from './TabComponent';
import './detailView.css';
import Link from 'next/link';
import { getAlertIcon, getSeverityColor, validateType } from '@/app/helperFunction';
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

function IssueView({ params }: { params: { id: string } }) {
    const alertTypes = ['Critical', 'Warning', 'Info', 'None']; // Define your alert types here
    const severityTypes = ['Low', 'Medium', 'High']; // Define your alert types here
    const statusTypes = ['New', 'Open', 'Closed', 'In Progress']; // Define your alert types here
    const incidentTypes = ['Performance', 'Storage', 'Overheating', 'Backups', 'Power', 'Data Integrity', 'Connection', 'Query', 'Monitoring', 'Network',
        'Authentication', 'Resources', 'Processes', 'Configuration', 'Data Export', 'Documentation', 'Startup', 'Demonstration', 'Communication', 'Data Import', 'Security'];
    const priorities = Array.from({ length: 10 }, (_, i) => i + 1);

    const [isEditMode, setEditMode] = useState(false);
    const [issue, setIssue] = useState<SystemMonitoringIssue | null>(null);
    const [issueCopy, setIssueCopy] = useState<SystemMonitoringIssue | null>(null);


    //helper function to format date
    const formatDate = (date: string | number | Date) => {
        return format(new Date(date), 'dd.MM.yyyy HH:mm:ss', { locale: de });
    };

    const handleAddSystem = () => {
        setIssue(prev => {
            if (!prev) return prev;

            return {
                ...prev,
                affectedSystems: [...prev.affectedSystems, '']
            };
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


        console.log(e.target);

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

            <div className='my-2'>
                {isEditMode ? (
                    <div>
                        <p className='font-bold pb-2'>Title</p>
                        <input
                            type="text"
                            name="title"
                            value={issue.title}
                            onChange={handleInputChange}
                            className="editable-input"
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
                                className="input mx-2"
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
                                className="input mx-2"
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
                        {isEditMode ? (
                            <select
                                name="status"
                                value={issue.status}
                                onChange={handleInputChange
                                }
                                className="input mx-2"
                            >
                                {statusTypes.map(type => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <span className='bg-gray-200 dark:bg-gray-500 rounded-xl p-2 m-2'>
                                {issue.status}
                            </span>
                        )}
                    </p>
                </div>

                <div>
                    <p>Incident type:
                        {isEditMode ? (
                            <select
                                name="incidentType"
                                value={issue.incidentType}
                                onChange={handleInputChange}
                                className="input mx-2"
                            >
                                {incidentTypes.map(type => (
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
                                className="input mx-2"
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

                <div className='bg-github-secondary dark:bg-github-dark-tertiary max-w-l rounded-lg shadow-md min-h-[200px] col-span-1 row-span-2 p-4'>
                    <p className='font-bold pb-2'>Description</p>
                    {isEditMode ? (
                        <textarea
                            name="description"
                            value={issue.description}
                            onChange={handleInputChange}
                            className="editable-input"
                        />
                    ) : (
                        <p style={{ wordBreak: 'break-word', whiteSpace: 'pre-line' }}>{issue.description}</p>
                    )}
                </div>

                <div className='bg-github-secondary dark:bg-github-dark-tertiary max-w-l rounded-lg shadow-md min-h-[200px] col-span-1 row-span-1 p-4'>
                    <p className='font-bold pb-2'>Affected Systems</p>
                    <div className="space-y-1">
                        {isEditMode ? (
                            <>
                                {issue.affectedSystems.map((system, index) => (

                                    <div key={index} className="flex items-center mb-2">
                                        <input
                                            type="text"
                                            name={`affectedSystems-${index}`}
                                            value={system}
                                            onChange={(e) => handleSystemChange(index, e.target.value)}
                                            className="editable-input flex-grow"
                                        />
                                        <button type="button" onClick={() => handleRemoveSystem(index)} className="ml-2 text-red-500">Remove</button>
                                    </div>




                                ))}
                                <button type="button" onClick={handleAddSystem} className="text-blue-500">Add Affected System</button>
                            </>
                        ) : (
                            issue.affectedSystems.length > 0 ? (
                                issue.affectedSystems.map((system, index) => (
                                    <p key={index}> - {system}</p>
                                ))
                            ) : (
                                <p>No affected systems</p> // Or leave it empty if you prefer
                            )
                        )
                        }
                    </div>
                </div>

                <div className='bg-github-secondary dark:bg-github-dark-tertiary rounded-lg shadow-md min-h-[150px] col-span-1 row-span-1 p-4'>
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
                        <p className='text-right'>{formatDate(issue.endTime)}</p>


                    </div>
                </div>

                <div className='bg-github-secondary dark:bg-github-dark-tertiary max-w-l rounded-lg shadow-md min-h-[200px] col-span-1 row-span-1 p-4'>
                    <p className='p-2 font-bold'>Impact</p>
                    {isEditMode ? (
                        <textarea
                            name="impact"
                            value={issue.impact}
                            onChange={handleInputChange}
                            className="editable-input"
                        />
                    ) : (
                        <p className='p-1'>{issue.impact}</p>
                    )}
                </div>

                <div className='bg-github-secondary dark:bg-github-dark-tertiary max-w-l rounded-lg shadow-md min-h-[200px] col-span-1 row-span-1 p-4'>
                    <p className='p-2 font-bold'>Preventative Measures</p>
                    {isEditMode ? (
                        <textarea
                            name="preventativeMeasures"
                            value={issue.preventativeMeasures}
                            onChange={handleInputChange}
                            className="editable-input"
                        />
                    ) : (
                        <p className='p-1'> - {issue.preventativeMeasures}</p>
                    )}
                </div>

                <TabComponent />

                <div className='col-start-3 col-span-1'>
                    <div className='flex justify-end'>
                        {isEditMode ? (
                            <>
                                <button onClick={handleCancel} className='bg-gray-500 text-white p-2 rounded-lg shadow-md mr-2'>Cancel</button>
                                <button onClick={handleSave} className='bg-github-primary dark:bg-github-dark-primary dark:text-white p-2 rounded-lg shadow-md'>Save</button>

                            </>
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
