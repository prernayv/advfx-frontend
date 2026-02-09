// ===== API CONFIG (PRODUCTION) =====
window.API_BASE = "https://advfx-backend-1.onrender.com";



/*==================== SHOW MENU ====================*/
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close')

/*===== MENU SHOW =====*/
/* Validate if constant exists */
if(navToggle){
    navToggle.addEventListener('click', () =>{
        navMenu.classList.add('show-menu')
    })
}

/*===== MENU HIDDEN =====*/
/* Validate if constant exists */
if(navClose){
    navClose.addEventListener('click', () =>{
        navMenu.classList.remove('show-menu')
    })
}

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction(){
    const navMenu = document.getElementById('nav-menu')
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*==================== CHANGE BACKGROUND HEADER ====================*/
function scrollHeader(){
    const nav = document.getElementById('header')
    // When the scroll is greater than 80 viewport height, add the scroll-header class to the header tag
    if(this.scrollY >= 80) nav.classList.add('scroll-header'); else nav.classList.remove('scroll-header')
}
window.addEventListener('scroll', scrollHeader)

/*==================== SHOW SCROLL UP ====================*/
function scrollUp(){
    const scrollUp = document.getElementById('scroll-up');
    // When the scroll is higher than 560 viewport height, add the show-scroll class to the a tag with the scroll-top class
    if(this.scrollY >= 560) scrollUp.classList.add('show-scroll'); else scrollUp.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp)

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]')

function scrollActive(){
    const scrollY = window.pageYOffset

    sections.forEach(current =>{
        const sectionHeight = current.offsetHeight
        const sectionTop = current.offsetTop - 50;
        sectionId = current.getAttribute('id')

        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active-link')
        }else{
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active-link')
        }
    })
}
window.addEventListener('scroll', scrollActive)

/*==================== SMOOTH SCROLLING ====================*/
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/*==================== SCROLL REVEAL ANIMATION ====================*/
// Initialize only if library is available
let sr;
if (typeof window !== 'undefined' && typeof window.ScrollReveal !== 'undefined') {
  sr = window.ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2000,
    delay: 200,
    reset: true
  });
  sr.reveal('.hero__content', {});
  sr.reveal('.section__title, .section__subtitle', {});
  sr.reveal('.category__card', { interval: 100 });
  sr.reveal('.course__card', { interval: 100 });
  sr.reveal('.about__content', { origin: 'left' });
  sr.reveal('.footer__content', { origin: 'bottom' });
}

/*==================== ENHANCED INTERACTIONS ====================*/
// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Enhanced button hover effects
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px) scale(1.05)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Card hover effects with enhanced animations
document.querySelectorAll('.category__card, .course__card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Newsletter form handling
const newsletterForm = document.querySelector('.newsletter__form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('.newsletter__input').value;
        
        if (email) {
            // Simulate form submission
            const button = this.querySelector('.btn');
            const originalText = button.textContent;
            
            button.textContent = 'Subscribing...';
            button.disabled = true;
            
            setTimeout(() => {
                button.textContent = 'Subscribed!';
                button.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.disabled = false;
                    button.style.background = '';
                    this.querySelector('.newsletter__input').value = '';
                }, 2000);
            }, 1500);
        }
    });
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const rate = scrolled * -0.5;
    
    if (hero) {
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Dynamic typing effect for hero title (optional enhancement)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect on load
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero__title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        // Uncomment the line below to enable typing effect
        // typeWriter(heroTitle, originalText, 50);
    }
});

// Add intersection observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.category__card, .course__card, .stat__item').forEach(el => {
    observer.observe(el);
});

// Add CSS classes for animations
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: fadeInUp 0.6s ease-out forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .scroll-header {
        background: rgba(18, 18, 18, 0.98) !important;
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
    }
    
    .loaded {
        opacity: 1;
    }
    
    body {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
`;
document.head.appendChild(style);

// Enhanced mobile menu functionality
const mobileMenuLinks = document.querySelectorAll('.nav__link');
mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
        // Add active state
        mobileMenuLinks.forEach(l => l.classList.remove('active-link'));
        link.classList.add('active-link');
        
        // Close mobile menu
        navMenu.classList.remove('show-menu');
    });
});

// ===== Scroll progress indicator =====
// Add scroll progress indicator
const scrollProgress = document.createElement('div');
scrollProgress.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, #0ABAB5, #8A2BE2);
    z-index: 9999;
    transition: width 0.1s ease;
`;
document.body.appendChild(scrollProgress);

window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = (scrollTop / scrollHeight) * 100;
    scrollProgress.style.width = scrollPercent + '%';
});

// Add loading spinner (optional)
function showLoader() {
    const loader = document.createElement('div');
    loader.id = 'loader';
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #121212;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        transition: opacity 0.5s ease;
    `;
    
    loader.innerHTML = `
        <div style="
            width: 50px;
            height: 50px;
            border: 3px solid #333;
            border-top: 3px solid #0ABAB5;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        "></div>
    `;
    
    const spinStyle = document.createElement('style');
    spinStyle.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(spinStyle);
    
    document.body.appendChild(loader);
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.remove();
            }, 500);
        }, 1000);
    });
}

// Initialize loader
// showLoader(); // Uncomment to enable loading spinner

console.log('Website loaded successfully! 🚀');

// ===== AUTO-OPEN ENQUIRY POPUP FROM URL PARAMETER =====
// Check if user was redirected from a course page with enquiry parameter
function checkForAutoEnquiry() {
    const urlParams = new URLSearchParams(window.location.search);
    const hash = window.location.hash;
    
    // Check for both URL parameter and hash methods
    if (urlParams.get('open') === 'enquiry' || hash === '#enquire') {
        // Small delay to ensure page is fully loaded
        setTimeout(() => {
            if (typeof openEnquiryPopup === 'function') {
                openEnquiryPopup();
                // Clean up URL without reloading page
                const cleanUrl = window.location.pathname;
                window.history.replaceState({}, document.title, cleanUrl);
            }
        }, 500);
    }
}

// Run check when page loads
window.addEventListener('load', checkForAutoEnquiry);
// Also run on DOM ready as backup
document.addEventListener('DOMContentLoaded', checkForAutoEnquiry);

// ... MODAL CONTACT FORM =====
(function () {
  // Remove modal contact form functionality since we're using direct navigation
})();

// ===== OFFLINE SUBMISSION HANDLING =====
(function() {
    const OFFLINE_STORAGE_KEY = 'advfx_offline_enquiries';
    const SYNC_CHECK_INTERVAL = 30000; // 30 seconds
    
    // Get API base URL
    function getApiBase() {
        return (
            (window.API_BASE) ||
            (window.env && window.env.API_BASE) ||
            new URLSearchParams(window.location.search).get('apiBase') ||
            'http://localhost:3000'
        );
    }
    
    // Submit enquiry to backend
    window.submitEnquiry = async function(apiData) {
        try {
            const response = await fetch(`${getApiBase()}/api/enquiry`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(apiData),
                timeout: 10000 // 10 second timeout
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('✅ Enquiry submitted to MongoDB Atlas:', result);
            return true;
        } catch (error) {
            console.log('❌ Backend submission failed:', error.message);
            throw error;
        }
    };
    
    // Save enquiry to offline storage
    window.saveOfflineEnquiry = function(enquiryData) {
        try {
            const offlineEnquiries = getOfflineEnquiries();
            const enquiryWithId = {
                ...enquiryData,
                offlineId: Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                savedAt: new Date().toISOString(),
                synced: false
            };
            
            offlineEnquiries.push(enquiryWithId);
            localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(offlineEnquiries));
            
            console.log('💾 Enquiry saved offline:', enquiryWithId.offlineId);
            
            // Show offline indicator
            showOfflineIndicator();
            
            return enquiryWithId.offlineId;
        } catch (error) {
            console.error('❌ Failed to save offline enquiry:', error);
            return null;
        }
    };
    
    // Get offline enquiries from storage
    function getOfflineEnquiries() {
        try {
            const stored = localStorage.getItem(OFFLINE_STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('❌ Failed to get offline enquiries:', error);
            return [];
        }
    }
    
    // Sync offline enquiries when connection is restored
    async function syncOfflineEnquiries() {
        const offlineEnquiries = getOfflineEnquiries();
        const unsyncedEnquiries = offlineEnquiries.filter(e => !e.synced);
        
        if (unsyncedEnquiries.length === 0) {
            return;
        }
        
        console.log(`🔄 Syncing ${unsyncedEnquiries.length} offline enquiries...`);
        
        let syncedCount = 0;
        const updatedEnquiries = [...offlineEnquiries];
        
        for (const enquiry of unsyncedEnquiries) {
            try {
                // Remove offline-specific fields before sending
                const { offlineId, savedAt, synced, ...apiData } = enquiry;
                
                await submitEnquiry(apiData);
                
                // Mark as synced
                const index = updatedEnquiries.findIndex(e => e.offlineId === enquiry.offlineId);
                if (index !== -1) {
                    updatedEnquiries[index].synced = true;
                    updatedEnquiries[index].syncedAt = new Date().toISOString();
                }
                
                syncedCount++;
                console.log(`✅ Synced offline enquiry: ${enquiry.offlineId}`);
                
            } catch (error) {
                console.log(`❌ Failed to sync enquiry ${enquiry.offlineId}:`, error.message);
                // Keep trying other enquiries
            }
        }
        
        // Update storage
        localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(updatedEnquiries));
        
        if (syncedCount > 0) {
            console.log(`✅ Successfully synced ${syncedCount} offline enquiries`);
            showSyncSuccessMessage(syncedCount);
            
            // Clean up old synced enquiries (keep for 24 hours)
            cleanupSyncedEnquiries();
        }
        
        // Hide offline indicator if all synced
        const remainingUnsynced = updatedEnquiries.filter(e => !e.synced);
        if (remainingUnsynced.length === 0) {
            hideOfflineIndicator();
        }
    }
    
    // Clean up old synced enquiries
    function cleanupSyncedEnquiries() {
        try {
            const offlineEnquiries = getOfflineEnquiries();
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            
            const filteredEnquiries = offlineEnquiries.filter(enquiry => {
                if (!enquiry.synced) return true; // Keep unsynced
                if (!enquiry.syncedAt) return false; // Remove old synced without timestamp
                return new Date(enquiry.syncedAt) > oneDayAgo; // Keep recent synced
            });
            
            if (filteredEnquiries.length !== offlineEnquiries.length) {
                localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(filteredEnquiries));
                console.log(`🧹 Cleaned up ${offlineEnquiries.length - filteredEnquiries.length} old synced enquiries`);
            }
        } catch (error) {
            console.error('❌ Failed to cleanup synced enquiries:', error);
        }
    }
    
    // Check if backend is online
    async function checkBackendStatus() {
        try {
            const response = await fetch(`${getApiBase()}/api/health`, {
                method: 'GET',
                timeout: 5000
            });
            return response.ok;
        } catch (error) {
            return false;
        }
    }
    
    // Show offline indicator
    function showOfflineIndicator() {
        let indicator = document.getElementById('offlineIndicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'offlineIndicator';
            indicator.innerHTML = `
                <div style="
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: linear-gradient(135deg, #ff9800, #f57c00);
                    color: white;
                    padding: 12px 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    z-index: 10000;
                    font-family: 'Poppins', sans-serif;
                    font-size: 14px;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    animation: slideInRight 0.3s ease;
                ">
                    <span style="
                        width: 8px;
                        height: 8px;
                        background: #fff;
                        border-radius: 50%;
                        animation: pulse 2s infinite;
                    "></span>
                    Offline enquiries pending sync
                </div>
            `;
            document.body.appendChild(indicator);
            
            // Add CSS animations
            if (!document.getElementById('offlineIndicatorStyles')) {
                const style = document.createElement('style');
                style.id = 'offlineIndicatorStyles';
                style.textContent = `
                    @keyframes slideInRight {
                        from { transform: translateX(100%); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                    @keyframes pulse {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.5; }
                    }
                `;
                document.head.appendChild(style);
            }
        }
    }
    
    // Hide offline indicator
    function hideOfflineIndicator() {
        const indicator = document.getElementById('offlineIndicator');
        if (indicator) {
            indicator.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => indicator.remove(), 300);
        }
    }
    
    // Show sync success message
    function showSyncSuccessMessage(count) {
        const message = document.createElement('div');
        message.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #4caf50, #388e3c);
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                z-index: 10001;
                font-family: 'Poppins', sans-serif;
                font-size: 14px;
                font-weight: 500;
                animation: slideInRight 0.3s ease;
            ">
                ✅ ${count} enquir${count === 1 ? 'y' : 'ies'} synced successfully!
            </div>
        `;
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => message.remove(), 300);
        }, 3000);
    }
    
    // Show offline message
    window.showOfflineMessage = function(message) {
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #ff9800, #f57c00);
                color: white;
                padding: 20px 30px;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                z-index: 10002;
                font-family: 'Poppins', sans-serif;
                font-size: 16px;
                font-weight: 500;
                text-align: center;
                max-width: 400px;
                animation: scaleIn 0.3s ease;
            ">
                <div style="margin-bottom: 10px; font-size: 24px;">📱</div>
                ${message}
                <div style="margin-top: 15px; font-size: 12px; opacity: 0.9;">
                    Your data is safe and will be submitted automatically when the server is back online.
                </div>
            </div>
        `;
        document.body.appendChild(notification);
        
        // Add scale animation
        if (!document.getElementById('scaleInStyles')) {
            const style = document.createElement('style');
            style.id = 'scaleInStyles';
            style.textContent = `
                @keyframes scaleIn {
                    from { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
                    to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            notification.style.animation = 'scaleIn 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    };
    
    // Auto-sync functionality
    function startAutoSync() {
        setInterval(async () => {
            const offlineEnquiries = getOfflineEnquiries();
            const unsyncedCount = offlineEnquiries.filter(e => !e.synced).length;
            
            if (unsyncedCount > 0) {
                const isOnline = await checkBackendStatus();
                if (isOnline) {
                    console.log('🌐 Backend is back online, syncing offline enquiries...');
                    await syncOfflineEnquiries();
                }
            }
        }, SYNC_CHECK_INTERVAL);
    }
    
    // Initialize offline handling
    function initOfflineHandling() {
        // Check for existing offline enquiries on page load
        const offlineEnquiries = getOfflineEnquiries();
        const unsyncedCount = offlineEnquiries.filter(e => !e.synced).length;
        
        if (unsyncedCount > 0) {
            console.log(`📱 Found ${unsyncedCount} offline enquiries pending sync`);
            showOfflineIndicator();
            
            // Try to sync immediately
            setTimeout(async () => {
                const isOnline = await checkBackendStatus();
                if (isOnline) {
                    await syncOfflineEnquiries();
                }
            }, 2000);
        }
        
        // Start auto-sync
        startAutoSync();
        
        // Listen for online/offline events
        window.addEventListener('online', async () => {
            console.log('🌐 Connection restored, checking for offline enquiries...');
            setTimeout(async () => {
                const isOnline = await checkBackendStatus();
                if (isOnline) {
                    await syncOfflineEnquiries();
                }
            }, 1000);
        });
        
        window.addEventListener('offline', () => {
            console.log('📱 Connection lost, offline mode activated');
        });
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initOfflineHandling);
    } else {
        initOfflineHandling();
    }
})();

// Success and Error Message Functions
function showSuccessMessage(message) {
    const toast = document.createElement('div');
    toast.className = 'toast toast-success';
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add toast styles if not already added
    if (!document.querySelector('#toast-styles')) {
        const toastStyles = document.createElement('style');
        toastStyles.id = 'toast-styles';
        toastStyles.textContent = `
            .toast {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                z-index: 10000;
                transform: translateX(400px);
                transition: transform 0.3s ease;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                max-width: 350px;
            }
            
            .toast-success {
                background: linear-gradient(135deg, #00ff88, #00cc6a);
            }
            
            .toast-error {
                background: linear-gradient(135deg, #ff6b6b, #ff5252);
            }
            
            .toast-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .toast-content i {
                font-size: 18px;
            }
            
            .toast.show {
                transform: translateX(0);
            }
            
            @media (max-width: 768px) {
                .toast {
                    right: 10px;
                    left: 10px;
                    max-width: none;
                    transform: translateY(-100px);
                }
                
                .toast.show {
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(toastStyles);
    }
    
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Remove toast after 4 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => document.body.removeChild(toast), 300);
    }, 4000);
}

function showErrorMessage(message) {
    const toast = document.createElement('div');
    toast.className = 'toast toast-error';
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Remove toast after 5 seconds (longer for error messages)
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => document.body.removeChild(toast), 300);
    }, 5000);
}

// ===== ENQUIRY POPUP FUNCTIONALITY =====
(function() {
    const enquiryPopup = document.getElementById('enquiryPopup');
    const enquiryOverlay = document.getElementById('enquiryPopupOverlay');
    const enquiryCloseBtn = document.getElementById('enquiryPopupClose');
    const enquiryForm = document.getElementById('enquiryForm');
    const body = document.body;

    // Open popup function - only for Enquire Now button
    window.openEnquiryPopup = function() {
        if (!enquiryPopup) return;
        enquiryOverlay.classList.add('active');
        enquiryPopup.classList.add('show');
        body.style.overflow = 'hidden';
        
        // Focus first input for accessibility
        const firstInput = enquiryForm.querySelector('input');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 300);
        }
    };

    // Close popup function
    window.closeEnquiryPopup = function() {
        if (!enquiryPopup) return;
        enquiryOverlay.classList.remove('active');
        enquiryPopup.classList.remove('show');
        body.style.overflow = '';
        
        // Clear form validation states
        clearFormValidation();
    };

    // Clear form validation states
    function clearFormValidation() {
        if (!enquiryForm) return;
        const formGroups = enquiryForm.querySelectorAll('.enquiry-form__group');
        formGroups.forEach(group => {
            group.classList.remove('invalid');
        });
    }

    // Form validation
    function validateField(field) {
        const formGroup = field.closest('.enquiry-form__group');
        const fieldType = field.type;
        const fieldValue = field.value.trim();
        let isValid = true;

        // Remove previous validation state
        formGroup.classList.remove('invalid');

        // Validation rules
        switch (fieldType) {
            case 'text':
                if (field.name === 'fullname') {
                    isValid = fieldValue.length >= 2 && /^[a-zA-Z\s]+$/.test(fieldValue);
                }
                break;
            case 'tel':
                isValid = /^[6-9]\d{9}$/.test(fieldValue.replace(/\s+/g, ''));
                break;
            case 'email':
                isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fieldValue);
                break;
            default:
                isValid = fieldValue !== '';
        }

        if (!isValid) {
            formGroup.classList.add('invalid');
        }

        return isValid;
    }

    // Validate entire form
    function validateForm() {
        if (!enquiryForm) return false;
        const fields = enquiryForm.querySelectorAll('input[required], select[required]');
        let isFormValid = true;

        fields.forEach(field => {
            const isFieldValid = validateField(field);
            if (!isFieldValid) {
                isFormValid = false;
            }
        });

        return isFormValid;
    }

    if (enquiryPopup) {
        // Event listeners for popup controls
        enquiryCloseBtn?.addEventListener('click', closeEnquiryPopup);
        enquiryOverlay?.addEventListener('click', closeEnquiryPopup);

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && enquiryPopup.classList.contains('show')) {
                closeEnquiryPopup();
            }
        });

        // Real-time validation on input/change
        if (enquiryForm) {
            const fields = enquiryForm.querySelectorAll('input, select');
            fields.forEach(field => {
                field.addEventListener('blur', () => validateField(field));
                field.addEventListener('input', () => {
                    if (field.closest('.enquiry-form__group').classList.contains('invalid')) {
                        validateField(field);
                    }
                });
            });

            // Form submission with offline support
            enquiryForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                if (!validateForm()) {
                    // Scroll to first invalid field
                    const firstInvalid = enquiryForm.querySelector('.enquiry-form__group.invalid');
                    if (firstInvalid) {
                        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    return;
                }

                // Get form data
                const formData = new FormData(enquiryForm);
                const enquiryData = Object.fromEntries(formData.entries());

                // Show loading state
                const submitBtn = enquiryForm.querySelector('.enquiry-submit-btn');
                const originalText = submitBtn.querySelector('.enquiry-submit-text').textContent;
                submitBtn.querySelector('.enquiry-submit-text').textContent = 'Submitting...';
                submitBtn.disabled = true;

                // Prepare data for backend API
                const apiData = {
                    name: enquiryData.fullname || enquiryData.name,
                    phone: enquiryData.mobile || enquiryData.phone,
                    email: enquiryData.email,
                    address: enquiryData.state || enquiryData.address || 'Not specified',
                    course: enquiryData.course || 'General Enquiry',
                    message: enquiryData.message || 'Enquiry from website',
                    submissionDate: new Date().toISOString(),
                    userAgent: navigator.userAgent,
                    ipAddress: 'client-side' // Will be set by backend
                };

                try {
                    // Try to submit to backend
                    const success = await submitEnquiry(apiData);
                    
                    if (success) {
                        // Success feedback
                        submitBtn.querySelector('.enquiry-submit-text').textContent = 'Submitted Successfully!';
                        submitBtn.style.background = 'linear-gradient(135deg, #00ff88, #00cc6a)';
                        
                        console.log('✅ Enquiry submitted successfully to MongoDB Atlas');
                        
                        // Reset form and close popup after delay
                        setTimeout(() => {
                            enquiryForm.reset();
                            closeEnquiryPopup();
                            
                            // Reset button state
                            submitBtn.querySelector('.enquiry-submit-text').textContent = originalText;
                            submitBtn.style.background = '';
                            submitBtn.disabled = false;
                            
                            // Show success message
                            showSuccessMessage('Thank you for your enquiry! We will contact you soon.');
                        }, 1500);
                    } else {
                        throw new Error('Submission failed');
                    }
                    
                } catch (error) {
                    console.log('❌ Backend submission failed, saving offline:', error.message);
                    
                    // Save to offline queue
                    saveOfflineEnquiry(apiData);
                    
                    // Show offline success message
                    submitBtn.querySelector('.enquiry-submit-text').textContent = 'Saved Offline ✓';
                    submitBtn.style.background = 'linear-gradient(135deg, #ffa726, #ff9800)';
                    
                    setTimeout(() => {
                        enquiryForm.reset();
                        closeEnquiryPopup();
                        
                        // Reset button state
                        submitBtn.querySelector('.enquiry-submit-text').textContent = originalText;
                        submitBtn.style.background = '';
                        submitBtn.disabled = false;
                        
                        // Show offline message
                        showOfflineMessage('Your enquiry has been saved offline and will be submitted when the server is available.');
                    }, 1500);
                }
            });
        }
    }
})();

// ===== HERO BACKGROUND VIDEO OPTIMIZATION =====
(function () {
  const video = document.getElementById('heroVideo');
  if (!video) return;

  // Ensure autoplay works on iOS/Android with muted + playsinline
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');
  video.muted = true;

  const sources = Array.from(video.querySelectorAll('source'));
  let sourceIndex = 0;

  const loadSource = () => {
    if (!sources.length) return;
    const current = sources[sourceIndex];
    if (!current) return;
    // Support both data-src lazy and direct src
    if (current.dataset.src && !current.src) current.src = current.dataset.src;
    video.load();
    video.play().catch(() => {/* ignore autoplay block */});
  };

  const tryNextSource = () => {
    sourceIndex += 1;
    if (sourceIndex < sources.length) {
      loadSource();
    } else {
      // All sources failed: gracefully fallback to static hero background
      const hero = document.querySelector('.hero');
      hero && hero.classList.add('no-video');
      video.parentElement && video.parentElement.removeChild(video);
    }
  };

  // Start lazy loading when idle/after short delay
  const startLoading = () => {
    loadSource();
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(startLoading, { timeout: 2000 });
  } else {
    setTimeout(startLoading, 600);
  }

  // On error or stalled, try next source
  video.addEventListener('error', tryNextSource, { once: false });
  video.addEventListener('stalled', tryNextSource, { once: false });
  video.addEventListener('abort', tryNextSource, { once: false });

  // Subtle reveal once ready
  video.addEventListener('canplay', () => {
    video.classList.add('ready');
  });
})();

// Fallback reveal-on-scroll if ScrollReveal library is not available
(function(){
  if (typeof window === 'undefined') return;
  if (window.ScrollReveal) return; // ScrollReveal (if loaded elsewhere) will handle animations

  const onReady = () => {
    const targets = document.querySelectorAll('.reveal-on-scroll');
    if (!targets.length) return;

    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });

    targets.forEach(el => io.observe(el));
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
})();

// ===== Auto-load official logos in Software Covered =====
(function(){
  const ready = () => {
    const cards = document.querySelectorAll('.software__card');
    if (!cards.length) return;

    // Aliases to improve matching
    const alias = new Map([
      ['Marvellous Designer', 'Marvelous Designer'],
      ['3D Equalizer', '3DEqualizer'],
      ['Adobe Sampler', 'Adobe Substance 3D Sampler'],
      ['Adobe Substance 3D Stager', 'Adobe Substance 3D Stager'],
      ['Adobe Substance 3D Painter', 'Adobe Substance 3D Painter'],
      ['DaVinci', 'DaVinci Resolve'],
      ['Deepseek', 'DeepSeek'],
      ['Katana', 'Foundry Katana'],
      ['Mocha', 'Mocha Pro'],
      ['SilhouetteFX', 'Boris FX Silhouette'],
      ['Reality Capture', 'RealityCapture'],
      ['Houdini', 'Houdini (software)'],
      ['Nuke', 'Foundry Nuke']
    ]);

    // Curated primary sources (SVG preferred for crisp scaling)
    const sources = new Map([
      ['Adobe After Effects', [
        'https://upload.wikimedia.org/wikipedia/commons/c/cb/Adobe_After_Effects_CC_icon.svg'
      ]],
      ['Adobe Premiere Pro', [
        'https://upload.wikimedia.org/wikipedia/commons/5/5f/Adobe_Premiere_Pro_CC_icon.svg'
      ]],
      ['Adobe Audition', [
        'https://upload.wikimedia.org/wikipedia/commons/1/1b/Adobe_Audition_CC_icon.svg'
      ]],
      ['Adobe Photoshop', [
        'https://upload.wikimedia.org/wikipedia/commons/2/20/Adobe_Photoshop_CC_icon.svg'
      ]],
      ['Adobe Substance 3D Painter', [
        'https://upload.wikimedia.org/wikipedia/commons/2/2d/Adobe_Substance_3D_Painter_Monogram.svg'
      ]],
      ['Adobe Substance 3D Stager', [
        'https://upload.wikimedia.org/wikipedia/commons/6/61/Adobe_Substance_3D_Stager_Monogram.svg'
      ]],
      ['Adobe Substance 3D Sampler', [
        'https://upload.wikimedia.org/wikipedia/commons/0/04/Adobe_Substance_3D_Sampler_Monogram.svg'
      ]],
      ['Autodesk Maya', [
        'https://upload.wikimedia.org/wikipedia/commons/c/c9/Autodesk_Maya_Logo.svg'
      ]],
      ['Autodesk 3ds Max', [
        'https://upload.wikimedia.org/wikipedia/commons/5/51/Autodesk_3ds_Max_Logo.svg'
      ]],
      ['Foundry Nuke', [
        'https://upload.wikimedia.org/wikipedia/commons/6/6d/Nuke-logo.svg'
      ]],
      ['Houdini (software)', [
        'https://upload.wikimedia.org/wikipedia/commons/5/5d/Houdini_3D_logo.svg'
      ]],
      ['Foundry Katana', [
        'https://upload.wikimedia.org/wikipedia/commons/4/48/Foundry_Katana_logo.svg'
      ]],
      ['Marvelous Designer', [
        'https://upload.wikimedia.org/wikipedia/commons/0/05/Marvelous_Designer_logo_2019.svg'
      ]],
      ['Mocha Pro', [
        'https://upload.wikimedia.org/wikipedia/commons/7/76/Mocha_Pro_logo.svg'
      ]],
      ['Boris FX Silhouette', [
        'https://upload.wikimedia.org/wikipedia/commons/8/81/SilhouetteFX_logo.svg'
      ]],
      ['3DEqualizer', [
        'https://upload.wikimedia.org/wikipedia/commons/7/73/3DEqualizer_logo.svg'
      ]],
      ['ChatGPT', [
        'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg'
      ]],
      ['DeepSeek', [
        'https://raw.githubusercontent.com/deepseek-ai/assets/main/logo/deepseek-logo.svg'
      ]],
      ['DaVinci Resolve', [
        'https://upload.wikimedia.org/wikipedia/commons/5/5f/DaVinci_Resolve_17_logo.svg'
      ]],
      ['Wonder Unit Storyboarder', [
        'https://raw.githubusercontent.com/wonderunit/storyboarder/master/resources/icon.png'
      ]],
      ['RealityCapture', [
        'https://upload.wikimedia.org/wikipedia/commons/5/58/RealityCapture_logo.svg'
      ]]
    ]);

    // Simple cache to avoid re-fetching on SPA-like navigation
    const cache = new Map();

    const wikiThumb = async (query) => {
      const endpoint = 'https://en.wikipedia.org/w/api.php';
      const url = `${endpoint}?action=query&format=json&origin=*&prop=pageimages&generator=search&gsrlimit=1&gsrsearch=${encodeURIComponent(query)}&piprop=thumbnail&pithumbsize=256`;
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('network');
        const data = await res.json();
        const pages = data?.query?.pages;
        if (!pages) return null;
        const first = Object.values(pages)[0];
        return first?.thumbnail?.source || null;
      } catch (e) {
        return null;
      }
    };

    cards.forEach(card => {
      const nameEl = card.querySelector('.software__name');
      const logoEl = card.querySelector('.software__logo');
      if (!nameEl || !logoEl) return;
      const rawName = nameEl.textContent.trim();
      const canonical = alias.get(rawName) || rawName;

      const img = document.createElement('img');
      img.className = 'software__img';
      img.alt = `${rawName} logo`;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.referrerPolicy = 'no-referrer';

      let loaded = false;
      const replaceWithImg = () => {
        if (loaded) return;
        loaded = true;
        logoEl.innerHTML = '';
        logoEl.appendChild(img);
      };

      const trySources = async () => {
        const list = sources.get(canonical) || sources.get(rawName) || [];
        let idx = 0;

        const tryNext = async () => {
          // If curated list exhausted, try Wikipedia fallbacks
          if (idx >= list.length) {
            const wikiCandidates = [
              `${rawName} logo`,
              `${canonical} logo`,
              `${rawName} (software)`,
              `${canonical} (software)`
            ];
            for (const q of wikiCandidates) {
              const url = await wikiThumb(q);
              if (url) {
                img.onload = replaceWithImg;
                img.onerror = null; // stop loop on wiki result failure
                img.src = url;
                return;
              }
            }
            return; // give up, keep placeholder SVG
          }

          const url = list[idx++];
          img.onload = replaceWithImg;
          img.onerror = () => {
            // try next candidate
            tryNext();
          };
          img.src = url;
        };

        tryNext();
      };

      // Use cache if we've already resolved this logo in this session
      const cacheKey = canonical;
      if (cache.has(cacheKey)) {
        const cachedUrl = cache.get(cacheKey);
        img.onload = replaceWithImg;
        img.src = cachedUrl;
      } else {
        // Attempt loading and cache on success
        const origOnload = img.onload;
        img.onload = (ev) => {
          cache.set(cacheKey, img.currentSrc || img.src);
          if (origOnload) origOnload(ev);
        };
        trySources();
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
  } else {
    ready();
  }
})();
