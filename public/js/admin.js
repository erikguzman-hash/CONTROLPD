import { elements } from './ui.js';
import { getUsersForAdmin, updateUserRoleInDb, updateUserPapersInDb } from './firestore.js';

const ROLES = ['miembro', 'director', 'administrador'];
const PAPERS = ['coordinador', 'experto', 'revisor', 'productor'];

async function updateUserRole(db, uid, newRole) {
    try {
        await updateUserRoleInDb(db, uid, newRole);
    } catch (error) {
        console.error("Error al actualizar el rol:", error);
        alert("No se pudo actualizar el rol.");
    }
}

async function updateUserPapers(db, uid, papers) {
    try {
        await updateUserPapersInDb(db, uid, papers);
    } catch (error) {
        console.error("Error al actualizar los papeles:", error);
        alert("No se pudieron actualizar los papeles.");
    }
}

function renderUserRow(db, user, currentUserRole) {
    const row = document.createElement('tr');
    row.className = 'border-b';

    // User and Email
    const userCell = document.createElement('td');
    userCell.className = 'py-3 px-4';
    userCell.textContent = user.displayName;
    row.appendChild(userCell);

    const emailCell = document.createElement('td');
    emailCell.className = 'py-3 px-4';
    emailCell.textContent = user.email;
    row.appendChild(emailCell);

    // Role Dropdown
    const roleCell = document.createElement('td');
    roleCell.className = 'py-3 px-4';
    const select = document.createElement('select');
    select.className = "role-select border rounded-md p-1";
    select.dataset.uid = user.uid;
    if (currentUserRole !== 'administrador') select.disabled = true;

    ROLES.forEach(role => {
        const option = document.createElement('option');
        option.value = role;
        option.textContent = role.charAt(0).toUpperCase() + role.slice(1);
        if (user.role === role) option.selected = true;
        select.appendChild(option);
    });
    select.addEventListener('change', (e) => updateUserRole(db, e.target.dataset.uid, e.target.value));
    roleCell.appendChild(select);
    row.appendChild(roleCell);

    // Papers Checkboxes
    const papersCell = document.createElement('td');
    papersCell.className = 'py-3 px-4';
    const papersContainer = document.createElement('div');
    papersContainer.className = 'flex flex-wrap gap-2';

    PAPERS.forEach(paper => {
        const checkboxContainer = document.createElement('div');
        checkboxContainer.className = 'flex items-center';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `paper-${user.uid}-${paper}`;
        checkbox.value = paper;
        checkbox.className = 'h-4 w-4 text-hgio-green focus:ring-hgio-green border-gray-300 rounded';
        if (user.papers && user.papers.includes(paper)) checkbox.checked = true;
        if (currentUserRole !== 'administrador') checkbox.disabled = true;

        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.textContent = paper.charAt(0).toUpperCase() + paper.slice(1);
        label.className = 'ml-2 text-sm text-gray-700';
        
        checkboxContainer.appendChild(checkbox);
        checkboxContainer.appendChild(label);
        papersContainer.appendChild(checkboxContainer);
    });

    papersContainer.addEventListener('change', (e) => {
        if (e.target.type === 'checkbox') {
            const selectedPapers = Array.from(papersContainer.querySelectorAll('input:checked')).map(cb => cb.value);
            updateUserPapers(db, user.uid, selectedPapers);
        }
    });

    papersCell.appendChild(papersContainer);
    row.appendChild(papersCell);

    return row;
}

export async function loadAdmin(dependencies) {
    const { db, appState } = dependencies;
    const { currentUserRole } = appState;
    if (currentUserRole !== 'administrador') return;
    
    const panelSection = document.getElementById('admin-panel-section');
    if (!panelSection) return;

    panelSection.innerHTML = `
        <h3 class="text-lg font-bold text-hgio-blue mb-2 border-b pb-2">Gestión de Usuarios</h3>
        <div id="user-management-table" class="overflow-x-auto"></div>
    `;

    const tableContainer = document.getElementById('user-management-table');
    tableContainer.innerHTML = `
        <table class="min-w-full bg-white text-sm">
            <thead class="bg-hgio-blue text-white">
                <tr>
                    <th class="text-left py-3 px-4 uppercase font-semibold">Usuario</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold">Email</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold">Rol</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold">Papeles</th>
                </tr>
            </thead>
            <tbody id="user-list-tbody" class="text-gray-700"></tbody>
        </table>`;

    const tableBody = document.getElementById('user-list-tbody');
    const snapshot = await getUsersForAdmin(db);
    snapshot.forEach(doc => {
        tableBody.appendChild(renderUserRow(db, doc.data(), currentUserRole));
    });
}