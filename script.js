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
