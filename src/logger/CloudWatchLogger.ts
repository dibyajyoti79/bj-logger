import { PutLogEventsCommand, CreateLogStreamCommand, CreateLogGroupCommand } from '@aws-sdk/client-cloudwatch-logs'
import { cloudWatchClient } from '../config/aws'
import { handleError } from '../utils/errorHandler'

class CloudWatchLogger {
    private logGroupName: string
    private logStreamName: string

    constructor(logGroupName: string, logStreamName: string) {
        this.logGroupName = logGroupName
        this.logStreamName = logStreamName
    }

    private async ensureLogGroupAndStream(): Promise<void> {
        try {
            await cloudWatchClient.send(new CreateLogGroupCommand({ logGroupName: this.logGroupName }))
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (!error.name.includes('ResourceAlreadyExistsException')) {
                    handleError(error, 'CreateLogGroup')
                }
            } else {
                handleError(error, 'CreateLogGroup')
            }
        }

        try {
            await cloudWatchClient.send(
                new CreateLogStreamCommand({
                    logGroupName: this.logGroupName,
                    logStreamName: this.logStreamName
                })
            )
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (!error.name.includes('ResourceAlreadyExistsException')) {
                    handleError(error, 'CreateLogStream')
                }
            } else {
                handleError(error, 'CreateLogStream')
            }
        }
    }

    async log(message: string): Promise<void> {
        try {
            await this.ensureLogGroupAndStream()
            const command = new PutLogEventsCommand({
                logGroupName: this.logGroupName,
                logStreamName: this.logStreamName,
                logEvents: [
                    {
                        message,
                        timestamp: Date.now()
                    }
                ]
            })

            await cloudWatchClient.send(command)
            console.log('Log sent to CloudWatch successfully')
        } catch (error) {
            handleError(error, 'PutLogEvents')
        }
    }
}

export default CloudWatchLogger
