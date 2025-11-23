let allMessages = [];

function parseMessengerJSON(text) {
    try {
        const data = JSON.parse(text);
        if (Array.isArray(data)) return data;
        return data.messages || [];
    } catch {
        return [];
    }
}

function renderMessages(list) {
    const container = document.getElementById("messages");
    const count = document.getElementById("count");

    count.textContent = `Mensajes: ${list.length}`;

    container.innerHTML = list.map(msg => `
        <div class="message">
            <strong>${msg.sender_name || "Sin nombre"}</strong><br>
            <small>${new Date(msg.timestamp_ms).toLocaleString()}</small><br>
            ${msg.content || "[sin contenido]"}
        </div>
    `).join("");
}

function applyFilters() {
    const text = document.getElementById("searchText").value.toLowerCase();
    const from = document.getElementById("fromDate").value;
    const to = document.getElementById("toDate").value;

    let filtered = allMessages;

    if (text) {
        filtered = filtered.filter(m => (m.content || "").toLowerCase().includes(text));
    }

    if (from) {
        const fromMs = new Date(from).getTime();
        filtered = filtered.filter(m => m.timestamp_ms >= fromMs);
    }

    if (to) {
        const toMs = new Date(to).getTime();
        filtered = filtered.filter(m => m.timestamp_ms <= toMs);
    }

    renderMessages(filtered);
}

document.getElementById("parseBtn").onclick = () => {
    const text = document.getElementById("rawJson").value;
    const msgs = parseMessengerJSON(text);
    allMessages = msgs;
    renderMessages(msgs);
};

document.getElementById("fileInput").onchange = async (event) => {
    allMessages = [];
    for (const file of event.target.files) {
        const text = await file.text();
        const msgs = parseMessengerJSON(text);
        allMessages.push(...msgs);
    }
    allMessages.sort((a, b) => a.timestamp_ms - b.timestamp_ms);
    renderMessages(allMessages);
};

// filtros en tiempo real
document.getElementById("searchText").oninput = applyFilters;
document.getElementById("fromDate").oninput = applyFilters;
document.getElementById("toDate").oninput = applyFilters;
