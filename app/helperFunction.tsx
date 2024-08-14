import { IoWarningOutline } from "react-icons/io5";
//import { PiWarningOctagonBold } from "react-icons/pi";
// import { TfiInfoAlt } from "react-icons/tfi";
import { RiErrorWarningLine } from "react-icons/ri";
import { IoInformationCircleOutline } from "react-icons/io5";
import { de } from 'date-fns/locale';
import { format } from 'date-fns';
import Tippy from "@tippyjs/react";

export const severityTranslation: { [key: string]: string } = {
    "High": "Hoch",
    "Medium": "Mittel",
    "Low": "Niedrig"
}

export const alertTypeTransaltion: { [key: string]: string } = {
    "Info": "Informationsmeldung",
    "Warning": "Warnmeldung",
    "Error": "Fehlermeldung"
}

export const incidentTypeTranslationMapDeEn: { [key: string]: string } = {
    "Performance": "Performance",
    "Speicher": "Storage",
    "Überhitzung": "Overheating",
    "Backups": "Backups",
    "Stromversorgung": "Power",
    "Datenintegrität": "Data Integrity",
    "Verbindung": "Connection",
    "Abfrage": "Query",
    "Überwachung": "Monitoring",
    "Netzwerk": "Network",
    "Authentifizierung": "Authentication",
    "Ressourcen": "Resources",
    "Prozesse": "Processes",
    "Konfiguration": "Configuration",
    "Datenexport": "Data Export",
    "Dokumentation": "Documentation",
    "Startvorgang": "Startup",
    "Demonstration": "Demonstration",
    "Kommunikation": "Communication",
    "Datenimport": "Data Import",
    "Sicherheit": "Security",
    "Sonstiges": "Other"
};

export const incidentTypeTranslationMapEnDe: { [key: string]: string } = {
    "Performance": "Leistung",
    "Storage": "Speicher",
    "Overheating": "Überhitzung",
    "Backups": "Backups",
    "Power": "Stromversorgung",
    "Data Integrity": "Datenintegrität",
    "Connection": "Verbindung",
    "Query": "Abfrage",
    "Monitoring": "Überwachung",
    "Network": "Netzwerk",
    "Authentication": "Authentifizierung",
    "Resources": "Ressourcen",
    "Processes": "Prozesse",
    "Configuration": "Konfiguration",
    "Data Export": "Datenexport",
    "Documentation": "Dokumentation",
    "Startup": "Startvorgang",
    "Demonstration": "Demonstration",
    "Communication": "Kommunikation",
    "Data Import": "Datenimport",
    "Security": "Sicherheit",
    "Other": "Sonstiges"
};


export function validateType<T>(value: any, validValues: T[], defaultValue: T): T {
    return validValues.includes(value) ? value : defaultValue;
}

export function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

//helper function to format date
export const formatDate = (date: string | number | Date) => {
    return format(new Date(date), 'HH:mm, dd.MM.yy ', { locale: de });
};

export const getAlertIconBig = (alertType: string) => {
    switch (alertType) {
        case 'Warning':
            return <IoWarningOutline size={60} className="text-yellow-500" />;
        case 'Error':
            return < RiErrorWarningLine size={60} className="text-red-700" />;
        case 'Info':
        default:
            return <IoInformationCircleOutline size={60} className="text-blue-800" />;
    }
};

export const compareSort = (a: string, b: string) => {
    return a.localeCompare(b);
}


export const getAlertText = (alertType: string, translate: (key1: string, key2: boolean) => string) => {
    const types = translate('alartTypes', false).split(", ");
    console.log('Translated alert types:', types);  // Debugging line
    console.log('Alert type:', alertType);  // Debugging line
    switch (alertType) {
        case 'Warning':
            return types[1];
        case 'Error':
            return types[2];
        case 'Info':
            return types[0];
        default:
            return "Unbekannte Meldung";
    }
}

export const getPriorityText = (prio: number, tippyContent: React.ReactNode, translate: (key1: string, key2: boolean) => string) => {
    let priorityText;
    const prios = translate("prios", false).split(", ");
    priorityText = prios[prio - 1];

    return (
        <Tippy content={<span>{priorityText}</span>}>
            <span>{tippyContent}</span>
        </Tippy>
    );

}

//function to show the correct icon depending on the alert type
export const getAlertIcon = (alertType: string) => {
    switch (alertType) {
        case 'Warning':
            return <IoWarningOutline className='text-5xl text-yellow-500 dark:text-yellow-500' />;
        case 'Error':
            return < RiErrorWarningLine className='text-5xl text-red-500 dark:text-red-800' />;
        case 'Info':
        default:
            return <IoInformationCircleOutline className='text-5xl text-blue-800 dark:text-blue-800' />;
    }
};

export const getSeverityColor = (severity: string) => {
    switch (severity) {
        case 'Low':
            return 'bg-green-500 dark:bg-green-700';
        case 'Medium':
            return 'bg-yellow-500 dark:bg-yellow-700';
        case 'High':
            return 'bg-red-500 dark:bg-red-700';
        default:
            return 'bg-gray-500 dark:bg-gray-700';
    }
};