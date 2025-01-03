# CloudWatch Logger NPM

A simple CloudWatch Logger for Node.js applications.

## Installation

```bash
npm install cloudwatch-logger-npm
```

## Usage

```typescript
import { Logger } from 'cloudwatch-logger-npm'

const logger = new Logger('CM', 'TestLogGroup', 'TestLogStream')

logger.error({
    message: 'This is a error test log entry.',
    traceId: '1234567890',
    body: {
        test: 'test'
    }
})
```

## Configuration

Create a `.env` file in the root directory of your project and add the following variables:

```bash
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_REGION=aws-region
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
