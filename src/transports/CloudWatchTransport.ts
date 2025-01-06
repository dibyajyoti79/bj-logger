import { PutLogEventsCommand, CreateLogStreamCommand, CreateLogGroupCommand, CloudWatchLogsClient } from '@aws-sdk/client-cloudwatch-logs'
import { Transport } from './Transport'
import { LogEntry, LogLevel } from '../interfaces/LogEntry'
import { handleError } from '../utils/errorHandler'

export interface CloudWatchConfig {
    region: string
    accessKeyId: string
    secretAccessKey: string
    logGroupName: string
    logStreamName: string
}

export class CloudWatchTransport extends Transport {
    private logGroupName: string
    private logStreamName: string
    private client: CloudWatchLogsClient

    constructor(config: CloudWatchConfig) {
        super()
        this.logGroupName = config.logGroupName
        this.logStreamName = config.logStreamName
        this.client = new CloudWatchLogsClient({
            region: config.region,
            credentials: {
                accessKeyId: config.accessKeyId,
                secretAccessKey: config.secretAccessKey
            }
        })
    }

    private async ensureLogGroupAndStream(): Promise<void> {
        try {
            await this.client.send(new CreateLogGroupCommand({ logGroupName: this.logGroupName }))
        } catch (error) {
            if (error instanceof Error && error.name !== 'ResourceAlreadyExistsException') {
                handleError(error, 'CreateLogGroup')
            }
        }

        try {
            await this.client.send(
                new CreateLogStreamCommand({
                    logGroupName: this.logGroupName,
                    logStreamName: this.logStreamName
                })
            )
        } catch (error) {
            if (error instanceof Error && error.name !== 'ResourceAlreadyExistsException') {
                handleError(error, 'CreateLogStream')
            }
        }
    }

    async log(entry: LogEntry, level: LogLevel): Promise<void> {
        await this.ensureLogGroupAndStream()
        const log = {
            level,
            service: entry.service,
            traceId: entry.traceId,
            message: entry.message,
            timestamp: entry.timestamp || new Date().toISOString(),
            body: entry.body || {}
        }
        const logMessage = JSON.stringify(log)
        const command = new PutLogEventsCommand({
            logGroupName: this.logGroupName,
            logStreamName: this.logStreamName,
            logEvents: [{ message: logMessage, timestamp: Date.now() }]
        })

        try {
            await this.client.send(command)
        } catch (error) {
            handleError(error, 'PutLogEvents')
        }
    }
}
