let usuarios = [];

const dataGuardada = localStorage.getItem("usuarios");
if (dataGuardada) {
  usuarios = JSON.parse(dataGuardada);
} else {
  usuarios = [
    { id: 1, nombre: "Juan Perez", email: "juan@mail.com", telefono: "5551234567" },
    { id: 2, nombre: "Ana López", email: "ana@mail.com", telefono: "5559876543" }
  ];
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

const userTableBody = document.querySelector("#userTable tbody");
const userForm = document.getElementById("userForm");
const cancelarBtn = document.getElementById("cancelarEdicion");
const toastContainer = document.getElementById("toastContainer");
const searchInput = document.getElementById("searchInput");

document.addEventListener('DOMContentLoaded', () => {
  if ('Notification' in window) Notification.requestPermission();
});

function guardarEnLocalStorage() {
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

function renderTable(data = usuarios) {
  userTableBody.innerHTML = "";
  data.forEach(user => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.nombre}</td>
      <td>${user.email}</td>
      <td>${user.telefono}</td>
      <td>
        <button class="editBtn" onclick="editUser(${user.id})">Editar</button>
        <button class="deleteBtn" onclick="deleteUser(${user.id})">Eliminar</button>
      </td>
    `;
    userTableBody.appendChild(row);
  });
}

function showToast(message, type = "success", duration = 3000) {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<div>${message}</div><button class="close">&times;</button>`;
  toastContainer.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 50);
  toast.querySelector(".close").addEventListener("click", () => hideToast(toast));
  setTimeout(() => hideToast(toast), duration);

  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Gestión de Brainrots', { body: message });
  }
}

function hideToast(toast) {
  toast.classList.remove("show");
  setTimeout(() => { if (toast && toast.parentElement) toast.parentElement.removeChild(toast); }, 250);
}

userForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = document.getElementById("userId").value;
  const nombre = document.getElementById("nombre").value.trim();
  const email = document.getElementById("email").value.trim();
  const telefono = document.getElementById("telefono").value.trim();

  if (!nombre || !email || !telefono) {
    showToast("Completa todos los campos", "error", 3500);
    return;
  }

  let successMessage = "";

  if (id) {
    const index = usuarios.findIndex(u => u.id == id);
    if (index !== -1) {
      usuarios[index] = { id: parseInt(id), nombre, email, telefono };
      successMessage = "Usuario actualizado correctamente";
    }
  } else {
    const newUser = {
      id: usuarios.length ? Math.max(...usuarios.map(u => u.id)) + 1 : 1,
      nombre,
      email,
      telefono
    };
    usuarios.push(newUser);
    successMessage = "Usuario agregado correctamente";
  }

  guardarEnLocalStorage();
  userForm.reset();
  document.getElementById("userId").value = "";
  document.getElementById("submitBtn").textContent = "Agregar Brainrot";
  cancelarBtn.style.display = "none";
  renderTable();

  if (successMessage) showToast(successMessage, "success", 2500);
});

cancelarBtn.addEventListener("click", () => {
  userForm.reset();
  document.getElementById("userId").value = "";
  document.getElementById("submitBtn").textContent = "Agregar Brainrot";
  cancelarBtn.style.display = "none";
});

function editUser(id) {
  const user = usuarios.find(u => u.id === id);
  if (user) {
    document.getElementById("userId").value = user.id;
    document.getElementById("nombre").value = user.nombre;
    document.getElementById("email").value = user.email;
    document.getElementById("telefono").value = user.telefono;
    document.getElementById("submitBtn").textContent = "Guardar Cambios";
    cancelarBtn.style.display = "inline-block";
  }
}

function deleteUser(id) {
  if (confirm("¿Seguro que deseas eliminar este usuario?")) {
    usuarios = usuarios.filter(u => u.id !== id);
    guardarEnLocalStorage();
    renderTable();
    showToast("Usuario eliminado correctamente", "success", 2000);
  }
}

if (searchInput) {
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filtered = usuarios.filter(u =>
      u.nombre.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      u.telefono.includes(query)
    );
    renderTable(filtered);
  });
}

renderTable();
