import { Transport } from './Transport'
import { LogEntry, LogLevel } from '../interfaces/LogEntry'

export class ConsoleTransport extends Transport {
    async log(entry: LogEntry, level: LogLevel): Promise<void> {
        const logMessage = {
            level,
            service: entry.service,
            traceId: entry.traceId,
            message: entry.message,
            timestamp: entry.timestamp || new Date().toISOString(),
            body: entry.body || {}
        }
        console.log(JSON.stringify(logMessage, null, 2)) // Pretty print the log entry
    }
}
