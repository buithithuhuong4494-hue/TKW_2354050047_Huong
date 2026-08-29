const state = {
    records: [],
    query: "",
    category: "all",
    status: "all",
    sort: "date-desc",
    loading: true,
    error: null,
};


export function initRecords() {
    const root = document.querySelector("[data-records-page]");

    if (!root) return;

    const loadingBox = root.querySelector("[data-state-loading]");
    const errorBox = root.querySelector("[data-state-error]");
    const errorMessage = root.querySelector("[data-error-message]");
    const emptyBox = root.querySelector("[data-state-empty]");
    const dataBox = root.querySelector("[data-state-data]");
    const tbody = root.querySelector("[data-records-body]");

    const template = document.getElementById("row-template");

    if (
        !loadingBox ||
        !errorBox ||
        !errorMessage ||
        !emptyBox ||
        !dataBox ||
        !tbody ||
        !template
    ) {
        return;
    }


    function buildRow(record) {
        const row = template.content.firstElementChild.cloneNode(true);

        row.querySelector("[data-cell='id']").textContent =
            record.id;

        row.querySelector("[data-cell='traveler']").textContent =
            record.traveler;

        row.querySelector("[data-cell='category']").textContent =
            record.category;

        row.querySelector("[data-cell='status']").textContent =
            record.status;

        row.querySelector("[data-cell='people']").textContent =
            `${record.people} người`;

        row.querySelector("[data-cell='amount']").textContent =
            new Intl.NumberFormat("vi-VN").format(record.amount) + " ₫";

        row.querySelector("[data-cell='date']").textContent =
            record.date;

        return row;
    }


    function render() {
        loadingBox.classList.toggle(
            "hidden",
            !state.loading
        );

        errorBox.classList.toggle(
            "hidden",
            !state.error
        );

        emptyBox.classList.add("hidden");
        dataBox.classList.add("hidden");


        if (state.loading) {
            return;
        }


        if (state.error) {
            errorMessage.textContent = state.error;
            return;
        }


        if (!state.records.length) {
            emptyBox.classList.remove("hidden");
            return;
        }


        const rows = state.records.map(buildRow);

        tbody.replaceChildren(...rows);

        dataBox.classList.remove("hidden");
    }


    async function loadRecords() {
        const response = await fetch("./data/records.json");

        if (!response.ok) {
            throw new Error(
                `Máy chủ trả về ${response.status}`
            );
        }

        return response.json();
    }


    async function start() {
        render();

        try {
            state.records = await loadRecords();
        } catch (error) {
            state.error =
                `Không tải được dữ liệu: ${error.message}`;
        } finally {
            state.loading = false;
            render();
        }
    }


    start();
}