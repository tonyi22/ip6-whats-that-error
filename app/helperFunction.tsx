import { IoWarningOutline } from "react-icons/io5";
//import { PiWarningOctagonBold } from "react-icons/pi";
// import { TfiInfoAlt } from "react-icons/tfi";
import { RiErrorWarningLine } from "react-icons/ri";
import { IoInformationCircleOutline } from "react-icons/io5";
import { de } from 'date-fns/locale';
import { format } from 'date-fns';
import Tippy from "@tippyjs/react";

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
            return <IoWarningOutline size="3.5rem" className="text-yellow-500" />;
        case 'Critical':
            return < RiErrorWarningLine size="3.5rem" className="text-red-700" />;
        case 'Info':
        default:
            return <IoInformationCircleOutline size="3.5rem" className="text-blue-800" />;
    }
};

export const compareSort = (a: string, b: string) => {
    return a.localeCompare(b);
}


export const getAlertText = (alertType: string) => {
    switch (alertType) {
        case 'Warning':
            return "Warnmeldung";
        case 'Critical':
            return "Fehlermeldunge";
        case 'Info':
            return "Informationsmeldung";
        default:
            return "Unbekannte Meldung";
    }
}

export const getPriorityText = (prio: number, tippyContent: React.ReactNode) => {
    let priorityText;

    switch (prio) {
        case 1:
            priorityText = "Niedrige Priorität";
            break;
        case 2:
            priorityText = "Mittlere Priorität";
            break;
        case 3:
            priorityText = "Hohe Priorität";
            break;
        case 4:
            priorityText = "Dringende Priorität";
            break;
    }

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
        case 'Critical':
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