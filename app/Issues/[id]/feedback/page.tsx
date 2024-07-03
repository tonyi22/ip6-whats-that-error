'use client'
import React, { useEffect, useState, useRef } from 'react';
import '../detailView.css';
import { getAlertIcon, getSeverityColor } from '@/app/helperFunction';
import SliderComponent from './Slider';
import SternComponent from './Stern';
import ThumbComponent from './Thumb';
import TextBoxComponent from './Textbox';
import EmojiComponent from './Emoji';
import CheckboxComponent from './Checkbox';
import { useRouter, useParams } from 'next/navigation';
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
    const [sliderRating, setSliderRating] = useState(2);
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
        severityUnderstandable: '',
        statusUnderstandable: '',
        incidentTypeUnderstandable: '',
        descriptionUnderstandable: '',
        affectedSystemsUnderstandable: '',
        impactUnderstandable: '',
        preventativeMeasuresUnderstandable: '',
        whatToDo: '',
        implemented: '',
        issueResolved: '',
        issueRelevant: '',
        relevanceAISuggestions: '',
        clarityAISuggestions: '',
        easeOfUseAISuggestions: '',
        implementationAISuggestions: '',
        improvementAISuggestions: '',
        overallSatisfactionAISuggestions: '',
        correctPriority: '',
        correctIncidentType: '',
        correctAlertType: '',
        correctSeverity: '',
        correctStatus: '',
        descriptionClarityImproved: '',
        descriptionClarityImprovedComments: '',
        problemUnderstandingChanged: '',
        problemUnderstandingChangedComments: '',
        solutionStepsClarityImproved: '',
        priorityAdjustedCorrectlyComments: '',
        priorityAdjustedCorrectly: '',
        missingInfoProvided: '',
        missingInfoProvidedComments: '',
        issueClarityImproved: '',
        issueClarityImprovedComments: '',
        solutionStepsClarityImprovedComments: '',
    });

    const systemsList = [
        'WebServer-01', 'DatabaseServer-01', 'StorageSystem-01', 'NetworkSwitch-01', 'LoadBalancer-01',
        'BackupServer-01', 'MonitoringSystem-01', 'AuthenticationServer-01', 'APIGateway-01', 'Firewall-01',
        'VirtualizationServer-01', 'DNSServer-01', 'EmailServer-01', 'ApplicationServer-01', 'ERPSystem-01',
        'CRMSystem-01', 'FileServer-01', 'ProxyServer-01', 'DevelopmentServer-01', 'TestServer-01'
    ];

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setResponses(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddSystem = (system: string) => {
        setIssue(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                affectedSystems: prev.affectedSystems.includes(system) ? prev.affectedSystems : [...prev.affectedSystems, system]
            };
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

                <div className="w bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-2xl font-bold mb-4 text-center">Final Feedback</h3>
                    <form onSubmit={handleSubmit}>

                        <div className="grid grid-cols-2 gap-4 mb-4 border p-4 rounded-lg">
                            <div>
                                <span className="ml-2">War der Alert Type der richtige?</span>
                                <label className="flex items-center text-gray-700 dark:text-gray-300">
                                    {getAlertIcon(issue.alertType)}
                                    <span className="ml-2">{issue.alertType}</span>
                                </label>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex space-x-4">
                                    <label className="flex items-center">
                                        <input type="radio" name="alertIconUnderstandable" value="yes" className="custom-radio" />
                                        <span className="ml-2">Ja</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="radio" name="alertIconUnderstandable" value="no" className="custom-radio" />
                                        <span className="ml-2">Nein</span>
                                    </label>
                                </div>
                                <select
                                    name="correctAlertType"
                                    value={responses.correctAlertType}
                                    onChange={handleChange}
                                    className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                >
                                    <option value="" disabled>Wähle den richtigen Alert Type</option>
                                    {["Warning", "Info", "Critical"].map(type => (
                                        <option key={type} value={type} disabled={type === issue.alertType}>
                                            {getAlertIcon(type)} {type}
                                        </option>
                                    ))}
                                </select>
                                <textarea
                                    name="alertIconUnderstandable"
                                    value={responses.alertIconUnderstandable}
                                    onChange={handleChange}
                                    placeholder='Begründung für neuen Alert Type'
                                    className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                        </div>


                        <div className="grid grid-cols-2 gap-4 mb-4 border p-4 rounded-lg">
                            <div>
                                <span className="ml-2">War die Severity korrekt?</span>
                                <label className="flex items-center text-gray-700 dark:text-gray-300">
                                    <span className={`rounded-xl p-2 ${getSeverityColor(issue.severity)}`}>{issue.severity}</span>
                                </label>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex space-x-4">
                                    <label className="flex items-center">
                                        <input type="radio" name="severityCorrect" value="yes" className="custom-radio" />
                                        <span className="ml-2">Ja</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="radio" name="severityCorrect" value="no" className="custom-radio" />
                                        <span className="ml-2">Nein</span>
                                    </label>
                                </div>
                                <select
                                    name="correctSeverity"
                                    value={responses.correctSeverity}
                                    onChange={handleChange}
                                    className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                >
                                    <option value="" disabled>Wähle die richtige Severity</option>
                                    {['Low', 'Medium', 'High'].map(severity => (
                                        <option key={severity} value={severity} disabled={severity === issue.severity}>
                                            {severity}
                                        </option>
                                    ))}
                                </select>

                                <textarea
                                    name="severityUnderstandable"
                                    value={responses.severityUnderstandable}
                                    onChange={handleChange}
                                    placeholder='Begründe die neue Severity'
                                    className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                        </div>




                        <div className="grid grid-cols-2 gap-4 mb-4 border p-4 rounded-lg">
                            <div>
                                <span className="ml-2">War der Incident Type der richtigen Kategorie zugeordnet?</span>
                                <label className="flex items-center text-gray-700 dark:text-gray-300">
                                    <span className="bg-gray-200 dark:bg-gray-500 rounded-xl p-2">{issue.incidentType}</span>
                                </label>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex space-x-4">
                                    <label className="flex items-center">
                                        <input type="radio" name="incidentTypeUnderstandable" value="yes" className="custom-radio" />
                                        <span className="ml-2">Ja</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="radio" name="incidentTypeUnderstandable" value="no" className="custom-radio" />
                                        <span className="ml-2">Nein</span>
                                    </label>
                                </div>
                                <select
                                    name="correctIncidentType"
                                    value={responses.correctIncidentType}
                                    onChange={handleChange}
                                    className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                >
                                    <option value="" disabled>Wähle den richtigen Incident Type</option>
                                    {[
                                        "Performance", "Storage", "Overheating", "Backups", "Power", "Data Integrity", "Connection", "Query", "Monitoring", "Network",
                                        "Authentication", "Resources", "Processes", "Configuration", "Data Export", "Documentation", "Startup", "Demonstration", "Communication",
                                        "Data Import", "Security"
                                    ].map(type => (
                                        <option key={type} value={type} disabled={type === issue.incidentType}>{type}</option>
                                    ))}
                                </select>

                                <textarea
                                    name="incidentTypeUnderstandable"
                                    value={responses.incidentTypeUnderstandable}
                                    onChange={handleChange}
                                    placeholder='Wenn nein, bitte beschreiben...'
                                    className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                        </div>


                        <div> {issue.isInitialGiven ? (
                            <div className="grid grid-cols-2 gap-4 mb-4 border p-4 rounded-lg">
                                <label className="text-gray-700 dark:text-gray-300">
                                    Wurde die Priorität des Issues korrekt angepasst?
                                </label>
                                <div className="flex flex-col">
                                    <div className="flex space-x-4">
                                        <label className="flex items-center">
                                            <input type="radio" name="priorityUnderstandable2" value="yes" className="custom-radio" />
                                            <span className="ml-2">Ja</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input type="radio" name="priorityUnderstandable2" value="no" className="custom-radio" />
                                            <span className="ml-2">Nein</span>
                                        </label>
                                    </div>
                                    <select
                                        name="correctPriority"
                                        value={responses.correctPriority}
                                        onChange={handleChange}
                                        className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    >
                                        <option value="">Bitte die korrekte Priorität auswählen</option>
                                        {[...Array(10)].map((_, i) => (
                                            <option key={i + 1} value={i + 1} disabled={i + 1 === issue.priority}>{i + 1}</option>
                                        ))}
                                    </select>
                                    <textarea
                                        name="priorityAdjustedCorrectlyComments"
                                        value={responses.priorityAdjustedCorrectlyComments}
                                        onChange={handleChange}
                                        placeholder='Wenn nein, bitte beschreiben...'
                                        className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4 mb-4 border p-4 rounded-lg">
                                <div>
                                    <span className="ml-2">War die Priorität nachvollziehbar? Wenn nein, welche Priorität hätte das Issue haben sollen?</span>
                                    <label className="flex items-center text-gray-700 dark:text-gray-300">
                                        <span className="bg-gray-200 dark:bg-gray-500 rounded-xl p-2">{issue.priority}/10</span>
                                    </label>
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex space-x-4">
                                        <label className="flex items-center">
                                            <input type="radio" name="priorityUnderstandable" value="yes" className="custom-radio" />
                                            <span className="ml-2">Ja</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input type="radio" name="priorityUnderstandable" value="no" className="custom-radio" />
                                            <span className="ml-2">Nein</span>
                                        </label>
                                    </div>
                                    <select
                                        name="correctPriority"
                                        value={responses.correctPriority}
                                        onChange={handleChange}
                                        className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    >
                                        <option value="">Bitte die korrekte Priorität auswählen</option>
                                        {[...Array(10)].map((_, i) => (
                                            <option key={i + 1} value={i + 1} disabled={i + 1 === issue.priority}>{i + 1}</option>
                                        ))}
                                    </select>

                                    <textarea
                                        name="priorityUnderstandable"
                                        value={responses.priorityUnderstandable}
                                        onChange={handleChange}
                                        placeholder='Begründung für neue Prio'
                                        className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                </div>
                            </div>)}
                        </div>


                        <div>
                            {issue.isInitialGiven ? (
                                <div className="grid grid-cols-2 gap-4 mb-4 border p-4 rounded-lg">
                                    <label className="text-gray-700 dark:text-gray-300">
                                        Wurde die Beschreibung des Issues im Verlauf klarer und hat sich
                                        dein Verständnis des Problems im Verlauf verbessert?
                                    </label>
                                    <div className="flex flex-col">
                                        <div className="flex space-x-4">
                                            <label className="flex items-center">
                                                <input type="radio" name="moreUnderstandable" value="yes" className="custom-radio" />
                                                <span className="ml-2">Ja</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input type="radio" name="moreUnderstandable" value="no" className="custom-radio" />
                                                <span className="ml-2">Nein</span>
                                            </label>
                                        </div>
                                        <textarea
                                            name="descriptionClarityImprovedComments"
                                            value={responses.descriptionClarityImprovedComments}
                                            onChange={handleChange}
                                            placeholder='Wenn nein, bitte beschreiben...'
                                            className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        />
                                    </div>
                                </div>

                            ) : (
                                <div className="grid grid-cols-2 gap-4 mb-4 border p-4 rounded-lg">
                                    <div>
                                        <span className="ml-2">War die Beschreibung des Issues klar und verständlich?</span>
                                        <label className="flex items-center text-gray-700 dark:text-gray-300">
                                            <p className="bg-github-secondary dark:bg-github-dark-tertiary max-w-l rounded-lg shadow-md p-4">
                                                {issue.description}
                                            </p>
                                        </label>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex space-x-4">
                                            <label className="flex items-center">
                                                <input type="radio" name="descriptionUnderstandable" value="yes" className="custom-radio" />
                                                <span className="ml-2">Ja</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input type="radio" name="descriptionUnderstandable" value="no" className="custom-radio" />
                                                <span className="ml-2">Nein</span>
                                            </label>
                                        </div>
                                        <textarea
                                            name="descriptionUnderstandable"
                                            value={responses.descriptionUnderstandable}
                                            onChange={handleChange}
                                            placeholder='Wenn nein, bitte beschreiben...'
                                            className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            {issue.isInitialGiven ? (
                                <div className="grid grid-cols-2 gap-4 mb-4 border p-4 rounded-lg">
                                    <label className="text-gray-700 dark:text-gray-300">
                                        Wurden die fehlenden Informationen bereitgestellt?
                                    </label>
                                    <div className="flex flex-col">
                                        <div className="flex space-x-4">
                                            <label className="flex items-center">
                                                <input type="radio" name="bereitgestellt" value="yes" className="custom-radio" />
                                                <span className="ml-2">Ja</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input type="radio" name="bereitgestellt" value="no" className="custom-radio" />
                                                <span className="ml-2">Nein</span>
                                            </label>
                                        </div>
                                        <textarea
                                            name="missingInfoProvidedComments"
                                            value={responses.missingInfoProvidedComments}
                                            onChange={handleChange}
                                            placeholder='Wenn nein, bitte beschreiben...'
                                            className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        />
                                    </div>
                                </div>
                            ) : null}
                        </div>





                        <div className="grid grid-cols-2 gap-4 mb-4 border p-4 rounded-lg">
                            <div>
                                <span className="ml-2">Waren die betroffenen Systeme korrekt?</span>
                                <label className="flex items-center text-gray-700 dark:text-gray-300">
                                    <div className='bg-github-secondary dark:bg-github-dark-tertiary max-w-l rounded-lg shadow-md p-4'>
                                        <div className="space-y-1">
                                            {issue.affectedSystems.map((system, index) => (
                                                <div key={index} className="flex items-center mb-2">
                                                    <span className="flex-grow">{system}</span>
                                                    <button type="button" onClick={() => handleRemoveSystem(index)} className="ml-2 text-red-500">Remove</button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </label>
                            </div>
                            <div className="flex flex-col">
                                <div className="dropdown-container">
                                    <div className="flex space-x-4">
                                        <label className="mb-2 flex items-center">
                                            <input type="radio" name="affSystems" value="yes" className="custom-radio" />
                                            <span className="ml-2">Ja</span>
                                        </label>
                                        <label className="mb-2 flex items-center">
                                            <input type="radio" name="affSystems" value="no" className="custom-radio" />
                                            <span className="ml-2">Nein</span>
                                        </label>
                                    </div>
                                    <div
                                        className="dropdown"
                                        onClick={handleDropdownClick}
                                    >
                                        Wähle die Systeme aus
                                    </div>
                                    {dropdownOpen && (
                                        <div className="dropdown-menu">
                                            {systemsList.map(system => (
                                                <div
                                                    key={system}
                                                    className={`dropdown-item ${issue.affectedSystems.includes(system) ? 'bg-gray-200' : ''}`}
                                                    onClick={() => handleAddSystem(system)}
                                                >
                                                    {issue.affectedSystems.includes(system) ? '✓ ' : ''}{system}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4 border p-4 rounded-lg">
                            <div>
                                <span className="ml-2">War die Auswirkung verständlich?</span>
                                <label className="flex items-center text-gray-700 dark:text-gray-300">
                                    <p className='bg-github-secondary dark:bg-github-dark-tertiary max-w-l rounded-lg shadow-md p-4'>
                                        {issue.impact}
                                    </p>
                                </label>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex space-x-4">
                                    <label className="flex items-center">
                                        <input type="radio" name="impactUnderstandable" value="yes" className="custom-radio" />
                                        <span className="ml-2">Ja</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="radio" name="impactUnderstandable" value="no" className="custom-radio" />
                                        <span className="ml-2">Nein</span>
                                    </label>
                                </div>
                                <textarea
                                    name="impactUnderstandable"
                                    value={responses.impactUnderstandable}
                                    onChange={handleChange}
                                    placeholder='Wenn nein, warum nicht?'
                                    className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4 border p-4 rounded-lg">
                            <div>
                                <span className="ml-2">Waren die aufgelisteten vorbeugenden Massnahmen verständlich und umsetzbar?</span>
                                <label className="flex items-center text-gray-700 dark:text-gray-300">
                                    <p className='bg-github-secondary dark:bg-github-dark-tertiary max-w-l rounded-lg shadow-md p-4'>
                                        {issue.preventativeMeasures}
                                    </p>
                                </label>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex space-x-4">
                                    <label className="flex items-center">
                                        <input type="radio" name="preventativeMeasuresUnderstandable" value="yes" className="custom-radio" />
                                        <span className="ml-2">Ja</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="radio" name="preventativeMeasuresUnderstandable" value="no" className="custom-radio" />
                                        <span className="ml-2">Nein</span>
                                    </label>
                                </div>
                                <textarea
                                    name="preventativeMeasuresUnderstandable"
                                    value={responses.preventativeMeasuresUnderstandable}
                                    onChange={handleChange}
                                    placeholder='Wenn nein, wieso und was war nicht umsetzbar?'
                                    className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4 border p-4 rounded-lg">
                            <label className="text-gray-700 dark:text-gray-300">
                                Wusstest du, was zu tun ist, um das Issue zu lösen?
                            </label>
                            <div className="flex flex-col">
                                <div className="flex space-x-4">
                                    <label className="flex items-center">
                                        <input type="radio" name="whatToDo" value="yes" className="custom-radio" />
                                        <span className="ml-2">Ja</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="radio" name="whatToDo" value="no" className="custom-radio" />
                                        <span className="ml-2">Nein</span>
                                    </label>
                                </div>
                                <textarea
                                    name="whatToDo"
                                    value={responses.whatToDo}
                                    onChange={handleChange}
                                    placeholder='Wenn nein, bitte beschreiben...'
                                    className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4 border p-4 rounded-lg">
                            <label className="text-gray-700 dark:text-gray-300">
                                Hast du den Lösungsvorschlag umgesetzt? Falls nein, wie hast du das Issue tatsächlich gelöst?
                            </label>
                            <div className="flex flex-col">
                                <div className="flex space-x-4">
                                    <label className="flex items-center">
                                        <input type="radio" name="implemented" value="yes" className="custom-radio" />
                                        <span className="ml-2">Ja</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="radio" name="implemented" value="no" className="custom-radio" />
                                        <span className="ml-2">Nein</span>
                                    </label>
                                </div>
                                <textarea
                                    name="implemented"
                                    value={responses.implemented}
                                    onChange={handleChange}
                                    placeholder='Wie hast du das Issue gelöst?'
                                    className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                        </div>



                        <div className="grid grid-cols-2 gap-4 mb-4 border p-4 rounded-lg">
                            <label className="text-gray-700 dark:text-gray-300">
                                Waren die AI-Vorschläge für das Issue relevant? Falls ja, waren die AI-Vorschläge klar und verständlich?

                            </label>
                            <div className="flex flex-col">
                                <div className="flex space-x-4">
                                    <label className="flex items-center">
                                        <input type="radio" name="clarityAISuggestions" value="yes" className="custom-radio" />
                                        <span className="ml-2">Ja</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="radio" name="clarityAISuggestions" value="no" className="custom-radio" />
                                        <span className="ml-2">Nein</span>
                                    </label>
                                </div>
                                <textarea
                                    name="relevanceAISuggestions"
                                    value={responses.relevanceAISuggestions}
                                    onChange={handleChange}
                                    placeholder='Wenn nein, was war nicht verständlich?'
                                    className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4 border p-4 rounded-lg">
                            <label className="text-gray-700 dark:text-gray-300">
                                Hast du die AI-Vorschläge umgesetzt? Falls ja, wie einfach war es diese umzusetzen von 0-5?
                            </label>
                            <div className="flex flex-col">
                                <div className="flex space-x-4">
                                    <label className="flex items-center">
                                        <input type="radio" name="implementationAISuggestions" value="yes" className="custom-radio" />
                                        <span className="ml-2">Ja</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="radio" name="implementationAISuggestions" value="no" className="custom-radio" />
                                        <span className="ml-2">Nein</span>
                                    </label>
                                </div>
                                <div className="flex space-x-4">
                                    <SliderComponent value={sliderRating} onChange={setSliderRating} min={1} max={5} />
                                </div>
                                <textarea
                                    name="implementationAISuggestions"
                                    value={responses.implementationAISuggestions}
                                    onChange={handleChange}
                                    placeholder='Wenn nein, warum nicht?'
                                    className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4 border p-4 rounded-lg">
                            <label className="text-gray-700 dark:text-gray-300">
                                Hast du Vorschläge zur Verbesserung der AI-Vorschläge?
                            </label>
                            <textarea
                                name="improvementAISuggestions"
                                value={responses.improvementAISuggestions}
                                onChange={handleChange}
                                placeholder='Bitte beschreiben...'
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                                    placeholder='Bitte beschreiben...'
                                    className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                        </div>



                        <div className="flex justify-end space-x-4 mt-6 border p-4 rounded-lg">
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

export default Feedback;
