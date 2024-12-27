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
        console.log("Hämtad data:", data);

        const contentDiv = document.getElementById("content");

        // Skapa DOM-element för artister
        data.items.forEach((artist) => {
            const artistCard = document.createElement("div");
            artistCard.classList.add("artist-card");

            const artistName = document.createElement("h3");
            artistName.textContent = artist.fields.name || "Okänd artist";

            const genre = document.createElement("p");
            const genreLabel = document.createElement("span");
            genreLabel.textContent = "Genre: ";
            genreLabel.classList.add("label");
            const genreValue = document.createTextNode(
                artist.fields.genre
                    ? data.includes.Entry.find((entry) => entry.sys.id === artist.fields.genre.sys.id)?.fields.name
                    : "Okänd genre"
            );
            genre.appendChild(genreLabel);
            genre.appendChild(genreValue);

            const day = document.createElement("p");
            const dayLabel = document.createElement("span");
            dayLabel.textContent = "Dag: ";
            dayLabel.classList.add("label");

            const dayData = artist.fields.day
                ? `${data.includes.Entry.find((entry) => entry.sys.id === artist.fields.day.sys.id)?.fields.description} 
                  (${data.includes.Entry.find((entry) => entry.sys.id === artist.fields.day.sys.id)?.fields.date})`
                : "Okänd dag";

            const dayValue = document.createTextNode(dayData);
            day.appendChild(dayLabel);
            day.appendChild(dayValue);

            const stage = document.createElement("p");
            const stageLabel = document.createElement("span");
            stageLabel.textContent = "Scen: ";
            stageLabel.classList.add("label");

            const stageValue = document.createTextNode(
                artist.fields.stage
                    ? data.includes.Entry.find((entry) => entry.sys.id === artist.fields.stage.sys.id)?.fields.name
                    : "Okänd scen"
            );
            stage.appendChild(stageLabel);
            stage.appendChild(stageValue);

            const description = document.createElement("p");
            const descriptionLabel = document.createElement("span");
            descriptionLabel.textContent = "Beskrivning: ";
            descriptionLabel.classList.add("label");

            const descriptionValue = document.createTextNode(
                artist.fields.description || "Ingen beskrivning tillgänglig."
            );
            description.appendChild(descriptionLabel);
            description.appendChild(descriptionValue);

            // Lägg till element i kortet
            artistCard.appendChild(artistName);
            artistCard.appendChild(genre);
            artistCard.appendChild(day);
            artistCard.appendChild(stage);
            artistCard.appendChild(description);

            // Lägg till kortet i innehållsbehållaren
            contentDiv.appendChild(artistCard);
        });
    } catch (error) {
        console.error("Ett fel inträffade vid hämtning av data:", error);
        document.getElementById("content").textContent =
            "Ett fel inträffade vid hämtning av data. Försök igen senare.";
    }
};

fetchData();