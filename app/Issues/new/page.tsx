'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { systemMonitoringIssuesArray } from '../page';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { getAlertIcon, getSeverityColor, validateType } from '@/app/helperFunction';
import '../[id]/detailView.css';
import { SystemMonitoringIssue } from '@/app/data/data';
import { MdCancel } from "react-icons/md";

const NewIssue = () => {
    const alertTypes = ['Critical', 'Warning', 'Info', 'None'] as const;
    const severityTypes = ['Low', 'Medium', 'High'] as const;
    const statusTypes = ['New', 'Open', 'Closed', 'In Progress'] as const;
    const incidentTypes = ['Performance', 'Storage', 'Overheating', 'Backups', 'Power'] as const;
    const priorities = Array.from({ length: 10 }, (_, i) => i + 1);

    const [newIssue, setNewIssue] = useState({
        id: systemMonitoringIssuesArray.length + 1, // or use a more sophisticated ID generator
        title: '',
        description: '',
        alertType: 'None',
        severity: 'Low',
        status: 'New',
        incidentType: 'Performance',
        priority: 1,
        affectedSystems: [] as string[],
        creator: 'User 1', // This should be set to the current user in a real app
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

    const [suggestedDescription, setSuggestedDescription] = useState('');
    const [suggestionAccepted, setSuggestionAccepted] = useState(false);

    const router = useRouter();

    const [showTitleTemplate, setShowTitleTemplate] = useState(false);
    const [titleTemplateDismissed, setTitleTemplateDismissed] = useState(false);
    const [showDescriptionTemplate, setShowDescriptionTemplate] = useState(false);
    const [descriptionTemplateDismissed, setDescriptionTemplateDismissed] = useState(false);

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

    const showTemplateAgain = (templateType: 'title' | 'description') => {
        if (templateType === 'title') {
            setShowTitleTemplate(true);
            setTitleTemplateDismissed(false);
        } else if (templateType === 'description') {
            setShowDescriptionTemplate(true);
            setDescriptionTemplateDismissed(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewIssue(prev => ({
            ...prev,
            [name]: name === 'priority' ? parseInt(value, 10) : value
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

    const handleAddSystem = () => {
        setNewIssue(prev => ({
            ...prev,
            affectedSystems: [...prev.affectedSystems, '']
        }));
    };

    const checkForTitleSuggestion = (title: string) => {
        const lowerCase = title.toLowerCase();
        if (title.toLowerCase().includes('datenbankserver') && title.toLowerCase().includes('überhitzung')) {
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

    const handleSystemChange = (index: number, value: string) => {
        setNewIssue(prev => {
            const updatedSystems = [...prev.affectedSystems];
            updatedSystems[index] = value;
            return {
                ...prev,
                affectedSystems: updatedSystems
            };
        });
    };


    const handleRemoveSystem = (index: number) => {
        setNewIssue(prev => {
            const updatedSystems = prev.affectedSystems.filter((_, i) => i !== index);
            return {
                ...prev,
                affectedSystems: updatedSystems
            };
        });
    };

    const handleCancel = () => {
        router.push('/Issues');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        systemMonitoringIssuesArray.push(newIssue as SystemMonitoringIssue); // In a real app, this would be a POST request to the backend
        router.push('/Issues'); // Navigate back to the issues list
    };

    return (
        <div className='flex justify-center'>
            <div className="my-10 bg-github-tertiary dark:bg-github-dark-background text-black dark:text-github-dark-text w-full max-w-4xl">
                <h3 className="p-10 text-5xl font-semibold m-7 flex justify-center items-center">Create New Issue</h3>
                <form onSubmit={handleSubmit}>



                    <div>
                        <label className="block text-sm font-bold mb-2" htmlFor="title">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={newIssue.title}
                            onChange={handleInputChange}
                            className="editable-input"
                            onFocus={handleTitleFocus} // Show template on focus
                            required
                        />
                        {showTitleTemplate && (
                            <div
                                className="relative mt-2 p-2 mb-4 bg-gray-50 border border-gray-300 rounded-lg shadow-md"
                                style={{
                                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Hover-like shadow
                                }}
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
                    </div>
                    {titleTemplateDismissed && !showTitleTemplate && (
                        <button
                            type="button"
                            className="text-sm text-blue-500 mb-4"
                            onClick={() => showTemplateAgain('title')}
                        >
                            Show Template
                        </button>
                    )}




                    <div>
                        <label className="block text-sm font-bold mb-2" htmlFor="description">Description</label>
                        <textarea
                            name="description"
                            value={suggestionAccepted ? newIssue.description : newIssue.description}
                            placeholder={suggestionAccepted ? '' : suggestedDescription}
                            onChange={handleInputChange}
                            className="editable-input"
                            onFocus={handleDescriptionFocus} // Show template on focus
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
                        {
                            showDescriptionTemplate && (
                                <div className="relative mt-2 p-2 mb-4 bg-gray-50 border border-gray-300 rounded-lg shadow-md"
                                    style={{
                                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Hover-like shadow
                                    }}>
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
                                        <li>Lösungsvorschlag</li>
                                    </ol>
                                </div>
                            )}
                    </div>

                    {descriptionTemplateDismissed && !showDescriptionTemplate && (
                        <button
                            type="button"
                            className="text-sm text-blue-500 mb-4"
                            onClick={() => showTemplateAgain('description')}
                        >
                            Show Template
                        </button>
                    )}

                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <label className="block text-sm font-bold mb-2" htmlFor="alertType">Alert Type</label>
                            <select
                                name="alertType"
                                value={newIssue.alertType}
                                onChange={handleInputChange}
                                className="input"
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
                                className="input"
                            >
                                {severityTypes.map(type => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2" htmlFor="status">Status</label>
                            <select
                                name="status"
                                value={newIssue.status}
                                onChange={handleInputChange}
                                className="input"
                            >
                                {statusTypes.map(type => (
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
                                className="input"
                            >
                                {incidentTypes.map(type => (
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
                                className="input"
                            >
                                {priorities.map(priority => (
                                    <option key={priority} value={priority}>
                                        {priority}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-2" htmlFor="affectedSystems">Affected Systems</label>
                        {newIssue.affectedSystems.map((system, index) => (
                            <div key={index} className="flex items-center mb-2">
                                <input
                                    type="text"
                                    name={`affectedSystems-${index}`}
                                    value={system}
                                    onChange={(e) => handleSystemChange(index, e.target.value)}
                                    className="editable-input flex-grow"
                                />
                                <button type="button" onClick={() => handleRemoveSystem(index)} className="ml-2 text-red-500">Remove</button>
                            </div>
                        ))}
                        <button type="button" onClick={handleAddSystem} className="text-blue-500 text-sm">Add Affected System</button>
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

                    <div className="flex justify-end">
                        <button type="button" onClick={handleCancel} className="bg-gray-500 text-white p-2 rounded-lg shadow-md mx-2">Cancel</button>
                        <button type="submit" className="bg-github-primary dark:bg-github-dark-primary dark:text-white p-2 rounded-lg shadow-md">Create Issue</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewIssue;