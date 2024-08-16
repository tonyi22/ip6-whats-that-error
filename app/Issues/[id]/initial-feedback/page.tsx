'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAlertIcon, getAlertText, getPriorityText, getSeverityColor, severityTranslation } from '@/app/helperFunction';
import { SystemMonitoringIssue } from '@/app/data/data';
import SliderComponent from './Slider';
import SternComponent from './Stern';
import Tippy from '@tippyjs/react';
import { useTranslation } from '@/app/TranslationContext';

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
    const [starRating, setStarRating] = useState<number | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const router = useRouter();
    const [issue, setIssue] = useState<SystemMonitoringIssue | null>(null);
    const { translate, language } = useTranslation();
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
        if (starRating === null) {
            alert("Please select a star rating.");
            return;
        }
        setIsSubmitted(true);

        const issues = loadIssuesFromLocalStorage();
        // Update the issue's isInitialGiven property
        const updatedIssues = issues.map(issue => {
            if (issue.id === Number(params.id)) {
                return { ...issue, isInitialGiven: true, status: 'In Progress' as const, responses };
            }
            return issue;
        });

        // Save the updated issues array to local storage
        saveIssuesToLocalStorage(updatedIssues);
        router.push(`/Issues/${params.id}`)
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

            <form onSubmit={handleSubmit}>
                <div className="flex space-x-8 ">
                    <div className="w-1/2 bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-bold mb-4">Issue Details</h3>
                        <div className='flex justify-between items-center my-2 border p-4 rounded-lg' >
                            <div className='flex items-center space-x-2'>
                                <span>{translate("alertType")}:</span>
                                <Tippy content={<span>{getAlertText(issue.alertType, translate)}</span>}>
                                    <span>{getAlertIcon(issue.alertType)}</span>
                                </Tippy>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span>{translate("severity")}:</span>
                                <span className={`rounded-xl p-2 ${getSeverityColor(issue.severity)}`}>{language === 'en' ? issue.severity : severityTranslation[issue.severity]}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <p>{translate("priority")}: {getPriorityText(issue.priority,
                                    <span className='bg-gray-200 dark:bg-gray-500 rounded-xl p-2'>
                                        {`${issue.priority}/4`}
                                    </span>, translate)}</p>
                            </div>
                        </div>
                        <div className='border p-4 rounded-lg'>
                            <p className="">{translate("title")}:</p>
                            <h4 className="text-xl font-semibold mt-1">{issue.title ? issue.title : translate("missing")}</h4>
                        </div>
                        <div className='border p-4 rounded-lg mt-2'>
                            <p className="">{translate("description")}:</p>
                            <p className="mt-1" style={{ wordBreak: 'break-word', whiteSpace: 'pre-line' }}>{issue.description ? issue.description : translate("missing")}</p>
                        </div>
                    </div>

                    <div className="w-1/2 bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-bold mb-4">{translate("initialFeedback")}</h3>

                        {!issue.wizardFeedback &&
                            <div className="grid grid-cols-2 gap-4 mb-4 border p-4 rounded-lg">
                                <label className="">
                                    {translate("issueDescriptionClear")}
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
                                                required
                                            />
                                            <span className="ml-2">{translate("yes")}</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="issueClear"
                                                value="no"
                                                className="custom-radio"
                                                onChange={handleChange}
                                                required
                                            />
                                            <span className="ml-2">{translate("no")}</span>
                                        </label>
                                    </div>
                                    {responses.issueClear === 'no' && (
                                        <textarea
                                            name="issueClearDetails"
                                            onChange={handleChange}
                                            placeholder={translate("whatWasUnclear")}
                                            className="editable-input mt-2"
                                            required
                                        />
                                    )}
                                </div>
                            </div>}
                        {!issue.wizardFeedback &&
                            <div className="grid grid-cols-2 gap-4 mb-4 border p-4 rounded-lg">
                                <label className="">
                                    {translate("problemUnderstanding")}
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
                                                required
                                            />
                                            <span className="ml-2">{translate("yes")}</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="problemUnderstood"
                                                value="no"
                                                className="custom-radio"
                                                onChange={handleChange}
                                                required
                                            />
                                            <span className="ml-2">{translate("no")}</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="problemUnderstood"
                                                value="teilweise"
                                                className="custom-radio"
                                                onChange={handleChange}
                                                required
                                            />
                                            <span className="ml-2">{translate("partially")}</span>
                                        </label>
                                    </div>
                                    {(responses.problemUnderstood === 'no' || responses.problemUnderstood === 'teilweise') && (
                                        <textarea
                                            name="problemUnderstoodDetails"
                                            onChange={handleChange}
                                            placeholder={translate("whatDidntYouUnderstand")}
                                            className="editable-input mt-2"
                                            required
                                        />
                                    )}
                                </div>
                            </div>}

                        <div className="grid grid-cols-2 gap-4 mb-4 border p-4 rounded-lg">
                            <label className="">
                                {translate("missingImportantInfo")}
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
                                            required
                                        />
                                        <span className="ml-2">{translate("yes")}</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="infoMissing"
                                            value="no"
                                            className="custom-radio"
                                            onChange={handleChange}
                                            required
                                        />
                                        <span className="ml-2">{translate("no")}</span>
                                    </label>
                                </div>
                                {responses.infoMissing === 'yes' && (
                                    <textarea
                                        name="infoMissingDetails"
                                        onChange={handleChange}
                                        placeholder={translate("whatWasMissing")}
                                        className="editable-input mt-2"
                                        required
                                    />
                                )}
                            </div>
                        </div>

                        {!issue.wizardFeedback &&


                            <div className="grid grid-cols-2 gap-4 mb-4 border p-4 rounded-lg">
                                <label className="">
                                    {translate("requiredStepsKnowledge")}
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
                                                required
                                            />
                                            <span className="ml-2">{translate("yes")}</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="stepsKnown"
                                                value="no"
                                                className="custom-radio"
                                                onChange={handleChange}
                                                required
                                            />
                                            <span className="ml-2">{translate("no")}</span>
                                        </label>
                                    </div>
                                    {responses.stepsKnown === 'no' && (
                                        <textarea
                                            name="stepsKnownDetails"
                                            onChange={handleChange}
                                            placeholder={translate("pleaseDescribe")}
                                            className="editable-input mt-2"
                                            required
                                        />
                                    )}
                                </div>
                            </div>}



                        <div className="grid grid-cols-2 gap-4 mb-4 border p-4 rounded-lg">
                            <label className="">
                                {translate("issueClarityRating")}
                            </label>
                            <div className="flex flex-col justify-center">
                                <div className="flex space-x-4 items-center">
                                    <SternComponent rating={starRating} onChange={setStarRating} />
                                </div>
                                {isSubmitted && starRating === null && (
                                    <p className="text-red-500 text-sm mt-2">Rating is required.</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4 border p-4 rounded-lg">
                            <label className="">
                                {translate("priorityUnderstandability")}
                            </label>
                            <div className="flex flex-col">
                                <div className="flex space-x-4">
                                    <SliderComponent value={sliderRatingPriority} onChange={setSliderRatingPriority} min={1} max={4} />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4 border p-4 rounded-lg">
                            <label className="">
                                {translate("severityUnderstandability")}
                            </label>
                            <div className="flex flex-col">
                                <div className="flex space-x-4">
                                    <SliderComponent value={sliderRatingSeverity} onChange={setSliderRatingSeverity} min={1} max={4} />
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
                <div className="flex justify-end space-x-4 mt-6">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        {translate("cancel")}
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        {translate("submit")}
                    </button>
                </div>
            </form>
        </div >
    );
};

export default InitialFeedbackForm;
