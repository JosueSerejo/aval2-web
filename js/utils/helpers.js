
export function calculateRemainaingTime(startTime, minimumTimeSpinner) {
    const elapsedTime = Date.now() - startTime;
    const remainingTime = minimumTimeSpinner - elapsedTime;
    return remainingTime;
}

export function showMessage(catalogElement, mediaType) {
    const mediaTypeText = mediaType === 'movie' ? 'filme' : 'série';

    catalogElement.innerHTML = `
        <div class="no-results">
            <p>Nenhum(a) ${mediaTypeText} encontrado(a).</p>
        </div>
    `;
}