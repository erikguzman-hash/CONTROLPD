export const elements = {
    loadingView: document.getElementById('loading-view'),
    loginView: document.getElementById('login-view'),
    appView: document.getElementById('app-view'),
    googleSigninButton: document.getElementById('google-signin-button'),
    logoutButton: document.getElementById('logout-button'),
    createTaskBtn: document.getElementById('create-task-btn'),
    userNameSpan: document.getElementById('user-name'),
    userRoleSpan: document.getElementById('user-role'),
    adminTabBtn: document.getElementById('admin-tab-btn'),
    tabs: document.querySelectorAll('.tab-btn'),
    tabContents: document.querySelectorAll('.tab-content'),
    taskModal: document.getElementById('task-modal'),
    taskModalTitle: document.getElementById('task-modal-title'),
    taskModalFooter: document.getElementById('task-modal-footer'),
    taskDetailsReadonly: document.getElementById('task-details-readonly'),
    taskForm: document.getElementById('task-form'),
    closeModalBtns: document.querySelectorAll('.close-modal-btn'),
    userManagementTable: document.getElementById('user-management-table'),
    statsContainer: document.getElementById('stats-container'),
};

export function showView(view) {
    elements.loadingView.classList.add('hidden');
    elements.loginView.classList.add('hidden');
    elements.appView.classList.add('hidden');
    if (view === 'loading') elements.loadingView.classList.remove('hidden');
    if (view === 'login') elements.loginView.classList.remove('hidden');
    if (view === 'app') elements.appView.classList.remove('hidden');
}

export function updateUserInfo(user, role) {
    elements.userNameSpan.textContent = user.displayName;
    const roleCapitalized = role.charAt(0).toUpperCase() + role.slice(1);
    elements.userRoleSpan.textContent = roleCapitalized;
    if (role === 'director' || role === 'administrador') {
        elements.adminTabBtn.classList.remove('hidden');
    } else {
        elements.adminTabBtn.classList.add('hidden');
    }
}

export function resetAppView(appState) {
     if (appState.unsubscribeTasks) appState.unsubscribeTasks();
     elements.adminTabBtn.classList.add('hidden');
     elements.userNameSpan.textContent = '';
     elements.userRoleSpan.textContent = '';
}