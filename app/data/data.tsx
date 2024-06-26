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
    affectedSystems: string[];
    alertType: 'Warning' | 'Info' | 'Critical';
    incidentType: 'Performance' | 'Storage' | 'Overheating' | 'Backups' | 'Power';
    priority: number;
    severity: 'Low' | 'Medium' | 'High';
    preventativeMeasures: string;
    attachments: string[];
    comments: string[];
    isInitialGiven: boolean;
}
