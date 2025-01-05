document.addEventListener('DOMContentLoaded', async () => {
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

            const filterContainer = document.getElementById("filters");

            const createDropdownHTML = (labelText, options, id) => {
                return `
                    <div>
                        <label class="filter-label" for="${id}">${labelText}</label>
                        <select class="filter-select" id="${id}">
                            <option value="">All</option>
                            ${options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                        </select>
                    </div>`;
            };

            const getUniqueValues = (field) => [...new Set(data.items.map((item) => {
                const refId = item.fields[field]?.sys.id;
                const fieldData = refId ? data.includes.Entry.find((entry) => entry.sys.id === refId)?.fields : null;
                return field === "day" ? fieldData?.description || "Unknown" : fieldData?.name || "Unknown";
            }))];

            filterContainer.innerHTML = `
                ${createDropdownHTML("Genre", getUniqueValues("genre"), "genreFilter")}
                ${createDropdownHTML("Day", getUniqueValues("day"), "dayFilter")}
                ${createDropdownHTML("Stage", getUniqueValues("stage"), "stageFilter")}
            `;

            ["genreFilter", "dayFilter", "stageFilter"].forEach(id => {
                document.getElementById(id).addEventListener('change', () => {
                    fetchAndRenderCardData({
                        genre: document.getElementById("genreFilter").value,
                        day: document.getElementById("dayFilter").value,
                        stage: document.getElementById("stageFilter").value
                    });
                });
            });

            fetchAndRenderCardData();

        } catch (error) {
            console.error("Error:", error);
        }
    };

    fetchAndRenderFilterData();
});