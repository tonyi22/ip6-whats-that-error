'use client';
import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { IoArrowBackOutline } from "react-icons/io5";
import { FaCaretDown, FaCheck } from 'react-icons/fa';
import Link from 'next/link';
import { formatDate, getAlertIcon, getSeverityColor, validateType, compareSort, getPriorityText, getAlertText } from '@/app/helperFunction';
import { SystemMonitoringIssue } from '@/app/data/data';
import { TabComponent } from '../TabComponent';
import '../detailView.css';
import { CiEdit } from "react-icons/ci";
import { AiOutlineWechatWork } from "react-icons/ai";
import ChatBubble from '../ChatBubble';
import { IoTerminal } from "react-icons/io5";
import { MdCancel } from "react-icons/md";
import Stepper from './Stepper';
import { useRouter } from 'next/navigation';
import { log } from 'console';
import Terminal from '../Terminal';
import FeedbackModal from './FeedbackModal';

// Load and save issues from/to localStorage
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

// Predefined systems list
const systemsList = [
    'WebServer-01', 'DatabaseServer-01', 'StorageSystem-01', 'NetworkSwitch-01', 'LoadBalancer-01',
    'BackupServer-01', 'MonitoringSystem-01', 'AuthenticationServer-01', 'APIGateway-01', 'Firewall-01',
    'VirtualizationServer-01', 'DNSServer-01', 'EmailServer-01', 'ApplicationServer-01', 'ERPSystem-01',
    'CRMSystem-01', 'FileServer-01', 'ProxyServer-01', 'DevelopmentServer-01', 'TestServer-01'
];

function IssueJourney({ params }: { params: { id: string } }) {
    const alertTypes = ['Critical', 'Warning', 'Info', 'None'];
    const severityTypes = ['Low', 'Medium', 'High'];
    const statusTypes = ['New', 'Open', 'Closed', 'In Progress'];
    const incidentTypes = ['Performance', 'Storage', 'Overheating', 'Backups', 'Power', 'Data Integrity', 'Connection', 'Query', 'Monitoring', 'Network',
        'Authentication', 'Resources', 'Processes', 'Configuration', 'Data Export', 'Documentation', 'Startup', 'Demonstration', 'Communication', 'Data Import', 'Security', 'other'];
    const priorities = Array.from({ length: 4 }, (_, i) => i + 1);
    const router = useRouter();

    const [isEditMode, setEditMode] = useState(false);
    const [issue, setIssue] = useState<SystemMonitoringIssue | null>(null);
    const [issueCopy, setIssueCopy] = useState<SystemMonitoringIssue | null>(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isTerminalOpen, setIsTerminalOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0); // State to manage current steip
    const [introStep, setIntroStep] = useState(0);
    const [introFlag, setIntroFlag] = useState(true);

    const [showPromptDescription, setShowPromptDescription] = useState(true);
    const [showPromptLoesungsvorschlag, setshowPromptLoesungsvorschlag] = useState(true);
    const [showPromptImpact, setShowPromptImpact] = useState(true);
    const [showPromptPreventativeMeasures, setShowPromptPreventativeMeasures] = useState(true);
    const [showPromptAffectedSystems, setShowPromptAffectedSystems] = useState(true);

    const chatButtonRef = useRef<HTMLButtonElement>(null);
    const activeStepRef = useRef<HTMLDivElement>(null);
    const textBubbleRef = useRef<HTMLDivElement>(null);
    // ref for intro
    const introContainerRef = useRef<HTMLDivElement>(null);

    const [showFeedbackModal, setShowFeedbackModal] = useState(false);

    const [textBubbleContent, setTextBubbleContent] = useState([
        "Diese Ansicht enthält wichtige Informationen zum Issue, einschließlich Titel, Alarmtyp, Schweregrad, Status, Incident-Typ und Priorität.",
        "Detaillierte Beschreibung des Problems.",
        "Listet die Systeme auf, die von dem Issue betroffen sind.",
        "Empfohlene Schritte zur Behebung des Problems, basierend auf der Analyse und Diagnose der Störung.",
        "Zeigt die Auswirkungen des Issues auf das System oder die betroffenen Benutzer an.",
        "Vorbeugende Massnahmen, die ergriffen werden können, um das Auftreten ähnlicher Issues in der Zukunft zu verhindern.",
        "Kommentare und Anhänge.",
        "Zusätzliche Informationen zur Problemmeldung, wie Ersteller, Priorität, Zeitstempel und Dauer des Ereignisses."
    ]);

    const [wizardTextIntro, setWizardTextInstro] = useState([
        "Willkommen beim Wizard! Hier werden Ihnen schrittweise die einzelnen Bereiche des Issues erklärt. Jeder Bereich wird nacheinander angezeigt und erläutert.",
        "Hier sehen Sie den spezifischen Bereich des Issues, der gerade erklärt wird.",
        "Dieser Abschnitt erklärt, welche Informationen im Issue enthalten sind und deren Bedeutung.",
        "Mit diesem Knopf können Sie Fragen an die KI stellen, falls Sie Hilfe benötigen. Nun beginnt die Tour."
    ]);

    const handleClick = () => {
        setCurrentStep(currentStep + 1);
        setShowFeedbackModal(true)
    };

    const openChat = () => {
        setIsChatOpen(prevState => !prevState);
    };

    const openTerminal = () => {
        setIsTerminalOpen(prevState => !prevState);
    };

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const updateIntroContainerPosition = () => {
            if (textBubbleRef.current && introContainerRef.current) {
                const textBubbleRect = textBubbleRef.current.getBoundingClientRect();
                introContainerRef.current.style.top = `${textBubbleRect.top}px`; // Align top with textBubble
                introContainerRef.current.style.left = `${textBubbleRect.right + 10}px`; // Align horizontally with textBubble
            }
        };

        updateIntroContainerPosition();
        window.addEventListener('resize', updateIntroContainerPosition);
        window.addEventListener('scroll', updateIntroContainerPosition);

        return () => {
            window.removeEventListener('resize', updateIntroContainerPosition);
            window.removeEventListener('scroll', updateIntroContainerPosition);
        };
    }, [currentStep]);

    useEffect(() => {
        const issues = loadIssuesFromLocalStorage();
        const foundIssue = issues.find(issue => issue.id === Number(params.id));
        if (foundIssue) {
            setIssue(foundIssue);
        } else {
            console.log(`Issue with ID ${params.id} not found`);
        }
    }, [params.id]);

    useLayoutEffect(() => {
        const updateTextBubblePosition = () => {
            if (activeStepRef.current && textBubbleRef.current) {
                const rect = activeStepRef.current.getBoundingClientRect();
                if (currentStep === 6 || currentStep === 7) {
                    // Position above the active step
                    textBubbleRef.current.style.top = `${rect.top - textBubbleRef.current.offsetHeight - 10}px`;
                    textBubbleRef.current.style.bottom = "unset";
                } else {
                    // Position below the active step
                    textBubbleRef.current.style.top = `${rect.bottom + 10}px`;
                    textBubbleRef.current.style.bottom = "unset";
                }
                textBubbleRef.current.style.left = `${rect.left}px`;
                textBubbleRef.current.style.width = `${rect.width}px`;
            }
        };

        // Create an IntersectionObserver
        const intersectionObserver = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                updateTextBubblePosition();
            }
        });

        // Observe the activeStepRef element
        if (activeStepRef.current) {
            intersectionObserver.observe(activeStepRef.current);
        }

        // Cleanup on unmount
        return () => {
            if (activeStepRef.current) {
                intersectionObserver.unobserve(activeStepRef.current);
            }
        };
    }, [currentStep]); // Dependency array

    useEffect(() => {
        const updateTextBubblePosition = () => {
            if (activeStepRef.current && textBubbleRef.current) {
                const rect = activeStepRef.current.getBoundingClientRect();
                if (currentStep === 6 || currentStep === 7) {
                    // Position above the active step
                    textBubbleRef.current.style.top = `${rect.top - textBubbleRef.current.offsetHeight - 10}px`;
                    textBubbleRef.current.style.bottom = 'unset';
                } else {
                    // Position below the active step
                    textBubbleRef.current.style.top = `${rect.bottom + 10}px`;
                    textBubbleRef.current.style.bottom = 'unset';
                }
                textBubbleRef.current.style.left = `${rect.left}px`;
                textBubbleRef.current.style.width = `${rect.width}px`;
            }
        };

        updateTextBubblePosition();
        window.addEventListener('resize', updateTextBubblePosition);
        window.addEventListener('scroll', updateTextBubblePosition);

        // Add this line to update the position after the initial render
        setTimeout(updateTextBubblePosition, 0);

        return () => {
            window.removeEventListener('resize', updateTextBubblePosition);
            window.removeEventListener('scroll', updateTextBubblePosition);
        };
    }, [currentStep]);

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
        setIssueCopy(JSON.parse(JSON.stringify(issue))); // Create a deep copy of the issue
        setEditMode(true);
    };

    const handleCancel = () => {
        setIssue(issueCopy!); // Revert to the original issue
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
                saveIssuesToLocalStorage(issues);
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
                newValue = parseInt(value, 4);
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

    const steps = [
        "Overview",
        "Description",
        "Affected Systems",
        "Solution Proposal",
        "Impact",
        "Preventative Measures",
        "Tab Component",
        "Additional Info"
    ];



    const nextStep = () => {
        if (isChatOpen) {
            openChat();
        }
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (isChatOpen) {
            openChat();
        }
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const goToStep = (index: number) => {
        setCurrentStep(index);
    };

    if (!issue) {
        return <div className="mx-10 my-10 text-black dark:text-github-dark-text">Issue not found</div>;
    }

    function handleIntroNext() {
        if (introStep === 3) {
            setIntroFlag(false);
        }
        setIntroStep(introStep + 1);
    }

    return (
        <div className={`mx-10 my-10 bg-github-tertiary dark:bg-github-dark-background text-black dark:text-github-dark-text relative`}>
            <div className='flex items-center justify-between mb-4 z-20'>
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
                            <span className='flex items-center'>Edit <CiEdit className='text-2xl ml-2' /></span>
                        </button>
                    ) : (
                        <div className='flex space-x-4'>
                            <button onClick={handleCancel} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline">Cancel</button>
                            <button onClick={handleSave} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline">Save</button>
                        </div>
                    )}
                    {!issue.isInitialGiven && !isEditMode && (
                        <Link href={`/Issues/${issue.id}/initial-feedback`}>
                            <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline'>
                                Give Initial Feedback
                            </button>
                        </Link>
                    )}
                </div>
            </div>

            <ChatBubble
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                buttonRef={chatButtonRef}
                activeStepRef={activeStepRef}
                textBubbleRef={textBubbleRef} // Pass textBubbleRef to ChatBubble
            />
            {!introFlag && currentStep < 8 &&
                <Stepper
                    steps={steps}
                    currentStep={currentStep}
                    onStepClick={goToStep} // Add onStepClick for clickable steps
                />
            }
            <div className="grid grid-cols-3 grid-rows-[auto, 1fr, 1fr, 1fr] gap-4 relative z-10">
                <div ref={currentStep === 0 ? activeStepRef : null} className={`mb-5 bg-gradient-to-b from-[#fcf1fa] to-[#f7ebff] rounded-lg shadow-md p-4 col-span-3 ${introFlag ? introStep === 1 ? 'active-step' : 'blacked-out-intro' : currentStep === 0 ? 'active-step' : 'blacked-out'}`}>

                    <div className='mb-4'>
                        {isEditMode ? (
                            <div className='w-1/2'>
                                <p className='font-bold pb-2'>Title</p>
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
                            <p className="">Alert type:</p>
                            {isEditMode ? (
                                <select
                                    name="alertType"
                                    value={issue.alertType}
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
                                <span>{getAlertIcon(issue.alertType)}</span>
                            )}
                        </div>
                        <div>
                            <p>Severity:
                                {isEditMode ? (
                                    <select
                                        name="severity"
                                        value={issue.severity}
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
                                        {issue.severity}</span>
                                )}
                            </p>
                        </div>
                        <div>
                            <p>Status:
                                <select
                                    name="status"
                                    value={issue.status}
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
                            <p>Incident type:
                                {isEditMode ? (
                                    <select
                                        name="incidentType"
                                        value={issue.incidentType}
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
                                        onChange={handleInputChange}
                                        className="input mx-2 border border-grey-800"
                                    >
                                        {priorities.map(priority => (
                                            <option key={priority} value={priority}>
                                                {priority}, {priority === 1 ? 'niedrig' : priority === 2 ? 'mittel' : priority === 3 ? 'hoch' : 'dringend'}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <span className='bg-gray-200 dark:bg-gray-500 rounded-xl p-2 m-2'>
                                        {`${issue.priority}/4`}
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>

                </div>
                {introFlag && (introStep === 0 || introStep === 1) && (
                    <div className="intro-container">
                        <div className="comment">
                            {introFlag ? wizardTextIntro[introStep] : ""}
                        </div>
                        <button
                            onClick={handleIntroNext}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline">
                            Weiter
                        </button>
                    </div>
                )}



                <div ref={currentStep === 1 ? activeStepRef : null} className={`bg-github-secondary dark:bg-github-dark-tertiary rounded-lg shadow-md min-h-[200px] col-span-1 row-span-2 p-4 bg-gradient-to-b from-[#fcf1fa] to-[#f7ebff] ${currentStep === 1 ? 'active-step' : 'blacked-out'}`}>
                    <p className='font-bold pb-2'>Description</p>

                    {isEditMode ? (
                        <textarea
                            name="description"
                            value={issue.description}
                            onChange={handleInputChange}
                            className="editable-input"
                        />
                    ) : ((issue.description === "" && showPromptDescription) ? (
                        <div className='text-center bg-white p-2 border rounded-md'>
                            <p className='font-bold '>Es scheint als ob hier der Text fehlt. Willst du das mit KI ergänzen lassen?</p>
                            <div className='mt-2 flex justify-center'>
                                <button className='bg-blue-500 hover:bg-blue-700 w-16 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2'>Ja</button>
                                <button onClick={() => {
                                    setShowPromptDescription(false)
                                }} className='bg-blue-500 hover:bg-blue-700 w-16 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>Nein</button>
                            </div>
                        </div>

                    ) : (
                        <p
                            className="max-h-96 overflow-y-auto"
                            style={{ wordBreak: 'break-word', whiteSpace: 'pre-line', maxHeight: '1050px' }}
                        >
                            {issue.description}
                        </p>
                    ))}
                </div>

                <div ref={currentStep === 2 ? activeStepRef : null} className={`bg-github-secondary dark:bg-github-dark-tertiary max-w-l rounded-lg shadow-md min-h-[200px] col-span-1 row-span-1 p-4 bg-gradient-to-b from-[#fcf1fa] to-[#f7ebff] ${currentStep === 2 ? 'active-step' : 'blacked-out'}`}>
                    <p className='font-bold pb-2'>Affected Systems</p>
                    <div className="space-y-1">
                        {isEditMode ? (
                            <div>
                                <div className='flex space-x-4 h-full'>
                                    <div className="relative inline-block min-h-[45px]" ref={dropdownRef}>
                                        <div
                                            className="cursor-pointer"
                                            onClick={toggleDropdown}
                                        >
                                            <div className="cursor-pointer flex items-center border rounded-md py-1 px-4 bg-white shadow-sm min-h-[45px]">
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
                                </div>
                                <div className={`flex-grow py-1 px-2 max-h-60 overflow-y-auto min-h-[40px] flex flex-col justify-center mt-2 ${issue.affectedSystems.length !== 0 ? 'border border-gray-300 rounded-md' : ''}`}>
                                    {issue.affectedSystems.map((system, index) => (
                                        <div key={index} className={`flex items-center ${index !== issue.affectedSystems.length - 1 ? 'border-b border-gray-300' : ''} min-h-[40px]`}>
                                            <span className="flex-grow">{system}</span>
                                            <button type="button" onClick={() => handleRemoveSystem(index)} className="ml-2 text-red-500">Remove</button>
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
                                showPromptAffectedSystems ? (
                                    <div className='text-center bg-white p-2 border rounded-md'>
                                        <p className='font-bold '>Es scheint als ob hier der Text fehlt. Willst du das mit KI ergänzen lassen?</p>
                                        <div className='mt-2 flex justify-center'>
                                            <button className='bg-blue-500 hover:bg-blue-700 w-16 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2'>Ja</button>
                                            <button onClick={() => {
                                                setShowPromptAffectedSystems(false)
                                            }} className='bg-blue-500 hover:bg-blue-700 w-16 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>Nein</button>
                                        </div>
                                    </div>
                                ) : (
                                    <></>
                                )
                            )
                        )}
                    </div>
                </div>

                <div ref={currentStep === 3 ? activeStepRef : null} data-step-title="Lösungsvorschlag" className={`bg-github-secondary dark:bg-github-dark-tertiary rounded-lg shadow-md min-h-[150px] col-span-1 row-span-1 p-4 bg-gradient-to-b from-[#fcf1fa] to-[#f7ebff] ${currentStep === 3 ? 'active-step' : 'blacked-out'}`}>
                    <p className='font-bold pb-2'>Lösungsvorschlag</p>
                    {isEditMode ? (
                        <textarea
                            name="loesungsvorschlag"
                            value={issue.loesungsvorschlag}
                            onChange={handleInputChange}
                            className="editable-input"
                        />
                    ) : (
                        ((issue.loesungsvorschlag === "" && showPromptLoesungsvorschlag) ? (
                            <div className='text-center bg-white p-2 border rounded-md'>
                                <p className='font-bold '>Es scheint als ob hier der Text fehlt. Willst du das mit KI ergänzen lassen?</p>
                                <div className='mt-2 flex justify-center'>
                                    <button className='bg-blue-500 hover:bg-blue-700 w-16 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2'>Ja</button>
                                    <button onClick={() => {
                                        setshowPromptLoesungsvorschlag(false)
                                    }} className='bg-blue-500 hover:bg-blue-700 w-16 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>Nein</button>
                                </div>
                            </div>
                        ) :
                            (<p className='' style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>{issue.loesungsvorschlag}</p>)
                        ))}
                </div>

                <div ref={currentStep === 4 ? activeStepRef : null} className={`bg-github-secondary dark:bg-github-dark-tertiary max-w-l rounded-lg shadow-md min-h-[200px] col-span-1 row-span-1 p-4 bg-gradient-to-b from-[#fcf1fa] to-[#f7ebff] ${currentStep === 4 ? 'active-step' : 'blacked-out'}`}>
                    <p className='font-bold pb-2'>Impact</p>
                    {isEditMode ? (
                        <textarea
                            name="impact"
                            value={issue.impact}
                            onChange={handleInputChange}
                            className="editable-input"
                        />
                    ) : ((issue.impact === "" && showPromptImpact) ? (
                        <div className='text-center bg-white p-2 border rounded-md'>
                            <p className='font-bold '>Es scheint als ob hier der Text fehlt. Willst du das mit KI ergänzen lassen?</p>
                            <div className='mt-2 flex justify-center'>
                                <button className='bg-blue-500 hover:bg-blue-700 w-16 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2'>Ja</button>
                                <button onClick={() => {
                                    setShowPromptImpact(false)
                                }} className='bg-blue-500 hover:bg-blue-700 w-16 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>Nein</button>
                            </div>
                        </div>
                    ) : (
                        <p className='' style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>{issue.impact}</p>)
                    )}
                </div>

                <div ref={currentStep === 5 ? activeStepRef : null} data-step-title="Lösungsvorschlag" className={`bg-github-secondary dark:bg-github-dark-tertiary max-w-l rounded-lg shadow-md min-h-[200px] col-span-1 row-span-1 p-4 bg-gradient-to-b from-[#fcf1fa] to-[#f7ebff] ${currentStep === 5 ? 'active-step' : 'blacked-out'}`}>
                    <p className='font-bold pb-2'>Preventative Measures</p>
                    {isEditMode ? (
                        <textarea
                            name="preventativeMeasures"
                            value={issue.preventativeMeasures}
                            onChange={handleInputChange}
                            className="editable-input"
                        />
                    ) : (

                        (issue.preventativeMeasures === "" && showPromptPreventativeMeasures) ? (
                            <div className='text-center bg-white p-2 border rounded-md'>
                                <p className='font-bold '>Es scheint als ob hier der Text fehlt. Willst du das mit KI ergänzen lassen?</p>
                                <div className='mt-2 flex justify-center'>
                                    <button className='bg-blue-500 hover:bg-blue-700 w-16 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2'>Ja</button>
                                    <button onClick={() => {
                                        setShowPromptPreventativeMeasures(false)
                                    }} className='bg-blue-500 hover:bg-blue-700 w-16 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>Nein</button>
                                </div>
                            </div>
                        ) :

                            (<p className='' style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>{issue.preventativeMeasures}</p>)
                    )}
                </div>

                <div ref={currentStep === 6 ? activeStepRef : null} className={`bg-github-secondary dark:bg-github-dark-tertiary rounded-lg shadow-md min-h-[200px] col-span-1 row-span-1 p-4 bg-gradient-to-b from-[#fcf1fa] to-[#f7ebff] ${currentStep === 6 ? 'active-step' : 'blacked-out'}`}>
                    <TabComponent />
                </div>

                <div ref={currentStep === 7 ? activeStepRef : null} className={`bg-github-secondary dark:bg-github-dark-tertiary rounded-lg shadow-md min-h-[150px] col-span-1 row-span-1 p-4 bg-gradient-to-b from-[#fcf1fa] to-[#f7ebff] ${currentStep === 7 ? 'active-step' : 'blacked-out'}`}>
                    <p className='font-bold pb-2'>Info</p>
                    <div className='grid grid-cols-2 gap-2'>
                        <p className=''>Creator:</p>
                        <p className='text-right'>{issue.creator}</p>
                        <p className=''>Issue Nr.:</p>
                        <p className='text-right'>{issue.id}</p>
                        <p className=''>Duration:</p>
                        <p className='text-right'>{issue.duration} h</p>
                        <p className=''>Timestamp:</p>
                        <p className='text-right'>{formatDate(issue.timestamp)}</p>
                        <p className=''>Last updated:</p>
                        <p className='text-right'>{formatDate(issue.lastUpdated)}</p>
                        <p className=''>End time:</p>
                        <p className='text-right'>--:--</p>
                    </div>
                </div>
            </div>

            <div className="flex justify-center z-20">
                {isTerminalOpen && issue.commands.length > 0 && (
                    <div className='terminal-container'>
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-2xl font-bold text-black dark:text-white">Terminal</h1>
                            <button
                                type="button"
                                className="text-black dark:text-white self-center" /* Add self-center to the button */
                                onClick={openTerminal}
                            >
                                <MdCancel className="text-gray-700 transform scale-150" />
                            </button>
                        </div>
                        <p className="text-black dark:text-gray-300 mb-4">Hier sind die empfohlenen Befehle, um Ihr Problem zu lösen:</p>
                        <ul className="list-disc pl-5 mb-4 text-black dark:text-gray-300">
                            <li className="mb-2">Den PRTG Core Server-Dienst neu starten</li>
                            <li className="mb-2">Den Status des PRTG Core Server-Dienstes überprüfen</li>
                            <li className="mb-2">Den PRTG Core Server-Dienst beim Booten aktivieren</li>
                        </ul>
                        <Terminal commands={issue.commands} onExecute={handleExecute} commandResponses={issue.commandResponses} />
                    </div>
                )}
            </div>

            {/* Dark mask overlay */}
            <div className="fixed inset-0 bg-black opacity-80 z-0 pointer-events-none"></div>

            {/* Text bubble */}
            {currentStep < 8 &&
                <div ref={textBubbleRef} className={`${currentStep === 6 || currentStep === 7 ? 'text-bubble-top' : 'text-bubble-bottom'} ${introFlag ? (introStep === 2 || introStep === 3) ? '' : 'blacked-out-intro' : ''}`}>
                    <div className="text-bubble-text">
                        <p style={{ whiteSpace: 'pre-line', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                            {textBubbleContent[currentStep]}
                        </p>

                        <div className='flex justify-end mt-[10px]'>
                            <button ref={chatButtonRef} className={`
                            ${introFlag ?
                                    introStep === 3 ?
                                        'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline border-2 border-red-300' :
                                        'ai-button font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' :
                                    isChatOpen ?
                                        'bg-blue-700 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' : 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'}`}
                                onClick={openChat}>
                                <AiOutlineWechatWork className='text-xl' />
                            </button>
                        </div>
                    </div>

                    <div className="navigation-buttons items-center">
                        <button onClick={prevStep}
                            disabled={currentStep === 0}
                            style={{
                                visibility: currentStep === 0 ? 'hidden' : 'visible'
                            }}>
                            Previous
                        </button>

                        <div className='flex space-x-2'>
                            {steps.map((_, index) => (
                                <div
                                    key={index}
                                    className={`circle ${currentStep >= index ? 'completed' : ''}`}
                                />
                            ))}
                        </div>
                        <button
                            onClick={currentStep !== steps.length - 1 ? nextStep : handleClick}
                            className={`${introFlag ? "intro-button" : currentStep !== steps.length - 1 ? "" : "fertig-button"}`}>
                            {currentStep !== steps.length - 1 ? "Next" : "Fertig"}
                        </button>
                    </div>
                </div>
            }

            {/* Conditionally render the intro container for introStep === 1 */}
            {(introFlag && introStep === 2 || introStep === 3) && (
                <div ref={introContainerRef} className="intro-container-2">
                    <div className="comment">
                        {wizardTextIntro[introStep]}
                    </div>
                    <button
                        onClick={handleIntroNext}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline">
                        {introStep === 3 ? "Start" : "Weiter"}
                    </button>
                </div>
            )}

            {showFeedbackModal && (
                <FeedbackModal
                    onSubmit={() => {
                        const issues = loadIssuesFromLocalStorage();
                        const updatedIssues = issues.map(issue => {
                            if (issue.id === Number(params.id)) {
                                return { ...issue, wizardFeedback: true };
                            }
                            return issue;
                        });
                        saveIssuesToLocalStorage(updatedIssues);
                        router.push(`/Issues/${params.id}`)
                    }}
                    onClose={
                        () => setShowFeedbackModal(false)
                    }
                />
            )}
        </div >
    );
}

export default IssueJourney;
