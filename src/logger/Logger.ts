import { LogEntry, LogLevel } from '../interfaces/LogEntry'
import CloudWatchLogger from './CloudWatchLogger'

class Logger {
    private cloudWatchLogger: CloudWatchLogger
    private service: string

    constructor(serviceName: string, logGroupName: string, logStreamName: string) {
        this.cloudWatchLogger = new CloudWatchLogger(logGroupName, logStreamName)
        this.service = serviceName
    }

    private async log(entry: LogEntry, level: LogLevel): Promise<void> {
        const logMessage = JSON.stringify({
            level,
            service: this.service,
            ...entry,
            timestamp: entry.timestamp || new Date().toISOString()
        })

        await this.cloudWatchLogger.log(logMessage)
    }

    // 'FATAL' | 'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'TRACE'
    fatal(entry: LogEntry): Promise<void> {
        return this.log(entry, LogLevel.FATAL)
    }

    error(entry: LogEntry): Promise<void> {
        return this.log(entry, LogLevel.ERROR)
    }

    warn(entry: LogEntry): Promise<void> {
        return this.log(entry, LogLevel.WARN)
    }

    info(entry: LogEntry): Promise<void> {
        return this.log(entry, LogLevel.INFO)
    }

    debug(entry: LogEntry): Promise<void> {
        return this.log(entry, LogLevel.DEBUG)
    }

    trace(entry: LogEntry): Promise<void> {
        return this.log(entry, LogLevel.TRACE)
    }
}

export default Logger
