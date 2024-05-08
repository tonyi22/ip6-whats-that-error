export interface SystemMonitoringIssue {
    id: number,
    title: string;
    description: string;
    status: string;//'Open' | 'Closed' | 'In Progress';
    timestamp: Date;
    creator: string;
    duration: number;
    endTime: Date;
    lastUpdated: Date;
    impact: string;
    affectedSystems: string[];
    alertType: string;//'Warning' | 'Info' | 'Critical';
    incidentType: string;//'Performance' | 'Storage' | 'Overheating' | 'Backups' | 'Power';
    priority: number;
    severity: string;//'Low' | 'Medium' | 'High';
    preventativeMeasures: string;
    attachments: string[];
    comments: string[];
}
