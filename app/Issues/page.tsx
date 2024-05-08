import issues from '../data/issues.json' assert { type: 'json' };;
import styles from '../issues.module.css'

function List({ list }: { list: SystemMonitoringIssue[] }) {
    return (
        <div className={styles.issueList}>
            {list.slice(1).map(issue => (
                <div key={issue.id} className={styles.issueCard}>
                    <h2>{issue.title}</h2>
                    <p>{issue.description}</p>
                </div>
            ))}
        </div>
    )
}


function MainCard({ firstIssue }: { firstIssue: SystemMonitoringIssue }) {
    return (
        <div className={styles.mainIssue} >
            <h1>{firstIssue.title}</h1>
            <p>{firstIssue.description}</p>
        </div>
    )
}

const systemMonitoringIssuesArray: SystemMonitoringIssue[] = issues.map(issue => {
    return {
        ...issue,
        timestamp: new Date(issue.timestamp),
        endTime: new Date(issue.endTime),
        lastUpdated: new Date(issue.lastUpdated),
    };
});

export default function IssuesPage() {
    return (
        <div>
            <div className={styles.app}>
                <MainCard firstIssue={systemMonitoringIssuesArray[0]} />
                <List list={systemMonitoringIssuesArray} />
            </div>
        </div>
    )
}