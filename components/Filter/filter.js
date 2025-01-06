const fetchAndRenderFilterData = async () => {
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

        const filterContainer = document.getElementById("filter");
        const contentDiv = document.getElementById("content");

        if (!data.items || data.items.length === 0) {
            const noDataMessage = document.createElement("p");
            noDataMessage.textContent = "No artists available to display.";
            contentDiv.appendChild(noDataMessage);
            return;
        }

        const createDropdown = (labelText, options, id) => {
            const group = document.createElement("div");

            const label = document.createElement("label");
            label.classList.add("filter-label");
            label.textContent = labelText;
            label.setAttribute("for", id);

            const select = document.createElement("select");
            select.classList.add("filter-select");
            select.id = id;

            const defaultOption = document.createElement("option");
            defaultOption.textContent = "All";
            defaultOption.value = "";
            select.appendChild(defaultOption);

            options.forEach((opt) => {
                const option = document.createElement("option");
                option.textContent = opt;
                option.value = opt;
                select.appendChild(option);
            });

            group.appendChild(label);
            group.appendChild(select);
            return group;
        };

        const getUniqueValues = (field) =>
            [...new Set(data.items.map((item) => {
                const refId = item.fields[field]?.sys.id;
                const fieldData = refId
                    ? data.includes.Entry.find((entry) => entry.sys.id === refId)?.fields
                    : null;
                if (field === "day") {
                    return fieldData ? fieldData.description : "Unknown";
                }
                return fieldData?.name || "Unknown";
            }))];

        filterContainer.appendChild(createDropdown("Genre", getUniqueValues("genre"), "genreFilter"));
        filterContainer.appendChild(createDropdown("Day", getUniqueValues("day"), "dayFilter"));
        filterContainer.appendChild(createDropdown("Scene", getUniqueValues("stage"), "sceneFilter"));

        const renderArtists = (filters) => {
            while (contentDiv.firstChild) {
                contentDiv.removeChild(contentDiv.firstChild);
            }

            const filteredItems = data.items.filter((item) => {
                const match = (field, value) => {
                    const refId = item.fields[field]?.sys.id;
                    const fieldData = refId
                        ? data.includes.Entry.find((entry) => entry.sys.id === refId)?.fields
                        : null;

                    if (field === "day" && fieldData) {
                        return !value || fieldData.description === value;
                    }

                    return !value || (fieldData?.name || "Unknown") === value;
                };

                return match("genre", filters.genre) &&
                    match("day", filters.day) &&
                    match("stage", filters.scene);
            });

            if (filteredItems.length === 0) {
                const noMatchMessage = document.createElement("p");
                noMatchMessage.textContent = "No artists match the selected filters.";
                contentDiv.appendChild(noMatchMessage);
                return;
            }

            filteredItems.forEach((artist) => {
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
                    "Scene",
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
        };

        ["genreFilter", "dayFilter", "sceneFilter"].forEach((id) => {
            document.getElementById(id).addEventListener("change", () => {
                renderArtists({
                    genre: document.getElementById("genreFilter").value,
                    day: document.getElementById("dayFilter").value,
                    scene: document.getElementById("sceneFilter").value,
                });
            });
        });

        renderArtists({});
    } catch (error) {
        console.error("Error:", error);
    }
};

fetchAndRenderFilterData();