async function getUserDetails() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const data = await response.json();

        const tableBody = document.querySelector('tbody');
        let rows = "";

        data.forEach(d => {
            const parts = d.name.split(" ");
            const firstName = parts[0] || "";
            const lastName = parts.slice(1).join(" ");

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
