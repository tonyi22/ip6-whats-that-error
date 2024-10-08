'use client'

import React, { useEffect, useState, useRef } from 'react';
import '../detailView.css';
import { alertTypeTransaltion, compareSort, getAlertIcon, getAlertText, getSeverityColor, incidentTypeTranslationMapEnDe, severityTranslation, systemsList } from '@/app/helperFunction';
import SliderComponent from './Slider';
import SternComponent from './Stern';
import { useRouter } from 'next/navigation';
import { SystemMonitoringIssue } from '@/app/data/data';
import { FaCaretDown, FaCheck } from 'react-icons/fa';
import Tippy from '@tippyjs/react';
import { useTranslation } from '@/app/TranslationContext';

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

function Feedback({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [issue, setIssue] = useState<SystemMonitoringIssue | null>(null);
    const [sliderRating, setSliderRating] = useState(3);
    const [starRating, setStarRating] = useState(0);
    const { translate, language } = useTranslation()

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
        titleReason: '',
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
        titleUnderstandable: '',
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
        if (issue) {
            const updatedIssue = { ...issue, status: 'Closed' as const };
            setIssue(updatedIssue);
            const issues = loadIssuesFromLocalStorage();
            const index = issues.findIndex(i => i.id === issue.id);
            if (index !== -1) {
                issues[index] = updatedIssue;
                saveIssuesToLocalStorage(issues);
            }
        }
    };

    useEffect(() => {
        const issues = loadIssuesFromLocalStorage();
        const foundIssue = issues.find(issue => issue.id === Number(params.id));
        if (foundIssue) {
            setIssue(foundIssue);
        }
    }, [params.id]);

    if (!issue) {
        return <div>Issue not found</div>;
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


            <div className="space-x-8">

                <div className="">
                    <h3 className=" text-2xl font-bold mb-4 text-center ">{translate("final")}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white grid grid-cols-[60%_40%] gap-4 mb-4 border p-4 rounded-lg">
                            <div>
                                <span className="ml-2">{translate("issueTitleClarity")}</span>
                                <label className="flex items-center text-gray-700 dark:text-gray-300">
                                    <p className="max-h-96 overflow-y-auto bg-github-secondary dark:bg-github-dark-tertiary max-w-l mt-2 ml-2 rounded-lg shadow-md p-4"
                                        style={{ wordBreak: 'break-word', whiteSpace: 'pre-line', maxHeight: '1050px' }}
                                    >
                                        {issue.title ? issue.title : translate("missing")}
                                    </p>
                                </label>
                            </div>
                            <div className="flex flex-col pr-4">
                                <div className="flex space-x-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="titleUnderstandable"
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
                                            name="titleUnderstandable"
                                            value="no"
                                            className="custom-radio"
                                            onChange={handleChange}
                                            required
                                        />
                                        <span className="ml-2">{translate("no")}</span>
                                    </label>
                                </div>
                                {responses.titleUnderstandable === 'no' && (
                                    <>
                                        <textarea
                                            name="titleReason"
                                            value={responses.titleReason}
                                            onChange={handleChange}
                                            placeholder={translate("whatWasUnclear")}
                                            className="editable-input mt-3"
                                            required
                                        />
                                    </>
                                )}
                            </div>
                        </div>

                        <div> {issue.isInitialGiven || issue.wizardFeedback ?

                            null : <div className="bg-white grid grid-cols-[60%_40%] gap-4 mb-4 border p-4 rounded-lg">
                                <div>
                                    <span className="ml-2">{translate("issueDescriptionClarity")}</span>
                                    <label className="flex items-center text-gray-700 dark:text-gray-300">
                                        <p className="max-h-96 overflow-y-auto bg-github-secondary dark:bg-github-dark-tertiary max-w-l mt-2 ml-2 rounded-lg shadow-md p-4"
                                            style={{ wordBreak: 'break-word', whiteSpace: 'pre-line', maxHeight: '1050px' }}
                                        >
                                            {issue.description ? issue.description : translate("missing")}
                                        </p>
                                    </label>
                                </div>
                                <div className="flex flex-col pr-4">
                                    <div className="flex space-x-4">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="descriptionUnderstandable"
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
                                                name="descriptionUnderstandable"
                                                value="no"
                                                className="custom-radio"
                                                onChange={handleChange}
                                                required
                                            />
                                            <span className="ml-2">{translate("no")}</span>
                                        </label>
                                    </div>
                                    {responses.descriptionUnderstandable === 'no' && (
                                        <>
                                            <textarea
                                                name="descriptionReason"
                                                value={responses.descriptionReason}
                                                onChange={handleChange}
                                                placeholder={translate("whatWasUnclear")}
                                                className="editable-input mt-3"
                                                required
                                            />
                                        </>
                                    )}
                                </div>
                            </div>}

                        </div>

                        <div className="bg-white grid grid-cols-[60%_40%] gap-4 mb-4 p-4 border rounded-lg">
                            <div>
                                <span className="ml-2 ">{translate("wasAlertTypeCorrect")}</span>
                                <label className="flex mt-2 ml-2 items-center text-gray-700 dark:text-gray-300">
                                    <Tippy content={<span>{getAlertText(issue.alertType, translate)}</span>}>
                                        <span>{getAlertIcon(issue.alertType)}</span>
                                    </Tippy>
                                </label>
                            </div>
                            <div className="flex flex-col pr-4">
                                <div className="flex space-x-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="alertIconUnderstandable"
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
                                            name="alertIconUnderstandable"
                                            value="no"
                                            className="custom-radio"
                                            onChange={handleChange}
                                            required
                                        />
                                        <span className="ml-2">{translate("no")}</span>
                                    </label>
                                </div>
                                {responses.alertIconUnderstandable === 'no' && (
                                    <>
                                        <p className='mt-4 mb-1 ml-1 text-sm'>{translate("chooseCorrectType")}</p>
                                        <div className="inline-block">
                                            <select
                                                name="correctAlertType"
                                                value={responses.correctAlertType === '' ? language === 'en' ? issue.alertType : alertTypeTransaltion[issue.alertType] : responses.correctAlertType}
                                                onChange={handleChange}
                                                className="mt-2 input border border-grey-800 w-auto"
                                                required
                                            >
                                                {translate("alertTypes", false).split(", ").map(type => (
                                                    <option key={type} value={type} disabled={type === (language === 'en' ? issue.alertType : alertTypeTransaltion[issue.alertType])}>
                                                        {type}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <textarea
                                            name="alertIconReason"
                                            value={responses.alertIconReason}
                                            onChange={handleChange}
                                            placeholder={translate("justifyNewAlertType")}
                                            className="editable-input mt-3"
                                            required
                                        />
                                    </>

                                )}
                            </div>
                        </div>

                        <div className="bg-white grid grid-cols-[60%_40%] gap-4 mb-4 border p-4 rounded-lg">
                            <div className="flex flex-col">
                                <span className="ml-2">{translate("wasIncidentTypeCorrectlyCategorized")}</span>
                                <label className="mt-2 ml-2 flex items-center text-gray-700 dark:text-gray-300">
                                    <span className="bg-gray-200 dark:bg-gray-500 rounded-xl p-2">{language === 'en' ? issue.incidentType : incidentTypeTranslationMapEnDe[issue.incidentType]}</span>
                                </label>
                            </div>
                            <div className="flex flex-col pr-4">
                                <div className="flex space-x-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="incidentTypeUnderstandable"
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
                                            name="incidentTypeUnderstandable"
                                            value="no"
                                            className="custom-radio"
                                            onChange={handleChange}
                                            required
                                        />
                                        <span className="ml-2">{translate("no")}</span>
                                    </label>
                                </div>
                                {responses.incidentTypeUnderstandable === 'no' && (
                                    <>
                                        <p className='mt-4 mb-1 ml-1 text-sm'>{translate("chooseCorrectType")}</p>
                                        <div className="inline-block">
                                            <select
                                                name="correctIncidentType"
                                                value={responses.correctIncidentType === '' ? language === 'en' ? issue.incidentType : incidentTypeTranslationMapEnDe[issue.incidentType] : responses.correctIncidentType}
                                                onChange={handleChange}
                                                className="mt-2 input border border-grey-500 w-auto"
                                                required
                                            >
                                                {translate("incidentTypes", false).split(", ").sort(compareSort).map(type => (
                                                    <option key={type} value={type} disabled={type === (language === 'en' ? issue.incidentType : incidentTypeTranslationMapEnDe[issue.incidentType])}>{type}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="bg-white grid grid-cols-[60%_40%] gap-4 mb-4 border p-4 rounded-lg">
                            <div>
                                <label className="ml-2">
                                    {translate("wasAISolutionRelevant")}
                                </label>
                                <label className="mt-2 ml-2 flex items-center text-gray-700 dark:text-gray-300">

                                    <p className='bg-github-secondary dark:bg-github-dark-tertiary max-w-l rounded-lg shadow-md p-4'>
                                        {issue.loesungsvorschlag ? issue.loesungsvorschlag : translate("missing")}
                                    </p>

                                </label>
                            </div>

                            <div className="flex flex-col pr-4">
                                <div className="flex space-x-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="clarityAISuggestions"
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
                                            name="clarityAISuggestions"
                                            value="no"
                                            className="custom-radio"
                                            onChange={handleChange}
                                            required
                                        />
                                        <span className="ml-2">{translate("no")}</span>
                                    </label>
                                </div>
                                {responses.clarityAISuggestions === 'yes' && (
                                    <textarea
                                        name="relevanceAISuggestions"
                                        value={responses.relevanceAISuggestions}
                                        onChange={handleChange}
                                        placeholder={translate('wereAISuggestionsClear')}
                                        className="editable-input mt-3"
                                        required
                                    />
                                )}
                                {responses.clarityAISuggestions === 'no' && (
                                    <textarea
                                        name="relevanceAISuggestions"
                                        value={responses.relevanceAISuggestions}
                                        onChange={handleChange}
                                        placeholder={translate("whySuggestionsNotRelevant")}
                                        className="editable-input mt-3"
                                        required
                                    />
                                )}
                            </div>
                        </div>
                        <div>
                            {issue.isInitialGiven || issue.wizardFeedback ? null :
                                <div className="bg-white grid grid-cols-[60%_40%] gap-4 mb-4 border p-4 rounded-lg">
                                    <label className="ml-2">
                                        {translate("didYouKnowHowToResolve")}
                                    </label>
                                    <div className="flex flex-col pr-4">
                                        <div className="flex space-x-4">
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="whatToDo"
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
                                                    name="whatToDo"
                                                    value="no"
                                                    className="custom-radio"
                                                    onChange={handleChange}
                                                    required
                                                />
                                                <span className="ml-2">{translate("no")}</span>
                                            </label>
                                        </div>
                                        {responses.whatToDo === 'no' && (
                                            <textarea
                                                name="whatToDoReason"
                                                value={responses.whatToDoReason}
                                                onChange={handleChange}
                                                placeholder={translate("whereIsInformationMissing")}
                                                className="editable-input mt-3"
                                                required
                                            />
                                        )}
                                    </div>
                                </div>
                            }
                        </div>

                        <div className="bg-white grid grid-cols-[60%_40%] gap-4 mb-4 border p-4 rounded-lg">
                            <div>
                                <span className="ml-2">{translate("impactUnderstandable")}</span>
                                <label className="mt-2 ml-2 flex items-center text-gray-700 dark:text-gray-300">

                                    <p className='bg-github-secondary dark:bg-github-dark-tertiary max-w-l rounded-lg shadow-md p-4'>
                                        {issue.impact ? issue.impact : translate("missing")}
                                    </p>

                                </label>
                            </div>
                            <div className="flex flex-col pr-4">
                                <div className="flex space-x-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="impactUnderstandable"
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
                                            name="impactUnderstandable"
                                            value="no"
                                            className="custom-radio"
                                            onChange={handleChange}
                                            required
                                        />
                                        <span className="ml-2">{translate("no")}</span>
                                    </label>
                                </div>
                                {responses.impactUnderstandable === 'no' && (
                                    <textarea
                                        name="impactReason"
                                        value={responses.impactReason}
                                        onChange={handleChange}
                                        placeholder={translate("whatWasUnclear")}
                                        className="editable-input mt-3"
                                        required
                                    />
                                )}
                            </div>
                        </div>

                        <div>
                            {issue.isInitialGiven ? null :
                                <div className="bg-white grid grid-cols-[60%_40%] gap-4 mb-4 border p-4 rounded-lg">
                                    <div className="flex flex-col">
                                        <span className="ml-2">{translate("priorityUnderstandable")}</span>
                                        <label className="mt-2 ml-2 flex items-center text-gray-700 dark:text-gray-300">
                                            <span className="bg-gray-200 dark:bg-gray-500 rounded-xl p-2">{issue.priority}/4</span>
                                        </label>
                                    </div>
                                    <div className="flex flex-col pr-4">
                                        <div className="flex space-x-4">
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="priorityUnderstandable"
                                                    value="yes"
                                                    className="custom-radio"
                                                    onChange={handleChange}
                                                />
                                                <span className="ml-2">{translate("yes")}</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="priorityUnderstandable"
                                                    value="no"
                                                    className="custom-radio"
                                                    onChange={handleChange}
                                                />
                                                <span className="ml-2">{translate("no")}</span>
                                            </label>
                                        </div>
                                        {responses.priorityUnderstandable === 'no' && (
                                            <>
                                                <p className='mt-4 mb-1 ml-1 text-sm'>{translate("selectCorrectPriority")}</p>
                                                <div className="inline-block">
                                                    <select
                                                        name="correctPriority"
                                                        value={responses.correctPriority === '' ? issue.priority : responses.correctPriority}
                                                        onChange={handleChange}
                                                        className="mt-2 input border border-grey-800 w-auto"
                                                        defaultValue=""
                                                    >
                                                        {[...Array(4)].map((_, i) => (
                                                            <option key={i + 1} value={i + 1} disabled={i + 1 === issue.priority}>{i + 1}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <textarea
                                                    name="priorityReason"
                                                    value={responses.priorityReason}
                                                    onChange={handleChange}
                                                    placeholder={translate("reasonForNewPriority")}
                                                    className="editable-input mt-3"
                                                />
                                            </>
                                        )}
                                    </div>
                                </div>}
                        </div>

                        <div className="bg-white grid grid-cols-[60%_40%] gap-4 mb-4 border p-4 rounded-lg">
                            <div>
                                <span className="ml-2">{translate("affectedSystemsCorrect")}</span>
                                <div className={`flex-grow text-gray-700 mt-2 py-1 px-2 max-h-60 overflow-y-auto min-h-[40px] flex w-96 flex-col justify-center mt-2 ${issue.affectedSystems.length !== 0 ? 'rounded-lg shadow-md' : ''}`}>
                                    {issue.affectedSystems.length > 0 ?

                                        issue.affectedSystems.map((system, index) => (
                                            <div key={index} className={`flex items-center ${index !== issue.affectedSystems.length - 1 ? 'border-b border-gray-300' : ''} min-h-[40px]`}>
                                                <span className="flex-grow">{system}</span>
                                            </div>
                                        )) :
                                        <label className="mt-2 flex items-center text-gray-700 dark:text-gray-300">

                                            <p className='bg-github-secondary dark:bg-github-dark-tertiary max-w-l rounded-lg shadow-md p-4'>
                                                {translate("missing")}
                                            </p>

                                        </label>}
                                </div>
                            </div>
                            <div className="flex flex-col pr-4">
                                <div className="flex space-x-4 ">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="affSystems"
                                            value="yes"
                                            className="custom-radio"
                                            onChange={handleChange}
                                        />
                                        <span className="ml-2">{translate("yes")}</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="affSystems"
                                            value="no"
                                            className="custom-radio"
                                            onChange={handleChange}
                                        />
                                        <span className="ml-2">{translate("no")}</span>
                                    </label>
                                </div>
                                {responses.affSystems === 'no' && (
                                    <div className="relative inline-block min-h-[45px] mt-2" ref={dropdownRef}>
                                        <div
                                            className="cursor-pointer"
                                            onClick={toggleDropdown}
                                        >
                                            <div className="cursor-pointer inline-flex items-center border rounded-md py-1 px-4 bg-white shadow-sm min-h-[45px]">
                                                {translate("choseSystem")}
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

                        <div>
                            {issue.isInitialGiven ? null :
                                <div className=" bg-white grid grid-cols-[60%_40%] gap-4 mb-4 border p-4 rounded-lg">
                                    <div>
                                        <span className="ml-2 block text-left">{translate("severityUnderstandable")}</span>
                                        <label className="flex mt-2 ml-2 items-center text-gray-700 dark:text-gray-300">
                                            <span className={`rounded-xl p-2 ${getSeverityColor(issue.severity)}`}>{issue.severity}</span>
                                        </label>
                                    </div>
                                    <div className="flex flex-col pr-4">
                                        <div className="flex space-x-4">
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="severityUnderstandable"
                                                    value="yes"
                                                    className="custom-radio"
                                                    onChange={handleChange}
                                                />
                                                <span className="ml-2">{translate("yes")}</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="severityUnderstandable"
                                                    value="no"
                                                    className="custom-radio"
                                                    onChange={handleChange}
                                                />
                                                <span className="ml-2">{translate("no")}</span>
                                            </label>
                                        </div>
                                        {responses.severityUnderstandable === 'no' && (
                                            <>
                                                <p className='mt-4 mb-1 ml-1 text-sm'>{translate("selectCorrectSeverity")}</p>
                                                <div className="inline-block">
                                                    <select
                                                        name="correctSeverity"
                                                        value={responses.correctSeverity === '' ? language === 'en' ? issue.severity : severityTranslation[issue.severity] : responses.correctSeverity}
                                                        onChange={handleChange}
                                                        className="mt-2 input border border-grey-800 w-auto"
                                                    >
                                                        {translate("severityTypes", false).split(", ").map(severity => (
                                                            <option key={severity} value={severity} disabled={severity === (language === 'en' ? issue.severity : severityTranslation[issue.severity])}>
                                                                {severity}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <textarea
                                                    name="severityReason"
                                                    value={responses.severityReason}
                                                    onChange={handleChange}
                                                    placeholder={translate("reasonForNewSeverity")}
                                                    className="editable-input mt-3"
                                                />
                                            </>
                                        )}
                                    </div>
                                </div>
                            }
                        </div>

                        <div className="bg-white grid grid-cols-[60%_40%] gap-4 mb-4 border p-4 rounded-lg">
                            <label className="ml-2">
                                {translate("solutionImplemented")}
                            </label>
                            <div className="flex flex-col pr-4">
                                <div className="flex space-x-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="implemented"
                                            value="yes"
                                            className="custom-radio"
                                            onChange={handleChange}
                                        />
                                        <span className="ml-2">{translate("yes")}</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="implemented"
                                            value="no"
                                            className="custom-radio"
                                            onChange={handleChange}
                                        />
                                        <span className="ml-2">{translate("no")}</span>
                                    </label>
                                </div>
                                {responses.implemented === 'no' && (
                                    <textarea
                                        name="implementedReason"
                                        value={responses.implementedReason}
                                        onChange={handleChange}
                                        placeholder={translate("issueResolved")}
                                        className="editable-input mt-3"
                                    />
                                )}
                                {responses.implemented === 'yes' && (
                                    <>
                                        <p className='mt-4 mb-1 ml-1 text-sm'>{translate("implementationEase")}</p>
                                        <div className="flex space-x-4">
                                            <SliderComponent value={sliderRating} onChange={setSliderRating} min={1} max={4} />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="bg-white grid grid-cols-[60%_40%] mb-4 border p-4 rounded-lg ">
                            <div className='ml-2'>
                                <label>
                                    {translate("overallSatisfactionWithAIServices")}
                                </label>
                                <div className="flex flex-col">
                                    <div className="flex">
                                        <SternComponent rating={starRating} onChange={setStarRating} />
                                    </div>
                                    <textarea
                                        name="overallSatisfactionAISuggestions"
                                        value={responses.overallSatisfactionAISuggestions}
                                        onChange={handleChange}
                                        placeholder={translate("explainYourRating")}
                                        className="editable-input mt-3"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4 mt-6 p-4 rounded-lg">
                            <button
                                type="button"
                                onClick={() => {

                                    router.push(`/Issues/${issue.id}`);
                                }}
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                {translate("cancel")}
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline"
                                onClick={() => {
                                    router.push("/Issues");
                                }}
                            >
                                {translate("submit")}
                            </button>
                        </div>
                    </form>
                </div>
            </div >
        </div >
    );
};

export default Feedback;
