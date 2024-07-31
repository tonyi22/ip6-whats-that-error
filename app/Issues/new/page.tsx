'use client';

import React, { useEffect, useRef, useState } from 'react';
import { FaCaretDown, FaCheck } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import systemMonitoringIssuesArray from '../page';
import '../[id]/detailView.css';
import { compareSort } from '@/app/helperFunction';
import { MdCancel } from "react-icons/md";
import '../[id]/detailView.css';

const NewIssue = () => {
    const alertTypes = ['Informationsmeldung', 'Warnmeldung', 'Fehlermeldung', 'None'] as const;
    const severityTypes = ['Low', 'Medium', 'High'] as const;
    const statusTypes = ['New', 'Open', 'Closed', 'In Progress'] as const;
    const incidentTypes = [
        'Performance', 'Storage', 'Overheating', 'Backups', 'Power',
        'Data Integrity', 'Connection', 'Query', 'Monitoring', 'Network',
        'Authentication', 'Resources', 'Processes', 'Configuration', 'Data Export',
        'Documentation', 'Startup', 'Demonstration', 'Communication', 'Data Import', 'Security', 'other'
    ];
    const priorities = [
        { value: 1, label: "niedrig" },
        { value: 2, label: "mittel" },
        { value: 3, label: "hoch" },
        { value: 4, label: "dringend" }
    ];

    const systemsList = [
        'WebServer-01', 'DatabaseServer-01', 'StorageSystem-01', 'NetworkSwitch-01', 'LoadBalancer-01',
        'BackupServer-01', 'MonitoringSystem-01', 'AuthenticationServer-01', 'APIGateway-01', 'Firewall-01',
        'VirtualizationServer-01', 'DNSServer-01', 'EmailServer-01', 'ApplicationServer-01', 'ERPSystem-01',
        'CRMSystem-01', 'FileServer-01', 'ProxyServer-01', 'DevelopmentServer-01', 'TestServer-01'
    ];

    const [newIssue, setNewIssue] = useState({
        id: systemMonitoringIssuesArray.length + 1,
        title: '',
        description: '',
        alertType: 'None',
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
    });

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const titleInputRef = useRef<HTMLInputElement>(null); // Correct ref type for input
    const descriptionInputRef = useRef<HTMLTextAreaElement>(null);

    const titleShowTempRef = useRef<HTMLButtonElement>(null); // Separate ref for title show template button
    const descriptionShowTempRef = useRef<HTMLButtonElement>(null); // Separate ref for description show template button


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

    const alertTypeMapping: { [key: string]: string } = {
        'Informationsmeldung': 'Info',
        'Warnmeldung': 'Warning',
        'Fehlermeldung': 'Critical'
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewIssue(prev => ({
            ...prev,
            [name]: name === 'priority' ? parseInt(value, 4) : name === 'alertType' ? alertTypeMapping[value] || value : value
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
        if (lowerCase.includes('datenbankserver') && lowerCase.includes('überhitzung')) {
            setSuggestedDescription(`Einleitung:
Der Datenbankserver CT-10 hat unter hoher Auslastung hohe Last- und Latenzprobleme verursacht, was die Leistung mehrerer Anwendungen beeinträchtigt.

Hintergrundinformationen:
Server CT-10 hostet die Hauptdatenbank für unsere E-Commerce-Plattform. Der Server ist entscheidend für die Abwicklung von Benutzertransaktionen und die Verwaltung von Bestandsdaten. Kürzlich haben Benutzer langsame Reaktionszeiten und gelegentliche Zeitüberschreitungen gemeldet.

Schritte zur Reproduktion:
1. Melden Sie sich bei der E-Commerce-Plattform an.
2. Versuchen Sie, einen Artikel in den Warenkorb zu legen.
3. Gehen Sie zur Kasse.
4. Beobachten Sie die Reaktionszeit beim Absenden der Bestellung.

Erwartetes Verhalten:
Der Server sollte diese Vorgänge innerhalb akzeptabler Reaktionszeiten (unter 2 Sekunden) abwickeln.

Tatsächliches Verhalten:
Der Server benötigt 5-10 Sekunden zum Antworten und manchmal überschreiten die Anfragen die Zeitgrenze, was zu einer Fehlermeldung führt.

Zusätzliche Informationen:
- Server CT-10 läuft auf Ubuntu 20.04 mit MySQL 8.0.
- Das Problem trat nach einem kürzlichen Anstieg des Datenverkehrs aufgrund einer Werbekampagne auf.
- Die CPU-Auslastung auf dem Server liegt konstant über 90 %.
- Die Festplatten-E/A-Operationen sind erheblich höher als gewöhnlich.
- Relevante Fehlerprotokolle sind beigefügt.

Lösungsvorschlag:
- Untersuchen Sie die Abfragen, die eine hohe CPU- und E/A-Auslastung verursachen.
- Erwägen Sie die Optimierung der Datenbankindizes.
- Erhöhen Sie die Serverressourcen (CPU, RAM) bei Bedarf.
- Prüfen Sie die Möglichkeit des Lastenausgleichs, indem Sie die Datenbanklast auf mehrere Server verteilen.`);
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

    return (
        <div className="flex justify-center my-10 p-8 bg-github-tertiary dark:bg-github-dark-background text-black dark:text-github-dark-text">
            <div className="bg-gradient-to-b from-[#fcf1fa] to-[#f7ebff] my-10 bg-github-tertiary dark:bg-github-dark-background text-black dark:text-github-dark-text w-full max-w-4xl p-10 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold mb-4 text-center">Create New Issue</h3>
                <form>
                    <div className='mb-4'>
                        <div>
                            <label className="block text-sm font-bold mb-2" htmlFor="title">Title *</label>
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
                                    <h4 className="font-semibold text-sm">Title Template</h4>
                                    <div className="text-sm text-gray-700">
                                        <span className="font-semibold">Format:</span> [Subject] [Predicate] [Object] [Conjunction] [Condition/Place/Action/Process]
                                        <br />
                                        <span className="font-semibold">Example:</span> Server CT-10 is overheating the system under high load.
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
                                    Show Template
                                </button>
                            )}</div>
                    </div>
                    <div className='mb-4'>
                        <div >
                            <label className="block text-sm font-bold mb-2" htmlFor="description">Description *</label>
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
                                    Accept Suggestion
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
                                    <h4 className="font-semibold text-sm">Description Guide</h4>
                                    <ol className="text-sm text-gray-700 list-decimal list-inside">
                                        <li>Einleitung</li>
                                        <li>Hintergrundinformationen</li>
                                        <li>Schritte zur Reproduktion</li>
                                        <li>Erwartetes Verhalten</li>
                                        <li>Tatsächliches Verhalten</li>
                                        <li>Zusätzliche Informationen</li>
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
                                Show Template
                            </button>
                        )}
                    </div>

                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <label className="block text-sm font-bold mb-2" htmlFor="alertType">Alert Type</label>
                            <select
                                name="alertType"
                                value={newIssue.alertType}
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
                            <label className="block text-sm font-bold mb-2" htmlFor="severity">Severity</label>
                            <select
                                name="severity"
                                value={newIssue.severity}
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
                            <label className="block text-sm font-bold mb-2" htmlFor="incidentType">Incident Type</label>
                            <select
                                name="incidentType"
                                value={newIssue.incidentType}
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
                            <label className="block text-sm font-bold mb-2" htmlFor="priority">Priority</label>
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
                        <label className="block text-sm font-bold mb-2" htmlFor="affectedSystems">Affected Systems</label>

                        <div className="flex space-x-4 h-full">
                            <div className="relative inline-block min-h-[45px]" ref={dropdownRef}>
                                <div className="cursor-pointer" onClick={toggleDropdown}>
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
                                    <div className="text-gray-500 cursor-default">Keine Systeme ausgewählt</div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-2" htmlFor="impact">Impact</label>
                        <textarea
                            name="impact"
                            value={newIssue.impact}
                            onChange={handleInputChange}
                            className="editable-input"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-2" htmlFor="preventativeMeasures">Preventative Measures</label>
                        <textarea
                            name="preventativeMeasures"
                            value={newIssue.preventativeMeasures}
                            onChange={handleInputChange}
                            className="editable-input"
                        />
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={handleCancel} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline">Cancel</button>
                        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline">Create Issue</button>
                    </div>
                </form>
            </div>
        </div>

    );
};

export default NewIssue;
