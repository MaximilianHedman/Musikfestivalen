const fetchAndRenderCardData = async () => {
    const baseUrl = "https://cdn.contentful.com/spaces/";
    const SPACE_ID = localStorage.getItem("space_id");
    const ACCESS_TOKEN = localStorage.getItem("access_token");

    if (!SPACE_ID || !ACCESS_TOKEN) {
        throw new Error("API keys are missing in localStorage.");
    }

    const apiURL = `${baseUrl}${SPACE_ID}/entries?access_token=${ACCESS_TOKEN}&content_type=artist`;

    try {
        const response = await fetch(apiURL);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        const data = await response.json();

        const contentDiv = document.getElementById("content");

        if (!data.items || data.items.length === 0) {
            const noDataMessage = document.createElement("p");
            noDataMessage.textContent = "No artists available to display.";
            contentDiv.appendChild(noDataMessage);
            return;
        }

        data.items.forEach((artist) => {
            const artistCard = document.createElement("div");
            artistCard.classList.add("artist-card");

            const artistName = document.createElement("h3");
            artistName.textContent = artist.fields.name || "Unknown Artist";

            const createLabelledText = (label, value) => {
                const container = document.createElement("p");
                const labelSpan = document.createElement("span");
                labelSpan.textContent = `${label}: `;
                labelSpan.classList.add("label");
                const textNode = document.createTextNode(value || "Unknown");
                container.appendChild(labelSpan);
                container.appendChild(textNode);
                return container;
            };

            const genre = createLabelledText(
                "Genre",
                artist.fields.genre?.sys.id
                    ? data.includes.Entry.find((entry) => entry.sys.id === artist.fields.genre.sys.id)?.fields.name
                    : "Unknown"
            );

            const day = createLabelledText(
                "Day",
                artist.fields.day?.sys.id
                    ? data.includes.Entry.find((entry) => entry.sys.id === artist.fields.day.sys.id)?.fields.description
                    : "Unknown"
            );

            const stage = createLabelledText(
                "Stage",
                artist.fields.stage?.sys.id
                    ? data.includes.Entry.find((entry) => entry.sys.id === artist.fields.stage.sys.id)?.fields.name
                    : "Unknown"
            );

            const description = createLabelledText(
                "Description",
                artist.fields.description || "No description available."
            );

            artistCard.appendChild(artistName);
            artistCard.appendChild(genre);
            artistCard.appendChild(day);
            artistCard.appendChild(stage);
            artistCard.appendChild(description);

            contentDiv.appendChild(artistCard);
        });
    } catch (error) {
        console.error("Error:", error);

        const contentDiv = document.getElementById("content");
        contentDiv.textContent = "An error occurred while fetching data. Please try again later.";
    }
};

fetchAndRenderCardData();