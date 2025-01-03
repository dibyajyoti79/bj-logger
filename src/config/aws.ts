import { CloudWatchLogsClient } from '@aws-sdk/client-cloudwatch-logs'

export const cloudWatchClient = new CloudWatchLogsClient({
    region: process.env.AWS_REGION
})
