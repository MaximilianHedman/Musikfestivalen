const fetchData = async () => {
    try {
        const baseUrl = "https://cdn.contentful.com/spaces/";
        const SPACE_ID = localStorage.getItem("space_id");
        const ACCESS_TOKEN = localStorage.getItem("access_token");

        if (!SPACE_ID || !ACCESS_TOKEN) {
            throw new Error("API-nycklar saknas i localStorage.");
        }

        const apiURL = `${baseUrl}${SPACE_ID}/entries?access_token=${ACCESS_TOKEN}&content_type=artist`;
        const response = await fetch(apiURL);

        if (!response.ok) {
            throw new Error("HTTP-fel! Något gick snett i förfrågan.");
        }

        const data = await response.json();
        const contentDiv = document.getElementById("content");

        data.items.forEach((artist) => {
            const artistCard = document.createElement("div");
            artistCard.classList.add("artist-card");

            const artistName = document.createElement("h3");
            artistName.textContent = artist.fields.name || "Okänd artist";

            const createLabelledText = (label, value) => {
                const container = document.createElement("p");
                const labelSpan = document.createElement("span");
                labelSpan.textContent = `${label}: `;
                labelSpan.classList.add("label");
                const textNode = document.createTextNode(value || "Okänd");
                container.appendChild(labelSpan);
                container.appendChild(textNode);
                return container;
            };

            const genre = createLabelledText(
                "Genre",
                artist.fields.genre?.sys.id
                    ? data.includes.Entry.find((entry) => entry.sys.id === artist.fields.genre.sys.id)?.fields.name
                    : "Okänd genre"
            );

            const day = createLabelledText(
                "Dag",
                artist.fields.day?.sys.id
                    ? `${data.includes.Entry.find((entry) => entry.sys.id === artist.fields.day.sys.id)?.fields.description} (${data.includes.Entry.find((entry) => entry.sys.id === artist.fields.day.sys.id)?.fields.date})`
                    : "Okänd dag"
            );

            const stage = createLabelledText(
                "Scen",
                artist.fields.stage?.sys.id
                    ? data.includes.Entry.find((entry) => entry.sys.id === artist.fields.stage.sys.id)?.fields.name
                    : "Okänd scen"
            );

            const description = createLabelledText(
                "Beskrivning",
                artist.fields.description || "Ingen beskrivning tillgänglig."
            );

            artistCard.appendChild(artistName);
            artistCard.appendChild(genre);
            artistCard.appendChild(day);
            artistCard.appendChild(stage);
            artistCard.appendChild(description);

            contentDiv.appendChild(artistCard);
        });
    } catch (error) {
        console.error("Ett fel inträffade vid hämtning av data:", error);
        document.getElementById("content").textContent =
            "Ett fel inträffade vid hämtning av data. Försök igen senare.";
    }
};

fetchData();