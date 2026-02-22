// ===========================
// Firebase Integration
// ===========================
import * as FirebaseService from './firebase-service.js';

// ===========================
// App State
// ===========================
const appState = {
    currentView: 'calendar',
    currentDate: new Date(),
    selectedDate: null,
    patients: [],
    activities: [], // Changed from appointments to activities
    users: [], // For admin dashboard
    currentUser: null,
    currentUserData: null, // Full user data from Firestore
    selectedDayDate: null, // Currently expanded day
    currentActivityId: null, // Activity being viewed in details modal
    currentActivityId: null, // Activity being viewed in details modal
    notificationTimers: [], // Active notification timeouts
    dayPanelWasOpen: false, // Track if day panel was open before opening activity sidebar
    currentPatientId: null // Patient being viewed in profile
};

// ===========================
// DOM Elements
// ===========================
const elements = {
    navItems: document.querySelectorAll('.nav-item'),
    views: document.querySelectorAll('.view'),
    calendarGrid: document.getElementById('calendarGrid'),
    currentMonth: document.getElementById('currentMonth'),
    btnPrevMonth: document.getElementById('btnPrevMonth'),
    btnNextMonth: document.getElementById('btnNextMonth'),
    btnAddActivity: document.getElementById('btnAddActivity'),
    btnNewPatient: document.getElementById('btnNewPatient'),
    btnNewPatientAlt: document.getElementById('btnNewPatientAlt'),
    modalNewPatient: document.getElementById('modalNewPatient'),
    // modalNewActivity: document.getElementById('modalNewActivity'), // Replaced by sidebar
    modalActivityDetails: document.getElementById('modalActivityDetails'),
    modalLogin: document.getElementById('modalLogin'),
    formNewPatient: document.getElementById('formNewPatient'),
    formNewActivity: document.getElementById('formNewActivity'),
    formLogin: document.getElementById('formLogin'),
    activityPatient: document.getElementById('activityPatient'),
    // New Activity Sidebar elements
    newActivitySidebar: document.getElementById('newActivitySidebar'),
    newActivityOverlay: document.getElementById('newActivityOverlay'),
    btnCloseNewActivity: document.getElementById('btnCloseNewActivity'),
    btnCancelNewActivity: document.getElementById('btnCancelNewActivity'),
    // Edit Activity Sidebar elements
    editActivitySidebar: document.getElementById('editActivitySidebar'),
    editActivityOverlay: document.getElementById('editActivityOverlay'),
    btnCloseEditActivity: document.getElementById('btnCloseEditActivity'),
    btnCancelEditActivity: document.getElementById('btnCancelEditActivity'),
    activityDate: document.getElementById('activityDate'),
    activityTime: document.getElementById('activityTime'),
    activityType: document.getElementById('activityType'),
    activityType: document.getElementById('activityType'),
    activityTreatment: document.getElementById('activityTreatment'),
    activityNotes: document.getElementById('activityNotes'),
    // Vital Sidebar elements
    newVitalSidebar: document.getElementById('newVitalSidebar'),
    newVitalOverlay: document.getElementById('newVitalOverlay'),
    btnCloseNewVital: document.getElementById('btnCloseNewVital'),
    btnCancelNewVital: document.getElementById('btnCancelNewVital'),
    formNewVital: document.getElementById('formNewVital'),
    vitalDate: document.getElementById('vitalDate'),
    vitalTime: document.getElementById('vitalTime'),
    // Foot Assessment Sidebar elements
    newFootAssessmentSidebar: document.getElementById('newFootAssessmentSidebar'),
    newFootAssessmentOverlay: document.getElementById('newFootAssessmentOverlay'),
    btnCloseNewFootAssessment: document.getElementById('btnCloseNewFootAssessment'),
    btnCancelNewFootAssessment: document.getElementById('btnCancelNewFootAssessment'),
    formNewFootAssessment: document.getElementById('formNewFootAssessment'),
    footAssessmentDate: document.getElementById('footAssessmentDate'),
    ulcerLocation: document.getElementById('ulcerLocation'),
    ulcerLocation: document.getElementById('ulcerLocation'),
    ulcerDetails: document.getElementById('ulcerDetails'),
    infectionCheck: document.getElementById('infectionCheck'),
    // Wound Assessment elements
    newWoundAssessmentSidebar: document.getElementById('newWoundAssessmentSidebar'),
    newWoundAssessmentOverlay: document.getElementById('newWoundAssessmentOverlay'),
    btnCloseNewWoundAssessment: document.getElementById('btnCloseNewWoundAssessment'),
    btnCancelNewWoundAssessment: document.getElementById('btnCancelNewWoundAssessment'),
    formNewWoundAssessment: document.getElementById('formNewWoundAssessment'),
    woundDate: document.getElementById('woundDate'),

    // Edit IDs
    editVitalId: document.getElementById('editVitalId'),
    editFootAssessmentId: document.getElementById('editFootAssessmentId'),
    editWoundAssessmentId: document.getElementById('editWoundAssessmentId'),

    loginUsername: document.getElementById('loginUsername'),
    loginPassword: document.getElementById('loginPassword'),
    loginError: document.getElementById('loginError'),
    btnLoginSubmit: document.getElementById('btnLoginSubmit'),
    userProfile: document.getElementById('userProfile'),
    userEmail: document.getElementById('userEmail'),
    btnLogout: document.getElementById('btnLogout'),
    // Admin dashboard elements
    navAdmin: document.getElementById('navAdmin'),
    btnAddUser: document.getElementById('btnAddUser'),
    modalAddUser: document.getElementById('modalAddUser'),
    modalEditUser: document.getElementById('modalEditUser'),
    formAddUser: document.getElementById('formAddUser'),
    formEditUser: document.getElementById('formEditUser'),
    usersTableBody: document.getElementById('usersTableBody'),
    searchUsers: document.getElementById('searchUsers'),
    newUserUsername: document.getElementById('newUserUsername'),
    newUserRole: document.getElementById('newUserRole'),
    newUserPasscode: document.getElementById('newUserPasscode'),
    newUserActive: document.getElementById('newUserActive'),
    btnGeneratePasscode: document.getElementById('btnGeneratePasscode'),
    btnCopyPasscode: document.getElementById('btnCopyPasscode'),
    editUserId: document.getElementById('editUserId'),
    editUserUsername: document.getElementById('editUserUsername'),
    editUserRole: document.getElementById('editUserRole'),
    editUserPasscode: document.getElementById('editUserPasscode'),
    editUserActive: document.getElementById('editUserActive'),
    btnRegeneratePasscode: document.getElementById('btnRegeneratePasscode'),
    btnCopyEditPasscode: document.getElementById('btnCopyEditPasscode'),
    // Day Panel elements
    dayPanel: document.getElementById('dayPanel'),
    dayPanelOverlay: document.getElementById('dayPanelOverlay'),
    dayPanelDate: document.getElementById('dayPanelDate'),
    dayPanelTimeline: document.getElementById('dayPanelTimeline'),
    btnCloseDayPanel: document.getElementById('btnCloseDayPanel'),
    btnDayPanelAdd: document.getElementById('btnDayPanelAdd'),
    // Activity details action buttons
    btnEditActivity: document.getElementById('btnEditActivity'),
    btnDeleteActivity: document.getElementById('btnDeleteActivity'),
    // Edit activity modal elements
    formEditActivity: document.getElementById('formEditActivity'),
    editActivityId: document.getElementById('editActivityId'),
    editActivityPatient: document.getElementById('editActivityPatient'),
    editActivityDate: document.getElementById('editActivityDate'),
    editActivityTime: document.getElementById('editActivityTime'),
    editActivityType: document.getElementById('editActivityType'),
    editActivityTreatment: document.getElementById('editActivityTreatment'),
    editActivityNotes: document.getElementById('editActivityNotes'),
    editActivityReminder: document.getElementById('editActivityReminder'),
    // Reminder field on new activity form
    activityReminder: document.getElementById('activityReminder'),
    // Patient Edit elements
    editPatientId: document.getElementById('editPatientId'),
    modalPatientTitle: document.getElementById('modalPatientTitle'),
    btnSubmitPatient: document.getElementById('btnSubmitPatient')
};

// ===========================
// Authentication
// ===========================

/**
 * Handle login form submission
 */
if (elements.formLogin) {
    elements.formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = elements.loginUsername.value.trim();
        const passcode = elements.loginPassword.value;

        // Show loading state
        elements.btnLoginSubmit.disabled = true;
        elements.btnLoginSubmit.innerHTML = '<span class="loading-spinner"></span> Connexion...';
        elements.loginError.style.display = 'none';

        try {
            const user = await FirebaseService.login(username, passcode);
            handleLoginSuccess(user);
            elements.formLogin.reset();
        } catch (error) {
            console.error('Login error:', error);
            let errorMessage = 'Erreur de connexion. Vérifiez vos identifiants.';
            if (error.message === 'Identifiants invalides') {
                errorMessage = 'Nom d\'utilisateur ou code d\'accès incorrect';
            } else if (error.message === 'Compte désactivé') {
                errorMessage = 'Ce compte a été désactivé';
            }
            elements.loginError.textContent = errorMessage;
            elements.loginError.style.display = 'block';
        } finally {
            elements.btnLoginSubmit.disabled = false;
            elements.btnLoginSubmit.textContent = 'Se connecter';
        }
    });
}

// ===========================
// Session Management
// ===========================

/**
 * Check for existing session on load
 */
async function checkSession() {
    const savedUser = sessionStorage.getItem('cell_user');
    if (savedUser) {
        try {
            const user = JSON.parse(savedUser);
            // Verify user still exists and is active
            const freshUser = await FirebaseService.login(user.username, user.passcode);
            handleLoginSuccess(freshUser);
        } catch (error) {
            console.error('Session restoration failed:', error);
            sessionStorage.removeItem('cell_user');
            // Stay on login screen
        }
    }
}

/**
 * Handle successful login
 */
function handleLoginSuccess(user) {
    appState.currentUser = user;
    appState.currentUserData = user;

    // Save to session storage
    sessionStorage.setItem('cell_user', JSON.stringify({
        username: user.username,
        passcode: user.passcode // Storing passcode locally for auto-relogin
    }));

    // Update UI
    elements.userProfile.style.display = 'flex';
    elements.userEmail.textContent = user.username;
    closeModal('modalLogin');

    // Show admin menu if user is admin
    if (user.role === 'admin') {
        elements.navAdmin.style.display = 'block';
    } else {
        elements.navAdmin.style.display = 'none';
    }

    // Initialize data listeners
    initializeDataListeners();
}

/**
 * Handle logout
 */
if (elements.btnLogout) {
    elements.btnLogout.addEventListener('click', async () => {
        sessionStorage.removeItem('cell_user');
        window.location.reload();
    });
}

// ===========================
// Firebase Data Listeners
// ===========================

let patientsUnsubscribe = null;
let activitiesUnsubscribe = null;
let usersUnsubscribe = null;

/**
 * Initialize real-time data listeners
 */
function initializeDataListeners() {
    // Listen for patients changes
    if (patientsUnsubscribe) patientsUnsubscribe();
    patientsUnsubscribe = FirebaseService.onPatientsChanged((patients) => {
        appState.patients = patients;
        updateStats();
        updatePatientDropdown();
        renderPatientsGrid();
    });

    // Listen for activities changes
    if (activitiesUnsubscribe) activitiesUnsubscribe();
    activitiesUnsubscribe = FirebaseService.onActivitiesChanged((activities) => {
        appState.activities = activities;
        updateStats();
        renderCalendar();
        // Re-schedule notifications when activities change
        scheduleNotifications();
        // Refresh day panel if open
        if (appState.selectedDayDate) {
            renderDayTimeline(appState.selectedDayDate);
        }
    });

    // Listen for users changes (admin only)
    if (appState.currentUserData && appState.currentUserData.role === 'admin') {
        if (usersUnsubscribe) usersUnsubscribe();
        usersUnsubscribe = FirebaseService.onUsersChanged((users) => {
            appState.users = users;
            renderUsersTable();
        });
    }
}

// ===========================
// Admin Dashboard
// ===========================

/**
 * Render users table
 */
function renderUsersTable(filterRole = 'all', searchTerm = '') {
    if (!elements.usersTableBody) return;

    let filteredUsers = appState.users;

    // Apply role filter
    if (filterRole !== 'all') {
        filteredUsers = filteredUsers.filter(user => user.role === filterRole);
    }

    // Apply search filter
    if (searchTerm) {
        filteredUsers = filteredUsers.filter(user =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    if (filteredUsers.length === 0) {
        elements.usersTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state-table">Aucun utilisateur trouvé</td>
            </tr>
        `;
        return;
    }

    elements.usersTableBody.innerHTML = filteredUsers.map(user => `
        <tr data-user-id="${user.id}">
            <td>${user.username}</td>
            <td>
                <span class="role-badge ${user.role}">${user.role === 'admin' ? 'Administrateur' : 'Infirmière'}</span>
            </td>
            <td>
                <div class="passcode-display">
                    <span class="passcode-text masked" data-passcode="${user.passcode || '******'}">••••••</span>
                    <button class="btn-icon-action" onclick="togglePasscodeVisibility(this)" title="Afficher/Masquer">
                        <span class="material-icons">visibility</span>
                    </button>
                    <button class="btn-icon-action" onclick="copyPasscode('${user.passcode || ''}')" title="Copier">
                        <span class="material-icons">content_copy</span>
                    </button>
                </div>
            </td>
            <td>
                <span class="status-badge ${user.isActive ? 'active' : 'inactive'}">
                    <span class="material-icons">${user.isActive ? 'check_circle' : 'cancel'}</span>
                    ${user.isActive ? 'Actif' : 'Inactif'}
                </span>
            </td>
            <td>${user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString('fr-FR') : 'N/A'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-action" onclick="openEditUserModal('${user.id}')">
                        <span class="material-icons">edit</span>
                        Modifier
                    </button>
                    <button class="btn-action" onclick="toggleUserStatusAction('${user.id}', ${!user.isActive})">
                        <span class="material-icons">${user.isActive ? 'block' : 'check_circle'}</span>
                        ${user.isActive ? 'Désactiver' : 'Activer'}
                    </button>
                    <button class="btn-action danger" onclick="deleteUserAction('${user.id}')">
                        <span class="material-icons">delete</span>
                        Supprimer
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

/**
 * Toggle passcode visibility
 */
window.togglePasscodeVisibility = function (button) {
    const passcodeText = button.closest('.passcode-display').querySelector('.passcode-text');
    const icon = button.querySelector('.material-icons');

    if (passcodeText.classList.contains('masked')) {
        passcodeText.textContent = passcodeText.dataset.passcode;
        passcodeText.classList.remove('masked');
        icon.textContent = 'visibility_off';
    } else {
        passcodeText.textContent = '••••••';
        passcodeText.classList.add('masked');
        icon.textContent = 'visibility';
    }
};

/**
 * Copy passcode to clipboard
 */
window.copyPasscode = async function (passcode) {
    try {
        await navigator.clipboard.writeText(passcode);
        showToast('Code copié dans le presse-papiers');
    } catch (error) {
        console.error('Copy error:', error);
        alert('Erreur lors de la copie');
    }
};

/**
 * Generate passcode button handler
 */
if (elements.btnGeneratePasscode) {
    elements.btnGeneratePasscode.addEventListener('click', () => {
        const passcode = FirebaseService.generatePasscode();
        elements.newUserPasscode.value = passcode;
        elements.btnCopyPasscode.style.display = 'inline-flex';
    });
}

if (elements.btnCopyPasscode) {
    elements.btnCopyPasscode.addEventListener('click', async () => {
        const passcode = elements.newUserPasscode.value;
        await copyPasscode(passcode);
    });
}

if (elements.btnRegeneratePasscode) {
    elements.btnRegeneratePasscode.addEventListener('click', () => {
        const passcode = FirebaseService.generatePasscode();
        elements.editUserPasscode.value = passcode;
        elements.btnCopyEditPasscode.style.display = 'inline-flex';
    });
}

if (elements.btnCopyEditPasscode) {
    elements.btnCopyEditPasscode.addEventListener('click', async () => {
        const passcode = elements.editUserPasscode.value;
        await copyPasscode(passcode);
    });
}

/**
 * Add user button handler
 */
if (elements.btnAddUser) {
    elements.btnAddUser.addEventListener('click', () => {
        elements.formAddUser.reset();
        elements.newUserPasscode.value = '';
        elements.btnCopyPasscode.style.display = 'none';
        openModal('modalAddUser');
    });
}

/**
 * Add user form submission
 */
if (elements.formAddUser) {
    elements.formAddUser.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = elements.newUserUsername.value.trim();
        const role = elements.newUserRole.value;
        const passcode = elements.newUserPasscode.value;
        const isActive = elements.newUserActive.checked;

        if (!passcode) {
            alert('Veuillez générer un code d\'accès');
            return;
        }

        try {
            const currentUserId = appState.currentUser ? appState.currentUser.id : null;
            await FirebaseService.createUserWithPasscode(username, passcode, role, isActive, currentUserId);
            closeModal('modalAddUser');
            elements.formAddUser.reset();
            showToast('Utilisateur créé avec succès');
        } catch (error) {
            console.error('Create user error:', error);
            let errorMessage = 'Erreur lors de la création de l\'utilisateur';
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'Cet email est déjà utilisé';
            }
            alert(errorMessage);
        }
    });
}

/**
 * Open edit user modal
 */
window.openEditUserModal = function (userId) {
    const user = appState.users.find(u => u.id === userId);
    if (!user) return;

    elements.editUserId.value = user.id;
    elements.editUserUsername.value = user.username;
    elements.editUserRole.value = user.role;
    elements.editUserPasscode.value = '';
    elements.editUserActive.checked = user.isActive;
    elements.btnCopyEditPasscode.style.display = 'none';

    openModal('modalEditUser');
};

/**
 * Edit user form submission
 */
if (elements.formEditUser) {
    elements.formEditUser.addEventListener('submit', async (e) => {
        e.preventDefault();

        const userId = elements.editUserId.value;
        const username = elements.editUserUsername.value.trim();
        const role = elements.editUserRole.value;
        const newPasscode = elements.editUserPasscode.value;
        const isActive = elements.editUserActive.checked;

        try {
            const updateData = {
                username: username.toLowerCase(),
                email: `${username.toLowerCase()}@cell.local`,
                role,
                isActive
            };

            // Only update passcode if a new one was generated
            if (newPasscode) {
                updateData.passcode = newPasscode;
            }

            await FirebaseService.updateUser(userId, updateData);
            closeModal('modalEditUser');
            showToast('Utilisateur modifié avec succès');
        } catch (error) {
            console.error('Update user error:', error);
            alert('Erreur lors de la modification de l\'utilisateur');
        }
    });
}

/**
 * Toggle user status
 */
window.toggleUserStatusAction = async function (userId, isActive) {
    try {
        await FirebaseService.toggleUserStatus(userId, isActive);
        showToast(`Utilisateur ${isActive ? 'activé' : 'désactivé'} avec succès`);
    } catch (error) {
        console.error('Toggle status error:', error);
        alert('Erreur lors du changement de statut');
    }
};

/**
 * Delete user
 */
window.deleteUserAction = async function (userId) {
    const user = appState.users.find(u => u.id === userId);
    if (!user) return;

    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.username} ?`)) {
        return;
    }

    try {
        await FirebaseService.deleteUser(userId);
        showToast('Utilisateur supprimé avec succès');
    } catch (error) {
        console.error('Delete user error:', error);
        alert('Erreur lors de la suppression de l\'utilisateur');
    }
};

/**
 * Filter buttons
 */
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        const searchTerm = elements.searchUsers ? elements.searchUsers.value : '';
        renderUsersTable(filter, searchTerm);
    });
});

/**
 * Search users
 */
if (elements.searchUsers) {
    elements.searchUsers.addEventListener('input', (e) => {
        const searchTerm = e.target.value;
        const activeFilter = document.querySelector('.filter-btn.active');
        const filter = activeFilter ? activeFilter.dataset.filter : 'all';
        renderUsersTable(filter, searchTerm);
    });
}

/**
 * Show toast notification
 */
function showToast(message) {
    // Simple alert for now, can be enhanced with a toast component
    const toast = document.createElement('div');
    toast.className = 'success-message';
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.top = '20px';
    toast.style.right = '20px';
    toast.style.zIndex = '10000';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '8px';
    toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ===========================
// Navigation
// ===========================
function switchView(viewName) {
    elements.navItems.forEach(item => {
        if (item.dataset.view === viewName) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    elements.views.forEach(view => {
        if (view.id === `view-${viewName}`) {
            view.classList.add('active');
        } else {
            view.classList.remove('active');
        }
    });

    appState.currentView = viewName;
}

elements.navItems.forEach(item => {
    item.addEventListener('click', () => {
        switchView(item.dataset.view);
    });
});

// ===========================
// Calendar Functions
// ===========================
function renderCalendar() {
    const year = appState.currentDate.getFullYear();
    const month = appState.currentDate.getMonth();

    const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    elements.currentMonth.textContent = `${monthNames[month]} ${year}`;

    elements.calendarGrid.innerHTML = '';

    // Add day headers
    const dayHeaders = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    dayHeaders.forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-day-header';
        header.textContent = day;
        elements.calendarGrid.appendChild(header);
    });

    console.log('Rendering Calendar:', {
        year, month,
        totalActivities: appState.activities.length,
        firstActivityDate: appState.activities[0]?.date
    });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const startDay = firstDay === 0 ? 6 : firstDay - 1;

    // Previous month days
    for (let i = startDay - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        const dayEl = createDayElement(day, true, year, month - 1);
        elements.calendarGrid.appendChild(dayEl);
    }

    // Current month days
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();
        const dayEl = createDayElement(day, false, year, month, isToday);
        elements.calendarGrid.appendChild(dayEl);
    }

    // Next month days
    const totalCells = elements.calendarGrid.children.length - 7;
    const remainingCells = 42 - totalCells;
    for (let day = 1; day <= remainingCells; day++) {
        const dayEl = createDayElement(day, true, year, month + 1);
        elements.calendarGrid.appendChild(dayEl);
    }
}

function createDayElement(day, isOtherMonth, year, month, isToday = false) {
    const dayEl = document.createElement('div');
    dayEl.className = 'calendar-day';
    if (isOtherMonth) dayEl.classList.add('other-month');
    if (isToday) dayEl.classList.add('today');

    const dayNumber = document.createElement('div');
    dayNumber.className = 'day-number';
    dayNumber.textContent = day;
    dayEl.appendChild(dayNumber);

    // Add activities container
    const activitiesContainer = document.createElement('div');
    activitiesContainer.className = 'day-activities';

    // Get activities for this day
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayActivities = appState.activities.filter(a => a.date === dateStr);

    dayActivities.forEach(activity => {
        const activityCard = document.createElement('div');
        activityCard.className = 'activity-card';
        const reminderHtml = activity.reminder && activity.reminder !== 'none'
            ? `<div class="activity-card-reminder"><span class="material-icons">notifications</span></div>`
            : '';
        activityCard.innerHTML = `
            <div class="activity-card-patient">${activity.patientName}</div>
            <div class="activity-card-time">${activity.time}</div>
            <div class="activity-card-type">${activity.type}</div>
            ${reminderHtml}
        `;
        activityCard.addEventListener('click', (e) => {
            e.stopPropagation();
            showActivityDetails(activity);
        });
        activitiesContainer.appendChild(activityCard);
    });

    dayEl.appendChild(activitiesContainer);

    // Store date on element for expanded state tracking
    dayEl.dataset.date = dateStr;

    // Click handler opens expanded day panel
    dayEl.addEventListener('click', () => {
        const clickedDate = new Date(year, month, day);
        openDayPanel(clickedDate, dateStr);
    });

    return dayEl;
}

function openActivityModal(date = null) {
    if (date) {
        const dateStr = date.toISOString().split('T')[0];
        elements.activityDate.value = dateStr;
    }

    // Reset reminder field
    if (elements.activityReminder) elements.activityReminder.value = 'none';

    // Populate patient dropdown
    updatePatientDropdown();

    openNewActivitySidebar();
}

// ===========================
// Sidebar Functions
// ===========================
function hideDayPanelTemporarily() {
    if (elements.dayPanel.classList.contains('active')) {
        elements.dayPanel.classList.remove('active');
        elements.dayPanelOverlay.classList.remove('active');
        appState.dayPanelWasOpen = true;
    }
}

function restoreDayPanel() {
    if (appState.dayPanelWasOpen) {
        elements.dayPanel.classList.add('active');
        elements.dayPanelOverlay.classList.add('active');
        appState.dayPanelWasOpen = false;
    }
}

function openNewActivitySidebar() {
    hideDayPanelTemporarily();
    elements.newActivitySidebar.classList.add('active');
    elements.newActivityOverlay.classList.add('active');
}

function closeNewActivitySidebar() {
    elements.newActivitySidebar.classList.remove('active');
    elements.newActivityOverlay.classList.remove('active');
    restoreDayPanel();
}

function openEditActivitySidebar() {
    hideDayPanelTemporarily();
    elements.editActivitySidebar.classList.add('active');
    elements.editActivityOverlay.classList.add('active');
}

function closeEditActivitySidebar() {
    elements.editActivitySidebar.classList.remove('active');
    elements.editActivityOverlay.classList.remove('active');
    restoreDayPanel();
    appState.currentActivityId = null;
}

function openNewVitalSidebar() {
    // Reset edit state
    if (elements.editVitalId) elements.editVitalId.value = '';
    const title = elements.newVitalSidebar.querySelector('h3');
    if (title) title.textContent = 'Nouvelle Mesure (Constantes)';

    // Set default date/time
    if (elements.vitalDate) elements.vitalDate.value = new Date().toISOString().split('T')[0];
    if (elements.vitalTime) elements.vitalTime.value = new Date().toTimeString().slice(0, 5);

    if (elements.newVitalSidebar) elements.newVitalSidebar.classList.add('active');
    if (elements.newVitalOverlay) elements.newVitalOverlay.classList.add('active');
}

function closeNewVitalSidebar() {
    if (elements.newVitalSidebar) elements.newVitalSidebar.classList.remove('active');
    if (elements.newVitalOverlay) elements.newVitalOverlay.classList.remove('active');
}

function openNewFootAssessmentSidebar() {
    // Reset edit state
    if (elements.editFootAssessmentId) elements.editFootAssessmentId.value = '';
    const title = elements.newFootAssessmentSidebar.querySelector('h2');
    if (title) title.textContent = 'Bilan Podologique';

    // Set default date
    if (elements.footAssessmentDate) elements.footAssessmentDate.value = new Date().toISOString().split('T')[0];

    if (elements.newFootAssessmentSidebar) elements.newFootAssessmentSidebar.classList.add('active');
    if (elements.newFootAssessmentOverlay) elements.newFootAssessmentOverlay.classList.add('active');
}

function closeNewFootAssessmentSidebar() {
    if (elements.newFootAssessmentSidebar) elements.newFootAssessmentSidebar.classList.remove('active');
    if (elements.newFootAssessmentOverlay) elements.newFootAssessmentOverlay.classList.remove('active');
}

function openNewWoundAssessmentSidebar() {
    // Reset edit state
    if (elements.editWoundAssessmentId) elements.editWoundAssessmentId.value = '';
    const title = elements.newWoundAssessmentSidebar.querySelector('h2');
    if (title) title.textContent = 'Suivi de Plaie';

    if (elements.woundDate) elements.woundDate.value = new Date().toISOString().split('T')[0];
    if (elements.newWoundAssessmentSidebar) elements.newWoundAssessmentSidebar.classList.add('active');
    if (elements.newWoundAssessmentOverlay) elements.newWoundAssessmentOverlay.classList.add('active');
}

function closeNewWoundAssessmentSidebar() {
    if (elements.newWoundAssessmentSidebar) elements.newWoundAssessmentSidebar.classList.remove('active');
    if (elements.newWoundAssessmentOverlay) elements.newWoundAssessmentOverlay.classList.remove('active');
}

// Edit Sidebar Openers
function openEditVitalSidebar(vital) {
    if (elements.formNewVital) elements.formNewVital.reset();
    if (elements.editVitalId) elements.editVitalId.value = vital.id;
    document.getElementById('vitalDate').value = vital.date;
    document.getElementById('vitalTime').value = vital.time;
    document.getElementById('vitalBP').value = vital.bp || (vital.bpSys && vital.bpDia ? `${vital.bpSys}/${vital.bpDia}` : '');
    document.getElementById('vitalHR').value = vital.heartRate || '';
    document.getElementById('vitalTemp').value = vital.temp || '';
    document.getElementById('vitalWeight').value = vital.weight || '';
    document.getElementById('vitalGlucose').value = vital.glucose || '';
    document.getElementById('vitalNotes').value = vital.notes || '';

    // Change title
    const title = elements.newVitalSidebar.querySelector('h3');
    if (title) title.textContent = 'Modifier la Mesure';

    if (elements.newVitalSidebar) elements.newVitalSidebar.classList.add('active');
    if (elements.newVitalOverlay) elements.newVitalOverlay.classList.add('active');
}

function openEditFootAssessmentSidebar(ass) {
    if (elements.formNewFootAssessment) elements.formNewFootAssessment.reset();
    if (elements.editFootAssessmentId) elements.editFootAssessmentId.value = ass.id;
    document.getElementById('footAssessmentDate').value = ass.assessmentDate;

    // Radio
    const radio = document.querySelector(`input[name="footNeuro"][value="${ass.neuroLoss ? 'oui' : 'non'}"]`);
    if (radio) radio.checked = true;

    document.getElementById('footPulse').value = ass.pulse;

    // Checkboxes
    if (ass.deformities) {
        ass.deformities.forEach(val => {
            const cb = document.querySelector(`input[name="footDeformity"][value="${val}"]`);
            if (cb) cb.checked = true;
        });
    }

    document.getElementById('ulcerLocation').value = ass.ulcerLocation || '';
    if (ass.ulcerLocation) {
        if (elements.ulcerDetails) elements.ulcerDetails.style.display = 'grid';
        if (elements.infectionCheck) elements.infectionCheck.style.display = 'block';
        document.getElementById('wagnerStage').value = ass.wagnerStage || '0';
        document.getElementById('ulcerSize').value = ass.ulcerSize || '';

        if (ass.infectionSigns) {
            ass.infectionSigns.forEach(val => {
                const cb = document.querySelector(`input[name="infectionSigns"][value="${val}"]`);
                if (cb) cb.checked = true;
            });
        }
    } else {
        if (elements.ulcerDetails) elements.ulcerDetails.style.display = 'none';
        if (elements.infectionCheck) elements.infectionCheck.style.display = 'none';
    }

    document.getElementById('footTreatment').value = ass.treatment || '';
    document.getElementById('nextVisitRecommendation').value = ass.nextVisit || '1week';

    // Change title
    const title = elements.newFootAssessmentSidebar.querySelector('h2');
    if (title) title.textContent = 'Modifier le Bilan';

    if (elements.newFootAssessmentSidebar) elements.newFootAssessmentSidebar.classList.add('active');
    if (elements.newFootAssessmentOverlay) elements.newFootAssessmentOverlay.classList.add('active');
}

function openEditWoundAssessmentSidebar(wound) {
    if (elements.formNewWoundAssessment) elements.formNewWoundAssessment.reset();
    if (elements.editWoundAssessmentId) elements.editWoundAssessmentId.value = wound.id;
    document.getElementById('woundDate').value = wound.date;
    document.getElementById('woundLocation').value = wound.location;
    document.getElementById('woundLength').value = wound.length || '';
    document.getElementById('woundWidth').value = wound.width || '';
    document.getElementById('woundDepth').value = wound.depth || '';
    document.getElementById('bedNecrosis').value = wound.bedNecrosis || '';
    document.getElementById('bedSlough').value = wound.bedSlough || '';
    document.getElementById('bedGranulation').value = wound.bedGranulation || '';
    document.getElementById('bedEpithel').value = wound.bedEpithel || '';
    document.getElementById('woundExudate').value = wound.exudate || 'none';
    document.getElementById('woundOdor').value = wound.odor || 'none';

    if (wound.periwound) {
        wound.periwound.forEach(val => {
            const cb = document.querySelector(`input[name="periwound"][value="${val}"]`);
            if (cb) cb.checked = true;
        });
    }

    document.getElementById('woundProtocol').value = wound.protocol || '';

    // Change title
    const title = elements.newWoundAssessmentSidebar.querySelector('h2');
    if (title) title.textContent = 'Modifier le Suivi';

    if (elements.newWoundAssessmentSidebar) elements.newWoundAssessmentSidebar.classList.add('active');
    if (elements.newWoundAssessmentOverlay) elements.newWoundAssessmentOverlay.classList.add('active');
}

// Sidebar Event Listeners
if (elements.btnCloseNewActivity) elements.btnCloseNewActivity.addEventListener('click', closeNewActivitySidebar);
if (elements.btnCancelNewActivity) elements.btnCancelNewActivity.addEventListener('click', closeNewActivitySidebar);
if (elements.newActivityOverlay) elements.newActivityOverlay.addEventListener('click', closeNewActivitySidebar);

if (elements.btnCloseEditActivity) elements.btnCloseEditActivity.addEventListener('click', closeEditActivitySidebar);
if (elements.btnCancelEditActivity) elements.btnCancelEditActivity.addEventListener('click', closeEditActivitySidebar);
if (elements.editActivityOverlay) elements.editActivityOverlay.addEventListener('click', closeEditActivitySidebar);

// ===========================
// Day Panel Functions
// ===========================
function openDayPanel(date, dateStr) {
    appState.selectedDayDate = dateStr;

    // Highlight the selected day on the calendar
    document.querySelectorAll('.calendar-day.day-expanded').forEach(el => {
        el.classList.remove('day-expanded');
    });
    const dayEl = document.querySelector(`.calendar-day[data-date="${dateStr}"]`);
    if (dayEl) dayEl.classList.add('day-expanded');

    // Set the date header
    const formatted = date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    elements.dayPanelDate.textContent = formatted.charAt(0).toUpperCase() + formatted.slice(1);

    // Render the timeline
    renderDayTimeline(dateStr);

    // Show panel
    elements.dayPanel.classList.add('active');
    elements.dayPanelOverlay.classList.add('active');
}

function closeDayPanel() {
    elements.dayPanel.classList.remove('active');
    elements.dayPanelOverlay.classList.remove('active');

    // Remove highlighted day
    document.querySelectorAll('.calendar-day.day-expanded').forEach(el => {
        el.classList.remove('day-expanded');
    });
    appState.selectedDayDate = null;
}

function renderDayTimeline(dateStr) {
    const timeline = elements.dayPanelTimeline;
    const dayActivities = appState.activities
        .filter(a => a.date === dateStr)
        .sort((a, b) => (a.time || '').localeCompare(b.time || ''));

    if (dayActivities.length === 0) {
        // Show empty state but still render hour slots
        timeline.innerHTML = '';
    } else {
        timeline.innerHTML = '';
    }

    // Group activities by hour
    const activityByHour = {};
    dayActivities.forEach(activity => {
        const hour = activity.time ? parseInt(activity.time.split(':')[0]) : 0;
        if (!activityByHour[hour]) activityByHour[hour] = [];
        activityByHour[hour].push(activity);
    });

    // Render 00:00 - 23:00 time slots
    for (let h = 0; h <= 23; h++) {
        const slot = document.createElement('div');
        slot.className = 'timeline-hour-slot';

        const label = document.createElement('div');
        label.className = 'timeline-hour-label';
        label.textContent = `${String(h).padStart(2, '0')}:00`;

        const content = document.createElement('div');
        content.className = 'timeline-hour-content';

        // Add activities for this hour
        if (activityByHour[h]) {
            activityByHour[h].forEach(activity => {
                const card = document.createElement('div');
                card.className = 'timeline-activity';

                const reminderIcon = activity.reminder && activity.reminder !== 'none'
                    ? `<span class="material-icons timeline-activity-reminder">notifications_active</span>`
                    : '';

                card.innerHTML = `
                    <div class="timeline-activity-info">
                        <div class="timeline-activity-patient">${activity.patientName}</div>
                        <div class="timeline-activity-type">${activity.type}</div>
                    </div>
                    <div class="timeline-activity-time">${activity.time}</div>
                    ${reminderIcon}
                    <div class="timeline-activity-actions">
                        <button class="timeline-action-btn" data-action="edit" title="Modifier">
                            <span class="material-icons">edit</span>
                        </button>
                        <button class="timeline-action-btn" data-action="delete" title="Supprimer">
                            <span class="material-icons">delete</span>
                        </button>
                    </div>
                `;

                // Click card to show details
                card.addEventListener('click', (e) => {
                    if (e.target.closest('.timeline-action-btn')) return;
                    showActivityDetails(activity);
                });

                // Edit button
                card.querySelector('[data-action="edit"]').addEventListener('click', (e) => {
                    e.stopPropagation();
                    openEditActivityModal(activity.id);
                });

                // Delete button
                card.querySelector('[data-action="delete"]').addEventListener('click', (e) => {
                    e.stopPropagation();
                    deleteActivityAction(activity.id);
                });

                content.appendChild(card);
            });
        }

        // Click empty slot to add activity at that hour
        slot.addEventListener('click', (e) => {
            if (e.target.closest('.timeline-activity')) return;
            const date = new Date(dateStr + 'T00:00:00');
            elements.activityDate.value = dateStr;
            elements.activityTime.value = `${String(h).padStart(2, '0')}:00`;
            if (elements.activityReminder) elements.activityReminder.value = 'none';
            updatePatientDropdown();
            openNewActivitySidebar();
        });

        slot.appendChild(label);
        slot.appendChild(content);
        timeline.appendChild(slot);
    }

    // Show activities outside 8-20 range at the top
    const outsideHours = dayActivities.filter(a => {
        const hour = a.time ? parseInt(a.time.split(':')[0]) : 8;
        return hour < 8 || hour > 20;
    });

    if (outsideHours.length > 0) {
        const earlySlot = document.createElement('div');
        earlySlot.className = 'timeline-hour-slot';
        const earlyLabel = document.createElement('div');
        earlyLabel.className = 'timeline-hour-label';
        earlyLabel.textContent = 'Autre';
        const earlyContent = document.createElement('div');
        earlyContent.className = 'timeline-hour-content';

        outsideHours.forEach(activity => {
            const card = document.createElement('div');
            card.className = 'timeline-activity';
            card.innerHTML = `
                <div class="timeline-activity-info">
                    <div class="timeline-activity-patient">${activity.patientName}</div>
                    <div class="timeline-activity-type">${activity.type}</div>
                </div>
                <div class="timeline-activity-time">${activity.time}</div>
            `;
            card.addEventListener('click', () => showActivityDetails(activity));
            earlyContent.appendChild(card);
        });

        earlySlot.appendChild(earlyLabel);
        earlySlot.appendChild(earlyContent);
        timeline.insertBefore(earlySlot, timeline.firstChild);
    }

    if (dayActivities.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'timeline-empty';
        emptyMsg.innerHTML = `
            <span class="material-icons">event_available</span>
            <p>Aucune activité pour cette journée</p>
        `;
        timeline.insertBefore(emptyMsg, timeline.firstChild);
    }
}

// ===========================
// Edit Activity Functions
// ===========================
function openEditActivityModal(activityId) {
    const activity = appState.activities.find(a => a.id === activityId);
    if (!activity) return;

    // Close other modals
    closeModal('modalActivityDetails');

    // Populate edit form
    elements.editActivityId.value = activity.id;
    elements.editActivityDate.value = activity.date;
    elements.editActivityTime.value = activity.time;
    elements.editActivityType.value = activity.type;
    elements.editActivityTreatment.value = activity.treatment || '';
    elements.editActivityNotes.value = activity.notes || '';
    elements.editActivityReminder.value = activity.reminder || 'none';

    // Populate patient dropdown
    const select = elements.editActivityPatient;
    select.innerHTML = '<option value="">Sélectionner un patient...</option>';
    appState.patients.forEach(patient => {
        const option = document.createElement('option');
        option.value = patient.id;
        option.textContent = patient.name;
        if (patient.id === activity.patientId) option.selected = true;
        select.appendChild(option);
    });

    openEditActivitySidebar();
}

async function deleteActivityAction(activityId) {
    const activity = appState.activities.find(a => a.id === activityId);
    if (!activity) return;

    const confirmMsg = `Supprimer l'activité de ${activity.patientName} le ${formatDate(activity.date)} à ${activity.time} ?`;
    if (!confirm(confirmMsg)) return;

    try {
        await FirebaseService.deleteActivity(activityId);
        closeModal('modalActivityDetails');
        showToast('Activité supprimée avec succès');

        // Refresh day panel if open
        if (appState.selectedDayDate) {
            renderDayTimeline(appState.selectedDayDate);
        }
    } catch (error) {
        console.error('Delete activity error:', error);
        alert('Erreur lors de la suppression de l\'activité');
    }
}

// ===========================
// Browser Notifications
// ===========================
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

function getReminderMs(reminderValue) {
    switch (reminderValue) {
        case '15min': return 15 * 60 * 1000;
        case '30min': return 30 * 60 * 1000;
        case '1hour': return 60 * 60 * 1000;
        case '1day': return 24 * 60 * 60 * 1000;
        default: return 0;
    }
}

function getReminderLabel(reminderValue) {
    switch (reminderValue) {
        case '15min': return '15 minutes avant';
        case '30min': return '30 minutes avant';
        case '1hour': return '1 heure avant';
        case '1day': return '1 jour avant';
        default: return 'Aucun';
    }
}

function scheduleNotifications() {
    // Clear existing timers
    appState.notificationTimers.forEach(t => clearTimeout(t));
    appState.notificationTimers = [];

    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    const now = Date.now();

    appState.activities.forEach(activity => {
        if (!activity.reminder || activity.reminder === 'none') return;
        if (!activity.date || !activity.time) return;

        const activityTime = new Date(`${activity.date}T${activity.time}:00`).getTime();
        const reminderMs = getReminderMs(activity.reminder);
        const notifyAt = activityTime - reminderMs;
        const delay = notifyAt - now;

        if (delay > 0 && delay < 24 * 60 * 60 * 1000) { // Only schedule within 24h
            const timer = setTimeout(() => {
                new Notification('Cell - Rappel', {
                    body: `${activity.patientName} — ${activity.type} à ${activity.time}`,
                    icon: '🔔',
                    tag: `activity-${activity.id}`
                });
            }, delay);
            appState.notificationTimers.push(timer);
        }
    });
}

function updatePatientDropdown() {
    const select = elements.activityPatient;
    select.innerHTML = '<option value="">Sélectionner un patient...</option>';
    select.innerHTML += '<option value="new">+ Créer un nouveau patient</option>';

    appState.patients.forEach(patient => {
        const option = document.createElement('option');
        option.value = patient.id;
        option.textContent = patient.name;
        select.appendChild(option);
    });
}

function showActivityDetails(activity) {
    // Store current activity ID for edit/delete actions
    appState.currentActivityId = activity.id;

    const content = document.getElementById('activityDetailsContent');
    const patient = appState.patients.find(p => p.id === activity.patientId);

    const reminderLabel = activity.reminder && activity.reminder !== 'none'
        ? getReminderLabel(activity.reminder)
        : null;

    content.innerHTML = `
        <div class="activity-detail-grid">
            <div class="activity-detail-item">
                <div class="activity-detail-label">Patient</div>
                <div class="activity-detail-value">
                    <a href="#" class="patient-link" data-patient-id="${activity.patientId}">
                        ${activity.patientName}
                    </a>
                </div>
            </div>
            <div class="activity-detail-item">
                <div class="activity-detail-label">Date</div>
                <div class="activity-detail-value">${formatDate(activity.date)}</div>
            </div>
            <div class="activity-detail-item">
                <div class="activity-detail-label">Heure</div>
                <div class="activity-detail-value">${activity.time}</div>
            </div>
            <div class="activity-detail-item">
                <div class="activity-detail-label">Type</div>
                <div class="activity-detail-value">${activity.type}</div>
            </div>
        </div>

        ${reminderLabel ? `
        <div class="activity-detail-section">
            <h4>Rappel</h4>
            <div class="reminder-badge">
                <span class="material-icons">notifications_active</span>
                ${reminderLabel}
            </div>
        </div>
        ` : ''}
        
        ${activity.treatment ? `
        <div class="activity-detail-section">
            <h4>Traitement</h4>
            <p>${activity.treatment}</p>
        </div>
        ` : ''}
        
        ${activity.notes ? `
        <div class="activity-detail-section">
            <h4>Notes</h4>
            <p>${activity.notes}</p>
        </div>
        ` : ''}
        
        ${patient ? `
        <div class="activity-detail-section">
            <h4>Informations patient</h4>
            <div class="activity-detail-grid">
                <div class="activity-detail-item">
                    <div class="activity-detail-label">Âge</div>
                    <div class="activity-detail-value">${patient.age} ans</div>
                </div>
                <div class="activity-detail-item">
                    <div class="activity-detail-label">Sexe</div>
                    <div class="activity-detail-value">${patient.gender}</div>
                </div>
                ${patient.contact ? `
                <div class="activity-detail-item">
                    <div class="activity-detail-label">Contact</div>
                    <div class="activity-detail-value">${patient.contact}</div>
                </div>
                ` : ''}
            </div>
        </div>
        ` : ''}
    `;

    // Add click handler for patient link
    const patientLink = content.querySelector('.patient-link');
    if (patientLink) {
        patientLink.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal('modalActivityDetails');
            console.log('Navigate to patient:', activity.patientId);
        });
    }

    openModal('modalActivityDetails');
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Calendar navigation
elements.btnPrevMonth.addEventListener('click', () => {
    appState.currentDate.setMonth(appState.currentDate.getMonth() - 1);
    renderCalendar();
});

elements.btnNextMonth.addEventListener('click', () => {
    appState.currentDate.setMonth(appState.currentDate.getMonth() + 1);
    renderCalendar();
});

// ===========================
// Patients Functions
// ===========================
async function addPatient(patientData) {
    try {
        const userId = appState.currentUser ? appState.currentUser.id : null;
        if (!userId) {
            alert("Erreur: Vous devez être connecté pour effectuer cette action.");
            return;
        }
        const patient = await FirebaseService.addPatient(patientData, userId);
        return patient;
    } catch (error) {
        console.error('Error adding patient:', error);
        alert('Erreur lors de l\'ajout du patient');
        throw error;
    }
}

function renderPatientsGrid() {
    const grid = document.getElementById('patientsGrid');
    if (!grid) return;

    if (appState.patients.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <p>Aucun patient enregistré</p>
                <button class="btn-primary" id="btnNewPatientAlt">+ Ajouter un patient</button>
            </div>
        `;

        // Re-attach event listener
        const btn = document.getElementById('btnNewPatientAlt');
        if (btn) {
            btn.addEventListener('click', () => {
                openNewPatientModal();
            });
        }
    } else {
        grid.innerHTML = '';
        appState.patients.forEach(patient => {
            const card = document.createElement('div');
            card.className = 'patient-card';
            card.innerHTML = `
                <div class="patient-card-header">
                    <div class="patient-avatar">${patient.name.charAt(0).toUpperCase()}</div>
                    <div class="patient-card-info">
                        <h3>${patient.name}</h3>
                        <p class="patient-meta">${patient.age} ans • ${patient.gender}</p>
                    </div>
                </div>

                <div class="patient-card-body">
                    ${patient.contact ? `<p><strong>Contact:</strong> ${patient.contact}</p>` : ''}
                    ${patient.medicalHistory ? `<p><strong>Antécédents:</strong> ${patient.medicalHistory}</p>` : ''}
                </div>
            `;
            // Add click listener
            card.addEventListener('click', () => {
                openPatientDetails(patient.id);
            });
            grid.appendChild(card);
        });
    }
}

// ===========================
// Patient Profile Functions
// ===========================
async function openPatientDetails(patientId) {
    appState.currentPatientId = patientId;
    const patient = appState.patients.find(p => p.id === patientId);

    if (!patient) {
        console.error("Patient not found");
        return;
    }

    // Populate Header
    document.getElementById('profileName').textContent = patient.name;
    document.getElementById('profileMeta').textContent = `${patient.age} ans • ${patient.gender === 'M' ? 'Homme' : patient.gender === 'F' ? 'Femme' : 'Autre'} • ${patient.contact || 'Aucun contact'} `;

    // Populate General Tab
    const generalInfoGrid = document.getElementById('profileGeneralInfo');
    generalInfoGrid.innerHTML = `
        <div class="detail-item">
            <label>Nom complet</label>
            <p>${patient.name}</p>
        </div>
        <div class="detail-item">
            <label>Âge / Sexe</label>
            <p>${patient.age} ans / ${patient.gender}</p>
        </div>
        <div class="detail-item">
            <label>Contact</label>
            <p>${patient.contact || '-'}</p>
        </div>
    `;

    document.getElementById('profileHistory').textContent = patient.medicalHistory || 'Aucun antécédent noté.';
    document.getElementById('profileComorbidities').textContent = patient.comorbidities || 'Aucune comorbidité notée.';
    document.getElementById('profileBloodSample').textContent = patient.bloodSample || 'Aucun bilan noté.';
    document.getElementById('profileImagery').textContent = patient.imagery || 'Aucune imagerie notée.';

    // Initialize tabs
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    // Default to first tab
    document.querySelector('.tab-btn[data-tab="tab-general"]').classList.add('active');
    document.getElementById('tab-general').classList.add('active');

    // Switch View
    switchView('patient-details');

    // Load sub-data
    renderVitals(patientId);
    renderFootAssessments(patientId);
    renderWoundAssessments(patientId);
}

function setupPatientProfileListeners() {
    // Back Button
    document.getElementById('btnBackToPatients').addEventListener('click', () => {
        appState.currentPatientId = null;
        switchView('patients');
    });

    // Valid only if element exists (admin/edit not implemented yet)
    const btnEdit = document.getElementById('btnEditPatientProfile');
    if (btnEdit) {
        btnEdit.addEventListener('click', () => {
            openEditPatientModal(appState.currentPatientId);
        });
    }

    // Tabs Navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');

            // Switch Buttons
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Switch Content
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');

            // Refresh data if needed
            if (tabId === 'tab-vitals' && appState.currentPatientId) {
                renderVitals(appState.currentPatientId);
            } else if (tabId === 'tab-foot' && appState.currentPatientId) {
                renderFootAssessments(appState.currentPatientId);
            } else if (tabId === 'tab-wounds' && appState.currentPatientId) {
                renderWoundAssessments(appState.currentPatientId);
            }
        });
    });

    // Mock buttons
    const btnAddVital = document.getElementById('btnAddVitalSign');
    if (btnAddVital) {
        btnAddVital.addEventListener('click', () => {
            openNewVitalSidebar();
        });
    }

    if (elements.btnCloseNewVital) elements.btnCloseNewVital.addEventListener('click', closeNewVitalSidebar);
    if (elements.btnCancelNewVital) elements.btnCancelNewVital.addEventListener('click', closeNewVitalSidebar);

    // New Vital Form Submit
    if (elements.formNewVital) {
        elements.formNewVital.addEventListener('submit', async (e) => {
            e.preventDefault();
            const patientId = appState.currentPatientId;
            if (!patientId) return;

            const editId = elements.editVitalId ? elements.editVitalId.value : '';

            const vitalData = {
                date: elements.vitalDate.value,
                time: elements.vitalTime.value,
                bp: document.getElementById('vitalBP').value,
                heartRate: document.getElementById('vitalHR').value,
                temp: document.getElementById('vitalTemp').value,
                weight: document.getElementById('vitalWeight').value,
                glucose: document.getElementById('vitalGlucose').value,
                notes: document.getElementById('vitalNotes').value
            };

            try {
                if (editId) {
                    await FirebaseService.updateVitalSign(editId, vitalData);
                    showToast('Constante mise à jour');
                } else {
                    await FirebaseService.addVitalSign(patientId, vitalData, appState.currentUser.id);
                    showToast('Constante ajoutée');
                }
                closeNewVitalSidebar();
                elements.formNewVital.reset();
                renderVitals(patientId);
            } catch (error) {
                console.error('Error saving vital:', error);
                alert('Erreur lors de l\'enregistrement');
            }
        });
    }

    document.getElementById('btnAddFootAssessment').addEventListener('click', () => {
        openNewFootAssessmentSidebar();
    });

    if (elements.btnCloseNewFootAssessment) elements.btnCloseNewFootAssessment.addEventListener('click', closeNewFootAssessmentSidebar);
    if (elements.btnCancelNewFootAssessment) elements.btnCancelNewFootAssessment.addEventListener('click', closeNewFootAssessmentSidebar);

    // Dynamic Form Logic for Foot Assessment
    if (elements.ulcerLocation) {
        elements.ulcerLocation.addEventListener('change', (e) => {
            const hasUlcer = e.target.value !== "";
            elements.ulcerDetails.style.display = hasUlcer ? 'grid' : 'none';
            elements.infectionCheck.style.display = hasUlcer ? 'block' : 'none';
        });
    }

    // Foot Assessment Form Submit
    if (elements.formNewFootAssessment) {
        elements.formNewFootAssessment.addEventListener('submit', async (e) => {
            e.preventDefault();
            const patientId = appState.currentPatientId;
            if (!patientId) return;

            if (!appState.currentUser) {
                alert('Veuillez vous reconnecter');
                return;
            }

            const form = e.target;
            const editId = elements.editFootAssessmentId ? elements.editFootAssessmentId.value : '';

            // Get checkboxes - Scoped to this form
            const deformities = [];
            form.querySelectorAll('input[name="footDeformity"]:checked').forEach(cb => deformities.push(cb.value));

            const infectionSigns = [];
            form.querySelectorAll('input[name="infectionSigns"]:checked').forEach(cb => infectionSigns.push(cb.value));

            // Get neuro radio - Safe check
            const neuroRadio = form.querySelector('input[name="footNeuro"]:checked');
            const neuroLoss = neuroRadio ? neuroRadio.value === 'oui' : false;

            const assessmentData = {
                assessmentDate: elements.footAssessmentDate.value,
                neuroLoss: neuroLoss,
                pulse: document.getElementById('footPulse').value,
                deformities: deformities,
                ulcerLocation: elements.ulcerLocation.value,
                wagnerStage: elements.ulcerLocation.value ? document.getElementById('wagnerStage').value : null,
                ulcerSize: elements.ulcerLocation.value ? document.getElementById('ulcerSize').value : null,
                infectionSigns: elements.ulcerLocation.value ? infectionSigns : [],
                treatment: document.getElementById('footTreatment').value,
                nextVisit: document.getElementById('nextVisitRecommendation').value
            };

            try {
                if (editId) {
                    await FirebaseService.updateAssessment(editId, assessmentData);
                    showToast('Bilan mis à jour');
                } else {
                    await FirebaseService.addAssessment(patientId, assessmentData, appState.currentUser.id);
                    showToast('Bilan enregistré');
                }
                closeNewFootAssessmentSidebar();
                form.reset();
                // Reset hidden sections
                if (elements.ulcerDetails) elements.ulcerDetails.style.display = 'none';
                if (elements.infectionCheck) elements.infectionCheck.style.display = 'none';

                renderFootAssessments(patientId);
            } catch (error) {
                console.error('Error saving assessment:', error);
                alert('Erreur lors de l\'enregistrement');
            }
        });
    }



    document.getElementById('btnAddWoundAssessment').addEventListener('click', () => {
        openNewWoundAssessmentSidebar();
    });

    if (elements.btnCloseNewWoundAssessment) elements.btnCloseNewWoundAssessment.addEventListener('click', closeNewWoundAssessmentSidebar);
    if (elements.btnCancelNewWoundAssessment) elements.btnCancelNewWoundAssessment.addEventListener('click', closeNewWoundAssessmentSidebar);

    if (elements.formNewWoundAssessment) {
        elements.formNewWoundAssessment.addEventListener('submit', async (e) => {
            e.preventDefault();
            const patientId = appState.currentPatientId;
            if (!patientId) return;

            if (!appState.currentUser) {
                alert('Veuillez vous reconnecter');
                return;
            }

            const form = e.target;
            const editId = elements.editWoundAssessmentId ? elements.editWoundAssessmentId.value : '';

            // Get periwound checkboxes - Scoped to form
            const periwound = [];
            form.querySelectorAll('input[name="periwound"]:checked').forEach(cb => periwound.push(cb.value));

            const assessmentData = {
                date: elements.woundDate.value,
                location: document.getElementById('woundLocation').value,
                length: document.getElementById('woundLength').value,
                width: document.getElementById('woundWidth').value,
                depth: document.getElementById('woundDepth').value,
                bedNecrosis: document.getElementById('bedNecrosis').value,
                bedSlough: document.getElementById('bedSlough').value,
                bedGranulation: document.getElementById('bedGranulation').value,
                bedEpithel: document.getElementById('bedEpithel').value,
                exudate: document.getElementById('woundExudate').value,
                odor: document.getElementById('woundOdor').value,
                periwound: periwound,
                protocol: document.getElementById('woundProtocol').value
            };

            try {
                if (editId) {
                    await FirebaseService.updateWoundAssessment(editId, assessmentData);
                    showToast('Suivi de plaie mis à jour');
                } else {
                    await FirebaseService.addWoundAssessment(patientId, assessmentData, appState.currentUser.id);
                    showToast('Suivi de plaie enregistré');
                }
                closeNewWoundAssessmentSidebar();
                form.reset();
                renderWoundAssessments(patientId);
            } catch (error) {
                console.error('Error saving wound assessment:', error);
                alert('Erreur lors de l\'enregistrement');
            }
        });
    }
}

// Call setup once
setupPatientProfileListeners();

// Placeholders for Data Rendering
async function renderVitals(patientId) {
    const tbody = document.getElementById('vitalsTableBody');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;">Chargement...</td></tr>';

    try {
        const vitals = await FirebaseService.getVitalSigns(patientId);

        if (vitals.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;">Aucune donnée</td></tr>';
            return;
        }

        tbody.innerHTML = '';
        vitals.forEach(vital => {
            const tr = document.createElement('tr');

            // Format BP display logic (same as before)
            let bpDisplay = '-';
            if (vital.bp) {
                const rawBp = vital.bp.trim();
                const bpParts = rawBp.split(/[\/\s-]/);
                if (bpParts.length === 2) {
                    let sys = parseFloat(bpParts[0]);
                    let dia = parseFloat(bpParts[1]);
                    if (!isNaN(sys) && !isNaN(dia)) {
                        if (sys >= 40) sys = sys / 10;
                        if (dia >= 40) dia = dia / 10;
                        bpDisplay = `${sys}/${dia}`;
                    } else {
                        bpDisplay = rawBp;
                    }
                } else {
                    bpDisplay = rawBp;
                }
            } else if (vital.bpSys && vital.bpDia) {
                bpDisplay = `${vital.bpSys}/${vital.bpDia}`;
            }

            tr.innerHTML = `
                <td>${formatDate(vital.date)} <span style="color:var(--color-text-tertiary); font-size: 0.9em">${vital.time}</span></td>
                <td>${bpDisplay}</td>
                <td>${vital.heartRate ? `${vital.heartRate} bpm` : '-'}</td>
                <td>${vital.temp ? `${vital.temp}°C` : '-'}</td>
                <td>${vital.weight ? `${vital.weight} kg` : '-'}</td>
                <td>${vital.glucose ? `${vital.glucose} g/L` : '-'}</td>
                <td>${vital.notes || '-'}</td>
                <td>
                    <button class="btn-icon-small btn-edit-vital" data-id="${vital.id}">
                        <span class="material-icons">edit</span>
                    </button>
                </td>
            `;

            // Add event listener to the edit button
            const btnEdit = tr.querySelector('.btn-edit-vital');
            btnEdit.addEventListener('click', () => openEditVitalSidebar(vital));

            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error('Error loading vitals:', error);
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:red;">Erreur de chargement</td></tr>';
    }
}

async function renderFootAssessments(patientId) {
    const list = document.getElementById('footAssessmentList');
    list.innerHTML = '<div class="empty-state-small"><p>Chargement...</p></div>';

    try {
        const assessments = await FirebaseService.getAssessments(patientId);

        if (assessments.length === 0) {
            list.innerHTML = '<div class="empty-state-small"><p>Aucun bilan podologique enregistré</p></div>';
            return;
        }

        list.innerHTML = '';
        assessments.forEach(ass => {
            const date = ass.assessmentDate ? new Date(ass.assessmentDate).toLocaleDateString('fr-FR') : 'Date inconnue';

            let riskLevel = 'Faible';
            let riskClass = 'risk-low';

            const hasNeuroLoss = ass.neuroLoss === true;
            const hasAbsentPulse = ass.pulse === 'absent';
            const deformationCount = (ass.deformities || []).length;

            if (hasNeuroLoss && hasAbsentPulse) { riskLevel = 'Élevé'; riskClass = 'risk-high'; }
            else if (hasNeuroLoss || hasAbsentPulse || deformationCount > 0) { riskLevel = 'Modéré'; riskClass = 'risk-medium'; }

            const card = document.createElement('div');
            card.className = 'profile-card';
            card.innerHTML = `
                <div class="section-header" style="margin-bottom: 8px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <h3>Bilan du ${date}</h3>
                        <span class="badge ${riskClass}">${riskLevel}</span>
                    </div>
                    <button class="btn-icon-small btn-edit-foot" data-id="${ass.id}">
                        <span class="material-icons" style="font-size: 18px;">edit</span>
                    </button>
                </div>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>Sensibilité</label>
                        <p>${ass.neuroLoss ? 'Perte (Anormal)' : 'Normale'}</p>
                    </div>
                    <div class="detail-item">
                        <label>Pouls</label>
                        <p>${ass.pulse}</p>
                    </div>
                     <div class="detail-item">
                        <label>Déformations</label>
                        <p>${ass.deformities.length ? ass.deformities.join(', ') : 'Aucune'}</p>
                    </div>
                </div>
                ${ass.ulcerLocation ? `
                <div style="margin-top: 16px; padding-top: 16px; border-top: 1px dashed var(--color-border);">
                    <h4 style="font-size: 14px; margin-bottom: 8px;">Ulcère (${ass.ulcerLocation})</h4>
                    <div class="detail-grid">
                        <div class="detail-item"><label>Wagner</label><p>Grade ${ass.wagnerStage}</p></div>
                        <div class="detail-item"><label>Taille</label><p>${ass.ulcerSize || '-'}</p></div>
                        <div class="detail-item"><label>Infection</label><p>${ass.infectionSigns.length ? 'Oui' : 'Non'}</p></div>
                    </div>
                </div>
                ` : ''}
                ${ass.treatment ? `
                <div style="margin-top: 12px;">
                    <label style="font-size: 12px; color: var(--color-text-secondary);">Traitement / Notes</label>
                    <p style="font-size: 14px; margin-top: 4px;">${ass.treatment}</p>
                </div>
                ` : ''}
            `;

            // Add edit listener
            const btnEdit = card.querySelector('.btn-edit-foot');
            btnEdit.addEventListener('click', () => openEditFootAssessmentSidebar(ass));

            list.appendChild(card);
        });

    } catch (error) {
        console.error('Error loading assessments:', error);
        list.innerHTML = '<div class="empty-state-small"><p>Erreur de chargement</p></div>';
    }
}

async function renderWoundAssessments(patientId) {
    const list = document.getElementById('woundAssessmentList');
    if (!list) return;

    list.innerHTML = '<div class="empty-state-small"><p>Chargement...</p></div>';

    try {
        const wounds = await FirebaseService.getWoundAssessments(patientId);

        if (!wounds || wounds.length === 0) {
            list.innerHTML = '<div class="empty-state-small"><p>Aucun suivi de plaie enregistré</p></div>';
            return;
        }

        list.innerHTML = '';
        wounds.forEach(wound => {
            const date = new Date(wound.date).toLocaleDateString('fr-FR');

            const card = document.createElement('div');
            card.className = 'profile-card';
            card.innerHTML = `
                <div class="section-header" style="margin-bottom: 8px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <h3>${wound.location}</h3>
                        <span class="badge" style="background:#f1f3f4; color:#333;">${date}</span>
                    </div>
                    <button class="btn-icon-small btn-edit-wound" data-id="${wound.id}">
                        <span class="material-icons" style="font-size: 18px;">edit</span>
                    </button>
                </div>
                <div class="detail-grid">
                    <div class="detail-item"><label>Dimensions</label><p>${wound.length || '-'} x ${wound.width || '-'} x ${wound.depth || '-'} cm</p></div>
                    <div class="detail-item"><label>Exsudat</label><p>${translateExudate(wound.exudate)}</p></div>
                </div>
                <div style="margin-top: 8px; font-size: 12px; color: var(--color-text-secondary);">
                    <strong>Lit:</strong> N:${wound.bedNecrosis || 0}% F:${wound.bedSlough || 0}% G:${wound.bedGranulation || 0}% E:${wound.bedEpithel || 0}%
                </div>
                ${wound.protocol ? `
                <div style="margin-top: 12px;">
                    <label style="font-size: 12px; color: var(--color-text-secondary);">Protocole</label>
                    <p style="font-size: 14px; margin-top: 4px;">${wound.protocol}</p>
                </div>
                ` : ''}
            `;

            // Add edit listener
            const btnEdit = card.querySelector('.btn-edit-wound');
            btnEdit.addEventListener('click', () => openEditWoundAssessmentSidebar(wound));

            list.appendChild(card);
        });

    } catch (error) {
        console.error('Error loading wounds:', error);
        list.innerHTML = '<div class="empty-state-small"><p>Erreur de chargement</p></div>';
    }
}

function translateExudate(val) {
    const map = { 'none': 'Absence', 'scant': 'Faible', 'moderate': 'Modéré', 'heavy': 'Abondant' };
    return map[val] || val;
}

// ===========================
// Activities Functions
// ===========================
async function addActivity(activityData) {
    try {
        const userId = appState.currentUser ? appState.currentUser.id : null;
        if (!userId) {
            alert("Erreur: Vous devez être connecté pour effectuer cette action.");
            return;
        }
        const activity = await FirebaseService.addActivity(activityData, userId);
        return activity;
    } catch (error) {
        console.error('Error adding activity:', error);
        alert('Erreur lors de l\'ajout de l\'activity');
        throw error;
    }
}

// ===========================
// Stats Functions
// ===========================
function updateStats() {
    const statElements = document.querySelectorAll('#statTotalPatients');
    statElements.forEach(el => {
        if (el) el.textContent = appState.patients.length;
    });

    // Count today's activities
    const today = new Date().toISOString().split('T')[0];
    const todayActivities = appState.activities.filter(a => a.date === today);
    const statTodayElements = document.querySelectorAll('#statTodayAppointments');
    statTodayElements.forEach(el => {
        if (el) el.textContent = todayActivities.length;
    });

    const statActiveElements = document.querySelectorAll('#statActiveFollowups');
    statActiveElements.forEach(el => {
        if (el) el.textContent = appState.activities.length;
    });

    // Count this week's activities
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const thisWeekActivities = appState.activities.filter(a => {
        const activityDate = new Date(a.date);
        return activityDate >= weekStart && activityDate <= weekEnd;
    });

    const statWeekElements = document.querySelectorAll('#statThisWeek');
    statWeekElements.forEach(el => {
        if (el) el.textContent = thisWeekActivities.length;
    });
}

// ===========================
// Modal Functions
// ===========================
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Modal close buttons
document.querySelectorAll('.modal-close, .btn-secondary[data-modal]').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const modalId = btn.dataset.modal || btn.closest('.modal').id;
        closeModal(modalId);
    });
});

// Close modal on outside click
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            // Don't close login modal by clicking outside
            if (modal.id !== 'modalLogin') {
                closeModal(modal.id);
            }
        }
    });
});

// New patient buttons
[elements.btnNewPatient, elements.btnNewPatientAlt].forEach(btn => {
    if (btn) {
        btn.addEventListener('click', () => {
            openNewPatientModal();
        });
    }
});

// New activity button
if (elements.btnAddActivity) {
    elements.btnAddActivity.addEventListener('click', () => {
        openActivityModal();
    });
}

// Day panel close button
if (elements.btnCloseDayPanel) {
    elements.btnCloseDayPanel.addEventListener('click', closeDayPanel);
}

// Day panel overlay close
if (elements.dayPanelOverlay) {
    elements.dayPanelOverlay.addEventListener('click', closeDayPanel);
}

// Day panel add activity button
if (elements.btnDayPanelAdd) {
    elements.btnDayPanelAdd.addEventListener('click', () => {
        if (appState.selectedDayDate) {
            const date = new Date(appState.selectedDayDate + 'T00:00:00');
            openActivityModal(date);
        } else {
            openActivityModal();
        }
    });
}

// Edit activity button in details modal
if (elements.btnEditActivity) {
    elements.btnEditActivity.addEventListener('click', () => {
        if (appState.currentActivityId) {
            openEditActivityModal(appState.currentActivityId);
        }
    });
}

// Delete activity button in details modal
if (elements.btnDeleteActivity) {
    elements.btnDeleteActivity.addEventListener('click', () => {
        if (appState.currentActivityId) {
            deleteActivityAction(appState.currentActivityId);
        }
    });
}

// Handle patient selection in activity form
if (elements.activityPatient) {
    elements.activityPatient.addEventListener('change', (e) => {
        if (e.target.value === 'new') {
            closeNewActivitySidebar();
            openNewPatientModal();
        }
    });
}

// Patient creation/edit functions
function openNewPatientModal() {
    if (elements.editPatientId) elements.editPatientId.value = '';
    if (elements.modalPatientTitle) elements.modalPatientTitle.textContent = 'Nouveau patient';
    if (elements.btnSubmitPatient) elements.btnSubmitPatient.textContent = 'Créer le patient';
    if (elements.formNewPatient) elements.formNewPatient.reset();
    openModal('modalNewPatient');
}

function openEditPatientModal(patientId) {
    const patient = appState.patients.find(p => p.id === patientId);
    if (!patient) return;

    if (elements.editPatientId) elements.editPatientId.value = patientId;
    if (elements.modalPatientTitle) elements.modalPatientTitle.textContent = 'Modifier le patient';
    if (elements.btnSubmitPatient) elements.btnSubmitPatient.textContent = 'Enregistrer les modifications';

    // Pre-fill form
    document.getElementById('patientName').value = patient.name || '';
    document.getElementById('patientAge').value = patient.age || '';
    document.getElementById('patientGender').value = patient.gender || '';
    document.getElementById('patientContact').value = patient.contact || '';
    document.getElementById('patientMedicalHistory').value = patient.medicalHistory || '';
    document.getElementById('patientBloodSample').value = patient.bloodSample || '';
    document.getElementById('patientImagery').value = patient.imagery || '';
    document.getElementById('patientComorbidities').value = patient.comorbidities || '';

    openModal('modalNewPatient');
}

// Form submissions
if (elements.formNewPatient) {
    elements.formNewPatient.addEventListener('submit', async (e) => {
        e.preventDefault();

        const editId = elements.editPatientId ? elements.editPatientId.value : '';

        const patientData = {
            name: document.getElementById('patientName').value || '',
            age: parseInt(document.getElementById('patientAge').value) || 0,
            gender: document.getElementById('patientGender').value || '',
            contact: document.getElementById('patientContact').value || '',
            medicalHistory: document.getElementById('patientMedicalHistory').value || '',
            bloodSample: document.getElementById('patientBloodSample').value || '',
            imagery: document.getElementById('patientImagery').value || '',
            comorbidities: document.getElementById('patientComorbidities').value || ''
        };

        try {
            if (editId) {
                await FirebaseService.updatePatient(editId, patientData);
                showToast('Informations du patient mises à jour');
                // If we're on the patient detail view, refresh it
                if (appState.currentPatientId === editId) {
                    openPatientDetails(editId);
                }
            } else {
                await addPatient(patientData);
                showToast('Nouveau patient créé');
            }
            closeModal('modalNewPatient');
            elements.formNewPatient.reset();
        } catch (error) {
            // Error already handled
            console.error('Error saving patient:', error);
        }
    });
}

if (elements.formNewActivity) {
    elements.formNewActivity.addEventListener('submit', async (e) => {
        e.preventDefault();

        const patientId = elements.activityPatient.value;
        const patient = appState.patients.find(p => p.id == patientId);

        if (!patient) {
            alert('Veuillez sélectionner un patient');
            return;
        }

        const activityData = {
            patientId: patient.id,
            patientName: patient.name,
            date: elements.activityDate.value,
            time: elements.activityTime.value,
            type: elements.activityType.value,
            treatment: elements.activityTreatment.value,
            notes: elements.activityNotes.value,
            reminder: elements.activityReminder ? elements.activityReminder.value : 'none'
        };

        try {
            await addActivity(activityData);
            closeNewActivitySidebar();
            elements.formNewActivity.reset();
        } catch (error) {
            // Error already handled in addActivity
        }
    });
}

// Edit activity form submission
if (elements.formEditActivity) {
    elements.formEditActivity.addEventListener('submit', async (e) => {
        e.preventDefault();

        const activityId = elements.editActivityId.value;
        const patientId = elements.editActivityPatient.value;
        const patient = appState.patients.find(p => p.id === patientId);

        if (!patient) {
            alert('Veuillez sélectionner un patient');
            return;
        }

        const activityData = {
            patientId: patient.id,
            patientName: patient.name,
            date: elements.editActivityDate.value,
            time: elements.editActivityTime.value,
            type: elements.editActivityType.value,
            treatment: elements.editActivityTreatment.value,
            notes: elements.editActivityNotes.value,
            reminder: elements.editActivityReminder.value
        };

        try {
            await FirebaseService.updateActivity(activityId, activityData);
            closeEditActivitySidebar();
            showToast('Activité modifiée avec succès');

            // Refresh day panel if open
            if (appState.selectedDayDate) {
                renderDayTimeline(appState.selectedDayDate);
            }
        } catch (error) {
            console.error('Update activity error:', error);
            alert('Erreur lors de la modification de l\'activité');
        }
    });
}

// ===========================
// Initialize App
// ===========================
function initApp() {
    renderCalendar();
    updateStats();

    // Request notification permission
    requestNotificationPermission();

    // Schedule notifications for existing activities
    scheduleNotifications();

    // Auth state listener will handle data initialization
    checkSession();
    console.log('App initialized - waiting for authentication');
}

// Start the app when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
