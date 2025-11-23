let allMessages = [];

function processJson(data) {
    if (!data.messages) return;

    data.messages.forEach(msg => {
        allMessages.push({
            sender: msg.sender_name,
            content: msg.content || "(Sin texto)",
            timestamp: msg.timestamp_ms
        });
    });

    renderMessages(allMessages);
}

function renderMessages(list) {
    const container = document.getElementById("messages");
    container.innerHTML = "";

    list.forEach(m => {
        const div = document.createElement("div");
        div.className = "message";

        const date = new Date(m.timestamp);
        const fecha = date.toLocaleString();

        div.innerHTML = `
            <div class="author">${m.sender}</div>
            <div class="time">${fecha}</div>
            <div class="text">${m.content}</div>
        `;

        container.appendChild(div);
    });
}

// --- Carga automática desde carpeta ---
document.getElementById("jsonFile").addEventListener("change", function () {
    const files = Array.from(this.files);

    const jsonFiles = files.filter(f => f.name.toLowerCase().endsWith(".json"));

    jsonFiles.forEach(file => {
        const reader = new FileReader();

        reader.onload = function (e) {
            try {
                const data = JSON.parse(e.target.result);
                processJson(data);
            } catch (err) {
                console.error("Error leyendo JSON:", err);
            }
        };

        reader.readAsText(file);
    });
});
});

// --- Filtro por texto y fechas ---
function applyFilters() {
    const search = document.getElementById("searchInput").value.toLowerCase();
    const from = document.getElementById("dateFrom").value;
    const to = document.getElementById("dateTo").value;

    let filtered = allMessages.filter(m => {
        let ok = true;

        if (search)
            ok = m.content.toLowerCase().includes(search) || m.sender.toLowerCase().includes(search);

        if (ok && from) {
            const ts = new Date(from).getTime();
            ok = m.timestamp >= ts;
        }

        if (ok && to) {
            const ts = new Date(to).getTime() + 86399999;
            ok = m.timestamp <= ts;
        }

        return ok;
    });

    renderMessages(filtered);
}

document.getElementById("searchInput").addEventListener("input", applyFilters);
document.getElementById("dateFrom").addEventListener("change", applyFilters);
document.getElementById("dateTo").addEventListener("change", applyFilters);