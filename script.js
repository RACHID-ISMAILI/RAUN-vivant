// Main application JavaScript
class App {
    constructor() {
        this.currentCategory = 'spiritualite';
        this.currentCapsule = null;
        this.initializeApp();
    }

    initializeApp() {
        this.setupMatrixBackground();
        this.setupEventListeners();
        this.setupRotatingText();
        this.loadCapsules();
        this.updateNavigation();
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
                drop.style.color = `rgba(0, 255, 0, ${Math.random() * 0.5 + 0.3})`;
                drop.style.fontSize = Math.random() * 20 + 10 + 'px';
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
        }, 100);

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

    setupRotatingText() {
        const textSpan = document.querySelector('.text-circle span');
        if (textSpan) {
            const text = textSpan.textContent;
            textSpan.innerHTML = '';
            
            for (let i = 0; i < text.length; i++) {
                const char = document.createElement('span');
                char.textContent = text[i];
                char.style.position = 'absolute';
                char.style.transformOrigin = '0 150px';
                char.style.transform = `rotate(${(360 / text.length) * i}deg)`;
                textSpan.appendChild(char);
            }
        }
    }

    setupEventListeners() {
        // Navigation buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                this.switchCategory(category);
            });
        });

        // Modal close buttons
        document.getElementById('close-modal')?.addEventListener('click', () => {
            this.closeModal('capsule-modal');
        });

        document.getElementById('close-intention-modal')?.addEventListener('click', () => {
            this.closeModal('intention-modal');
        });

        // Modal background clicks
        document.getElementById('capsule-modal')?.addEventListener('click', (e) => {
            if (e.target.id === 'capsule-modal') {
                this.closeModal('capsule-modal');
            }
        });

        document.getElementById('intention-modal')?.addEventListener('click', (e) => {
            if (e.target.id === 'intention-modal') {
                this.closeModal('intention-modal');
            }
        });

        // Action buttons
        document.getElementById('like-btn')?.addEventListener('click', () => {
            this.toggleLike();
        });

        document.getElementById('comment-btn')?.addEventListener('click', () => {
            document.querySelector('.comments-section')?.scrollIntoView({ behavior: 'smooth' });
        });

        document.getElementById('submit-comment')?.addEventListener('click', () => {
            this.submitComment();
        });

        // Intention button
        document.getElementById('add-intention-btn')?.addEventListener('click', () => {
            this.openModal('intention-modal');
        });

        document.getElementById('submit-intention')?.addEventListener('click', () => {
            this.submitIntention();
        });

        // Enter key support for textareas
        document.getElementById('comment-input')?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.submitComment();
            }
        });

        document.getElementById('intention-input')?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.submitIntention();
            }
        });
    }

    switchCategory(category) {
        this.currentCategory = category;
        this.updateNavigation();
        
        if (category === 'intentions') {
            this.showIntentions();
        } else {
            this.loadCapsules();
        }
    }

    updateNavigation() {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === this.currentCategory);
        });
    }

    loadCapsules() {
        const container = document.getElementById('capsules-container');
        const intentionsContainer = document.getElementById('intentions-container');
        
        container.classList.remove('hidden');
        intentionsContainer.classList.add('hidden');

        const capsules = window.dataStorage.getCapsulesByCategory(this.currentCategory);
        
        container.innerHTML = '';
        
        if (capsules.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; color: #888; padding: 2rem;">
                    <p>Aucune capsule disponible dans cette catégorie pour le moment.</p>
                    <p>De nouveaux contenus spirituels seront ajoutés prochainement.</p>
                </div>
            `;
            return;
        }

        capsules.forEach(capsule => {
            const card = this.createCapsuleCard(capsule);
            container.appendChild(card);
        });
    }

    createCapsuleCard(capsule) {
        const card = document.createElement('div');
        card.className = 'capsule-card';
        card.addEventListener('click', () => this.openCapsule(capsule.id));

        const categoryIcons = {
            spiritualite: '✨',
            sciences: '🧬',
            humanite: '🌍'
        };

        const preview = capsule.content.substring(0, 150) + (capsule.content.length > 150 ? '...' : '');

        card.innerHTML = `
            <div class="capsule-header">
                <div>
                    <h3 class="capsule-title">${this.escapeHtml(capsule.title)}</h3>
                    <span class="category-badge">${categoryIcons[capsule.category]} ${this.getCategoryName(capsule.category)}</span>
                </div>
            </div>
            <p class="capsule-preview">${this.escapeHtml(preview)}</p>
            <div class="capsule-stats">
                <span>👁️ ${capsule.views || 0} vues</span>
                <span>❤️ ${capsule.likes || 0} likes</span>
            </div>
        `;

        return card;
    }

    getCategoryName(category) {
        const names = {
            spiritualite: 'Spiritualité',
            sciences: 'Sciences',
            humanite: 'Humanité'
        };
        return names[category] || category;
    }

    openCapsule(id) {
        const capsule = window.dataStorage.getCapsule(id);
        if (!capsule) return;

        this.currentCapsule = capsule;
        
        // Update modal content
        document.getElementById('modal-title').textContent = capsule.title;
        document.getElementById('modal-category').textContent = `${this.getCategoryIcon(capsule.category)} ${this.getCategoryName(capsule.category)}`;
        document.getElementById('modal-stats').textContent = `👁️ ${capsule.views} vues • ❤️ ${capsule.likes} likes`;
        document.getElementById('modal-content').textContent = capsule.content;
        
        // Update like button
        this.updateLikeButton();
        
        // Load comments
        this.loadComments(id);
        
        // Clear comment form
        document.getElementById('author-input').value = '';
        document.getElementById('comment-input').value = '';
        
        this.openModal('capsule-modal');
    }

    getCategoryIcon(category) {
        const icons = {
            spiritualite: '✨',
            sciences: '🧬',
            humanite: '🌍'
        };
        return icons[category] || '📝';
    }

    updateLikeButton() {
        if (!this.currentCapsule) return;
        
        const likeBtn = document.getElementById('like-btn');
        const likeCount = document.getElementById('like-count');
        const userLikes = window.dataStorage.getUserLikes();
        const isLiked = userLikes.includes(this.currentCapsule.id);
        
        likeBtn.classList.toggle('liked', isLiked);
        likeBtn.querySelector('.heart').textContent = isLiked ? '♥' : '♡';
        likeCount.textContent = this.currentCapsule.likes || 0;
    }

    toggleLike() {
        if (!this.currentCapsule) return;
        
        const result = window.dataStorage.toggleLike(this.currentCapsule.id);
        this.currentCapsule.likes = result.newCount;
        
        this.updateLikeButton();
        
        // Update the card in the background
        this.loadCapsules();
    }

    loadComments(capsuleId) {
        const comments = window.dataStorage.getCommentsByCapsule(capsuleId);
        const commentsList = document.getElementById('comments-list');
        const commentCount = document.getElementById('comment-count');
        
        commentCount.textContent = comments.length;
        
        if (comments.length === 0) {
            commentsList.innerHTML = '<p style="color: #888; text-align: center; padding: 1rem;">Aucun commentaire pour le moment. Soyez le premier à partager votre réflexion!</p>';
            return;
        }
        
        commentsList.innerHTML = '';
        comments.forEach(comment => {
            const commentEl = this.createCommentElement(comment);
            commentsList.appendChild(commentEl);
        });
    }

    createCommentElement(comment) {
        const commentEl = document.createElement('div');
        commentEl.className = 'comment';
        
        const date = new Date(comment.createdAt).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        
        commentEl.innerHTML = `
            <div class="comment-author">${this.escapeHtml(comment.author)}</div>
            <div class="comment-text">${this.escapeHtml(comment.text)}</div>
            <div class="comment-date">${date}</div>
        `;
        
        return commentEl;
    }

    submitComment() {
        if (!this.currentCapsule) return;
        
        const authorInput = document.getElementById('author-input');
        const commentInput = document.getElementById('comment-input');
        const submitBtn = document.getElementById('submit-comment');
        
        const author = authorInput.value.trim() || 'Visiteur Spirituel';
        const text = commentInput.value.trim();
        
        if (!text) {
            alert('Veuillez écrire un commentaire.');
            return;
        }
        
        if (text.length > 500) {
            alert('Le commentaire ne peut pas dépasser 500 caractères.');
            return;
        }
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Publication...';
        
        setTimeout(() => {
            const comment = window.dataStorage.addComment({
                capsuleId: this.currentCapsule.id,
                author: author,
                text: text
            });
            
            if (comment) {
                authorInput.value = '';
                commentInput.value = '';
                this.loadComments(this.currentCapsule.id);
                
                // Show success feedback
                this.showNotification('Commentaire publié avec succès!', 'success');
            }
            
            submitBtn.disabled = false;
            submitBtn.textContent = 'Publier';
        }, 500);
    }

    showIntentions() {
        const container = document.getElementById('capsules-container');
        const intentionsContainer = document.getElementById('intentions-container');
        
        container.classList.add('hidden');
        intentionsContainer.classList.remove('hidden');
        
        this.loadIntentionsList();
    }

    loadIntentionsList() {
        const intentions = window.dataStorage.getIntentions();
        const intentionsList = document.querySelector('.intentions-list');
        
        intentionsList.innerHTML = '';
        
        if (intentions.length === 0) {
            intentionsList.innerHTML = `
                <div style="text-align: center; color: #888; padding: 2rem;">
                    <p>Aucune intention partagée pour le moment.</p>
                    <p>Soyez le premier à transmettre votre intention sacrée.</p>
                </div>
            `;
            return;
        }
        
        // Show most recent intentions first
        const sortedIntentions = intentions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        sortedIntentions.forEach(intention => {
            const card = this.createIntentionCard(intention);
            intentionsList.appendChild(card);
        });
    }

    createIntentionCard(intention) {
        const card = document.createElement('div');
        card.className = 'intention-card';
        
        const date = new Date(intention.createdAt).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        
        card.innerHTML = `
            <div class="intention-text">"${this.escapeHtml(intention.text)}"</div>
            <div class="intention-date">Transmise le ${date}</div>
        `;
        
        return card;
    }

    submitIntention() {
        const intentionInput = document.getElementById('intention-input');
        const submitBtn = document.getElementById('submit-intention');
        
        const text = intentionInput.value.trim();
        
        if (!text) {
            alert('Veuillez écrire votre intention.');
            return;
        }
        
        if (text.length > 300) {
            alert('L\'intention ne peut pas dépasser 300 caractères.');
            return;
        }
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Transmission...';
        
        setTimeout(() => {
            const intention = window.dataStorage.addIntention({ text: text });
            
            if (intention) {
                intentionInput.value = '';
                this.closeModal('intention-modal');
                
                // Refresh intentions if currently viewing them
                if (this.currentCategory === 'intentions') {
                    this.loadIntentionsList();
                }
                
                this.showNotification('Intention transmise avec gratitude!', 'success');
            }
            
            submitBtn.disabled = false;
            submitBtn.textContent = 'Transmettre l\'Intention';
        }, 1000);
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
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

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
});