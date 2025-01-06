export interface LogEntry {
    message: string
    service: string
    traceId?: string
    timestamp?: string
    body?: Record<string, any>
}
export enum LogLevel {
    FATAL = 'FATAL',
    ERROR = 'ERROR',
    WARN = 'WARN',
    INFO = 'INFO',
    DEBUG = 'DEBUG',
    TRACE = 'TRACE'
}
