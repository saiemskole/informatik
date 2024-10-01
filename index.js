async function hentMetadata() {
    const doi = document.getElementById("doi").value;
    const resultElement = document.getElementById("result");
    const loadingElement = document.getElementById("loading");

    // Tøm tidligere resultater og vis loading
    resultElement.innerHTML = '';
    loadingElement.classList.remove('hidden');

    // Tjek om DOI er udfyldt
    if (!doi) {
        resultElement.innerHTML = "<strong>Indtast venligst en DOI.</strong>";
        loadingElement.classList.add('hidden');
        return;
    }

    try {
        // Hent metadata fra CrossRef API
        const response = await fetch(`https://api.crossref.org/works/${doi}`);
        const data = await response.json();

        // Udtræk relevante oplysninger fra API-svaret
        const forfattere = data.message.author.map(author => `${author.given} ${author.family}`).join(", ");
        const titel = data.message.title[0];
        const aar = data.message.created['date-parts'][0][0];
        const udgiver = data.message.publisher;

        // Generer kildehenvisningen i APA-stil
        const henvisning = `${forfattere} (${aar}). *${titel}*. ${udgiver}.`;

        // Vis kildehenvisningen
        resultElement.innerHTML = `<strong>Din kildehenvisning i APA-stil:</strong><br>${henvisning}`;
    } catch (error) {
        resultElement.innerHTML = "<strong>Kunne ikke hente data. Tjek om DOI'en er korrekt.</strong>";
    } finally {
        // Fjern loading indikatoren
        loadingElement.classList.add('hidden');
    }
}
