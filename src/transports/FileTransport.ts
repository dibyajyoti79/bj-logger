import fs from 'fs'
import { Transport } from './Transport'
import { LogEntry, LogLevel } from '../interfaces/LogEntry'
import path from 'path'

export class FileTransport extends Transport {
    private logFilePath: string

    constructor(logFilePath: string) {
        super()
        this.logFilePath = path.resolve(process.cwd(), logFilePath, 'app.log')
    }

    private ensureDirectoryExists(): void {
        const dirPath = path.dirname(this.logFilePath)

        // Check if the directory exists, if not, create it
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true }) // Create the directory and any missing parent directories
        }
    }

    async log(entry: LogEntry, level: LogLevel): Promise<void> {
        this.ensureDirectoryExists() // Ensure the directory exists before logging
        const logMessage = {
            level,
            service: entry.service,
            traceId: entry.traceId,
            message: entry.message,
            timestamp: entry.timestamp || new Date().toISOString(),
            body: entry.body || {}
        }
        fs.appendFileSync(this.logFilePath, JSON.stringify(logMessage) + '\n')
    }
}
