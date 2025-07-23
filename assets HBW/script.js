// Theme Toggle Functionality
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.body = document.body;
        this.init();
    }

    init() {
        // Load saved theme or default to light
        const savedTheme = localStorage.getItem('hotel-theme') || 'light';
        this.setTheme(savedTheme);
        
        // Add event listener
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    setTheme(theme) {
        if (theme === 'dark') {
            this.body.classList.add('dark');
            this.themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            this.body.classList.remove('dark');
            this.themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
        localStorage.setItem('hotel-theme', theme);
    }

    toggleTheme() {
        const currentTheme = this.body.classList.contains('dark') ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }
}

// Image Slider Functionality
class ImageSlider {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.dots = document.querySelectorAll('.dot');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.currentSlide = 0;
        this.slideInterval = null;
        this.init();
    }

    init() {
        // Add event listeners
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Add dot navigation
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });

        // Start auto-slide
        this.startAutoSlide();

        // Pause on hover
        const heroSlider = document.querySelector('.hero-slider');
        heroSlider.addEventListener('mouseenter', () => this.stopAutoSlide());
        heroSlider.addEventListener('mouseleave', () => this.startAutoSlide());
    }

    showSlide(index) {
        // Remove active class from all slides and dots
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.dots.forEach(dot => dot.classList.remove('active'));

        // Add active class to current slide and dot
        this.slides[index].classList.add('active');
        this.dots[index].classList.add('active');
        
        this.currentSlide = index;
    }

    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.showSlide(nextIndex);
    }

    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.showSlide(prevIndex);
    }

    goToSlide(index) {
        this.showSlide(index);
    }

    startAutoSlide() {
        this.slideInterval = setInterval(() => {
            this.nextSlide();
        }, 5000); // Change slide every 5 seconds
    }

    stopAutoSlide() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
            this.slideInterval = null;
        }
    }
}

// Mobile Navigation
class MobileNavigation {
    constructor() {
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        this.hamburger.addEventListener('click', () => this.toggleMenu());
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.hamburger.contains(e.target) && !this.navMenu.contains(e.target)) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
    }

    closeMenu() {
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
    }
}

// Smooth Scrolling
class SmoothScroll {
    constructor() {
        this.navLinks = document.querySelectorAll('a[href^="#"]');
        this.init();
    }

    init() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Date Validation for Booking Forms
class DateManager {
    constructor() {
        this.checkinInputs = document.querySelectorAll('#checkin, #checkinDate');
        this.checkoutInputs = document.querySelectorAll('#checkout, #checkoutDate');
        this.init();
    }

    init() {
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        
        this.checkinInputs.forEach(input => {
            input.setAttribute('min', today);
            input.addEventListener('change', (e) => this.updateCheckoutMin(e.target));
        });

        this.checkoutInputs.forEach(input => {
            input.setAttribute('min', today);
        });
    }

    updateCheckoutMin(checkinInput) {
        const checkinDate = checkinInput.value;
        if (checkinDate) {
            // Set minimum checkout date to day after checkin
            const nextDay = new Date(checkinDate);
            nextDay.setDate(nextDay.getDate() + 1);
            const minCheckout = nextDay.toISOString().split('T')[0];
            
            this.checkoutInputs.forEach(input => {
                input.setAttribute('min', minCheckout);
                // Clear checkout if it's before new minimum
                if (input.value && input.value <= checkinDate) {
                    input.value = '';
                }
            });
        }
    }
}

// Form Handlers
class FormManager {
    constructor() {
        this.bookingForm = document.getElementById('bookingForm');
        this.contactForm = document.getElementById('contactForm');
        this.quickBookingForm = document.querySelector('.booking-form-quick');
        this.newsletterForm = document.querySelector('.newsletter-form');
        this.init();
    }

    init() {
        if (this.bookingForm) {
            this.bookingForm.addEventListener('submit', (e) => this.handleBookingSubmit(e));
        }

        if (this.contactForm) {
            this.contactForm.addEventListener('submit', (e) => this.handleContactSubmit(e));
        }

        if (this.quickBookingForm) {
            this.quickBookingForm.addEventListener('submit', (e) => this.handleQuickBookingSubmit(e));
        }

        if (this.newsletterForm) {
            this.newsletterForm.addEventListener('submit', (e) => this.handleNewsletterSubmit(e));
        }

        // Room booking buttons
        const roomButtons = document.querySelectorAll('.room-btn');
        roomButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleRoomBooking(e));
        });
    }

    handleBookingSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.bookingForm);
        const bookingData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            checkin: formData.get('checkinDate'),
            checkout: formData.get('checkoutDate'),
            roomType: formData.get('roomType'),
            guests: formData.get('guestCount'),
            specialRequests: formData.get('specialRequests')
        };

        if (this.validateBookingForm(bookingData)) {
            this.showSuccessMessage('Booking request submitted successfully! We\'ll contact you soon to confirm your reservation.', this.bookingForm);
            this.bookingForm.reset();
        }
    }

    handleContactSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.contactForm);
        const contactData = {
            name: formData.get('name'),
            email: formData.get('contactEmail'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };

        if (this.validateContactForm(contactData)) {
            this.showSuccessMessage('Thank you for your message! We\'ll get back to you within 24 hours.', this.contactForm);
            this.contactForm.reset();
        }
    }

    handleQuickBookingSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.quickBookingForm);
        const searchData = {
            checkin: formData.get('checkin'),
            checkout: formData.get('checkout'),
            guests: formData.get('guests')
        };

        if (this.validateQuickSearch(searchData)) {
            // Scroll to rooms section
            document.getElementById('rooms').scrollIntoView({ behavior: 'smooth' });
            this.showSuccessMessage('Searching available rooms for your dates...', this.quickBookingForm);
        }
    }

    handleNewsletterSubmit(e) {
        e.preventDefault();
        
        const email = e.target.querySelector('input[type="email"]').value;
        
        if (this.validateEmail(email)) {
            this.showSuccessMessage('Thank you for subscribing to our newsletter!', this.newsletterForm);
            e.target.reset();
        } else {
            this.showErrorMessage('Please enter a valid email address.', this.newsletterForm);
        }
    }

    handleRoomBooking(e) {
        const roomCard = e.target.closest('.room-card');
        const roomName = roomCard.querySelector('h3').textContent;
        const roomPrice = roomCard.querySelector('.room-price').textContent;
        
        // Scroll to booking section
        document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
        
        // Pre-fill room type if form exists
        const roomSelect = document.getElementById('roomType');
        if (roomSelect) {
            const optionValue = roomName.toLowerCase().replace(/\s+/g, '-');
            const option = roomSelect.querySelector(`option[value="${optionValue}"]`);
            if (option) {
                roomSelect.value = optionValue;
            }
        }

        this.showSuccessMessage(`Great choice! ${roomName} selected. Please fill out the booking form below.`, null);
    }

    validateBookingForm(data) {
        const { firstName, lastName, email, phone, checkin, checkout, roomType, guests } = data;

        if (!firstName.trim()) {
            this.showErrorMessage('Please enter your first name.', this.bookingForm);
            return false;
        }

        if (!lastName.trim()) {
            this.showErrorMessage('Please enter your last name.', this.bookingForm);
            return false;
        }

        if (!email.trim() || !this.validateEmail(email)) {
            this.showErrorMessage('Please enter a valid email address.', this.bookingForm);
            return false;
        }

        if (!phone.trim()) {
            this.showErrorMessage('Please enter your phone number.', this.bookingForm);
            return false;
        }

        if (!checkin) {
            this.showErrorMessage('Please select a check-in date.', this.bookingForm);
            return false;
        }

        if (!checkout) {
            this.showErrorMessage('Please select a check-out date.', this.bookingForm);
            return false;
        }

        if (new Date(checkout) <= new Date(checkin)) {
            this.showErrorMessage('Check-out date must be after check-in date.', this.bookingForm);
            return false;
        }

        if (!roomType) {
            this.showErrorMessage('Please select a room type.', this.bookingForm);
            return false;
        }

        if (!guests) {
            this.showErrorMessage('Please select number of guests.', this.bookingForm);
            return false;
        }

        return true;
    }

    validateContactForm(data) {
        const { name, email, subject, message } = data;

        if (!name.trim()) {
            this.showErrorMessage('Please enter your name.', this.contactForm);
            return false;
        }

        if (!email.trim() || !this.validateEmail(email)) {
            this.showErrorMessage('Please enter a valid email address.', this.contactForm);
            return false;
        }

        if (!subject.trim()) {
            this.showErrorMessage('Please enter a subject.', this.contactForm);
            return false;
        }

        if (!message.trim()) {
            this.showErrorMessage('Please enter your message.', this.contactForm);
            return false;
        }

        return true;
    }

    validateQuickSearch(data) {
        const { checkin, checkout, guests } = data;

        if (!checkin) {
            this.showErrorMessage('Please select a check-in date.', this.quickBookingForm);
            return false;
        }

        if (!checkout) {
            this.showErrorMessage('Please select a check-out date.', this.quickBookingForm);
            return false;
        }

        if (new Date(checkout) <= new Date(checkin)) {
            this.showErrorMessage('Check-out date must be after check-in date.', this.quickBookingForm);
            return false;
        }

        if (!guests) {
            this.showErrorMessage('Please select number of guests.', this.quickBookingForm);
            return false;
        }

        return true;
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showSuccessMessage(message, form) {
        this.showMessage(message, 'success', form);
    }

    showErrorMessage(message, form) {
        this.showMessage(message, 'error', form);
    }

    showMessage(message, type, form) {
        // Remove any existing messages
        const existingMessages = document.querySelectorAll('.form-message');
        existingMessages.forEach(msg => msg.remove());

        // Create new message element
        const messageEl = document.createElement('div');
        messageEl.className = `form-message ${type}`;
        messageEl.textContent = message;

        if (form) {
            // Insert message before form
            form.parentNode.insertBefore(messageEl, form);
        } else {
            // Show message at top of page
            document.body.insertBefore(messageEl, document.body.firstChild);
            messageEl.style.position = 'fixed';
            messageEl.style.top = '80px';
            messageEl.style.left = '50%';
            messageEl.style.transform = 'translateX(-50%)';
            messageEl.style.zIndex = '1002';
        }

        // Remove message after 5 seconds
        setTimeout(() => {
            messageEl.remove();
        }, 5000);

        // Scroll to message if form-specific
        if (form) {
            messageEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

// Scroll Effects and Animations
class ScrollAnimations {
    constructor() {
        this.animatedElements = document.querySelectorAll('.room-card, .amenity-item, .gallery-item');
        this.navbar = document.querySelector('.navbar');
        this.scrollTopBtn = document.getElementById('scrollTop');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            this.handleScroll();
            this.updateNavbar();
            this.toggleScrollTopButton();
        });

        // Scroll to top button
        if (this.scrollTopBtn) {
            this.scrollTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }

        // Initial check
        this.handleScroll();
    }

    handleScroll() {
        this.animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (elementTop < windowHeight * 0.8) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }

    updateNavbar() {
        if (window.scrollY > 100) {
            this.navbar.style.background = this.navbar.classList.contains('dark') 
                ? 'rgba(26, 32, 44, 0.98)' 
                : 'rgba(255, 255, 255, 0.98)';
        } else {
            this.navbar.style.background = this.navbar.classList.contains('dark') 
                ? 'rgba(26, 32, 44, 0.95)' 
                : 'rgba(255, 255, 255, 0.95)';
        }
    }

    toggleScrollTopButton() {
        if (window.pageYOffset > 300) {
            this.scrollTopBtn.classList.add('visible');
        } else {
            this.scrollTopBtn.classList.remove('visible');
        }
    }
}

// Gallery Modal (optional enhancement)
class GalleryModal {
    constructor() {
        this.galleryItems = document.querySelectorAll('.gallery-img');
        this.modal = null;
        this.init();
    }

    init() {
        this.galleryItems.forEach((img, index) => {
            img.addEventListener('click', () => this.openModal(img.src, index));
        });
    }

    openModal(imageSrc, index) {
        // Create modal if it doesn't exist
        if (!this.modal) {
            this.createModal();
        }

        const modalImg = this.modal.querySelector('.modal-img');
        modalImg.src = imageSrc;
        this.modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    createModal() {
        this.modal = document.createElement('div');
        this.modal.className = 'gallery-modal';
        this.modal.innerHTML = `
            <div class="modal-content">
                <span class="modal-close">&times;</span>
                <img class="modal-img" src="" alt="Gallery Image">
            </div>
        `;

        this.modal.style.cssText = `
            display: none;
            position: fixed;
            z-index: 2000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            align-items: center;
            justify-content: center;
        `;

        const modalContent = this.modal.querySelector('.modal-content');
        modalContent.style.cssText = `
            position: relative;
            max-width: 90%;
            max-height: 90%;
        `;

        const modalImg = this.modal.querySelector('.modal-img');
        modalImg.style.cssText = `
            width: 100%;
            height: auto;
            border-radius: 10px;
        `;

        const closeBtn = this.modal.querySelector('.modal-close');
        closeBtn.style.cssText = `
            position: absolute;
            top: -40px;
            right: 0;
            color: white;
            font-size: 35px;
            font-weight: bold;
            cursor: pointer;
        `;

        document.body.appendChild(this.modal);

        // Add event listeners
        closeBtn.addEventListener('click', () => this.closeModal());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });
    }

    closeModal() {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    new ImageSlider();
    new MobileNavigation();
    new SmoothScroll();
    new DateManager();
    new FormManager();
    new ScrollAnimations();
    new GalleryModal();

    // Initialize scroll animations for elements
    const animatedElements = document.querySelectorAll('.room-card, .amenity-item, .gallery-item');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
});

// Handle image loading errors
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            // Create a placeholder SVG if image fails to load
            const placeholder = `data:image/svg+xml,${encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
                    <rect width="400" height="300" fill="#f1f5f9"/>
                    <rect x="50" y="50" width="300" height="200" fill="#e2e8f0" rx="10"/>
                    <circle cx="200" cy="120" r="30" fill="#94a3b8"/>
                    <polygon points="150,180 200,130 250,180" fill="#94a3b8"/>
                    <text x="200" y="220" text-anchor="middle" fill="#64748b" font-family="Arial" font-size="16">Hotel Image</text>
                </svg>
            `)}`;
            this.src = placeholder;
        });
    });
});