// Custom Notification System
window.notifications = {
    container: null,
    
    init() {
        // Create notification container if it doesn't exist
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'notifications-container';
            this.container.id = 'notifications-container';
            document.body.appendChild(this.container);
        }
    },
    
    show(message, type = 'info', duration = 4000) {
        this.init();
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        // Icon based on type
        const icons = {
            success: 'check-circle',
            error: 'alert-circle',
            warning: 'alert-triangle',
            info: 'info'
        };
        
        notification.innerHTML = `
            <div class="notification-icon">
                <i data-lucide="${icons[type] || 'info'}"></i>
            </div>
            <div class="notification-content">
                <p>${message}</p>
            </div>
            <button class="notification-close" onclick="notifications.remove(this.parentElement)">
                <i data-lucide="x"></i>
            </button>
        `;
        
        this.container.appendChild(notification);
        
        // Initialize Lucide icons
        if (window.lucide) {
            lucide.createIcons();
        }
        
        // Trigger animation
        setTimeout(() => {
            notification.classList.add('notification-show');
        }, 10);
        
        // Auto remove after duration
        if (duration > 0) {
            setTimeout(() => {
                this.remove(notification);
            }, duration);
        }
        
        return notification;
    },
    
    remove(notification) {
        if (!notification) return;
        
        notification.classList.remove('notification-show');
        notification.classList.add('notification-hide');
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.parentElement.removeChild(notification);
            }
        }, 300);
    },
    
    success(message, duration = 4000) {
        return this.show(message, 'success', duration);
    },
    
    error(message, duration = 5000) {
        return this.show(message, 'error', duration);
    },
    
    warning(message, duration = 4000) {
        return this.show(message, 'warning', duration);
    },
    
    info(message, duration = 4000) {
        return this.show(message, 'info', duration);
    },
    
    // Custom confirm dialog
    confirm(message, title = '¿Estás seguro?') {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.className = 'notification-modal';
            modal.innerHTML = `
                <div class="notification-modal-overlay"></div>
                <div class="notification-modal-content">
                    <div class="notification-modal-header">
                        <i data-lucide="alert-circle"></i>
                        <h3>${title}</h3>
                    </div>
                    <div class="notification-modal-body">
                        <p>${message}</p>
                    </div>
                    <div class="notification-modal-actions">
                        <button class="btn btn-secondary" data-action="cancel">
                            <i data-lucide="x"></i>
                            Cancelar
                        </button>
                        <button class="btn btn-primary" data-action="confirm">
                            <i data-lucide="check"></i>
                            Aceptar
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Initialize Lucide icons
            if (window.lucide) {
                lucide.createIcons();
            }
            
            // Trigger animation
            setTimeout(() => {
                modal.classList.add('notification-modal-show');
            }, 10);
            
            // Handle button clicks
            const handleClick = (confirmed) => {
                modal.classList.remove('notification-modal-show');
                modal.classList.add('notification-modal-hide');
                
                setTimeout(() => {
                    if (modal.parentElement) {
                        modal.parentElement.removeChild(modal);
                    }
                }, 300);
                
                resolve(confirmed);
            };
            
            modal.querySelector('[data-action="confirm"]').addEventListener('click', () => handleClick(true));
            modal.querySelector('[data-action="cancel"]').addEventListener('click', () => handleClick(false));
            modal.querySelector('.notification-modal-overlay').addEventListener('click', () => handleClick(false));
        });
    }
};

// Auto-initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.notifications.init();
    });
} else {
    window.notifications.init();
}
