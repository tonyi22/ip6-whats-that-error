'use client';

import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { FaCaretDown, FaCheck } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import systemMonitoringIssuesArray from '../page';
import '../[id]/detailView.css';
import { alertTypeTransaltion, compareSort, incidentTypeTranslationMapEnDe, severityTranslation, systemsList, translateIssueToEnglish } from '@/app/helperFunction';
import { MdCancel } from "react-icons/md";
import '../[id]/detailView.css';
import { Language, useTranslation } from '@/app/TranslationContext';
import { SystemMonitoringIssue } from '@/app/data/data';

const NewIssue = () => {
    const { translate, language } = useTranslation();
    const alertTypes = translate('alertTypes', false).split(', ');
    const severityTypes = translate('severityTypes', false).split(', ');
    const incidentTypes = translate("incidentTypes", false).split(', ');
    const prio = translate("prios", false).split(', ');

    const priorities = [
        { value: 1, label: prio[0] },
        { value: 2, label: prio[1] },
        { value: 3, label: prio[2] },
        { value: 4, label: prio[3] }
    ];

    const saveIssuesToLocalStorage = (issues: SystemMonitoringIssue[], language: Language) => {
        const translatedIssues = issues.map(issue => translateIssueToEnglish(issue, language));
        localStorage.setItem('issues', JSON.stringify(translatedIssues));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const storedIssues = JSON.parse(localStorage.getItem('issues') || '[]');

        storedIssues.push(newIssue);

        saveIssuesToLocalStorage(storedIssues, language);

        router.push('/Issues');
    };

    const [newIssue, setNewIssue] = useState({
        id: systemMonitoringIssuesArray.length + 1,
        title: '',
        description: '',
        alertType: 'Info',
        severity: 'Low',
        status: 'New',
        incidentType: 'Performance',
        priority: 1,
        affectedSystems: [] as string[],
        creator: 'User 1',
        timestamp: new Date(),
        endTime: new Date(),
        lastUpdated: new Date(),
        impact: '',
        preventativeMeasures: '',
        comments: [],
        attachments: [],
        duration: 0,
        isInitialGiven: false,
        commands: []
    });

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const titleInputRef = useRef<HTMLInputElement>(null);
    const descriptionInputRef = useRef<HTMLTextAreaElement>(null);

    const titleShowTempRef = useRef<HTMLButtonElement>(null);
    const descriptionShowTempRef = useRef<HTMLButtonElement>(null);

    const [showTitleTemplate, setShowTitleTemplate] = useState(false);
    const [titleTemplateDismissed, setTitleTemplateDismissed] = useState(false);
    const [showDescriptionTemplate, setShowDescriptionTemplate] = useState(false);
    const [descriptionTemplateDismissed, setDescriptionTemplateDismissed] = useState(false);

    const titleTemplateRef = useRef<HTMLDivElement>(null);
    const descriptionTemplateRef = useRef<HTMLDivElement>(null)

    const [suggestedDescription, setSuggestedDescription] = useState('');
    const [suggestionAccepted, setSuggestionAccepted] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(prev => !prev);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setDropdownOpen(false);
        }

        if (titleTemplateRef.current && !titleTemplateRef.current.contains(event.target as Node) &&
            titleInputRef.current && !titleInputRef.current.contains(event.target as Node) &&
            titleShowTempRef.current && !titleShowTempRef.current.contains(event.target as Node)) {
            setShowTitleTemplate(false);
            setTitleTemplateDismissed(true);
        }

        if (descriptionTemplateRef.current && !descriptionTemplateRef.current.contains(event.target as Node) &&
            descriptionInputRef.current && !descriptionInputRef.current.contains(event.target as Node) &&
            descriptionShowTempRef.current && !descriptionShowTempRef.current.contains(event.target as Node)) {
            setShowDescriptionTemplate(false);
            setDescriptionTemplateDismissed(true);
        }
    };

    const handleTitleTemplateButtonClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        showTemplateAgain('title');
    };

    const handleDescriptionTemplateButtonClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        showTemplateAgain('description');
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleAddSystem = (system: string) => {
        setNewIssue(prevState => ({
            ...prevState,
            affectedSystems: prevState.affectedSystems.includes(system)
                ? prevState.affectedSystems.filter(s => s !== system)
                : [...prevState.affectedSystems, system]
        }));
    };

    const handleRemoveSystem = (index: number) => {
        setNewIssue(prevState => ({
            ...prevState,
            affectedSystems: prevState.affectedSystems.filter((_, i) => i !== index)
        }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewIssue(prev => ({
            ...prev,
            [name]: name === 'priority' ? parseInt(value, 4) : value
        }));

        if (name === 'title') {
            checkForTitleSuggestion(value);
        } else if (name === 'description') {
            if (suggestionAccepted && value === '') {
                setSuggestedDescription('');
                setSuggestionAccepted(false);
            }
        }
    };

    const checkForTitleSuggestion = (title: string) => {
        const lowerCase = title.toLowerCase();
        if (lowerCase.includes(translate("database")) && lowerCase.includes(translate("overheating"))
        ) {
            setSuggestedDescription(translate("suggestedDescription"))
        } else {
            setSuggestedDescription('');
        }
    };

    const acceptSuggestion = () => {
        setNewIssue(prev => ({
            ...prev,
            description: suggestedDescription
        }));
        setSuggestionAccepted(true);
    };

    useEffect(() => {
        if (suggestionAccepted) {
            setSuggestedDescription('');
        }
    }, [suggestionAccepted]);

    const handleCancel = () => {
        router.push('/Issues');
    };

    const handleTitleFocus = () => {
        if (!titleTemplateDismissed) {
            setShowTitleTemplate(true);
        }
    };

    const handleCloseTitleTemplate = () => {
        setShowTitleTemplate(false);
        setTitleTemplateDismissed(true);
    };

    const handleDescriptionFocus = () => {
        if (!descriptionTemplateDismissed) {
            setShowDescriptionTemplate(true);
        }
    };

    const handleCloseDescriptionTemplate = () => {
        setShowDescriptionTemplate(false);
        setDescriptionTemplateDismissed(true);
    };

    const handleBlurTitle = () => {
        setTitleTemplateDismissed(true);
        setShowTitleTemplate(false);
    }

    const handleBlurDescription = () => {
        setDescriptionTemplateDismissed(true);
        setShowDescriptionTemplate(false);
    }

    const showTemplateAgain = (templateType: 'title' | 'description') => {
        if (templateType === 'title') {
            setShowTitleTemplate(true);
            setTitleTemplateDismissed(false);
        } else if (templateType === 'description') {
            setShowDescriptionTemplate(true);
            setDescriptionTemplateDismissed(false);
        }
    };
    const template = translate("templateDes", false).split(", ")

    return (
        <div className="flex justify-center my-10 p-8 bg-github-tertiary dark:bg-github-dark-background text-black dark:text-github-dark-text">
            <div className="bg-gradient-to-b from-[#fcf1fa] to-[#fefcff] my-10 bg-github-tertiary dark:bg-github-dark-background text-black dark:text-github-dark-text w-full max-w-4xl p-10 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold mb-4 text-center">{translate('createNewIssue')}</h3>
                <form onSubmit={handleSubmit}>
                    <div className='mb-4'>
                        <div>
                            <label className="block text-sm font-bold mb-2" htmlFor="title">{translate('title')} *</label>
                            <input
                                type="text"
                                name="title"
                                value={newIssue.title}
                                onChange={handleInputChange}
                                className="editable-input"
                                onFocus={handleTitleFocus}
                                onBlur={handleBlurTitle}
                                ref={titleInputRef}
                                required
                            />
                            {showTitleTemplate && (
                                <div
                                    ref={titleTemplateRef}
                                    className="relative mt-2 p-2 mb-4 bg-gray-50 border border-gray-300 rounded-lg shadow-md"
                                    style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
                                >
                                    <button
                                        type="button"
                                        className="absolute top-2 right-2"
                                        onClick={handleCloseTitleTemplate}
                                    >
                                        <MdCancel className="w-4 h-4 text-gray-700" />
                                    </button>
                                    <h4 className="font-semibold text-sm">{translate('titleTemp')}</h4>
                                    <div className="text-sm text-gray-700">
                                        <span className="font-semibold">Format:</span> {translate('titleTemplate')}
                                        <br />
                                        <span className="font-semibold">{translate('example')}:</span> {translate('titleTemplateExample')}
                                    </div>
                                </div>
                            )}

                            {titleTemplateDismissed && !showTitleTemplate && (
                                <button
                                    ref={titleShowTempRef}
                                    type="button"
                                    className="text-sm text-blue-500"
                                    onClick={handleTitleTemplateButtonClick}
                                >
                                    {translate("showTemplate")}
                                </button>
                            )}</div>
                    </div>

                    <div className='mb-4'>
                        <div >
                            <label className="block text-sm font-bold mb-2" htmlFor="description">{translate('description')} *</label>
                            <textarea
                                name="description"
                                value={suggestionAccepted ? newIssue.description : newIssue.description}
                                placeholder={suggestionAccepted ? '' : suggestedDescription}
                                onChange={handleInputChange}
                                className="editable-input"
                                onFocus={handleDescriptionFocus}
                                onBlur={handleBlurDescription}
                                ref={descriptionInputRef}
                                required
                            />

                            {!suggestionAccepted && suggestedDescription && newIssue.description === '' && (
                                <button
                                    type="button"
                                    className="mt-2 bg-blue-500 mb-4 text-white p-2 rounded-lg shadow-md"
                                    onClick={acceptSuggestion}
                                >
                                    {translate("acceptSuggestion")}
                                </button>
                            )}

                            {showDescriptionTemplate && (
                                <div
                                    ref={descriptionTemplateRef}
                                    className="relative mt-2 p-2 mb-4 bg-gray-50 border border-gray-300 rounded-lg shadow-md"
                                    style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
                                >
                                    <button
                                        type="button"
                                        className="absolute top-2 right-2"
                                        onClick={handleCloseDescriptionTemplate}
                                    >
                                        <MdCancel className="w-4 h-4 text-gray-700" />
                                    </button>
                                    <h4 className="font-semibold text-sm">{translate("descriptionTemplate")}</h4>
                                    <ol className="text-sm text-gray-700 list-decimal list-inside">
                                        <li>{template[0]}</li>
                                        <li>{template[1]}</li>
                                        <li>{template[2]}</li>
                                        <li>{template[3]}</li>
                                        <li>{template[4]}</li>
                                        <li>{template[5]}</li>
                                    </ol>
                                </div>
                            )}
                        </div>

                        {descriptionTemplateDismissed && !showDescriptionTemplate && (
                            <button
                                ref={descriptionShowTempRef}
                                type="button"
                                className="text-sm text-blue-500"
                                onClick={handleDescriptionTemplateButtonClick}
                            >
                                {translate("showTemplate")}
                            </button>
                        )}
                    </div>

                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <label className="block text-sm font-bold mb-2" htmlFor="alertType">{translate('alertType')}</label>
                            <select
                                name="alertType"
                                value={language === "en" ? newIssue.alertType : alertTypeTransaltion[newIssue.alertType]}
                                onChange={handleInputChange}
                                className="input border border-grey-800"
                            >
                                {alertTypes.map(type => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2" htmlFor="severity">{translate('severity')}</label>
                            <select
                                name="severity"
                                value={language === "en" ? newIssue.severity : severityTranslation[newIssue.alertType]}
                                onChange={handleInputChange}
                                className="input border border-grey-800"
                            >
                                {severityTypes.map(type => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2" htmlFor="incidentType">{translate('incidentType')}</label>
                            <select
                                name="incidentType"
                                value={language === "en" ? newIssue.incidentType : incidentTypeTranslationMapEnDe[newIssue.incidentType]}
                                onChange={handleInputChange}
                                className="input border border-grey-800"
                            >
                                {incidentTypes.sort(compareSort).map(type => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2" htmlFor="priority">{translate('priority')}</label>
                            <select
                                name="priority"
                                value={newIssue.priority}
                                onChange={handleInputChange}
                                className="input border border-grey-800"
                            >
                                {priorities.map(priority => (
                                    <option key={priority.value} value={priority.value}>
                                        {priority.value}:   {priority.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-2" htmlFor="affectedSystems">{translate('affectedSystems')}</label>

                        <div className="flex space-x-4 h-full">
                            <div className="relative inline-block min-h-[45px]" ref={dropdownRef}>
                                <div className="cursor-pointer" onClick={toggleDropdown}>
                                    <div className="cursor-pointer flex items-center border rounded-md py-1 px-4 bg-white shadow-sm min-h-[45px]">
                                        {translate('choseSystem')}
                                        <FaCaretDown className="ml-1" />
                                    </div>
                                </div>
                                {dropdownOpen && (
                                    <div className="absolute bg-white border border-gray-300 rounded-lg mt-1 z-10 max-h-60 overflow-y-auto shadow-lg w-64">
                                        {systemsList.map(system => (
                                            <div
                                                key={system}
                                                className="cursor-pointer px-4 py-2 hover:bg-gray-100 flex items-center justify-between"
                                                onClick={() => handleAddSystem(system)}
                                            >
                                                {system}
                                                {newIssue.affectedSystems.includes(system) && <FaCheck className="text-green-500" />}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex-grow border bg-white border-gray-300 rounded-md px-2 max-h-60 overflow-y-auto min-h-[40px] flex flex-col justify-center">
                                {newIssue.affectedSystems.length > 0 ? (
                                    newIssue.affectedSystems.map((system, index) => (
                                        <div key={index} className={`flex items-center ${index !== newIssue.affectedSystems.length - 1 ? 'border-b border-gray-300' : ''} min-h-[40px]`}>
                                            <span className="flex-grow">{system}</span>
                                            <button type="button" onClick={() => handleRemoveSystem(index)} className="ml-2 text-red-500">Remove</button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-gray-500 cursor-default">{translate('noSystem')}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-2" htmlFor="impact">{translate('impact')}</label>
                        <textarea
                            name="impact"
                            value={newIssue.impact}
                            onChange={handleInputChange}
                            className="editable-input"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-2" htmlFor="preventativeMeasures">{translate('preventativeMeasures')}</label>
                        <textarea
                            name="preventativeMeasures"
                            value={newIssue.preventativeMeasures}
                            onChange={handleInputChange}
                            className="editable-input"
                        />
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={handleCancel} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline">{translate('cancel')}</button>
                        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline">{translate('createIssue')}</button>
                    </div>
                </form>
            </div>
        </div>

    );
};

export default NewIssue;
