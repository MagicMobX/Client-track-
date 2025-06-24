// On index.html
if (location.pathname.includes("index.html")) {
  const list = document.getElementById("client-list");
  const clients = JSON.parse(localStorage.getItem("clients") || "[]");

  clients.forEach(client => {
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>${client.name}</strong><br>
      ${client.service}<br>
      Appointment: ${client.appointment}<br>
      <button onclick="viewClient('${client.id}')">View</button>
    `;
    list.appendChild(div);
  });

  window.viewClient = function(id) {
    localStorage.setItem("currentClient", id);
    window.location.href = "view.html";
  }
}

// On add.html
if (location.pathname.includes("add.html")) {
  document.getElementById("clientForm").onsubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    const imageFile = data.get("image");

    const reader = new FileReader();
    reader.onloadend = () => {
      const clients = JSON.parse(localStorage.getItem("clients") || "[]");
      const newClient = {
        id: Date.now().toString(),
        name: data.get("name"),
        email: data.get("email"),
        service: data.get("service"),
        notes: data.get("notes"),
        appointment: data.get("appointment"),
        image: reader.result || ""
      };
      clients.push(newClient);
      localStorage.setItem("clients", JSON.stringify(clients));
      window.location.href = "index.html";
    };
    if (imageFile && imageFile.size > 0) reader.readAsDataURL(imageFile);
    else reader.onloadend();
  }
}

// On view.html
if (location.pathname.includes("view.html")) {
  const id = localStorage.getItem("currentClient");
  const clients = JSON.parse(localStorage.getItem("clients") || "[]");
  const client = clients.find(c => c.id === id);
  const details = document.getElementById("client-details");

  if (client) {
    details.innerHTML = `
      <h2>${client.name}</h2>
      <p>Email: ${client.email}</p>
      <p>Service: ${client.service}</p>
      <p>Notes: ${client.notes}</p>
      <p>Next Appointment: ${client.appointment}</p>
      ${client.image ? `<img src="${client.image}" width="200"/>` : ""}
    `;
  }

  window.deleteClient = function() {
    const newList = clients.filter(c => c.id !== id);
    localStorage.setItem("clients", JSON.stringify(newList));
    window.location.href = "index.html";
  }
}
