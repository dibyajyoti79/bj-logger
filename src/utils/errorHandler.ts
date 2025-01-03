export const handleError = (error: unknown, context: string): void => {
    if (error instanceof Error) {
        console.error(`[${context}] ${error.name}: ${error.message}`)
    } else {
        console.error(`[${context}] Unknown error:`, error)
    }
}
