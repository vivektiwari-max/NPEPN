document.addEventListener("DOMContentLoaded", () => {
    const adminToken = localStorage.getItem("adminToken");
    const adminDataString = localStorage.getItem("adminData");

    if (!adminToken || !adminDataString) {
        alert("Session Expired. Please login as Admin.");
        window.location.href = "admin-login.html";
        return;
    }

    const tbody = document.getElementById("pendingTbody");
    const logoutBtn = document.getElementById("logoutBtn");

    // Fetch pending records
    async function loadPendingAccounts() {
        try {
            const response = await fetch("http://127.0.0.1:3000/api/admin/pending", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${adminToken}`
                }
            });

            if (response.status === 401 || response.status === 403) {
                alert("Unauthorized access. Admin privileges required.");
                window.location.href = "admin-login.html";
                return;
            }

            const data = await response.json();

            if (response.ok) {
                renderTable(data.data);
            } else {
                tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:red;">Failed to load data</td></tr>`;
            }
        } catch (error) {
            console.error(error);
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:red;">Server connection error</td></tr>`;
        }
    }

    function renderTable(accounts) {
        tbody.innerHTML = "";

        if (accounts.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No pending approvals at the moment!</td></tr>`;
            return;
        }

        accounts.forEach(acc => {
            const tr = document.createElement("tr");

            // Role Badge styling
            let roleClass = acc.role || 'company';
            let roleText = acc.role ? acc.role : 'Unknown';

            tr.innerHTML = `
                <td>#${acc.id}</td>
                <td><strong>${acc.email}</strong></td>
                <td><span class="badge ${roleClass}">${roleText}</span></td>
                <td>${new Date(acc.created_at).toLocaleString()}</td>
                <td>
                    <button class="approve-btn" data-id="${acc.id}" data-role="${acc.role}">Approve</button>
                </td>
            `;

            tbody.appendChild(tr);
        });

        // Attach event listeners to approve buttons
        document.querySelectorAll(".approve-btn").forEach(btn => {
            btn.addEventListener("click", async (e) => {
                const id = e.target.getAttribute("data-id");
                const role = e.target.getAttribute("data-role");
                await approveAccount(id, role, btn);
            });
        });
    }

    async function approveAccount(id, role, btnElement) {
        const confirmApprove = confirm(`Are you sure you want to approve this ${role} account?`);
        if (!confirmApprove) return;

        btnElement.innerText = "Approving...";
        btnElement.disabled = true;

        try {
            const response = await fetch("http://127.0.0.1:3000/api/admin/approve", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${adminToken}`
                },
                body: JSON.stringify({ id, role })
            });

            const data = await response.json();

            if (response.ok) {
                alert("Account approved successfully!");
                loadPendingAccounts(); // refresh list
            } else {
                alert(data.message || "Failed to approve account.");
                btnElement.innerText = "Approve";
                btnElement.disabled = false;
            }
        } catch (error) {
            console.error(error);
            alert("Error connecting to server.");
            btnElement.innerText = "Approve";
            btnElement.disabled = false;
        }
    }

    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("adminToken");
            localStorage.removeItem("adminData");
            window.location.href = "admin-login.html";
        });
    }

    // Init
    loadPendingAccounts();
});
