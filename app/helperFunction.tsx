import { IoWarningOutline } from "react-icons/io5";
import { RiErrorWarningLine } from "react-icons/ri";
import { IoInformationCircleOutline } from "react-icons/io5";
import { de } from 'date-fns/locale';
import { format } from 'date-fns';
import Tippy from "@tippyjs/react";
import { IoIosHelpCircle } from "react-icons/io";

// helper functions used in other files

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

export const calculateDaysSinceTimestamp = (timestamp: Date) => {
    const currentDate = new Date();
    const issueDate = new Date(timestamp);
    const timeDifference = currentDate.getTime() - issueDate.getTime();
    const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
    return daysDifference;
};

export const systemsList = [
    'WebServer-01', 'DatabaseServer-01', 'StorageSystem-01', 'NetworkSwitch-01', 'LoadBalancer-01',
    'BackupServer-01', 'MonitoringSystem-01', 'AuthenticationServer-01', 'APIGateway-01', 'Firewall-01',
    'VirtualizationServer-01', 'DNSServer-01', 'EmailServer-01', 'ApplicationServer-01', 'ERPSystem-01',
    'CRMSystem-01', 'FileServer-01', 'ProxyServer-01', 'DevelopmentServer-01', 'TestServer-01'
];

export function translateIssueToEnglish(issue: any, language: string): any {
    if (language === 'de') {
        return {
            ...issue,
            status: statusTranslationDeEn[issue.status] || issue.status,
            severity: severityTranslationDeEn[issue.severity] || issue.severity,
            alertType: alertTypesTranslationDeEn[issue.alertType] || issue.alertType,
            incidentType: incidentTypeTranslationMapDeEn[issue.incidentType] || issue.incidentType,
        };
    }
    return issue;
}

export const statusTranslation: { [key: string]: string } = {
    "New": "Neu",
    "Open": "Offen",
    "Closed": "Geschlossen",
    "In Progress": "In Bearbeitung"
}

export const statusTranslationDeEn: { [key: string]: string } = {
    "Neu": "New",
    "Offen": "Open",
    "Geschlossen": "Closed",
    "In Bearbeitung": "In Progress"
}

export const severityTranslation: { [key: string]: string } = {
    "High": "Hoch",
    "Medium": "Mittel",
    "Low": "Niedrig"
}

export const severityTranslationDeEn: { [key: string]: string } = {
    "Hoch": "High",
    "Mittel": "Medium",
    "Niedrig": "Low"
}

export const alertTypeTransaltion: { [key: string]: string } = {
    "Info": "Informationsmeldung",
    "Warning": "Warnmeldung",
    "Error": "Fehlermeldung"
}

export const alertTypesTranslationDeEn: { [key: string]: string } = {
    "Informationsmeldung": "Info",
    "Warnmeldung": "Warning",
    "Fehlermeldung": "Error",
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
    const types = translate('alertTypes', false).split(", ");
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