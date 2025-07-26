// Admin panel JavaScript
class AdminPanel {
    constructor() {
        this.currentUser = null;
        this.editingCapsule = null;
        this.initializeAdmin();
    }

    initializeAdmin() {
        this.setupMatrixBackground();
        this.checkAuthStatus();
        this.setupEventListeners();
    }

    setupMatrixBackground() {
        const matrixBg = document.getElementById('matrix-bg');
        
        // Create matrix rain effect
        setInterval(() => {
            if (Math.random() < 0.1) {
                const char = String.fromCharCode(0x30A0 + Math.random() * 96);
                const drop = document.createElement('div');
                drop.textContent = char;
                drop.style.position = 'absolute';
                drop.style.left = Math.random() * 100 + '%';
                drop.style.top = '-20px';
                drop.style.color = `rgba(0, 255, 0, ${Math.random() * 0.3 + 0.2})`;
                drop.style.fontSize = Math.random() * 15 + 8 + 'px';
                drop.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;
                drop.style.pointerEvents = 'none';
                drop.style.userSelect = 'none';
                
                matrixBg.appendChild(drop);
                
                setTimeout(() => {
                    if (drop.parentNode) {
                        drop.parentNode.removeChild(drop);
                    }
                }, 5000);
            }
        }, 150);

        // Add CSS for falling animation
        if (!document.getElementById('matrix-styles')) {
            const style = document.createElement('style');
            style.id = 'matrix-styles';
            style.textContent = `
                @keyframes fall {
                    to {
                        transform: translateY(100vh);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    checkAuthStatus() {
        // Toujours forcer l'affichage du login au chargement de la page
        // pour plus de sécurité
        this.showLogin();
        
        // Effacer toute session précédente au chargement
        sessionStorage.removeItem('adminAuthenticated');
        sessionStorage.removeItem('loginAttempts');
        sessionStorage.removeItem('lockoutTime');
    }

    setupEventListeners() {
        // Login form
        document.getElementById('login-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Logout button
        document.getElementById('logout-btn')?.addEventListener('click', () => {
            this.handleLogout();
        });

        // New capsule button
        document.getElementById('new-capsule-btn')?.addEventListener('click', () => {
            this.openNewCapsuleModal();
        });

        // Modal close buttons
        document.getElementById('close-modal')?.addEventListener('click', () => {
            this.closeModal();
        });

        // Capsule form
        document.getElementById('capsule-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCapsule();
        });

        document.getElementById('cancel-capsule')?.addEventListener('click', () => {
            this.closeModal();
        });

        // Modal background click
        document.getElementById('capsule-modal')?.addEventListener('click', (e) => {
            if (e.target.id === 'capsule-modal') {
                this.closeModal();
            }
        });
    }

    handleLogin() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const errorEl = document.getElementById('login-error');
        const loginBtn = document.getElementById('login-btn');
        const loginText = loginBtn.querySelector('.login-text');
        const loginSpinner = loginBtn.querySelector('.login-spinner');

        // Vérifier le lockout
        if (this.isLockedOut()) {
            this.showError('Trop de tentatives échouées. Attendez avant de réessayer.');
            return;
        }

        if (!username || !password) {
            this.showError('Veuillez remplir tous les champs.');
            return;
        }

        // Afficher le spinner
        loginBtn.disabled = true;
        loginText.classList.add('hidden');
        loginSpinner.classList.remove('hidden');

        // Simulation d'une vérification sécurisée
        setTimeout(() => {
            if (window.dataStorage.authenticateAdmin(username, password)) {
                sessionStorage.setItem('adminAuthenticated', 'true');
                sessionStorage.setItem('adminUser', username);
                sessionStorage.removeItem('loginAttempts');
                this.currentUser = username;
                this.showDashboard();
                errorEl.classList.add('hidden');
            } else {
                this.incrementLoginAttempts();
                this.showError('Identifiants invalides. Accès refusé.');
            }

            // Restaurer le bouton
            loginBtn.disabled = false;
            loginText.classList.remove('hidden');
            loginSpinner.classList.add('hidden');
        }, 1500); // Délai pour simulation de vérification sécurisée
    }

    isLockedOut() {
        const attempts = parseInt(sessionStorage.getItem('loginAttempts') || '0');
        const lockoutTime = parseInt(sessionStorage.getItem('lockoutTime') || '0');
        
        if (attempts >= 3) {
            const now = Date.now();
            if (now - lockoutTime < 300000) { // 5 minutes de lockout
                return true;
            } else {
                // Réinitialiser après le lockout
                sessionStorage.removeItem('loginAttempts');
                sessionStorage.removeItem('lockoutTime');
                return false;
            }
        }
        return false;
    }

    incrementLoginAttempts() {
        const attempts = parseInt(sessionStorage.getItem('loginAttempts') || '0') + 1;
        sessionStorage.setItem('loginAttempts', attempts.toString());
        
        if (attempts >= 3) {
            sessionStorage.setItem('lockoutTime', Date.now().toString());
        }
    }

    showError(message) {
        const errorEl = document.getElementById('login-error');
        errorEl.textContent = message;
        errorEl.classList.remove('hidden');
    }

    handleLogout() {
        // Nettoyage complet de la session
        sessionStorage.clear();
        this.currentUser = null;
        
        // Effacer complètement le contenu du dashboard
        document.getElementById('admin-dashboard').innerHTML = '';
        
        // Effacer les champs du formulaire
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        document.getElementById('login-error').classList.add('hidden');
        
        // Nettoyer les timers
        if (this.logoutTimer) {
            clearTimeout(this.logoutTimer);
        }
        
        this.showLogin();
        
        // Notification de déconnexion
        this.showNotification('Déconnexion sécurisée effectuée', 'success');
    }

    showLogin() {
        document.getElementById('login-container').classList.remove('hidden');
        document.getElementById('admin-dashboard').classList.add('hidden');
        
        // Clear form
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        document.getElementById('login-error').classList.add('hidden');
    }

    showDashboard() {
        // Vérification supplémentaire de l'authentification
        if (sessionStorage.getItem('adminAuthenticated') !== 'true') {
            this.showLogin();
            return;
        }

        // Créer dynamiquement l'interface d'administration
        this.createDashboardHTML();
        
        document.getElementById('login-container').classList.add('hidden');
        document.getElementById('admin-dashboard').classList.remove('hidden');
        
        this.loadDashboardData();
        
        // Auto-déconnexion après inactivité (30 minutes)
        this.setupAutoLogout();
    }

    createDashboardHTML() {
        const dashboard = document.getElementById('admin-dashboard');
        dashboard.innerHTML = `
            <header class="admin-header">
                <div class="header-left">
                    <a href="index.html" class="back-btn">← Retour</a>
                    <h1>⚙️ Administration RAUN-RACHID</h1>
                </div>
                <div class="header-right">
                    <button id="new-capsule-btn" class="new-capsule-btn">+ Nouvelle Capsule</button>
                    <button id="logout-btn" class="logout-btn">Déconnexion</button>
                </div>
            </header>

            <main class="admin-main">
                <div class="stats-grid">
                    <div class="stat-card">
                        <h3>Capsules</h3>
                        <span id="total-capsules" class="stat-number">0</span>
                    </div>
                    <div class="stat-card">
                        <h3>Vues totales</h3>
                        <span id="total-views" class="stat-number">0</span>
                    </div>
                    <div class="stat-card">
                        <h3>Likes totaux</h3>
                        <span id="total-likes" class="stat-number">0</span>
                    </div>
                    <div class="stat-card">
                        <h3>Intentions</h3>
                        <span id="total-intentions" class="stat-number">0</span>
                    </div>
                </div>

                <div class="content-section">
                    <h2>Capsules existantes (<span id="capsules-count">0</span>)</h2>
                    <div id="capsules-list" class="capsules-list">
                        <!-- Capsules will be loaded here -->
                    </div>
                </div>

                <div class="content-section">
                    <h2>Intentions récentes</h2>
                    <div id="intentions-list" class="intentions-list">
                        <!-- Intentions will be loaded here -->
                    </div>
                </div>
            </main>
        `;
        
        // Re-attacher les événements après création du DOM
        this.reattachDashboardEvents();
    }

    reattachDashboardEvents() {
        // Logout button
        document.getElementById('logout-btn')?.addEventListener('click', () => {
            this.handleLogout();
        });

        // New capsule button
        document.getElementById('new-capsule-btn')?.addEventListener('click', () => {
            this.openNewCapsuleModal();
        });
    }

    setupAutoLogout() {
        const timeout = 30 * 60 * 1000; // 30 minutes
        
        if (this.logoutTimer) {
            clearTimeout(this.logoutTimer);
        }
        
        this.logoutTimer = setTimeout(() => {
            this.showNotification('Session expirée pour des raisons de sécurité', 'info');
            setTimeout(() => {
                this.handleLogout();
            }, 2000);
        }, timeout);
        
        // Réinitialiser le timer sur activité
        document.addEventListener('click', () => this.setupAutoLogout());
        document.addEventListener('keypress', () => this.setupAutoLogout());
    }

    loadDashboardData() {
        this.updateStats();
        this.loadCapsulesList();
        this.loadIntentionsList();
    }

    updateStats() {
        const stats = window.dataStorage.getStats();
        
        document.getElementById('total-capsules').textContent = stats.totalCapsules;
        document.getElementById('total-views').textContent = stats.totalViews;
        document.getElementById('total-likes').textContent = stats.totalLikes;
        document.getElementById('total-intentions').textContent = stats.totalIntentions;
    }

    loadCapsulesList() {
        const capsules = window.dataStorage.getCapsules();
        const container = document.getElementById('capsules-list');
        const countEl = document.getElementById('capsules-count');
        
        countEl.textContent = capsules.length;
        
        if (capsules.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; color: #888; padding: 2rem;">
                    <p>Aucune capsule créée pour le moment.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = '';
        
        // Sort by creation date (newest first)
        const sortedCapsules = capsules.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        sortedCapsules.forEach(capsule => {
            const item = this.createCapsuleItem(capsule);
            container.appendChild(item);
        });
    }

    createCapsuleItem(capsule) {
        const item = document.createElement('div');
        item.className = 'capsule-item';
        
        const categoryIcons = {
            spiritualite: '✨',
            sciences: '🧬',
            humanite: '🌍'
        };

        const categoryNames = {
            spiritualite: 'Spiritualité',
            sciences: 'Sciences',
            humanite: 'Humanité'
        };

        const date = new Date(capsule.createdAt).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        const preview = capsule.content.substring(0, 100) + (capsule.content.length > 100 ? '...' : '');

        item.innerHTML = `
            <div class="capsule-item-header">
                <div>
                    <h3 class="capsule-item-title">${this.escapeHtml(capsule.title)}</h3>
                    <div class="capsule-item-meta">
                        <span>${categoryIcons[capsule.category]} ${categoryNames[capsule.category]}</span>
                        <span>👁️ ${capsule.views || 0} vues</span>
                        <span>❤️ ${capsule.likes || 0} likes</span>
                        <span>📅 ${date}</span>
                    </div>
                </div>
                <div class="capsule-item-actions">
                    <button class="edit-btn" onclick="adminPanel.editCapsule(${capsule.id})" title="Modifier">
                        ✏️
                    </button>
                    <button class="delete-btn" onclick="adminPanel.deleteCapsule(${capsule.id})" title="Supprimer">
                        🗑️
                    </button>
                </div>
            </div>
            <div class="capsule-item-content">${this.escapeHtml(preview)}</div>
        `;

        return item;
    }

    loadIntentionsList() {
        const intentions = window.dataStorage.getIntentions();
        const container = document.getElementById('intentions-list');
        
        if (intentions.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; color: #888; padding: 1rem;">
                    <p>Aucune intention partagée pour le moment.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = '';
        
        // Show last 10 intentions
        const recentIntentions = intentions
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 10);
        
        recentIntentions.forEach(intention => {
            const item = this.createIntentionItem(intention);
            container.appendChild(item);
        });
    }

    createIntentionItem(intention) {
        const item = document.createElement('div');
        item.className = 'intention-item';
        
        const date = new Date(intention.createdAt).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        item.innerHTML = `
            <div class="intention-item-text">"${this.escapeHtml(intention.text)}"</div>
            <div class="intention-item-date">Transmise le ${date}</div>
        `;

        return item;
    }

    openNewCapsuleModal() {
        this.editingCapsule = null;
        
        document.getElementById('modal-title').textContent = 'Nouvelle Capsule';
        document.getElementById('capsule-title').value = '';
        document.getElementById('capsule-category').value = 'spiritualite';
        document.getElementById('capsule-content').value = '';
        
        this.openModal();
    }

    editCapsule(id) {
        const capsule = window.dataStorage.getCapsules().find(c => c.id === id);
        if (!capsule) return;

        this.editingCapsule = capsule;
        
        document.getElementById('modal-title').textContent = 'Modifier la Capsule';
        document.getElementById('capsule-title').value = capsule.title;
        document.getElementById('capsule-category').value = capsule.category;
        document.getElementById('capsule-content').value = capsule.content;
        
        this.openModal();
    }

    deleteCapsule(id) {
        const capsule = window.dataStorage.getCapsules().find(c => c.id === id);
        if (!capsule) return;

        const confirmed = confirm(`Êtes-vous sûr de vouloir supprimer la capsule "${capsule.title}" ?\n\nCette action est irréversible.`);
        
        if (confirmed) {
            window.dataStorage.deleteCapsule(id);
            this.loadDashboardData();
            this.showNotification('Capsule supprimée avec succès', 'success');
        }
    }

    saveCapsule() {
        const title = document.getElementById('capsule-title').value.trim();
        const category = document.getElementById('capsule-category').value;
        const content = document.getElementById('capsule-content').value.trim();
        const saveBtn = document.getElementById('save-capsule');

        if (!title || !content) {
            alert('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        if (title.length > 100) {
            alert('Le titre ne peut pas dépasser 100 caractères.');
            return;
        }

        if (content.length > 2000) {
            alert('Le contenu ne peut pas dépasser 2000 caractères.');
            return;
        }

        saveBtn.disabled = true;
        saveBtn.textContent = 'Sauvegarde...';

        setTimeout(() => {
            try {
                if (this.editingCapsule) {
                    // Update existing capsule
                    const updatedCapsule = {
                        ...this.editingCapsule,
                        title,
                        category,
                        content,
                        updatedAt: new Date().toISOString()
                    };
                    window.dataStorage.updateCapsule(updatedCapsule);
                    this.showNotification('Capsule mise à jour avec succès', 'success');
                } else {
                    // Create new capsule
                    const newCapsule = window.dataStorage.addCapsule({
                        title,
                        category,
                        content
                    });
                    this.showNotification('Nouvelle capsule créée avec succès', 'success');
                }

                this.closeModal();
                this.loadDashboardData();
            } catch (error) {
                alert('Erreur lors de la sauvegarde. Veuillez réessayer.');
                console.error('Save error:', error);
            }

            saveBtn.disabled = false;
            saveBtn.textContent = 'Sauvegarder';
        }, 500);
    }

    openModal() {
        const modal = document.getElementById('capsule-modal');
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal() {
        const modal = document.getElementById('capsule-modal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
        this.editingCapsule = null;
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'rgba(0, 255, 0, 0.9)' : 'rgba(0, 100, 255, 0.9)'};
            color: #000;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            font-weight: 600;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Global admin panel instance
let adminPanel;

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    adminPanel = new AdminPanel();
});