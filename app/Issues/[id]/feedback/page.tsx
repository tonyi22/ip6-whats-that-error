'use client'
import React, { useEffect, useState, useRef } from 'react';
import '../detailView.css';
import { compareSort, getAlertIcon, getSeverityColor } from '@/app/helperFunction';
import SliderComponent from './Slider';
import SternComponent from './Stern';
import { useRouter, useParams } from 'next/navigation';
import { SystemMonitoringIssue } from '@/app/data/data';
import { FaCaretDown, FaCheck } from 'react-icons/fa';

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

type RatingComponentProps = {
    onChange: (rating: number) => void;
};

const RatingComponent: React.FC<RatingComponentProps> = ({ onChange }) => {
    return (
        <div>
            {[...Array(5)].map((_, i) => (
                <span key={i} onClick={() => onChange(i + 1)} style={{ cursor: 'pointer', color: '#ffd700' }}>★</span>
            ))}
        </div>
    );
};

export function Feedback({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [issue, setIssue] = useState<SystemMonitoringIssue | null>(null);
    const [sliderRating, setSliderRating] = useState(3);
    const [starRating, setStarRating] = useState(0);
    const [thumbsRating, setThumbsRating] = useState(0);
    const [feedbackText, setFeedbackText] = useState('');
    const [emojiRating, setEmojiRating] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const checkboxOptions = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];

    const [responses, setResponses] = useState({
        issueClear: '',
        problemUnderstood: '',
        stepsKnown: '',
        infoMissing: '',
        issueClarityRating: '',
        priorityUnderstandable: '',
        alertIconUnderstandable: '',
        alertIconReason: '',
        bereitgestellt: '',
        severityUnderstandable2: '',
        severityUnderstandable: '',
        statusUnderstandable: '',
        descriptionReason: '',
        priorityUnderstandable2: '',
        severityAdjustedCorrectlyComments: '',
        severityCorrect: '',
        correctSeverity: '',
        severityReason: '',
        incidentTypeReason: '',
        incidentTypeUnderstandable: '',
        correctAlertType: '',
        moreUnderstandable: '',
        descriptionUnderstandable: '',
        affectedSystemsUnderstandable: '',
        impactUnderstandable: '',
        affSystems: '',
        implementationAISuggestions: '',
        implementationReason: '',
        impactReason: '',
        whatToDo: '',
        whatToDoReason: '',
        implemented: '',
        implementedReason: '',
        clarityAISuggestions: '',
        relevanceAISuggestions: '',
        preventativeMeasuresUnderstandable: '',
        issueResolved: '',
        issueRelevant: '',
        easeOfUseAISuggestions: '',
        improvementAISuggestions: '',
        overallSatisfactionAISuggestions: '',
        correctPriority: '',
        correctIncidentType: '',
        correctStatus: '',
        descriptionClarityImproved: '',
        descriptionClarityImprovedComments: '',
        problemUnderstandingChanged: '',
        priorityReason: '',
        problemUnderstandingChangedComments: '',
        solutionStepsClarityImproved: '',
        priorityAdjustedCorrectlyComments: '',
        priorityAdjustedCorrectly: '',
        missingInfoProvided: '',
        incidentTypeText: '',
        missingInfoProvidedComments: '',
        issueClarityImproved: '',
        issueClarityImprovedComments: '',
        solutionStepsClarityImprovedComments: '',
        textfeldunderstandable: '',
    });

    const systemsList = [
        'WebServer-01', 'DatabaseServer-01', 'StorageSystem-01', 'NetworkSwitch-01', 'LoadBalancer-01',
        'BackupServer-01', 'MonitoringSystem-01', 'AuthenticationServer-01', 'APIGateway-01', 'Firewall-01',
        'VirtualizationServer-01', 'DNSServer-01', 'EmailServer-01', 'ApplicationServer-01', 'ERPSystem-01',
        'CRMSystem-01', 'FileServer-01', 'ProxyServer-01', 'DevelopmentServer-01', 'TestServer-01'
    ];

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setResponses(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const toggleDropdown = () => {
        setDropdownOpen(prev => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleAddSystem = (system: string) => {
        setIssue(prevState => {
            if (prevState) {
                return {
                    ...prevState,
                    affectedSystems: prevState.affectedSystems.includes(system)
                        ? prevState.affectedSystems.filter(s => s !== system)
                        : [...prevState.affectedSystems, system]
                };
            }
            return prevState;
        });
    };

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

    const handleDropdownClick = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleOutsideClick = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Submit feedback logic
        console.log('Submitted responses:', responses);
    };

    useEffect(() => {
        const issues = loadIssuesFromLocalStorage();
        const foundIssue = issues.find(issue => issue.id === Number(params.id));
        if (foundIssue) { // Update state only if issue is found
            setIssue(foundIssue);
        } else {
            console.log(`Issue with ID ${params.id} not found`);
        }
    }, [params.id]);

    if (!issue) {
        return <div>Issue not found</div>;
    }

    return (
        <div className="max-w-6xl mx-auto my-10 p-8 bg-github-tertiary dark:bg-github-dark-background text-black dark:text-github-dark-text rounded-lg shadow-md">

            <style jsx>{`
                .custom-radio {
                    -webkit-appearance: none;
                    -moz-appearance: none;
                    appearance: none;
                    display: inline-block;
                    width: 0.75em; 
                    height: 0.75em; 
                    border-radius: 50%;
                    border: 1px solid #000;
                    cursor: pointer;
                    position: relative;
                    top: 0.15em;
                    margin-right: 0.05em;
                    background-color: white; 
                }
                .custom-radio:checked {
                    background-color: #4299e1; 
                    border-color: #000; 
                }
            `}</style>


            <div className="flex space-x-8">

                <div className="">
                    <h3 className="text-2xl font-bold mb-4 text-center">Final Feedback</h3>
                    <form onSubmit={handleSubmit}>

                        <div className="grid grid-cols-2 gap-4 mb-4 p-4 border rounded-lg">
                            <div>
                                <span className="ml-2 ">War der Alert Type der richtige?</span>
                                <label className="flex mt-2 ml-2 items-center text-gray-700 dark:text-gray-300">
                                    {getAlertIcon(issue.alertType)}
                                    <span className="ml-2">{issue.alertType}</span>
                                </label>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex space-x-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="alertIconUnderstandable"
                                            value="yes"
                                            className="custom-radio"
                                            onChange={handleChange}
                                        />
                                        <span className="ml-2">Ja</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="alertIconUnderstandable"
                                            value="no"
                                            className="custom-radio"
                                            onChange={handleChange}
                                        />
                                        <span className="ml-2">Nein</span>
                                    </label>
                                </div>
                                {responses.alertIconUnderstandable === 'no' && (
                                    <>
                                        <p className='mt-4 mb-1 ml-1 text-sm'>Wähle den richtigen Alert Type</p>
                                        <div className="inline-block">
                                            <select
                                                name="correctAlertType"
                                                value={responses.correctAlertType === '' ? issue.alertType : responses.correctAlertType}
                                                onChange={handleChange}
                                                className="mt-2 input border border-grey-800 w-auto"
                                            >
                                                {["Warning", "Info", "Critical"].map(type => (
                                                    <option key={type} value={type} disabled={type === issue.alertType}>
                                                        {type}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <textarea
                                            name="alertIconReason"
                                            value={responses.alertIconReason}
                                            onChange={handleChange}
                                            placeholder='Begründe den neuen Alert Type'
                                            className="editable-input mt-3"
                                        />
                                    </>

                                )}
                            </div>
                        </div>


                        <div>
                            {issue.isInitialGiven ? (
                                <div className="grid grid-cols-2 gap-4 mb-4 border p-4 rounded-lg">
                                    <div>
                                        <span className="ml-2">Wurde die Severity des Issues korrekt angepasst?</span>
                                        <label className="flex mt-2 ml-2 items-center text-gray-700 dark:text-gray-300">
                                            <span className={`rounded-xl p-2 ${getSeverityColor(issue.severity)}`}>{issue.severity}</span>
                                        </label>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex space-x-4">
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="severityCorrect"
                                                    value="yes"
                                                    className="custom-radio"
                                                    onChange={handleChange}
                                                />
                                                <span className="ml-2">Ja</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="severityCorrect"
                                                    value="no"
                                                    className="custom-radio"
                                                    onChange={handleChange}
                                                />
                                                <span className="ml-2">Nein</span>
                                            </label>
                                        </div>
                                        {responses.severityCorrect === 'no' && (

                                            <>


                                                <p className='mt-4 mb-1 ml-1 text-sm'>Wähle die richtige Severity</p>
                                                <div className="inline-block">
                                                    <select
                                                        name="correctSeverity"
                                                        value={responses.correctSeverity}
                                                        onChange={handleChange}
                                                        className="mt-2 input border border-grey-800 w-auto"
                                                        defaultValue=""
                                                    >
                                                        {['Low', 'Medium', 'High'].map(severity => (
                                                            <option key={severity} value={severity} disabled={severity === issue.severity}>
                                                                {severity}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <textarea
                                                    name="severityReason"
                                                    value={responses.severityReason}
                                                    onChange={handleChange}
                                                    placeholder='Begründe die neue Severity'
                                                    className="editable-input mt-3"
                                                />
                                            </>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4 mb-4 border p-4 rounded-lg">
                                    <div>
                                        <span className="ml-2 block text-left">War die Severity nachvollziehbar? </span>
                                        <label className="flex mt-2 ml-2 items-center text-gray-700 dark:text-gray-300">
                                            <span className={`rounded-xl p-2 ${getSeverityColor(issue.severity)}`}>{issue.severity}</span>
                                        </label>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex space-x-4">
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="severityUnderstandable"
                                                    value="yes"
                                                    className="custom-radio"
                                                    onChange={handleChange}
                                                />
                                                <span className="ml-2">Ja</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="severityUnderstandable"
                                                    value="no"
                                                    className="custom-radio"
                                                    onChange={handleChange}
                                                />
                                                <span className="ml-2">Nein</span>
                                            </label>
                                        </div>
                                        {responses.severityUnderstandable === 'no' && (
                                            <>
                                                <p className='mt-4 mb-1 ml-1 text-sm'>Wähle die richtige Severity</p>
                                                <div className="inline-block">
                                                    <select
                                                        name="correctSeverity"
                                                        value={responses.correctSeverity === '' ? issue.severity : responses.correctSeverity}
                                                        onChange={handleChange}
                                                        className="mt-2 input border border-grey-800 w-auto"
                                                    >
                                                        {['Low', 'Medium', 'High'].map(severity => (
                                                            <option key={severity} value={severity} disabled={severity === issue.severity}>
                                                                {severity}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <textarea
                                                    name="severityReason"
                                                    value={responses.severityReason}
                                                    onChange={handleChange}
                                                    placeholder='Begründung für neue Severity'
                                                    className="editable-input mt-3"
                                                />
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>






                        <div className="grid grid-cols-2 gap-4 mb-4 border p-4 rounded-lg">
                            <div className="flex flex-col">
                                <span className="ml-2">War der Incident Type der richtigen Kategorie zugeordnet?</span>
                                <label className="mt-2 ml-2 flex items-center text-gray-700 dark:text-gray-300">
                                    <span className="bg-gray-200 dark:bg-gray-500 rounded-xl p-2">{issue.incidentType}</span>
                                </label>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex space-x-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="incidentTypeUnderstandable"
                                            value="yes"
                                            className="custom-radio"
                                            onChange={handleChange}
                                        />
                                        <span className="ml-2">Ja</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="incidentTypeUnderstandable"
                                            value="no"
                                            className="custom-radio"
                                            onChange={handleChange}
                                        />
                                        <span className="ml-2">Nein</span>
                                    </label>
                                </div>
                                {responses.incidentTypeUnderstandable === 'no' && (
                                    <>
                                        <p className='mt-4 mb-1 ml-1 text-sm'>Wähle den richtigen Incident Type</p>
                                        <div className="inline-block">
                                            <select
                                                name="correctIncidentType"
                                                value={responses.correctIncidentType === '' ? issue.incidentType : responses.correctIncidentType}
                                                onChange={handleChange}
                                                className="mt-2 input border border-grey-800 w-auto"
                                            >
                                                {[
                                                    "Performance", "Storage", "Overheating", "Backups", "Power", "Data Integrity", "Connection", "Query", "Monitoring", "Network",
                                                    "Authentication", "Resources", "Processes", "Configuration", "Data Export", "Documentation", "Startup", "Demonstration", "Communication",
                                                    "Data Import", "Security", "other"
                                                ].sort(compareSort).map(type => (
                                                    <option key={type} value={type} disabled={type === issue.incidentType}>{type}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>


                        <div> {issue.isInitialGiven ? (
                            <div className="grid grid-cols-2 gap-4 mb-4 border p-4 rounded-lg">
                                <div>
                                    <span className="ml-2">
                                        Wurde die Priorität des Issues korrekt angepasst?
                                    </span>
                                    <label className="flex mt-2 ml-2 items-center text-gray-700 dark:text-gray-300">
                                        <span className="bg-gray-200 dark:bg-gray-500 rounded-xl p-2">{issue.priority}/10</span>
                                    </label>
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex space-x-4">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="priorityUnderstandable2"
                                                value="yes"
                                                className="custom-radio"
                                                onChange={handleChange}
                                            />
                                            <span className="ml-2">Ja</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="priorityUnderstandable2"
                                                value="no"
                                                className="custom-radio"
                                                onChange={handleChange}
                                            />
                                            <span className="ml-2">Nein</span>
                                        </label>
                                    </div>
                                    {responses.priorityUnderstandable2 === 'no' && (
                                        <>
                                            <p className='mt-4 mb-1 ml-1 text-sm'>Wähle die richtige Priority</p>
                                            <div className="inline-block">
                                                <select
                                                    name="correctPriority"
                                                    value={responses.correctPriority}
                                                    onChange={handleChange}
                                                    className="mt-2 input border border-grey-800 w-auto"
                                                >
                                                    {[...Array(10)].map((_, i) => (
                                                        <option key={i + 1} value={i + 1} disabled={i + 1 === issue.priority}>{i + 1}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <textarea
                                                name="priorityAdjustedCorrectlyComments"
                                                value={responses.priorityAdjustedCorrectlyComments}
                                                onChange={handleChange}
                                                placeholder='Begründe die neue Priorität'
                                                className="editable-input mt-3"
                                            />
                                        </>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4 mb-4 border p-4 rounded-lg">
                                <div className="flex flex-col">
                                    <span className="ml-2">War die Priorität nachvollziehbar?</span>
                                    <label className="mt-2 ml-2 flex items-center text-gray-700 dark:text-gray-300">
                                        <span className="bg-gray-200 dark:bg-gray-500 rounded-xl p-2">{issue.priority}/10</span>
                                    </label>
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex space-x-4">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="priorityUnderstandable"
                                                value="yes"
                                                className="custom-radio"
                                                onChange={handleChange}
                                            />
                                            <span className="ml-2">Ja</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="priorityUnderstandable"
                                                value="no"
                                                className="custom-radio"
                                                onChange={handleChange}
                                            />
                                            <span className="ml-2">Nein</span>
                                        </label>
                                    </div>
                                    {responses.priorityUnderstandable === 'no' && (
                                        <>
                                            <p className='mt-4 mb-1 ml-1 text-sm'>Wähle die korrekte Priorität auswählen</p>
                                            <div className="inline-block">
                                                <select
                                                    name="correctPriority"
                                                    value={responses.correctPriority === '' ? issue.priority : responses.correctPriority}
                                                    onChange={handleChange}
                                                    className="mt-2 input border border-grey-800 w-auto"
                                                    defaultValue=""
                                                >
                                                    {[...Array(10)].map((_, i) => (
                                                        <option key={i + 1} value={i + 1} disabled={i + 1 === issue.priority}>{i + 1}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <textarea
                                                name="priorityReason"
                                                value={responses.priorityReason}
                                                onChange={handleChange}
                                                placeholder='Begründung für neue Priorität'
                                                className="editable-input mt-3"
                                            />
                                        </>
                                    )}
                                </div>
                            </div>)}
                        </div>

                        <div>
                            {issue.isInitialGiven ? (
                                <div className="grid grid-cols-2 gap-4 mb-4 border p-4 rounded-lg">
                                    <label className="text-grayy-700 dark:text-gray-300 ml-2">
                                        Wurde die Beschreibung des Issues im Verlauf klarer und hat sich
                                        dein Verständnis des Problems im Verlauf verbessert?
                                    </label>
                                    <div className="flex flex-col">
                                        <div className="flex space-x-4">
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="moreUnderstandable"
                                                    value="yes"
                                                    className="custom-radio"
                                                    onChange={handleChange}
                                                />
                                                <span className="ml-2">Ja</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="moreUnderstandable"
                                                    value="no"
                                                    className="custom-radio"
                                                    onChange={handleChange}
                                                />
                                                <span className="ml-2">Nein</span>
                                            </label>
                                        </div>
                                        {responses.moreUnderstandable === 'no' && (
                                            <textarea
                                                name="descriptionClarityImprovedComments"
                                                value={responses.descriptionClarityImprovedComments}
                                                onChange={handleChange}
                                                placeholder='Was war noch unklar?'
                                                className="editable-input mt-3"
                                            />
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4 mb-4 border p-4 rounded-lg">
                                    <div>
                                        <span className="ml-2">War die Beschreibung des Issues klar und verständlich?</span>
                                        <label className="flex items-center text-gray-700 dark:text-gray-300">
                                            <p className="bg-github-secondary dark:bg-github-dark-tertiary max-w-l mt-2 ml-2 rounded-lg shadow-md p-4">
                                                {issue.description}
                                            </p>
                                        </label>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex space-x-4">
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="descriptionUnderstandable"
                                                    value="yes"
                                                    className="custom-radio"
                                                    onChange={handleChange}
                                                />
                                                <span className="ml-2">Ja</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="descriptionUnderstandable"
                                                    value="no"
                                                    className="custom-radio"
                                                    onChange={handleChange}
                                                />
                                                <span className="ml-2">Nein</span>
                                            </label>
                                        </div>
                                        {responses.descriptionUnderstandable === 'no' && (
                                            <>
                                                <textarea
                                                    name="descriptionReason"
                                                    value={responses.descriptionReason}
                                                    onChange={handleChange}
                                                    placeholder='Was war unklar?'
                                                    className="editable-input mt-3"
                                                />
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            {issue.isInitialGiven ? (
                                <div className="grid grid-cols-2 gap-4 mb-4 border p-4 rounded-lg">
                                    <label className="ml-2">
                                        Wurden die fehlenden Informationen bereitgestellt?
                                    </label>
                                    <div className="flex flex-col">
                                        <div className="flex space-x-4">
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="bereitgestellt"
                                                    value="yes"
                                                    className="custom-radio"
                                                    onChange={handleChange}
                                                />
                                                <span className="ml-2">Ja</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="bereitgestellt"
                                                    value="no"
                                                    className="custom-radio"
                                                    onChange={handleChange}
                                                />
                                                <span className="ml-2">Nein</span>
                                            </label>
                                        </div>
                                        {responses.bereitgestellt === 'no' && (
                                            <textarea
                                                name="missingInfoProvidedComments"
                                                value={responses.missingInfoProvidedComments}
                                                onChange={handleChange}
                                                placeholder='Wo fehlten dir Informationen? Z.B. Beschreibung, Systeme, Auswirkungen, Lösungsschritte...'
                                                className="editable-input mt-3"
                                            />
                                        )}
                                    </div>
                                </div>
                            ) : null}
                        </div>


                        <div className="grid grid-cols-2 gap-4 mb-4 border p-4 rounded-lg">
                            <div>
                                <span className="ml-2">Waren die betroffenen Systeme korrekt?</span>
                                <div className={`flex-grow text-gray-700 mt-2 ml-2 py-1 px-2 max-h-60 overflow-y-auto min-h-[40px] flex w-96 flex-col justify-center mt-2 ${issue.affectedSystems.length !== 0 ? 'rounded-lg shadow-md' : ''}`}>
                                    {issue.affectedSystems.map((system, index) => (
                                        <div key={index} className={`flex items-center ${index !== issue.affectedSystems.length - 1 ? 'border-b border-gray-300' : ''} min-h-[40px]`}>
                                            <span className="flex-grow">{system}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex space-x-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="affSystems"
                                            value="yes"
                                            className="custom-radio"
                                            onChange={handleChange}
                                        />
                                        <span className="ml-2">Ja</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="affSystems"
                                            value="no"
                                            className="custom-radio"
                                            onChange={handleChange}
                                        />
                                        <span className="ml-2">Nein</span>
                                    </label>
                                </div>
                                {responses.affSystems === 'no' && (
                                    <div className="relative inline-block min-h-[45px] mt-2" ref={dropdownRef}>
                                        <div
                                            className="cursor-pointer"
                                            onClick={toggleDropdown}
                                        >
                                            <div className="cursor-pointer inline-flex items-center border rounded-md py-1 px-4 bg-white shadow-sm min-h-[45px]">
                                                Wähle die Systeme aus
                                                <FaCaretDown className="ml-1" />
                                            </div>
                                        </div>
                                        {dropdownOpen && (
                                            <div className="absolute bg-white border border-gray-300 rounded-lg mt-1 z-10 max-h-60 overflow-y-auto shadow-lg w-64">
                                                {systemsList.map(system => (
                                                    <div
                                                        key={system}
                                                        className="cursor-pointer px-4 py-2 hover:bg-gray-100 flex items-center justify-between"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleAddSystem(system);
                                                        }}
                                                    >
                                                        {system}
                                                        {issue.affectedSystems.includes(system) && <FaCheck className="text-green-500" />}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>


                        <div className="grid grid-cols-2 gap-4 mb-4 border p-4 rounded-lg">
                            <div>
                                <span className="ml-2">War die Auswirkung verständlich?</span>
                                <label className="mt-2 ml-2 flex items-center text-gray-700 dark:text-gray-300">
                                    <p className='bg-github-secondary dark:bg-github-dark-tertiary max-w-l rounded-lg shadow-md p-4'>
                                        {issue.impact}
                                    </p>
                                </label>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex space-x-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="impactUnderstandable"
                                            value="yes"
                                            className="custom-radio"
                                            onChange={handleChange}
                                        />
                                        <span className="ml-2">Ja</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="impactUnderstandable"
                                            value="no"
                                            className="custom-radio"
                                            onChange={handleChange}
                                        />
                                        <span className="ml-2">Nein</span>
                                    </label>
                                </div>
                                {responses.impactUnderstandable === 'no' && (
                                    <textarea
                                        name="impactReason"
                                        value={responses.impactReason}
                                        onChange={handleChange}
                                        placeholder='Was war nicht verständilch?'
                                        className="editable-input mt-3"
                                    />
                                )}
                            </div>
                        </div>



                        <div className="grid grid-cols-2 gap-4 mb-4 border p-4 rounded-lg">
                            <label className="ml-2">
                                Wusstest du, was zu tun ist, um das Issue zu lösen?
                            </label>
                            <div className="flex flex-col">
                                <div className="flex space-x-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="whatToDo"
                                            value="yes"
                                            className="custom-radio"
                                            onChange={handleChange}
                                        />
                                        <span className="ml-2">Ja</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="whatToDo"
                                            value="no"
                                            className="custom-radio"
                                            onChange={handleChange}
                                        />
                                        <span className="ml-2">Nein</span>
                                    </label>
                                </div>
                                {responses.whatToDo === 'no' && (
                                    <textarea
                                        name="whatToDoReason"
                                        value={responses.whatToDoReason}
                                        onChange={handleChange}
                                        placeholder='Wo fehlen dir Informationen? Z.B. Beschreibung, Systeme, Auswirkungen, Lösungsschritte...'
                                        className="editable-input mt-3"
                                    />
                                )}
                            </div>
                        </div>


                        <div className="grid grid-cols-2 gap-4 mb-4 border p-4 rounded-lg">
                            <label className="ml-2">
                                Hast du den Lösungsvorschlag umgesetzt?
                            </label>
                            <div className="flex flex-col">
                                <div className="flex space-x-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="implemented"
                                            value="yes"
                                            className="custom-radio"
                                            onChange={handleChange}
                                        />
                                        <span className="ml-2">Ja</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="implemented"
                                            value="no"
                                            className="custom-radio"
                                            onChange={handleChange}
                                        />
                                        <span className="ml-2">Nein</span>
                                    </label>
                                </div>
                                {responses.implemented === 'no' && (
                                    <textarea
                                        name="implementedReason"
                                        value={responses.implementedReason}
                                        onChange={handleChange}
                                        placeholder='Wie hast du das Issue tatsächlich gelöst?'
                                        className="editable-input mt-3"
                                    />
                                )}
                            </div>
                        </div>



                        <div className="grid grid-cols-2 gap-4 mb-4 border p-4 rounded-lg">
                            <label className="ml-2">
                                Waren die AI-Vorschläge für das Issue relevant?
                            </label>
                            <div className="flex flex-col">
                                <div className="flex space-x-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="clarityAISuggestions"
                                            value="yes"
                                            className="custom-radio"
                                            onChange={handleChange}
                                        />
                                        <span className="ml-2">Ja</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="clarityAISuggestions"
                                            value="no"
                                            className="custom-radio"
                                            onChange={handleChange}
                                        />
                                        <span className="ml-2">Nein</span>
                                    </label>
                                </div>
                                {responses.clarityAISuggestions === 'yes' && (
                                    <textarea
                                        name="relevanceAISuggestions"
                                        value={responses.relevanceAISuggestions}
                                        onChange={handleChange}
                                        placeholder='Waren die AI-Vorschläge klar und verständlich?'
                                        className="editable-input mt-3"
                                    />
                                )}
                                {responses.clarityAISuggestions === 'no' && (
                                    <textarea
                                        name="relevanceAISuggestions"
                                        value={responses.relevanceAISuggestions}
                                        onChange={handleChange}
                                        placeholder='Weshalb waren die Vorschläge nicht relevant?'
                                        className="editable-input mt-3"
                                    />
                                )}
                            </div>
                        </div>



                        <div className="grid grid-cols-2 gap-4 mb-4 border p-4 rounded-lg">
                            <label className="ml-2">
                                Hast du die AI-Vorschläge umgesetzt?
                            </label>
                            <div className="flex flex-col">
                                <div className="flex space-x-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="implementationAISuggestions"
                                            value="yes"
                                            className="custom-radio"
                                            onChange={handleChange}
                                        />
                                        <span className="ml-2">Ja</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="implementationAISuggestions"
                                            value="no"
                                            className="custom-radio"
                                            onChange={handleChange}
                                        />
                                        <span className="ml-2">Nein</span>
                                    </label>
                                </div>
                                {responses.implementationAISuggestions === 'yes' && (
                                    <>
                                        <p className='mt-4 mb-1 ml-1 text-sm'>Wie einfach war die Umsetzung?</p>
                                        <div className="flex space-x-4">
                                            <SliderComponent value={sliderRating} onChange={setSliderRating} min={1} max={4} />
                                        </div>
                                    </>
                                )}
                                {responses.implementationAISuggestions === 'no' && (
                                    <textarea
                                        name="implementationReason"
                                        value={responses.implementationReason}
                                        onChange={handleChange}
                                        placeholder='Warum hast du die Vorschläge nicht angewendet?'
                                        className="editable-input mt-3"
                                    />
                                )}
                            </div>
                        </div>




                        <div className="grid grid-cols-2 gap-4 mb-4 border p-4 rounded-lg">
                            <label className="ml-2">
                                Hast du Vorschläge zur Verbesserung der AI-Vorschläge?
                            </label>
                            <textarea
                                name="improvementAISuggestions"
                                value={responses.improvementAISuggestions}
                                onChange={handleChange}
                                placeholder='Erzähl davon'
                                className="editable-input mt-3"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4 border p-4 rounded-lg">
                            <label className="text-gray-700 dark:text-gray-300">
                                Wie zufrieden bist du insgesamt mit den AI-Vorschlägen?
                            </label>
                            <div className="flex flex-col">
                                <div className="flex space-x-4">
                                    <SternComponent rating={starRating} onChange={setStarRating} />
                                </div>
                                <textarea
                                    name="overallSatisfactionAISuggestions"
                                    value={responses.overallSatisfactionAISuggestions}
                                    onChange={handleChange}
                                    placeholder='Bitte erkläre deine Bewertung'
                                    className="editable-input mt-3"
                                />
                            </div>
                        </div>



                        <div className="flex justify-end space-x-4 mt-6 p-4 rounded-lg">
                            <button
                                type="button"
                                onClick={() => router.push('/Issues')}
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
            </div >
        </div >
    );
};

export default Feedback;
