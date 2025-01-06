import { Transport } from '../transports/Transport'
import { LogEntry, LogLevel } from '../interfaces/LogEntry'
import { v4 as uuidv4 } from 'uuid'
import { ConsoleTransport } from '../transports/ConsoleTransport'
export class Logger {
    private transports: Transport[] = []
    private service: string

    constructor(service: string, transports: Transport[] = [new ConsoleTransport()]) {
        this.service = service
        this.transports = transports
    }

    // Overloaded method definitions
    async fatal(message: string): Promise<void>
    async fatal(entry: Omit<LogEntry, 'service'>): Promise<void>
    async fatal(entry: string | Omit<LogEntry, 'service'>): Promise<void> {
        await this.log(entry, LogLevel.FATAL)
    }

    async error(message: string): Promise<void>
    async error(entry: Omit<LogEntry, 'service'>): Promise<void>
    async error(entry: string | Omit<LogEntry, 'service'>): Promise<void> {
        await this.log(entry, LogLevel.ERROR)
    }

    async warn(message: string): Promise<void>
    async warn(entry: Omit<LogEntry, 'service'>): Promise<void>
    async warn(entry: string | Omit<LogEntry, 'service'>): Promise<void> {
        await this.log(entry, LogLevel.WARN)
    }

    async info(message: string): Promise<void>
    async info(entry: Omit<LogEntry, 'service'>): Promise<void>
    async info(entry: string | Omit<LogEntry, 'service'>): Promise<void> {
        await this.log(entry, LogLevel.INFO)
    }

    async debug(message: string): Promise<void>
    async debug(entry: Omit<LogEntry, 'service'>): Promise<void>
    async debug(entry: string | Omit<LogEntry, 'service'>): Promise<void> {
        await this.log(entry, LogLevel.DEBUG)
    }

    async trace(message: string): Promise<void>
    async trace(entry: Omit<LogEntry, 'service'>): Promise<void>
    async trace(entry: string | Omit<LogEntry, 'service'>): Promise<void> {
        await this.log(entry, LogLevel.TRACE)
    }

    // Core log method that handles both string and object entries
    private async log(entry: string | Omit<LogEntry, 'service'>, level: LogLevel): Promise<void> {
        const logEntry: LogEntry =
            typeof entry === 'string'
                ? {
                      message: entry,
                      traceId: uuidv4(),
                      service: this.service,
                      timestamp: new Date().toISOString()
                  }
                : {
                      ...entry,
                      service: this.service,
                      traceId: entry.traceId || uuidv4(),
                      timestamp: entry.timestamp || new Date().toISOString()
                  }

        const tasks = this.transports.map((transport) => transport.log(logEntry, level))
        await Promise.all(tasks)
    }
}
