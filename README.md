# BJ Logger

A centralized logger for Node.js applications. This package provides a simple way to log messages to CloudWatch Logs, as well as to a file. It also supports multiple transports, allowing you to log to multiple destinations.

## Installation

To install the package, run the following command:

```bash
npm install bj-logger
```

## Usage

### Basic Usage

To use the package, you need to create an instance of the `Logger` class and pass in the service name and any transports you want to use. Here's an example:

```typescript
import { Logger, ConsoleTransport, CloudWatchTransport } from 'bj-logger'

const logger = new Logger('MyService', [
    new ConsoleTransport(),
    new CloudWatchTransport({
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        logGroupName: 'MyLogGroup',
        logStreamName: 'MyLogStream'
    })
])

logger.info('This is a log message')
```

In this example, we're creating a `Logger` instance with the service name "MyService". We're also passing in two transports: a `ConsoleTransport` and a `CloudWatchTransport`. The `ConsoleTransport` logs to the console, while the `CloudWatchTransport` logs to CloudWatch Logs.

### Logging to a File

You can also log to a file by creating a `FileTransport` and passing in the path to the log file. Here's an example:

```typescript
import { Logger, FileTransport } from 'bj-logger'

const logger = new Logger('MyService', [new FileTransport('log/app.log')])

logger.info('This is a log message')
```

In this example, we're creating a `Logger` instance with the service name "MyService". We're also passing in a `FileTransport` that logs to a file named "app.log" in the "log" directory.

### Logging to Multiple Transports

You can log to multiple transports by passing in an array of transports to the `Logger` constructor. Here's an example:

```typescript
import { Logger, ConsoleTransport, CloudWatchTransport, FileTransport } from 'bj-logger'

const logger = new Logger('MyService', [
    new ConsoleTransport(),
    new CloudWatchTransport({
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        logGroupName: 'MyLogGroup',
        logStreamName: 'MyLogStream'
    }),
    new FileTransport('log/app.log')
])

logger.info('This is a log message')
```

In this example, we're creating a `Logger` instance with the service name "MyService". We're also passing in three transports: a `ConsoleTransport`, a `CloudWatchTransport`, and a `FileTransport`. The `ConsoleTransport` logs to the console, the `CloudWatchTransport` logs to CloudWatch Logs, and the `FileTransport` logs to a file named "app.log" in the "log" directory.

### Logging with Structured Data

You can log structured data by passing in an object with the `message`, `service`, `traceId`, `timestamp`, and `body` properties to the `Logger` constructor. Here's an example:

```typescript
import { Logger, ConsoleTransport, CloudWatchTransport, FileTransport } from 'bj-logger'

const logger = new Logger('MyService', [
    new ConsoleTransport(),
    new CloudWatchTransport({
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        logGroupName: 'MyLogGroup',
        logStreamName: 'MyLogStream'
    }),
    new FileTransport('log/app.log')
])

logger.info({
    message: 'This is a log message',
    service: 'MyService',
    traceId: '12345678-1234-1234-1234-123456789012',
    timestamp: new Date().toISOString(),
    body: {
        key1: 'value1',
        key2: 'value2'
    }
})
```

In this example, we're creating a `Logger` instance with the service name "MyService". We're also passing in three transports: a `ConsoleTransport`, a `CloudWatchTransport`, and a `FileTransport`. The `ConsoleTransport` logs to the console, the `CloudWatchTransport` logs to CloudWatch Logs, and the `FileTransport` logs to a file named "app.log" in the "log" directory.

### Logging with Custom Levels

You can log with custom levels by passing in a string or an object with the `level` property to the `Logger` constructor. Here's an example:

```typescript
import { Logger, ConsoleTransport, CloudWatchTransport, FileTransport } from 'bj-logger'

const logger = new Logger('MyService', [
    new ConsoleTransport(),
    new CloudWatchTransport({
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        logGroupName: 'MyLogGroup',
        logStreamName: 'MyLogStream'
    }),
    new FileTransport('log/app.log')
])

logger.info('This is a log message')
logger.warn('This is a warning message')
logger.error('This is an error message')
```

In this example, we're creating a `Logger` instance with the service name "MyService". We're also passing in three transports: a `ConsoleTransport`, a `CloudWatchTransport`, and a `FileTransport`. The `ConsoleTransport` logs to the console, the `CloudWatchTransport` logs to CloudWatch Logs, and the `FileTransport` logs to a file named "app.log" in the "log" directory.

The `Logger` instance has methods for logging at different log levels, such as `info`, `warn`, and `error`. Each method takes a string or an object as its argument. If you pass a string, it will be treated as the message to log. If you pass an object, it will be treated as the log entry.
