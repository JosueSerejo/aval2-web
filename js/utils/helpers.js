
export function calculateRemainaingTime(startTime, minimumTimeSpinner) {
    const elapsedTime = Date.now() - startTime;
    const remainingTime = minimumTimeSpinner - elapsedTime;
    return remainingTime;
}