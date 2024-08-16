// Issue data
export interface SystemMonitoringIssue {
    id: number;
    title: string;
    description: string;
    status: 'New' | 'Open' | 'Closed' | 'In Progress';
    timestamp: Date;
    creator: string;
    duration: number;
    endTime: Date;
    lastUpdated: Date;
    impact: string;
    loesungsvorschlag: string;
    affectedSystems: string[];
    alertType: 'Warning' | 'Info' | 'Error';
    incidentType: 'Performance' | 'Storage' | 'Overheating' | 'Backups' | 'Power' | 'Data Integrity' | 'Connection' | 'Query' | 'Monitoring' | 'Network' | 'Authentication' | 'Resources' | 'Processes' | 'Configuration' | 'Data Export' | 'Documentation' | 'Startup' | 'Demonstration' | 'Communication' | 'Data Import' | 'Security';
    priority: number;
    severity: 'Low' | 'Medium' | 'High';
    preventativeMeasures: string;
    attachments: string[];
    comments: string[];
    isInitialGiven: boolean;
    commands: string[];
    commandResponses: string[][];
    wizardFeedback: boolean;
}
