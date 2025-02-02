const fetchAndRenderCardData = async (filters = {}) => {
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
        console.log("Fetched data: ", data);
        console.log("Includes Entry: ", data.includes.Entry);

        const contentDiv = document.getElementById("content");

        if (!data.items || data.items.length === 0) {
            contentDiv.innerHTML = `<p>No artists available to display.</p>`;
            return;
        }

        const filteredItems = data.items.filter(artist => {
            const genreMatch = !filters.genre || (
                artist.fields.genre?.sys.id &&
                data.includes.Entry.find(entry => entry.sys.id === artist.fields.genre.sys.id
                )?.fields.name === filters.genre);

            const dayMatch = !filters.day || (
                artist.fields.day?.sys.id &&
                data.includes.Entry.find(entry => entry.sys.id === artist.fields.day.sys.id
                )?.fields.description === filters.day);

            const stageMatch = !filters.stage || (
                artist.fields.stage?.sys.id &&
                data.includes.Entry.find(entry => entry.sys.id === artist.fields.stage.sys.id
                )?.fields.name === filters.stage);

            return genreMatch && dayMatch && stageMatch;
        });

        contentDiv.innerHTML = filteredItems.length
            ? filteredItems.map(artist => {
                const genreEntry = artist.fields.genre?.sys.id
                    ? data.includes.Entry.find(entry => entry.sys.id === artist.fields.genre.sys.id)?.fields
                    : null;

                const genreName = genreEntry?.name || "Unknown";

                const dayEntry = artist.fields.day?.sys.id
                    ? data.includes.Entry.find(entry => entry.sys.id === artist.fields.day.sys.id)?.fields
                    : null;

                const dayDescription = dayEntry?.description || "Unknown";
                const dayDate = dayEntry?.date || "Unknown date";

                const stageEntry = artist.fields.stage?.sys.id
                    ? data.includes.Entry.find(entry => entry.sys.id === artist.fields.stage.sys.id)?.fields
                    : null;

                const stageName = stageEntry?.name || "Unknown";

                return `
                <div class="artist-card">
                    <h3>${artist.fields.name || "Unknown Artist"}</h3>
                    <p>
                        <strong>Genre:</strong> 
                        ${genreName}
                    </p>
                    <p>
                        <strong>Day:</strong> 
                        ${dayDescription} (${dayDate})
                    </p>
                    <p>
                        <strong>Stage:</strong> 
                        ${stageName}
                    </p>
                    <p>
                        <strong>Description:</strong> 
                        ${artist.fields.description || "No description available."}
                    </p>
                </div>`;
            }).join('') : `<p>No artists match the selected filters.</p>`;

    } catch (error) {
        console.error("Error:", error);
        document.getElementById("content").innerHTML = `<p>An error occurred while fetching data. Please try again later.</p>`;
    }
};

fetchAndRenderCardData();