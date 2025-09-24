async function getUserDetails() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const data = await response.json();

        const tableBody = document.querySelector('tbody');
        let rows = "";

        data.forEach(d => {
            const name = d.name.split(" ");
            const firstName = name[0] || "";
            const lastName = name.slice(1).join(" ");

            rows += `
                <tr>
                    <td>${d.id}</td>
                    <td>${firstName}</td>
                    <td>${lastName}</td>
                    <td>${d.email}</td>
                    <td>${d.company?.name || "N/A"}</td>
                    <td>
                        <button>Edit</button>
                        <button>Delete</button>
                    </td>
                </tr>
            `;
        });

        tableBody.innerHTML = rows;
    } catch (err) {
        console.error("Error fetching users:", err);
    }
}


const addUserBtn = document.querySelector(".addBtn");
const modal = document.getElementById("addUserModal");
const closeModal = document.querySelector(".close");
const cancelBtn = document.querySelector(".cancelBtn");
const addUserForm = document.getElementById("addUserForm");
const tableBody = document.querySelector("tbody");

addUserBtn.addEventListener("click", () => {
  modal.style.display = "block";
});


closeModal.addEventListener("click", () => modal.style.display = "none");
cancelBtn.addEventListener("click", () => modal.style.display = "none");


window.addEventListener("click", (e) => {
  if (e.target == modal) modal.style.display = "none";
});


addUserForm.addEventListener("submit", async (e) => {
  e.preventDefault();


  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const company = document.getElementById("company").value.trim() || "N/A";

  
  if (!firstName || !lastName || !email) {
    alert("Please fill all required fields.");
    return;
  }

  
  const userData = {
    name: `${firstName} ${lastName}`,
    email: email,
    company: { name: company }
  };

  try {
    
    const response = await fetch('https://jsonplaceholder.typicode.com/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    const newUser = await response.json(); 

    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td>${newUser.id}</td>
      <td>${firstName}</td>
      <td>${lastName}</td>
      <td>${email}</td>
      <td>${company}</td>
      <td>
        <button>Edit</button>
        <button>Delete</button>
      </td>
    `;
    tableBody.appendChild(newRow);

    addUserForm.reset();
    modal.style.display = "none";

    showToast("User added successfully!");
    } catch (err) {
        console.error("Error adding user:", err);
        showToast("Failed to add user. Check console.", 4000);
    }
});

function showToast(message, duration = 3000) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, duration);
}

tableBody.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const row = btn.closest("tr");
  if (!row) return;

  const id = row.children[0].textContent.trim();
  const firstName = row.children[1].textContent.trim();
  const lastName = row.children[2].textContent.trim();
  const email = row.children[3].textContent.trim();
  const company = row.children[4].textContent.trim();

  if (btn.textContent.trim() === "Edit") {
    const editModal = document.getElementById("editUserModal");
    editModal.style.display = "block";

    document.getElementById("editFirstName").value = firstName;
    document.getElementById("editLastName").value = lastName;
    document.getElementById("editEmail").value = email;
    document.getElementById("editCompany").value = company;

    const editForm = document.getElementById("editUserForm");
    editForm.onsubmit = async (ev) => {
      ev.preventDefault();

      const uFirst = document.getElementById("editFirstName").value.trim();
      const uLast = document.getElementById("editLastName").value.trim();
      const uEmail = document.getElementById("editEmail").value.trim();
      const uCompany = document.getElementById("editCompany").value.trim() || "N/A";

      if (!uFirst || !uLast || !uEmail) {
        showToast("Please fill all required fields.");
        return;
      }

      try {
        await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: Number(id),
            name: `${uFirst} ${uLast}`,
            email: uEmail,
            company: { name: uCompany },
          }),
        });

        row.children[1].textContent = uFirst;
        row.children[2].textContent = uLast;
        row.children[3].textContent = uEmail;
        row.children[4].textContent = uCompany;

        showToast("User updated successfully!");
        editModal.style.display = "none";
      } catch (err) {
        console.error("Edit failed:", err);
        showToast("Failed to update user.");
      }
    };

    document.querySelector(".editCancelBtn").onclick = () => {
      editModal.style.display = "none";
    };
  }

  if (btn.textContent.trim() === "Delete") {
    const deleteModal = document.getElementById("deleteUserModal");
    deleteModal.style.display = "block";

    document.getElementById("confirmDeleteBtn").onclick = async () => {
      try {
        await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
          method: "DELETE",
        });
        row.remove();
        showToast("User deleted successfully!");
        deleteModal.style.display = "none";
      } catch (err) {
        console.error("Delete failed:", err);
        showToast("Failed to delete user.");
      }
    };

    document.getElementById("cancelDeleteBtn").onclick = () => {
      deleteModal.style.display = "none";
    };
  }
});

const searchInput = document.querySelector(".search-bar");

searchInput.addEventListener("input", () => {
  const filter = searchInput.value.toLowerCase();
  const rows = tableBody.querySelectorAll("tr");

  rows.forEach(row => {
    const cells = row.querySelectorAll("td");
    const rowText = Array.from(cells).map(cell => cell.textContent.toLowerCase()).join(" ");
    
    if (rowText.includes(filter)) {
      row.style.display = ""; 
    } else {
      row.style.display = "none";
    }
  });
});

const filterBtn = document.querySelector(".filter");
const filterModal = document.getElementById("filterModal");
const filterForm = document.getElementById("filterForm");
const filterCancelBtn = document.querySelector(".filterCancelBtn");

filterBtn.addEventListener("click", () => {
  filterModal.style.display = "block";
});

filterCancelBtn.addEventListener("click", () => filterModal.style.display = "none");

window.addEventListener("click", (e) => {
  if (e.target === filterModal) filterModal.style.display = "none";
});

filterForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const fName = document.getElementById("filterFirstName").value.trim().toLowerCase();
  const lName = document.getElementById("filterLastName").value.trim().toLowerCase();
  const email = document.getElementById("filterEmail").value.trim().toLowerCase();
  const company = document.getElementById("filterCompany").value.trim().toLowerCase();

  const rows = tableBody.querySelectorAll("tr");

  rows.forEach(row => {
    const cells = row.querySelectorAll("td");
    const rowFirst = (cells[1]?.textContent || "").toLowerCase();
    const rowLast = (cells[2]?.textContent || "").toLowerCase();
    const rowEmail = (cells[3]?.textContent || "").toLowerCase();
    const rowCompany = (cells[4]?.textContent || "").toLowerCase();

    if (
      (fName && !rowFirst.includes(fName)) ||
      (lName && !rowLast.includes(lName)) ||
      (email && !rowEmail.includes(email)) ||
      (company && !rowCompany.includes(company))
    ) {
      row.style.display = "none";
    } else {
      row.style.display = "";
    }
  });

  filterModal.style.display = "none";
  showToast("Filter applied!");
});
