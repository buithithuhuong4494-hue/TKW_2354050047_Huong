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

    const searchInput = root.querySelector("[data-search]");
    const categoryFilter = root.querySelector("[data-category-filter]");
    const sortSelect = root.querySelector("[data-sort]");

    const form = root.querySelector("[data-record-form]");
    const addToggle = root.querySelector("[data-add-toggle]");
    const resetButton = root.querySelector("[data-reset-records]");
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


    // =========================
    // SẮP XẾP
    // =========================
    const sorters = {
        "date-desc": (a, b) =>
            b.date.localeCompare(a.date),

        "date-asc": (a, b) =>
            a.date.localeCompare(b.date),

        "amount-desc": (a, b) =>
            b.amount - a.amount,

        "amount-asc": (a, b) =>
            a.amount - b.amount,
    };


    // =========================
    // TẠO DÒNG BẢNG
    // =========================
    function buildRow(record) {
        const row =
            template.content.firstElementChild.cloneNode(true);

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

        const deleteButton = row.querySelector("[data-delete-record]");

        deleteButton?.addEventListener("click", () => {
            state.records = state.records.filter(
                (item) => item.id !== record.id
            );

            saveRecords();
            render();
        });

        return row;
    }

    const STORAGE_KEY = "tripmate-records";

    function saveRecords() {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(state.records)
        );
    }

    // =========================
    // LỌC + TÌM KIẾM + SORT
    // =========================
    function visibleRecords() {
        const q = state.query
            .trim()
            .toLowerCase();

        return [...state.records]
            .filter((record) =>
                state.category === "all" ||
                record.category === state.category
            )
            .filter((record) =>
                state.status === "all" ||
                record.status === state.status
            )
            .filter((record) =>
                !q ||
                record.id.toLowerCase().includes(q) ||
                record.traveler.toLowerCase().includes(q)
            )
            .sort(sorters[state.sort]);
    }


    // =========================
    // DEBOUNCE
    // =========================
    function debounce(fn, delay = 300) {
        let id;

        return (...args) => {
            clearTimeout(id);

            id = setTimeout(() => {
                fn(...args);
            }, delay);
        };
    }


    // =========================
    // RENDER
    // =========================
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
            errorMessage.textContent =
                state.error;

            return;
        }


        const list = visibleRecords();


        if (!list.length) {
            emptyBox.classList.remove("hidden");
            return;
        }


        const rows =
            list.map(buildRow);

        tbody.replaceChildren(...rows);

        dataBox.classList.remove("hidden");
    }


    // =========================
    // LOAD JSON
    // =========================
    async function loadRecords() {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved) {
            return JSON.parse(saved);
        }

        const response = await fetch("./data/records.json");

        if (!response.ok) {
            throw new Error(
                `Máy chủ trả về ${response.status}`
            );
        }

        const records = await response.json();

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(records)
        );

        return records;
    }


    // =========================
    // EVENT: TÌM KIẾM
    // =========================
    searchInput?.addEventListener(
        "input",
        debounce((event) => {
            state.query =
                event.target.value;

            render();
        }, 300)
    );


    // =========================
    // EVENT: LỌC LOẠI CHUYẾN
    // =========================
    categoryFilter?.addEventListener(
        "change",
        (event) => {
            state.category =
                event.target.value;

            render();
        }
    );


    // =========================
    // EVENT: SẮP XẾP
    // =========================
    sortSelect?.addEventListener(
        "change",
        (event) => {
            state.sort =
                event.target.value;

            render();
        }
    );


    // =========================
    // KHỞI ĐỘNG
    // =========================
    async function start() {
        render();

        try {
            state.records =
                await loadRecords();
        } catch (error) {
            state.error =
                `Không tải được dữ liệu: ${error.message}`;
        } finally {
            state.loading = false;
            render();
        }
    }

    addToggle?.addEventListener("click", () => {
        form?.classList.toggle("hidden");
    });

    form?.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(form);

        const newRecord = {
            id: formData.get("id").trim(),
            traveler: formData.get("traveler").trim(),
            category: formData.get("category"),
            status: formData.get("status"),
            people: Number(formData.get("people")),
            amount: Number(formData.get("amount")),
            date: formData.get("date"),
        };

        const duplicated = state.records.some(
            (record) =>
                record.id.toLowerCase() ===
                newRecord.id.toLowerCase()
        );

        if (duplicated) {
            alert("Mã chuyến đi đã tồn tại.");
            return;
        }

        state.records.push(newRecord);

        saveRecords();

        form.reset();
        form.classList.add("hidden");

        render();
    });

    resetButton?.addEventListener("click", async () => {
        localStorage.removeItem(STORAGE_KEY);

        state.loading = true;
        state.error = null;

        render();

        try {
            const response = await fetch("./data/records.json");

            if (!response.ok) {
                throw new Error(
                    `Máy chủ trả về ${response.status}`
                );
            }

            state.records = await response.json();

            saveRecords();
        } catch (error) {
            state.error =
                `Không tải được dữ liệu: ${error.message}`;
        } finally {
            state.loading = false;
            render();
        }
    });


    start();
}