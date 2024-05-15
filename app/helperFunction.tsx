import { IoWarningOutline } from "react-icons/io5";
//import { PiWarningOctagonBold } from "react-icons/pi";
// import { TfiInfoAlt } from "react-icons/tfi";
import { RiErrorWarningLine } from "react-icons/ri";
import { IoInformationCircleOutline } from "react-icons/io5";

export const getAlertIconBig = (alertType: string) => {
    switch (alertType) {
        case 'Warning':
            return <IoWarningOutline size="3.5rem" className="text-[#D566FF]" />;
        case 'Critical':
            return < RiErrorWarningLine size="3.5rem" className="text-[#D566FF]" />;
        case 'Info':
        default:
            return <IoInformationCircleOutline size="3.5rem" className="text-[#D566FF]" />;
    }
};


//function to show the correct icon depending on the alert type
export const getAlertIcon = (alertType: string) => {
    switch (alertType) {
        case 'Warning':
            return <IoWarningOutline className='text-5xl text-yellow-800 dark:text-yellow-800' />;
        case 'Critical':
            return < RiErrorWarningLine className='text-5xl text-red-800 dark:text-red-800' />;
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