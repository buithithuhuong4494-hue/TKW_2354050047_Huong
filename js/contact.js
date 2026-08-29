export function initContactForm() {
    const form = document.querySelector("[data-contact-form]");
    if (!form) return;

    const toast = document.querySelector("[data-toast]");

    const summary = form.querySelector("[data-form-summary]");

    const fields = Array.from(
        form.querySelectorAll(
            "input[required], select[required], textarea[required]"
        )
    );

    function messageFor(field) {
        const validity = field.validity;

        if (validity.valueMissing) {
            if (field.type === "checkbox") {
                return "Vui lòng đồng ý trước khi gửi yêu cầu.";
            }

            return "Vui lòng điền thông tin này.";
        }

        if (validity.typeMismatch) {
            return "Email chưa đúng định dạng.";
        }

        if (validity.patternMismatch) {
            return "Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0.";
        }

        return "Thông tin chưa hợp lệ.";
    }

    function getErrorBox(field) {
        const describedBy =
            field.getAttribute("aria-describedby");

        if (!describedBy) return null;

        const ids = describedBy.split(" ");

        const errorId = ids.find((id) =>
            id.endsWith("-error")
        );

        return errorId
            ? document.getElementById(errorId)
            : null;
    }

    function showError(field) {
        const errorBox = getErrorBox(field);

        field.setAttribute(
            "aria-invalid",
            "true"
        );

        if (errorBox) {
            errorBox.textContent =
                messageFor(field);
        }
    }

    function clearError(field) {
        const errorBox = getErrorBox(field);

        field.removeAttribute(
            "aria-invalid"
        );

        if (errorBox) {
            errorBox.textContent = "";
        }
    }

    fields.forEach((field) => {
        field.addEventListener("input", () => {
            if (field.checkValidity()) {
                clearError(field);
            }
        });

        field.addEventListener("change", () => {
            if (field.checkValidity()) {
                clearError(field);
            }
        });
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        let firstInvalid = null;

        fields.forEach((field) => {
            if (!field.checkValidity()) {
                showError(field);

                if (!firstInvalid) {
                    firstInvalid = field;
                }
            } else {
                clearError(field);
            }
        });

        if (firstInvalid) {
            if (summary) {
                summary.textContent =
                    "Vui lòng kiểm tra lại các thông tin được đánh dấu.";

                summary.classList.remove(
                    "hidden"
                );
            }

            firstInvalid.focus();
            return;
        }

        if (summary) {
            summary.textContent = "";
            summary.classList.add("hidden");
        }

        form.reset();

        if (toast) {
            toast.classList.remove("hidden");

            setTimeout(() => {
                toast.classList.add("hidden");
            }, 3000);
        }
    });
}