'use client';

import React, { useEffect, useState, useRef } from 'react';
import { IoArrowBackOutline } from "react-icons/io5";
import { FaCaretDown, FaCheck } from 'react-icons/fa';
import Link from 'next/link';
import { formatDate, getAlertIcon, getSeverityColor, validateType, compareSort, getPriorityText, getAlertText, incidentTypeTranslationMapEnDe, severityTranslation, statusTranslation, alertTypeTransaltion, translateIssueToEnglish, systemsList, calculateDaysSinceTimestamp } from '@/app/helperFunction';
import { SystemMonitoringIssue } from '@/app/data/data';
import { TabComponent } from './TabComponent';
import './detailView.css';
import { CiEdit } from "react-icons/ci";
import Tippy from '@tippyjs/react';
import { AiOutlineWechatWork } from "react-icons/ai";
import ChatBubble from './ChatBubble';
import { IoTerminal } from "react-icons/io5";
import { MdCancel } from "react-icons/md";
import { IoIosHelpCircle } from "react-icons/io";
import Terminal from './Terminal';
import { GoSidebarCollapse, GoSidebarExpand } from 'react-icons/go';
import { useSearchParams } from 'next/navigation';
import { Language, useTranslation } from '@/app/TranslationContext';

export const labels = (label: string, help: string) => {
    return (
        <div className='flex items-center pb-2 justify-between'>
            <p className='font-bold'>{label}</p>
            <Tippy theme="tomato-theme" content={<span>{help}</span>}>
                <span><IoIosHelpCircle className="text-l" /></span>
            </Tippy>
        </div>
    );
};

const loadIssuesFromLocalStorage = (): SystemMonitoringIssue[] => {
    const storedIssues = localStorage.getItem('issues');
    if (storedIssues) {
        return JSON.parse(storedIssues);
    }
    return [];
};

const saveIssuesToLocalStorage = (issues: SystemMonitoringIssue[], language: Language) => {
    const translatedIssues = issues.map(issue => translateIssueToEnglish(issue, language));
    localStorage.setItem('issues', JSON.stringify(translatedIssues));
};

function IssueDetail({ params }: { params: { id: string } }) {
    const { translate, language } = useTranslation()
    const alertTypes = translate("alertTypes", false).split(", ");
    const severityTypes = translate("severityTypes", false).split(", ");
    const statusTypes = translate("states", false).split(", ");

    const incidentTypes = translate("incidentTypes", false).split(", ");
    const prio = translate("prios", false).split(', ');

    const priorities = [
        { value: 1, label: prio[0] },
        { value: 2, label: prio[1] },
        { value: 3, label: prio[2] },
        { value: 4, label: prio[3] }
    ];

    const [isEditMode, setEditMode] = useState(false);
    const [issue, setIssue] = useState<SystemMonitoringIssue | null>(null);
    const [issueCopy, setIssueCopy] = useState<SystemMonitoringIssue | null>(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isTerminalOpen, setIsTerminalOpen] = useState(false);
    const [hide, setHide] = useState(true);
    const [collapse, setCollapse] = useState(false);
    const searchParams = useSearchParams();
    const from = searchParams.get('from');
    const commands = translate("commands", false).split(", ")

    const toggleThirdColumn = () => {
        setHide(!hide);
    };

    const chatButtonRef = useRef<HTMLButtonElement>(null);

    const openChat = () => {
        setIsChatOpen(prevState => !prevState);
    };

    const openTerminal = () => {
        setIsTerminalOpen(prevState => !prevState);
    };

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const issues = loadIssuesFromLocalStorage();
        const foundIssue = issues.find(issue => issue.id === Number(params.id));
        if (foundIssue) {
            setIssue(foundIssue);
        }
    }, [params.id]);

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
        setIssue(prevState => {
            if (prevState) {
                return {
                    ...prevState,
                    affectedSystems: prevState.affectedSystems.filter((_, i) => i !== index)
                };
            }
            return prevState;
        });
    };

    const toggleDropdown = () => {
        setDropdownOpen(prev => !prev);
    };

    const handleEdit = () => {
        setIssueCopy(JSON.parse(JSON.stringify(issue)));
        setEditMode(true);
    };

    const handleCancel = () => {
        setIssue(issueCopy!);
        setEditMode(false);
    };

    const handleExecute = async (command: string): Promise<string> => {
        return new Promise((resolve) => {
            const responses = issue!.commandResponses[issue!.commands.indexOf(command)];
            let responseIndex = 0;

            const interval = setInterval(() => {
                if (responseIndex < responses.length) {
                    resolve(responses[responseIndex]);
                    responseIndex++;
                } else {
                    clearInterval(interval);
                }
            }, 2000);
        });
    };

    const handleSave = () => {
        if (issue) {
            const issues = loadIssuesFromLocalStorage();
            const index = issues.findIndex(i => i.id === issue.id);
            if (index !== -1) {
                issues[index] = issue;
                saveIssuesToLocalStorage(issues, language);
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

            const updatedIssue = {
                ...prev,
                [name]: newValue,
            };

            const issues = loadIssuesFromLocalStorage();
            const index = issues.findIndex(i => i.id === updatedIssue.id);
            if (index !== -1) {
                issues[index] = updatedIssue;
                saveIssuesToLocalStorage(issues, language);
            }

            return updatedIssue;
        });
    };


    if (!issue) {
        return <div className="mx-10 my-10 text-black dark:text-github-dark-text">Issue not found</div>;
    }


    return (
        <div className={`mx-10 my-10 bg-github-tertiary dark:bg-github-dark-background text-black dark:text-github-dark-text`}>
            <div className='flex items-center justify-between mb-4'>
                <Link href={`/Issues`}>
                    <button className="bg-github-primary dark:bg-github-dark-primary dark:text-white flex items-center font-bold text-3xl py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        <IoArrowBackOutline className="mr-2" />
                    </button>
                </Link>
                <div className='flex space-x-4'>
                    {issue.commands.length > 0 && !isEditMode &&
                        <button
                            onClick={openTerminal}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            <IoTerminal />
                        </button>
                    }

                    {!isEditMode &&
                        <button ref={chatButtonRef} className={`${isChatOpen ? 'bg-blue-700' : 'bg-blue-500'} hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`} onClick={openChat}>
                            <AiOutlineWechatWork className='text-xl' />
                        </button>}
                    {!isEditMode ? (
                        <button onClick={handleEdit} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center'>
                            <span className='flex items-center'>{translate('edit')} <CiEdit className='text-2xl ml-2' /></span>
                        </button>
                    ) : (
                        <div className='flex space-x-4'>
                            <button onClick={handleCancel} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline">{translate("cancel")}</button>
                            <button onClick={handleSave} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline">{translate("save")}</button>
                        </div>
                    )}
                    {!issue.isInitialGiven && !isEditMode && (
                        <Link href={`/Issues/${issue.id}/initial-feedback`}>
                            <button
                                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline'>
                                {translate('giveInitial')}
                            </button>
                        </Link>
                    )}

                    <button
                        onClick={toggleThirdColumn}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-l-2xl shadow-md focus:outline-none focus:shadow-outline"
                    >
                        {hide ? <GoSidebarExpand className="text-xl" /> : <GoSidebarCollapse className="text-xl" />}
                    </button>
                </div>
            </div>

            <ChatBubble
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                buttonRef={chatButtonRef}
                activeStepRef={undefined}
            />

            <div className="mb-5 bg-gradient-to-b from-[#fcf1fa] to-[#f7ebff] rounded-lg shadow-md p-4 ">
                <div className='mb-4'>
                    {isEditMode ? (
                        <div className='w-1/2'>
                            <p className='font-bold pb-2'>{translate("title")}</p>
                            <input
                                maxLength={70}
                                type="text"
                                name="title"
                                value={issue.title}
                                onChange={handleInputChange}
                                className="editable-input"
                            />
                        </div>
                    ) : (
                        <h3 className="text-3xl font-semibold">{issue.title}</h3>
                    )}
                </div>

                <div className='flex justify-between items-center'>
                    <div className='flex items-center'>
                        <p className="">{translate('alertType')}:</p>
                        {isEditMode ? (
                            <select
                                name="alertType"
                                value={language === 'en' ? issue.alertType : alertTypeTransaltion[issue.alertType]}
                                onChange={handleInputChange}
                                className="input mx-2 border border-grey-800"
                            >
                                {alertTypes.map(type => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <Tippy content={<span>{getAlertText(issue.alertType, translate)}</span>}>
                                <span>{getAlertIcon(issue.alertType)}</span>
                            </Tippy>
                        )}
                    </div>
                    <div>
                        <p>{translate('severity')}:
                            {isEditMode ? (
                                <select
                                    name="severity"
                                    value={language === 'en' ? issue.severity : severityTranslation[issue.severity]}
                                    onChange={handleInputChange}
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
                                    {language === 'en' ? issue.severity : severityTranslation[issue.severity]}</span>
                            )}
                        </p>
                    </div>
                    <div>
                        <p>Status:
                            <select
                                name="status"
                                value={language === 'en' ? issue.status : statusTranslation[issue.status]}
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
                        <p>{translate('incidentType')}:
                            {isEditMode ? (
                                <select
                                    name="incidentType"
                                    value={language === 'en' ? issue.incidentType : incidentTypeTranslationMapEnDe[issue.incidentType]}
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
                                    {language === 'en' ? issue.incidentType : incidentTypeTranslationMapEnDe[issue.incidentType]}
                                </span>
                            )}
                        </p>
                    </div>
                    <div>
                        <p>{translate('priority')}:
                            {isEditMode ? (
                                <select
                                    name="priority"
                                    value={issue.priority}
                                    onChange={handleInputChange}
                                    className="input mx-2 border border-grey-800"
                                >
                                    {priorities.map(priority => (
                                        <option key={priority.value} value={priority.value}>
                                            {priority.value}:   {priority.label}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                getPriorityText(issue.priority,
                                    <span className='bg-gray-200 dark:bg-gray-500 rounded-xl p-2 m-2'>
                                        {`${issue.priority}/4`}
                                    </span>, translate)
                            )}
                        </p>
                    </div>
                </div>
            </div>

            <div className={`grid ${hide ? 'grid-cols-2' : 'grid-cols-3'} grid-rows-[auto, 1fr, 1fr, 1fr] gap-4 transition-all duration-300`}>
                <div className='bg-github-secondary dark:bg-github-dark-tertiary max-w-l rounded-lg shadow-md min-h-[200px] col-span-1 row-span-2 p-4 bg-gradient-to-b from-[#fcf1fa] to-[#f7ebff]'>
                    {labels(translate('description'), translate("descriptionHelp"))}
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

                <div className='bg-github-secondary dark:bg-github-dark-tertiary rounded-lg shadow-md min-h-[150px] col-span-1 row-span-1 p-4 bg-gradient-to-b from-[#fcf1fa] to-[#f7ebff]'>
                    {labels(translate('suggestedSolution'), translate("recommendedSteps"))}
                    {isEditMode ? (
                        <textarea
                            name="loesungsvorschlag"
                            value={issue.loesungsvorschlag}
                            onChange={handleInputChange}
                            className="editable-input"
                        />
                    ) : (
                        <p className='' style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>{issue.loesungsvorschlag}</p>
                    )}
                </div>

                {!hide && (
                    <div className={`bg-github-secondary dark:bg-github-dark-tertiary max-w-l rounded-lg shadow-md min-h-[200px] col-span-1 row-span-1 p-4 bg-gradient-to-b from-[#fcf1fa] to-[#f7ebff] transition-transform duration-300 transform ${hide ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}>
                        {labels(translate('affectedSystems'), translate("affectedSystemsHelp"))}
                        < div className="space-y-1" >
                            {
                                isEditMode ? (
                                    <div>
                                        <div className='flex space-x-4 h-full'>
                                            <div className="relative inline-block min-h-[45px]" ref={dropdownRef}>
                                                <div className="cursor-pointer" onClick={toggleDropdown}>
                                                    <div className="cursor-pointer flex items-center border rounded-md py-1 px-4 bg-white shadow-sm min-h-[45px]">
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
                                        </div>
                                        <div className={`flex-grow py-1 px-2 max-h-60 overflow-y-auto min-h-[40px] flex flex-col justify-center mt-2 ${issue.affectedSystems.length !== 0 ? 'border border-gray-300 rounded-md' : ''}`}>
                                            {issue.affectedSystems.map((system, index) => (
                                                <div key={index} className={`flex items-center ${index !== issue.affectedSystems.length - 1 ? 'border-b border-gray-300' : ''} min-h-[40px]`}>
                                                    <span className="flex-grow">{system}</span>
                                                    <button type="button" onClick={() => handleRemoveSystem(index)} className="ml-2 text-red-500">{translate("remove")}</button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    issue.affectedSystems.length > 0 ? (
                                        issue.affectedSystems.map((system, index) => (
                                            <p key={index} style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}> - {system}</p>
                                        ))
                                    ) : (
                                        <></>
                                    )
                                )}
                        </div>
                    </div>
                )
                }

                <div className='bg-github-secondary dark:bg-github-dark-tertiary max-w-l rounded-lg shadow-md min-h-[200px] col-span-1 row-span-1 p-4 bg-gradient-to-b from-[#fcf1fa] to-[#f7ebff]'>
                    {labels(translate('impact'), translate('impactDescription'))}
                    {isEditMode ? (
                        <textarea
                            name="impact"
                            value={issue.impact}
                            onChange={handleInputChange}
                            className="editable-input"
                        />
                    ) : (
                        <p className='' style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>{issue.impact}</p>
                    )}
                </div>

                {
                    !hide && (
                        <div className={`bg-github-secondary dark:bg-github-dark-tertiary max-w-l rounded-lg shadow-md min-h-[200px] col-span-1 row-span-1 p-4 bg-gradient-to-b from-[#fcf1fa] to-[#f7ebff] transition-transform duration-300 transform ${hide ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}>
                            {labels(translate('preventativeMeasures'), translate("preventativeMeasuresHelp"))}
                            {isEditMode ? (
                                <textarea
                                    name="preventativeMeasures"
                                    value={issue.preventativeMeasures}
                                    onChange={handleInputChange}
                                    className="editable-input"
                                />
                            ) : (
                                <p className='' style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>{issue.preventativeMeasures}</p>
                            )}
                        </div>
                    )
                }

                <TabComponent />
                {
                    !hide && (
                        <div className={`bg-github-secondary dark:bg-github-dark-tertiary rounded-lg shadow-md min-h-[150px] col-span-1 row-span-1 p-4 bg-gradient-to-b from-[#fcf1fa] to-[#f7ebff] transition-transform duration-300 transform ${hide ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}>
                            {labels("Info", translate("additionalInfoDescription"))}
                            <div className='grid grid-cols-2 gap-2'>
                                <p className=''>{translate("creator")}:</p>
                                <p className='text-right'>{issue.creator}</p>
                                <p className=''>{translate("issueNumber")}:</p>
                                <p className='text-right'>{issue.id}</p>
                                <p className=''>{translate("duration")}:</p>
                                <p className='text-right'>{calculateDaysSinceTimestamp(issue.timestamp)} {translate("days")}</p>
                                <p className=''>{translate("timestamp")}:</p>
                                <p className='text-right'>{formatDate(issue.timestamp)}</p>
                                <p className=''>{translate("lastUpdated")}:</p>
                                <p className='text-right'>{issue.lastUpdated > issue.timestamp ? formatDate(issue.lastUpdated) : "--:--"}</p>
                                <p className=''>{translate("endTime")}:</p>
                                <p className='text-right'>{issue.endTime ? formatDate(issue.endTime) : "--:--"}</p>
                            </div>
                        </div>
                    )
                }

                <div className={`${hide ? "col-start-2" : "col-start-3"} col-span-1`}>
                    <div className='flex justify-end'>
                        {!isEditMode && (
                            <div className="flex justify-end space-x-4">
                                <Link href={`/Issues/${issue.id}/feedback`}>
                                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline">{translate('feedbackClose')}</button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div >
            <div className="flex justify-center">
                {isTerminalOpen && issue.commands.length > 0 && (
                    <div className='terminal-container'>
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-2xl font-bold text-black dark:text-white">Terminal</h1>
                            <button
                                type="button"
                                className="text-black dark:text-white self-center"
                                onClick={openTerminal}
                            >
                                <MdCancel className="text-gray-700 transform scale-150" />
                            </button>
                        </div>
                        <p className="text-black dark:text-gray-300 mb-4">{translate("recommendedCommands")}</p>
                        <ul className="list-disc pl-5 mb-4 text-black dark:text-gray-300">
                            <li className="mb-2">{commands[0]}</li>
                            <li className="mb-2">{commands[1]}</li>
                            <li className="mb-2">{commands[2]}</li>
                        </ul>
                        <Terminal commands={issue.commands} commandResponses={issue.commandResponses} />
                    </div>
                )}
            </div>
        </div >
    );
}

export default IssueDetail;
