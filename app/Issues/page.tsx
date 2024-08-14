"use client";

import styles from '../issues.module.css'
import '../tippystyle.css'
import { FaGreaterThan, FaLessThan, FaSort, FaSortDown, FaSortUp, FaToggleOff, FaToggleOn } from "react-icons/fa";
import { SystemMonitoringIssue } from '../data/data';
import { MdOutlineFiberNew } from "react-icons/md";
import { useEffect, useState } from 'react';
import { BiSortAlt2 } from "react-icons/bi";
import { classNames, formatDate, getAlertIcon, getAlertIconBig, getAlertText, getPriorityText, getSeverityColor, incidentTypeTranslationMapEnDe, validateType } from '../helperFunction';
import { useRouter } from 'next/navigation';
import CustomDropDown from './dropDownMenu';
import issuesJson from '../data/issues.json' assert { type: 'json' };
import { Button, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useTranslation } from '../TranslationContext';
import { LiaToggleOffSolid, LiaToggleOnSolid } from 'react-icons/lia';
import React from 'react';

interface CardsHeaderProps {
    onSort: (column: string) => void;
    sortColumn: string;
    sortDirection: 'asc' | 'desc';
}

type SortableColumns = 'alertType' | 'priority' | 'timestamp';

const loadIssues = (): SystemMonitoringIssue[] => {
    const storedIssues = localStorage.getItem('issues');
    if (storedIssues) {
        return JSON.parse(storedIssues);
    } else {
        const issues: SystemMonitoringIssue[] = issuesJson.map(issue => {
            // Ensure commandResponses is initialized as an array of arrays
            const commandResponses: string[][] = issue.commandResponses && issue.commandResponses.length > 0
                ? issue.commandResponses
                : issue.commands.map(() => []);

            return {
                ...issue,
                status: validateType(issue.status, ['New', 'Open', 'Closed', 'In Progress'], "Open"),
                alertType: validateType(issue.alertType, ['Warning', 'Info', 'Error'], "Warning"),
                incidentType: validateType(issue.incidentType, ['Performance', 'Storage', 'Overheating', 'Backups', 'Power', 'Data Integrity', 'Connection', 'Query', 'Monitoring', 'Network',
                    'Authentication', 'Resources', 'Processes', 'Configuration', 'Data Export', 'Documentation', 'Startup', 'Demonstration', 'Communication', 'Data Import', 'Security'], "Performance"),
                severity: validateType(issue.severity, ['Low', 'Medium', 'High'], "Low"),
                timestamp: new Date(issue.timestamp),
                endTime: new Date(issue.endTime),
                lastUpdated: new Date(issue.lastUpdated),
                commandResponses: commandResponses
            };
        });
        localStorage.setItem('issues', JSON.stringify(issues));
        return issues;
    }
};

const saveIssues = (issues: SystemMonitoringIssue[]) => {
    localStorage.setItem('issues', JSON.stringify(issues));
}

function CardsHeader({ onSort, sortColumn, sortDirection }: CardsHeaderProps) {
    const { translate, language } = useTranslation();
    const renderSortIcon = (column: string) => {
        if (sortColumn === column) {
            return sortDirection === 'asc' ? <FaSortUp className='hover:cursor-pointer' /> : <FaSortDown className='hover:cursor-pointer' />;
        }
        return <FaSort className='hover:cursor-pointer' />;
    };

    const color = translate("color", false).split(", ");
    const type = translate("alartTypes", false).split(", ");
    const incidents = translate("incidentTypes", false).split(", ");
    const severities = translate("severityTypes", false).split(", ");
    const prios = translate("prios", false).split(", ");


    return (
        <thead className="bg-gray-300">
            <tr className=''>
                <th className="h-14 rounded-tl-xl rounded-bl-xl px-2 py-3 text-center text-xs font-medium text-gray-800 uppercase dark:text-neutral-500 w-24"
                    onClick={() => onSort('alertType')}>
                    <Tippy theme="tomato-theme" content={<span><span className="font-bold text-blue-500">{color[0]}:</span> {type[0]}<br /><span className="font-bold text-red-500">{color[1]}:</span> {type[1]}<br /><span className="font-bold text-yellow-500">{color[2]}:</span> {type[2]}</span>}>
                        <div className='flex items-center cursor-pointer'>{translate('alertType')} {renderSortIcon('alertType')}</div>
                    </Tippy>
                </th>
                <th className="px-4 py-3 text-start text-xs font-medium text-gray-800 uppercase dark:text-neutral-500" onClick={() => onSort('title')}>
                    <div className='flex items-center'>{translate('title')} {renderSortIcon('title')}</div>
                </th>

                {true &&
                    <th className="px-4 py-3 text-start text-xs font-medium text-gray-800 w-52 uppercase dark:text-neutral-500" onClick={() => onSort('incidentType')}>
                        <div className='flex items-center'>
                            <Tippy theme="tomato-theme" content={
                                <span>
                                    {incidents.sort().map((incident, index) => (
                                        <React.Fragment key={index}>
                                            <span className="">{translate(incident)}</span>
                                            <br />
                                        </React.Fragment>
                                    ))}
                                </span>
                            }
                            >
                                <div className='flex items-center'>{translate('incidentType')} {renderSortIcon('incidentType')}</div>
                            </Tippy>
                        </div>
                    </th>}

                {true &&
                    <th className="px-4 py-3 text-start text-xs font-medium text-gray-800 uppercase dark:text-neutral-500 w-40" onClick={() => onSort('severity')}>
                        <div className='flex items-center'>
                            <Tippy theme="tomato-theme" content={<span><span className="font-bold" ></span><span className="text-green-500">{severities[0]}</span><br /><span className="text-yellow-500">{severities[1]}</span><br /><span className="text-red-500">{severities[2]}</span></span>}>
                                <div className='flex items-center'>{translate('severity')}  {renderSortIcon('severity')}</div>
                            </Tippy>
                        </div>
                    </th>}

                <th className="px-4 py-3 text-start text-xs font-medium text-gray-800 uppercase dark:text-neutral-500 w-40" onClick={() => onSort('priority')}>
                    <div className='flex items-center'>
                        <Tippy theme="tomato-theme" content={<span><span className="font-bold">1:</span>  {prios[0]}<br /><span className="font-bold">2:</span> {prios[1]}<br /><span className="font-bold">3:</span> {prios[2]}<br /><span className="font-bold">4:</span> {prios[3]}</span>}>
                            <div className='flex items-center'>{translate('priority')}  {renderSortIcon('priority')}</div>
                        </Tippy>
                    </div>
                </th>
                <th className="px-4 py-3 text-start text-xs font-medium text-gray-800 uppercase dark:text-neutral-500 w-40" onClick={() => onSort('timestamp')}>
                    <div className='flex items-center'> {translate('timestamp')}  {renderSortIcon('timestamp')}</div>
                </th>
                <th className="rounded-tr-xl rounded-br-xl px-4 py-3 text-start text-xs font-medium text-gray-800 uppercase dark:text-neutral-500 w-[5rem]">{translate('option')} </th> {/* Add padding to the right */}
            </tr>
        </thead >
    );
}

function List({ list, isLmode }: { list: SystemMonitoringIssue[], isLmode: boolean }) {
    const router = useRouter();
    const { translate, language } = useTranslation();
    const [sortColumn, setSortColumn] = useState<string>('timestamp');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    const handleRowClick = (id: number) => {
        if (isLmode) {
            router.push(`/Issues/${id}/wizard`);
        } else {
            router.push(`/Issues/${id}`);
        }
    };

    const customSortOrder = {
        alertType: ['Error', 'Warning', 'Info'],
        severity: ['High', 'Medium', 'Low']
    };

    const handleSort = (column: string) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const sortedList = [...list].sort((a, b) => {
        let aValue: any = a[sortColumn as keyof SystemMonitoringIssue];
        let bValue: any = b[sortColumn as keyof SystemMonitoringIssue];

        if (sortColumn === 'timestamp') {
            aValue = new Date(aValue);
            bValue = new Date(bValue);
        } else if (sortColumn === 'alertType' || sortColumn === 'severity') {
            aValue = customSortOrder[sortColumn].indexOf(aValue);
            bValue = customSortOrder[sortColumn].indexOf(bValue);
        }

        if (aValue < bValue) {
            return sortDirection === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
            return sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
    });

    return (
        <table className="table-fixed rounded-xl border-separate w-full border-spacing-y-2">
            <CardsHeader onSort={handleSort} sortColumn={sortColumn} sortDirection={sortDirection} />
            <tbody className=''>
                {sortedList.map(listIssue => (
                    <tr
                        key={listIssue.id}
                        className="bg-[#fcf1fa] hover:bg-[#f2ebf5] hover:cursor-pointer border border-red-500"
                        onClick={() => handleRowClick(listIssue.id)}
                    >
                        <Tippy theme="tomato-theme" content={<span>{getAlertText(listIssue.alertType, translate)}</span>}>
                            <td className="rounded-bl-xl rounded-tl-xl px-2 py-3 w-40">{getAlertIcon(listIssue.alertType)}</td>
                        </Tippy>
                        <td className="pl-2 pr-6 py-3 truncate">{listIssue.title}</td>
                        {false &&
                            <td className="px-2 py-3 truncate">{listIssue.description}</td>}
                        {true &&
                            <td className="px-2 py-3 text-sm"><span className='bg-gray-200 dark:bg-gray-500 rounded-xl p-2'>
                                {language === "en" ? listIssue.incidentType : incidentTypeTranslationMapEnDe[listIssue.incidentType]}
                            </span></td>}
                        {true &&
                            <td className="px-2 py-3 text-sm"><span className={`${getSeverityColor(listIssue.severity)} rounded-xl p-2`}>
                                {listIssue.severity}</span></td>}
                        <td className="px-2 py-3 text-sm">

                            {getPriorityText(listIssue.priority,
                                <span className='bg-gray-200 dark:bg-gray-500 rounded-xl p-2'>
                                    {`${listIssue.priority}/4`}
                                </span>, translate)}
                        </td>
                        <td className="px-2 py-3 text-sm ">{formatDate(listIssue.timestamp)}</td>
                        <td className="text-center px-2 py-3 rounded-br-xl rounded-tr-xl"><CustomDropDown
                            id={listIssue.id}
                            initialFeedback={listIssue.isInitialGiven} /></td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

function Card1({ id, heading, description, icon, className = '', priority, timestamp, handlePrevious, handleNext, length, currentIndex, handleDismiss, handleSortNewIssues, alertType }:
    {
        id: number, heading: string, description: string, icon: React.ReactNode, className?: string, priority: number, timestamp: string, handlePrevious: () => void,
        handleNext: () => void, length: number, currentIndex: number, handleDismiss: () => void, handleSortNewIssues: (sortColumn: SortableColumns) => void, alertType: string
    }) {
    const [isClicked, setIsClicked] = useState(false);
    const router = useRouter();
    const { translate } = useTranslation();

    const extractDescription = (desc: string) => {
        const prefix = "Einleitung";
        if (desc.startsWith(prefix)) {
            desc = desc.slice(prefix.length);  // Remove "Einleitung:"
        }
        const firstNewlineIndex = desc.indexOf('\n');
        if (firstNewlineIndex === -1) return ''; // No newline found, return empty string

        const secondNewlineIndex = desc.indexOf('\n', firstNewlineIndex + 1);
        if (secondNewlineIndex === -1) return ''; // No second newline found, return empty string

        return desc.substring(firstNewlineIndex + 1, secondNewlineIndex).trim();
    };

    const truncatedDescription = extractDescription(description);

    const handleClick = () => {
        setIsClicked(true);
        setTimeout(() => {
            router.push(`/Issues/${id}`);
        }, 300); // 300ms matches the CSS transition duration
    };

    return (
        <div className="relative  rounded-xl flex flex-col items-center border-4 w-1/2 px-5" >
            <div className="absolute top-0 right-0 -mt-6 -mr-6">
                <MdOutlineFiberNew className="text-red-500 text-5xl" />
            </div>

            <div className='flex space-x-8 items-center mt-12'>
                <button
                    className={`p-2 text-xl bg-gray-200 rounded-full hover:bg-gray-300 ${length > 1 ? '' : 'invisible'}`}
                    onClick={handlePrevious}>

                    <FaLessThan />
                </button>

                <div
                    onClick={handleClick}
                    className={`card gap-4 rounded-xl shadow-sm px-6 py-3 shadow-2xl w-full relative bg-[#fcf4ff] ${styles.card} ${className}  h-60 transition-transform duration-300 ${isClicked ? 'transform scale-105' : ''}`}
                >
                    <div className="flex flex-col h-full space-y-2 flex-grow">
                        <div className="space-y-2 flex-grow space">
                            <div className="flex space-x-6">
                                <div className="min-w-max">
                                    <Tippy theme="tomato-theme" content={<span>{getAlertText(alertType, translate)}</span>}>
                                        <span>{icon}</span>
                                    </Tippy>
                                </div>
                                <h3 className="text-[20px] font-semibold line-clamp-2 overflow-hidden overflow-ellipsis">{heading}</h3>

                            </div>
                            <p className="leading-8 font-normal break-words overflow-hidden line-clamp-2">{truncatedDescription}</p>
                        </div>
                        <div className='flex justify-between mt-auto'>
                            <p>{translate('priority')}: {getPriorityText(priority,
                                <span className='bg-gray-200 dark:bg-gray-500 rounded-xl p-2'>
                                    {`${priority}/4`}
                                </span>, translate)}</p>
                            <p>{timestamp}</p>
                        </div>
                    </div>
                </div>

                <button
                    className={`p-2 text-xl bg-gray-200 rounded-full hover:bg-gray-300 z-10 ${length > 1 ? '' : 'invisible'}`}
                    onClick={handleNext}>
                    <FaGreaterThan />
                </button>
            </div>

            <div className='mt-5 w-full max-w-lg flex justify-between'>
                <div className='w-[3rem]'></div>
                <p>Issue {currentIndex + 1} {translate('of')} {length}</p>
                <Menu as="div" className="relative inline-block text-left" >
                    <div className="relative">
                        <MenuButton className="inline-flex w-full justify-center gap-2 py-1.5 px-3 text-sm/6">
                            <BiSortAlt2 className="w-5 h-5 border-none" />
                        </MenuButton>
                    </div>

                    <MenuItems
                        transition
                        className=" text-left absolute left-5 z-10 mt-2 w-32 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                    >
                        <div className="py-1">
                            <MenuItem>
                                {({ focus }) => (
                                    <Button
                                        className={classNames(focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm w-full')}
                                        onClick={() => handleSortNewIssues('alertType')}
                                    >
                                        {translate('alertType')}
                                    </Button>
                                )}
                            </MenuItem>

                            <MenuItem>
                                {({ focus }) => (
                                    <Button
                                        className={classNames(focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm w-full')}
                                        onClick={() => handleSortNewIssues('priority')}
                                    >
                                        {translate('priority')}
                                    </Button>
                                )}
                            </MenuItem>

                            <MenuItem>
                                {({ focus }) => (
                                    <Button
                                        className={classNames(focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm w-full')}
                                        onClick={() => handleSortNewIssues('timestamp')}
                                    >
                                        {translate('timestamp')}
                                    </Button>
                                )}
                            </MenuItem>
                        </div>
                    </MenuItems>
                </Menu>
            </div>

            <div className="flex w-full max-w-lg justify-center mb-4">
                <button
                    className="bg-blue-500 text-white px-4 py-3 rounded hover:bg-blue-600"
                    onClick={handleDismiss}>
                    {translate('read')}
                </button>
            </div>
        </div >
    );
}

export default function IssuesPage() {
    const router = useRouter();
    const { translate, setLanguage, language } = useTranslation();
    const [isLMode, setIsLMode] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [openIssues, setOpenIssues] = useState<SystemMonitoringIssue[]>([]);
    const [newIssues, setNewIssues] = useState<SystemMonitoringIssue[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentId, setCurrentId] = useState<number | null>(null);

    const handleNext = () => {
        const nextIndex = (currentIndex + 1) % newIssues.length;
        setCurrentId(newIssues[nextIndex].id)
        setCurrentIndex(nextIndex);
    };

    useEffect(() => {
        const loadedIssues = loadIssues();
        console.log("Loaded issues:", loadedIssues);
        setOpenIssues(loadedIssues.filter(issue => issue.status !== "New").sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
        setNewIssues(loadedIssues.filter(issue => issue.status === "New").sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
        setIsLoading(false);
    }, []); // Run only once on mount

    useEffect(() => {
        if (newIssues.length > 0) {
            setCurrentId(newIssues[0].id);
        }
    }, [newIssues]);

    const handlePrevious = () => {
        const prevIndex = (currentIndex - 1 + newIssues.length) % newIssues.length;
        setCurrentId(newIssues[prevIndex].id)
        setCurrentIndex(prevIndex);
    };

    const newIssuePage = () => {
        router.push('/Issues/new')
    }

    const handleDismiss = () => {
        if (newIssues.length > 0) {
            const updatedNewIssues = newIssues.filter(issue => issue.id !== currentId);
            const dismissedIssue = newIssues.find(issue => issue.id === currentId);

            if (dismissedIssue) {
                // Update both openIssues and newIssues before saving
                const newOpenIssue = { ...dismissedIssue, status: "Open" as 'Open' };
                setOpenIssues(prevOpenIssues => [...prevOpenIssues, newOpenIssue].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
                setNewIssues(updatedNewIssues);
                saveIssues([...updatedNewIssues, ...openIssues, newOpenIssue]); // Save updated issues to localStorage
            }

            if (updatedNewIssues.length > 0) {
                setCurrentIndex(0);
                setCurrentId(updatedNewIssues[0].id);
            } else {
                setCurrentIndex(-1);
                setCurrentId(null); // Use null instead of -1
            }
        }
    };

    const handleSortNewIssues = (sortColumn: SortableColumns) => {
        setNewIssues(prevNewIssues => {
            return [...prevNewIssues].sort((a, b) => {
                let aValue: any = a[sortColumn as keyof SystemMonitoringIssue];
                let bValue: any = b[sortColumn as keyof SystemMonitoringIssue];

                if (sortColumn === 'timestamp') {
                    aValue = new Date(aValue);
                    bValue = new Date(bValue);
                    // Sort newest date on top
                    return bValue - aValue;
                } else if (sortColumn === 'priority') {
                    // Sort highest priority first, then by newest date if priority is equal
                    if (a.priority === b.priority) {
                        aValue = new Date(a.timestamp);
                        bValue = new Date(b.timestamp);
                        return bValue - aValue;
                    }
                    return b.priority - a.priority;
                } else if (sortColumn === 'alertType') {
                    const customSortOrder = {
                        alertType: ['Error', 'Warning', 'Info'],
                    };
                    aValue = customSortOrder[sortColumn].indexOf(aValue);
                    bValue = customSortOrder[sortColumn].indexOf(bValue);
                    // Sort by custom order, then by newest date if alert type is equal
                    if (aValue === bValue) {
                        aValue = new Date(a.timestamp);
                        bValue = new Date(b.timestamp);
                        return bValue - aValue;
                    }
                    return aValue - bValue;
                } else if (sortColumn === 'severity') {
                    const customSortOrder: { [key: string]: string[] } = {
                        alertType: ['Error', 'Warning', 'Info'],
                    };
                    aValue = customSortOrder[sortColumn].indexOf(aValue);
                    bValue = customSortOrder[sortColumn].indexOf(bValue);
                    // Sort by custom order, then by newest date if severity is equal
                    if (aValue === bValue) {
                        aValue = new Date(a.timestamp);
                        bValue = new Date(b.timestamp);
                        return bValue - aValue;
                    }
                    return aValue - bValue;
                }

                if (aValue < bValue) {
                    return -1;
                }
                if (aValue > bValue) {
                    return 1;
                }
                return 0;
            });
        });
        setCurrentIndex(0);
        setCurrentId(newIssues[0]?.id || null);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.app}>
            <div className="w-5/6 flex justify-center">
                <div className="w-full flex justify-between select-none items-center">
                    <div>
                        {isLMode ?
                            <div className="flex items-center mt-12">
                                <LiaToggleOnSolid
                                    onClick={() => setIsLMode(!isLMode)}
                                    className="text-3xl cursor-pointer select-none text-blue-500"
                                />
                                <span className="ml-4 text-lg select-none">{translate('modeOn')}</span>
                            </div> :
                            <div className="flex items-center mt-12">
                                <LiaToggleOffSolid
                                    onClick={() => setIsLMode(!isLMode)}
                                    className="text-3xl cursor-pointer select-none"
                                />
                                <span className="ml-4 text-lg select-none">{translate('modeOff')}</span>
                            </div>
                        }
                    </div>
                    <div className='flex items-center mt-12 space-x-4'>
                        <button
                            className={`${language === 'en' ? 'text-blue-500' : 'text-black'}`}
                            onClick={() => setLanguage('en')}
                        >
                            EN
                        </button>
                        <button
                            className={`${language === 'de' ? 'text-blue-500' : 'text-black'}`}
                            onClick={() => setLanguage('de')}
                        >
                            DE
                        </button>
                    </div>
                </div>
            </div>

            {newIssues.length > 0 && currentId !== null &&
                <div className="flex flex-col items-center w-full">
                    <Card1
                        id={newIssues[currentIndex].id}
                        className={newIssues.length > 1 ? styles.mainIssue : ''}
                        heading={newIssues[currentIndex].title}
                        description={newIssues[currentIndex].description}
                        icon={getAlertIconBig(newIssues[currentIndex].alertType)}
                        priority={newIssues[currentIndex].priority}
                        timestamp={formatDate(newIssues[currentIndex].timestamp)}
                        handleNext={handleNext}
                        handlePrevious={handlePrevious}
                        length={newIssues.length}
                        currentIndex={currentIndex}
                        handleDismiss={handleDismiss}
                        handleSortNewIssues={handleSortNewIssues}
                        alertType={newIssues[currentIndex].alertType}
                    />
                </div>
            }
            <h3 className="text-5xl font-semibold mt-5">Issues</h3>
            <div className='w-5/6'>
                <div className="flex justify-end mb-4">
                    <button
                        className="bg-gray-200 text-black px-4 py-3 rounded hover:bg-gray-300"
                        onClick={newIssuePage}>
                        {translate('newIssue')}
                    </button>
                </div>
                <List list={openIssues} isLmode={isLMode} />
            </div>
        </div >
    )
}
