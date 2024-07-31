'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getAlertIcon, getAlertText, getPriorityText, getSeverityColor } from '@/app/helperFunction';
import { SystemMonitoringIssue } from '@/app/data/data';
import SliderComponent from './Slider';
import SternComponent from './Stern';
import Tippy from '@tippyjs/react';


const loadIssuesFromLocalStorage = (): SystemMonitoringIssue[] => {
    const storedIssues = localStorage.getItem('issues');
    if (storedIssues) {
        return JSON.parse(storedIssues);
    }
    return [];
};

function InitialFeedbackForm({ params }: { params: { id: string } }) {
    const [sliderRatingPriority, setSliderRatingPriority] = useState(3);
    const [sliderRatingSeverity, setSliderRatingSeverity] = useState(3);
    const [starRating, setStarRating] = useState(0);
    const [thumbsRating, setThumbsRating] = useState(0);
    const [feedbackText, setFeedbackText] = useState('');
    const [emojiRating, setEmojiRating] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const router = useRouter();
    const [issue, setIssue] = useState<SystemMonitoringIssue | null>(null);
    const [responses, setResponses] = useState({
        issueClear: '',
        problemUnderstood: '',
        stepsKnown: '',
        infoMissing: '',
        issueClearDetails: '',
        problemUnderstoodDetails: '',
        stepsKnownDetails: '',
        infoMissingDetails: '',
    });

    useEffect(() => {
        const issues = loadIssuesFromLocalStorage();
        const foundIssue = issues.find(issue => issue.id === Number(params.id));
        if (foundIssue) {
            setIssue(foundIssue);
        } else {
            console.log(`Issue mit ID ${params.id} nicht gefunden`);
        }
    }, [params.id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setResponses(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const saveIssuesToLocalStorage = (issues: SystemMonitoringIssue[]) => {
        localStorage.setItem('issues', JSON.stringify(issues));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const issues = loadIssuesFromLocalStorage();
        // Update the issue's isInitialGiven property
        const updatedIssues = issues.map(issue => {
            if (issue.id === Number(params.id)) {
                return { ...issue, isInitialGiven: true, responses };
            }
            return issue;
        });

        // Save the updated issues array to local storage
        saveIssuesToLocalStorage(updatedIssues);
        console.log('Submitted responses:', responses);
        router.push('/Issues')
    };



    if (!issue) {
        return <div>Issue nicht gefunden</div>;
    }



    return (



        <div className="bg-gradient-to-b from-[#fcf1fa] to-[#fefcff] max-w-6xl mx-auto my-10 p-8 bg-github-tertiary dark:bg-github-dark-background text-black dark:text-github-dark-text rounded-lg shadow-md">

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

            <div className="flex space-x-8 ">
                <div className="w-1/2 bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-2xl font-bold mb-4">Issue Details</h3>
                    <div className='flex justify-between items-center my-2'>
                        <div className='flex items-center space-x-2'>
                            <span>Alert icon:</span>
                            <Tippy content={<span>{getAlertText(issue.alertType)}</span>}>
                                <span>{getAlertIcon(issue.alertType)}</span>
                            </Tippy>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span>Severity:</span>
                            <span className={`rounded-xl p-2 ${getSeverityColor(issue.severity)}`}>{issue.severity}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <p>Priority: {getPriorityText(issue.priority,
                                <span className='bg-gray-200 dark:bg-gray-500 rounded-xl p-2'>
                                    {`${issue.priority}/4`}
                                </span>)}</p>


                        </div>
                    </div>
                    <h4 className="text-xl font-semibold mt-5">{issue.title}</h4>
                    <p className="mt-5" style={{ wordBreak: 'break-word', whiteSpace: 'pre-line' }}>{issue.description}</p>
                </div>

                <div className="w-1/2 bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-2xl font-bold mb-4">Initial Feedback</h3>
                    <form onSubmit={handleSubmit}>
                        {!issue.wizardFeedback &&
                            <div className="grid grid-cols-2 gap-4 mb-4 border p-4 rounded-lg">
                                <label className="">
                                    Ist die Beschreibung des Issues klar?
                                </label>
                                <div className="flex flex-col">
                                    <div className="flex space-x-4">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="issueClear"
                                                value="yes"
                                                className="custom-radio"
                                                onChange={handleChange}
                                            />
                                            <span className="ml-2">Ja</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="issueClear"
                                                value="no"
                                                className="custom-radio"
                                                onChange={handleChange}
                                            />
                                            <span className="ml-2">Nein</span>
                                        </label>
                                    </div>
                                    {responses.issueClear === 'no' && (
                                        <textarea
                                            name="issueClearDetails"
                                            onChange={handleChange}
                                            placeholder='Was war nicht klar?'
                                            className="editable-input mt-2"
                                        />
                                    )}
                                </div>
                            </div>}
                        {!issue.wizardFeedback &&
                            <div className="grid grid-cols-2 gap-4 mb-4 border p-4 rounded-lg">
                                <label className="">
                                    Hast du sofort verstanden, was das Problem ist?
                                </label>
                                <div className="flex flex-col">
                                    <div className="flex space-x-4">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="problemUnderstood"
                                                value="yes"
                                                className="custom-radio"
                                                onChange={handleChange}
                                            />
                                            <span className="ml-2">Ja</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="problemUnderstood"
                                                value="no"
                                                className="custom-radio"
                                                onChange={handleChange}
                                            />
                                            <span className="ml-2">Nein</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="problemUnderstood"
                                                value="teilweise"
                                                className="custom-radio"
                                                onChange={handleChange}
                                            />
                                            <span className="ml-2">Teilweise</span>
                                        </label>
                                    </div>
                                    {(responses.problemUnderstood === 'no' || responses.problemUnderstood === 'teilweise') && (
                                        <textarea
                                            name="problemUnderstoodDetails"
                                            onChange={handleChange}
                                            placeholder='Was hast du nicht verstanden?'
                                            className="editable-input mt-2"
                                        />
                                    )}
                                </div>
                            </div>}
                        {!issue.wizardFeedback &&
                            <div className="grid grid-cols-2 gap-4 mb-4 border p-4 rounded-lg">
                                <label className="">
                                    Wusstest du, welche Schritte zur Lösung des Issues erforderlich sind?
                                </label>
                                <div className="flex flex-col">
                                    <div className="flex space-x-4">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="stepsKnown"
                                                value="yes"
                                                className="custom-radio"
                                                onChange={handleChange}
                                            />
                                            <span className="ml-2">Ja</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="stepsKnown"
                                                value="no"
                                                className="custom-radio"
                                                onChange={handleChange}
                                            />
                                            <span className="ml-2">Nein</span>
                                        </label>
                                    </div>
                                    {responses.stepsKnown === 'no' && (
                                        <textarea
                                            name="stepsKnownDetails"
                                            onChange={handleChange}
                                            placeholder='Bitte beschreiben...'
                                            className="editable-input mt-2"
                                        />
                                    )}
                                </div>
                            </div>}

                        <div className="grid grid-cols-2 gap-4 mb-4 border p-4 rounded-lg">
                            <label className="">
                                Fehlen dir wichtige Informationen?
                            </label>
                            <div className="flex flex-col">
                                <div className="flex space-x-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="infoMissing"
                                            value="yes"
                                            className="custom-radio"
                                            onChange={handleChange}
                                        />
                                        <span className="ml-2">Ja</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="infoMissing"
                                            value="no"
                                            className="custom-radio"
                                            onChange={handleChange}
                                        />
                                        <span className="ml-2">Nein</span>
                                    </label>
                                </div>
                                {responses.infoMissing === 'yes' && (
                                    <textarea
                                        name="infoMissingDetails"
                                        onChange={handleChange}
                                        placeholder='Was hat dir gefehlt?'
                                        className="editable-input mt-2"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4 border p-4 rounded-lg">
                            <label className="">
                                Wie würdest du die Verständlichkeit des Issues bewerten?
                            </label>
                            <div className="flex flex-col justify-center">
                                <div className="flex space-x-4 items-center">
                                    <SternComponent rating={starRating} onChange={setStarRating} />
                                </div>
                            </div>
                        </div>




                        <div className="grid grid-cols-2 gap-4 mb-4 border p-4 rounded-lg">
                            <label className="">
                                Wie nachvollziehbar ist die Priorität?
                            </label>
                            <div className="flex flex-col">
                                <div className="flex space-x-4">
                                    <SliderComponent value={sliderRatingPriority} onChange={setSliderRatingPriority} min={1} max={4} />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4 border p-4 rounded-lg">
                            <label className="">
                                Wie nachvollziehbar ist die Severity?
                            </label>
                            <div className="flex flex-col">
                                <div className="flex space-x-4">
                                    <SliderComponent value={sliderRatingSeverity} onChange={setSliderRatingSeverity} min={1} max={4} />
                                </div>
                            </div>
                        </div>


                    </form>

                </div>

            </div>
            <div className="flex justify-end space-x-4 mt-6">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default InitialFeedbackForm;
