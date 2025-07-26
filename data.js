// Data storage for the static version
class LocalStorage {
    constructor() {
        this.initializeData();
    }

    initializeData() {
        // Initialize capsules if not exists
        if (!localStorage.getItem('capsules')) {
            const defaultCapsules = [
                {
                    id: 1,
                    title: "Éveil de la Conscience",
                    content: "☀️ L'éveil commence par la reconnaissance de notre nature divine. Nous sommes des âmes incarnées, venues sur Terre pour expérimenter l'amour universel et transcender les illusions de l'ego.\n\n🌟 Cette prise de conscience nous libère des chaînes de la peur et nous ouvre à la véritable sagesse. Chaque moment présent devient une opportunité de choisir l'amour plutôt que la peur.\n\n✨ L'éveil n'est pas une destination, mais un voyage constant de retour à notre essence divine.",
                    category: "spiritualite",
                    views: 1250,
                    likes: 89,
                    createdAt: new Date('2024-01-15').toISOString()
                },
                {
                    id: 2,
                    title: "L'Unité dans la Diversité",
                    content: "🌍 Nous vivons dans un monde d'apparente séparation, mais la réalité profonde révèle notre interconnexion fondamentale. Chaque être humain est une facette unique du même diamant cosmique.\n\n💫 Reconnaître cette unité transforme notre perception de l'autre. L'étranger devient un miroir, le conflit devient une invitation à la compassion.\n\n🙏 Dans cette reconnaissance, naît la paix véritable - non pas l'absence de conflit, mais la présence de l'amour inconditionnel.",
                    category: "humanite",
                    views: 987,
                    likes: 67,
                    createdAt: new Date('2024-01-20').toISOString()
                },
                {
                    id: 3,
                    title: "La Science de l'Âme",
                    content: "🔬 La science moderne redécouvre ce que les sages ont toujours su : la conscience est le fondement de la réalité. Les particules quantiques réagissent à l'observation, révélant le rôle créateur de la conscience.\n\n🧬 Notre ADN lui-même porte l'empreinte de nos pensées et émotions. Chaque cellule de notre corps vibre en harmonie avec notre état de conscience.\n\n⚛️ Cette compréhension ouvre la voie à une nouvelle médecine, une science holistique qui honore l'unité corps-esprit-âme.",
                    category: "sciences",
                    views: 1456,
                    likes: 123,
                    createdAt: new Date('2024-01-25').toISOString()
                }
            ];
            localStorage.setItem('capsules', JSON.stringify(defaultCapsules));
        }

        // Initialize intentions if not exists
        if (!localStorage.getItem('intentions')) {
            const defaultIntentions = [
                {
                    id: 1,
                    text: "Que tous les êtres trouvent la paix intérieure et rayonnent l'amour dans ce monde.",
                    createdAt: new Date('2024-01-10').toISOString()
                },
                {
                    id: 2,
                    text: "J'offre ma gratitude pour chaque leçon reçue et demande la sagesse pour servir le plus grand bien.",
                    createdAt: new Date('2024-01-12').toISOString()
                }
            ];
            localStorage.setItem('intentions', JSON.stringify(defaultIntentions));
        }

        // Initialize comments if not exists
        if (!localStorage.getItem('comments')) {
            const defaultComments = [
                {
                    id: 1,
                    capsuleId: 1,
                    author: "Marie L.",
                    text: "Merci pour ce partage lumineux. Ces mots résonnent profondément en moi.",
                    createdAt: new Date('2024-01-16').toISOString()
                },
                {
                    id: 2,
                    capsuleId: 1,
                    author: "Pierre D.",
                    text: "Une belle invitation à l'introspection. J'ai hâte de mettre ces enseignements en pratique.",
                    createdAt: new Date('2024-01-17').toISOString()
                }
            ];
            localStorage.setItem('comments', JSON.stringify(defaultComments));
        }

        // Initialize user likes if not exists
        if (!localStorage.getItem('userLikes')) {
            localStorage.setItem('userLikes', JSON.stringify([]));
        }

        // Initialize admin credentials if not exists
        if (!localStorage.getItem('adminCredentials')) {
            const adminCreds = {
                username: 'rachid',
                password: 'eveil2024'
            };
            localStorage.setItem('adminCredentials', JSON.stringify(adminCreds));
        }

        // Initialize session
        if (!localStorage.getItem('sessionId')) {
            localStorage.setItem('sessionId', 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9));
        }
    }

    // Capsules methods
    getCapsules() {
        return JSON.parse(localStorage.getItem('capsules') || '[]');
    }

    getCapsulesByCategory(category) {
        const capsules = this.getCapsules();
        return capsules.filter(capsule => capsule.category === category);
    }

    getCapsule(id) {
        const capsules = this.getCapsules();
        const capsule = capsules.find(c => c.id === parseInt(id));
        if (capsule) {
            // Increment views
            capsule.views = (capsule.views || 0) + 1;
            this.updateCapsule(capsule);
        }
        return capsule;
    }

    addCapsule(capsuleData) {
        const capsules = this.getCapsules();
        const newId = Math.max(...capsules.map(c => c.id), 0) + 1;
        const newCapsule = {
            ...capsuleData,
            id: newId,
            views: 0,
            likes: 0,
            createdAt: new Date().toISOString()
        };
        capsules.push(newCapsule);
        localStorage.setItem('capsules', JSON.stringify(capsules));
        return newCapsule;
    }

    updateCapsule(updatedCapsule) {
        const capsules = this.getCapsules();
        const index = capsules.findIndex(c => c.id === updatedCapsule.id);
        if (index !== -1) {
            capsules[index] = { ...capsules[index], ...updatedCapsule };
            localStorage.setItem('capsules', JSON.stringify(capsules));
            return capsules[index];
        }
        return null;
    }

    deleteCapsule(id) {
        const capsules = this.getCapsules();
        const filtered = capsules.filter(c => c.id !== parseInt(id));
        localStorage.setItem('capsules', JSON.stringify(filtered));
        
        // Also delete related comments
        const comments = this.getComments();
        const filteredComments = comments.filter(c => c.capsuleId !== parseInt(id));
        localStorage.setItem('comments', JSON.stringify(filteredComments));
        
        return true;
    }

    // Comments methods
    getComments() {
        return JSON.parse(localStorage.getItem('comments') || '[]');
    }

    getCommentsByCapsule(capsuleId) {
        const comments = this.getComments();
        return comments.filter(comment => comment.capsuleId === parseInt(capsuleId));
    }

    addComment(commentData) {
        const comments = this.getComments();
        const newId = Math.max(...comments.map(c => c.id), 0) + 1;
        const newComment = {
            ...commentData,
            id: newId,
            createdAt: new Date().toISOString()
        };
        comments.push(newComment);
        localStorage.setItem('comments', JSON.stringify(comments));
        return newComment;
    }

    // Intentions methods
    getIntentions() {
        return JSON.parse(localStorage.getItem('intentions') || '[]');
    }

    addIntention(intentionData) {
        const intentions = this.getIntentions();
        const newId = Math.max(...intentions.map(i => i.id), 0) + 1;
        const newIntention = {
            ...intentionData,
            id: newId,
            createdAt: new Date().toISOString()
        };
        intentions.push(newIntention);
        localStorage.setItem('intentions', JSON.stringify(intentions));
        return newIntention;
    }

    // Likes methods
    getUserLikes() {
        return JSON.parse(localStorage.getItem('userLikes') || '[]');
    }

    toggleLike(capsuleId) {
        const userLikes = this.getUserLikes();
        const capsules = this.getCapsules();
        const capsule = capsules.find(c => c.id === parseInt(capsuleId));
        
        if (!capsule) return { liked: false, newCount: 0 };

        const isLiked = userLikes.includes(parseInt(capsuleId));
        
        if (isLiked) {
            // Unlike
            const newLikes = userLikes.filter(id => id !== parseInt(capsuleId));
            localStorage.setItem('userLikes', JSON.stringify(newLikes));
            capsule.likes = Math.max(0, (capsule.likes || 0) - 1);
        } else {
            // Like
            userLikes.push(parseInt(capsuleId));
            localStorage.setItem('userLikes', JSON.stringify(userLikes));
            capsule.likes = (capsule.likes || 0) + 1;
        }
        
        this.updateCapsule(capsule);
        
        return {
            liked: !isLiked,
            newCount: capsule.likes
        };
    }

    // Admin methods
    authenticateAdmin(username, password) {
        const adminCreds = JSON.parse(localStorage.getItem('adminCredentials') || '{}');
        return adminCreds.username === username && adminCreds.password === password;
    }

    // Statistics methods
    getStats() {
        const capsules = this.getCapsules();
        const intentions = this.getIntentions();
        
        return {
            totalCapsules: capsules.length,
            totalViews: capsules.reduce((sum, c) => sum + (c.views || 0), 0),
            totalLikes: capsules.reduce((sum, c) => sum + (c.likes || 0), 0),
            totalIntentions: intentions.length
        };
    }
}

// Global storage instance
window.dataStorage = new LocalStorage();