import { LogEntry, LogLevel } from '../interfaces/LogEntry'

export abstract class Transport {
    abstract log(entry: LogEntry, level: LogLevel): Promise<void>
}
