import { LogEntry, LogLevel } from '../interfaces/LogEntry'
import CloudWatchLogger from './CloudWatchLogger'
import { Request, Response, NextFunction } from 'express'
import { v4 as uuidv4 } from 'uuid'
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

    /**
     * Middleware for logging HTTP requests and responses.
     */
    logHttp(): (req: Request, res: Response, next: NextFunction) => void {
        return (req: Request, res: Response, next: NextFunction) => {
            const start = Date.now()

            res.on('finish', async () => {
                const duration = Date.now() - start
                const correlationId = Array.isArray(req.headers['x-correlation-id'])
                    ? req.headers['x-correlation-id'][0]
                    : req.headers['x-correlation-id'] || uuidv4()
                const sanitizedHeaders = { ...req.headers }
                delete sanitizedHeaders['authorization'] // Remove sensitive information
                const logEntry: LogEntry = {
                    message: 'HTTP Transaction',
                    traceId: correlationId,
                    body: {
                        statusCode: res.statusCode,
                        method: req.method,
                        path: req.path,
                        url: req.originalUrl || req.url,
                        query: req.query,
                        headers: sanitizedHeaders,
                        userAgent: req.headers['user-agent'] || '',
                        ip: req.ip || '',
                        duration: `${duration}ms`
                    },
                    timestamp: new Date().toISOString()
                }

                try {
                    await this.info(logEntry)
                } catch (error) {
                    console.error('Failed to log HTTP transaction:', error)
                }
            })

            next()
        }
    }
}

export default Logger
