'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getAlertIcon, getSeverityColor } from '@/app/helperFunction';
import { SystemMonitoringIssue } from '@/app/data/data';

const formatDate = (date: string | number | Date) => {
    return new Date(date).toLocaleString();
};

const loadIssuesFromLocalStorage = (): SystemMonitoringIssue[] => {
    const storedIssues = localStorage.getItem('issues');
    if (storedIssues) {
        return JSON.parse(storedIssues);
    }
    return [];
};

function InitialFeedbackForm({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [issue, setIssue] = useState<SystemMonitoringIssue | null>(null);
    const [responses, setResponses] = useState({
        issueClear: '',
        problemUnderstood: '',
        stepsKnown: '',
        infoMissing: '',
        issueClarityRating: '',
        priorityUnderstandable: ''
    });

    useEffect(() => {
        const issues = loadIssuesFromLocalStorage();
        const foundIssue = issues.find(issue => issue.id === Number(params.id));
        if (foundIssue) { // Update state only if issue is found
            setIssue(foundIssue);
        } else {
            console.log(`Issue with ID ${params.id} not found`);
        }
    }, [params.id]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setResponses(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Submit feedback logic
        console.log('Submitted responses:', responses);
    };



    if (!issue) {
        return <div>Issue not found</div>;
    }



    return (
        <div className="max-w-6xl mx-auto my-10 p-8 bg-github-tertiary dark:bg-github-dark-background text-black dark:text-github-dark-text rounded-lg shadow-md">
            <div className="flex space-x-8">
                <div className="w-1/2 bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-2xl font-bold mb-4">Issue Details</h3>
                    <div className='flex justify-between items-center my-2'>
                        <div className='flex items-center space-x-2'>
                            <span>Alert icon:</span>
                            {getAlertIcon(issue.alertType)}
                        </div>
                        <div className="flex items-center space-x-2">
                            <span>Severity:</span>
                            <span className={`rounded-xl p-2 ${getSeverityColor(issue.severity)}`}>{issue.severity}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span>Priority:</span>
                            <span>{issue.priority} / 10</span>
                        </div>
                    </div>
                    <h4 className="text-xl font-semibold mt-5">{issue.title}</h4>
                    <p className="mt-5" style={{ wordBreak: 'break-word', whiteSpace: 'pre-line' }}>{issue.description}</p>
                </div>

                <div className="w-1/2 bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-2xl font-bold mb-4 text-center">Initial Feedback</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <label className="text-gray-700 dark:text-gray-300">
                                Ist die Beschreibung des Issues klar?
                            </label>
                            <textarea
                                name="issueClear"
                                value={responses.issueClear}
                                onChange={handleChange}
                                className="min-h-16 h-24 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <label className="text-gray-700 dark:text-gray-300">
                                Hast du sofort verstanden, was das Problem ist?
                            </label>
                            <textarea
                                name="problemUnderstood"
                                value={responses.problemUnderstood}
                                onChange={handleChange}
                                className="min-h-16 h-24 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <label className="text-gray-700 dark:text-gray-300">
                                Wusstest du, welche Schritte zur Lösung des Issues erforderlich sind?
                            </label>
                            <textarea
                                name="stepsKnown"
                                value={responses.stepsKnown}
                                onChange={handleChange}
                                className="min-h-16 h-24 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <label className="text-gray-700 dark:text-gray-300">
                                Fehlen dir wichtige Informationen?
                            </label>
                            <textarea
                                name="infoMissing"
                                value={responses.infoMissing}
                                onChange={handleChange}
                                className="min-h-16 h-24 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <label className="text-gray-700 dark:text-gray-300">
                                Wie würdest du die Verständlichkeit des Issues bewerten?
                            </label>
                            <textarea
                                name="issueClarityRating"
                                value={responses.issueClarityRating}
                                onChange={handleChange}
                                className="min-h-16 h-24 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <label className="text-gray-700 dark:text-gray-300">
                                Ist die Priorität des Issues für dich nachvollziehbar?
                            </label>
                            <textarea
                                name="priorityUnderstandable"
                                value={responses.priorityUnderstandable}
                                onChange={handleChange}
                                className="min-h-16 h-24 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>

                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default InitialFeedbackForm;
