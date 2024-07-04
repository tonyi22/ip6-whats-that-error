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
    // affectedSystems: 'WebServer-01' | 'DatabaseServer-01' | 'StorageSystem-01' | 'NetworkSwitch-01' | 'LoadBalancer-01' |
    // 'BackupServer-01' | 'MonitoringSystem-01' | 'AuthenticationServer-01' | 'APIGateway-01' | 'Firewall-01' |
    // 'VirtualizationServer-01' | 'DNSServer-01' | 'EmailServer-01' | 'ApplicationServer-01' | 'ERPSystem-01' |
    // 'CRMSystem-01' | 'FileServer-01' | 'ProxyServer-01' | 'DevelopmentServer-01' | 'TestServer-01';

    alertType: 'Warning' | 'Info' | 'Critical';
    incidentType: 'Performance' | 'Storage' | 'Overheating' | 'Backups' | 'Power' | 'Data Integrity' | 'Connection' | 'Query' | 'Monitoring' | 'Network' | 'Authentication' | 'Resources' | 'Processes' | 'Configuration' | 'Data Export' | 'Documentation' | 'Startup' | 'Demonstration' | 'Communication' | 'Data Import' | 'Security';
    priority: number;
    severity: 'Low' | 'Medium' | 'High';
    preventativeMeasures: string;
    attachments: string[];
    comments: string[];
    isInitialGiven: boolean;
}
