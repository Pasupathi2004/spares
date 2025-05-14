const API_BASE = "http://localhost:3000"; // adjust if hosted elsewhere

function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const error = document.getElementById("loginError");

  const defaultUsername = "admin";
  const defaultPassword = "admin123";

  if (username === defaultUsername && password === defaultPassword) {
    document.getElementById("loginSection").classList.add("hidden");
    document.getElementById("mainApp").classList.remove("hidden");
    error.textContent = "";
  } else {
    error.textContent = "❌ Invalid credentials";
  }
}

async function searchItem() {
  const name = document.getElementById("searchInput").value.toLowerCase();
  const result = document.getElementById("searchResult");
  try {
    const res = await fetch(`${API_BASE}/${name}`);
    if (!res.ok) throw new Error("Item not found");
    const item = await res.json();
    result.innerHTML = `
      <p><strong>Item:</strong> ${name}</p>
      <p><strong>Rack:</strong> ${item.rack}</p>
      <p><strong>Bin:</strong> ${item.bin}</p>
      <p><strong>Quantity:</strong> ${item.quantity}</p>
      <p><strong>Last Updated:</strong> ${new Date(
        item.updatedAt
      ).toLocaleString()}</p>`;
  } catch (err) {
    result.innerHTML = `<p style="color:red;">❌ ${err.message}</p>`;
  }
}

async function addItem() {
  const name = document.getElementById("newItem").value.toLowerCase();
  const rack = document.getElementById("newRack").value;
  const bin = document.getElementById("newBin").value;
  const qty = parseInt(document.getElementById("newQty").value);
  if (!name || !rack || !bin || isNaN(qty)) return alert("❌ Fill all fields!");

  try {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, rack, bin, quantity: qty }),
    });
    if (!res.ok) throw new Error("Failed to add item");
    alert("✅ Item added!");
    goBack();
  } catch (err) {
    alert(`❌ ${err.message}`);
  }
}

async function updateItem() {
  const name = document.getElementById("updateItem").value.toLowerCase();
  const qty = parseInt(document.getElementById("updateQty").value);
  if (isNaN(qty)) return alert("❌ Enter valid quantity");

  try {
    const res = await fetch(`${API_BASE}/${name}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: qty }),
    });
    if (!res.ok) throw new Error("Item not found or failed to update");
    alert("✅ Quantity updated!");
    goBack();
  } catch (err) {
    alert(`❌ ${err.message}`);
  }
}

async function deleteItem() {
  const name = document.getElementById("deleteItem").value.toLowerCase();
  try {
    const res = await fetch(`${API_BASE}/${name}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Item not found");
    alert("✅ Item deleted!");
    goBack();
  } catch (err) {
    alert(`❌ ${err.message}`);
  }
}

async function showSpares() {
  toggleMenu();
  goBack();
  try {
    const res = await fetch(API_BASE);
    const items = await res.json();
    const table = `
      <table border="1">
        <tr><th>Item</th><th>Rack</th><th>Bin</th><th>Quantity</th><th>Last Updated</th></tr>
        ${items
          .map(
            ({ name, rack, bin, quantity, updatedAt }) =>
              `<tr><td>${name}</td><td>${rack}</td><td>${bin}</td><td>${quantity}</td><td>${new Date(
                updatedAt
              ).toLocaleString()}</td></tr>`
          )
          .join("")}
      </table>`;
    document.getElementById("sparesList").innerHTML = table;
    document.getElementById("sparesSection").classList.remove("hidden");
  } catch (err) {
    alert("❌ Failed to load inventory");
  }
}

function goBack() {
  document.getElementById("searchResult").innerHTML = "";
  document.getElementById("sparesSection").classList.add("hidden");
}

function toggleMenu() {
  // if you have menu toggling logic, place it here
}
// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`🚀 Server running on http://localhost:${port}`)
);
