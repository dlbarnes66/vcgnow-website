// ===================================
// VCG - VENTURE COLLECTIVE GROUP
// Main JavaScript File
// ===================================

// === SUPABASE CONFIGURATION ===
const SUPABASE_URL = 'https://tyxddxhmyqxpiwheftya.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5eGRkeGhteXF4cGl3aGVmdHlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MzMxNjIsImV4cCI6MjA4NjUwOTE2Mn0.dAk1YMtZvezyZIU3ClHRQZCghwUt8-1lFAJ_uH_osls';

// Initialize Supabase client with unique variable name to avoid conflicts
const vcgSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// === NAVIGATION ===
document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile menu toggle
    const navHamburger = document.getElementById('navHamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (navHamburger) {
        navHamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Check if it's an anchor link
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    // Close mobile menu if open
                    navMenu.classList.remove('active');
                    
                    // Scroll to section
                    const offsetTop = target.offsetTop - 70; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Update active link
                    navLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                }
            }
        });
    });
    
    // Update active navigation on scroll
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveNav() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);
    
    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
});

// === CONTACT FORM SUBMISSION ===
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form values
            const firstName = document.getElementById('firstName').value.trim();
            const lastName = document.getElementById('lastName').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // Validate required fields
            if (!firstName || !lastName || !email) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Show loading state
            const submitBtn = document.getElementById('submitBtn');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoading = submitBtn.querySelector('.btn-loading');
            
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline-flex';
            
            try {
                // Prepare data for Supabase (matching CRM investors table schema)
                const investorData = {
                    investor_name: `${firstName} ${lastName}`,
                    contact_person: `${firstName} ${lastName}`,
                    email: email,
                    phone: phone || null,
                    notes: message || 'Contact form submission from vcgnow.com',
                    status: 'Lead',
                    stage: 'Pre-Seed',
                    source: 'Website Contact Form',
                    tags: ['Contact Form', 'Website Lead']
                };
                
                // Insert into Supabase
                const { data, error } = await vcgSupabase
                    .from('investors')
                    .insert([investorData])
                    .select();
                
                if (error) {
                    throw error;
                }
                
                console.log('Form submitted successfully:', data);
                
                // Hide form and show success message
                contactForm.style.display = 'none';
                document.querySelector('.form-intro').style.display = 'none';
                
                const formSuccess = document.getElementById('formSuccess');
                formSuccess.style.display = 'block';
                
                // Reset form
                contactForm.reset();
                
                // Auto-hide success message after 10 seconds
                setTimeout(() => {
                    contactForm.style.display = 'flex';
                    document.querySelector('.form-intro').style.display = 'block';
                    formSuccess.style.display = 'none';
                    
                    // Reset button state
                    submitBtn.disabled = false;
                    btnText.style.display = 'inline';
                    btnLoading.style.display = 'none';
                }, 10000);
                
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('There was an error submitting your inquiry. Please try again or contact us directly.');
                
                // Reset button state
                submitBtn.disabled = false;
                btnText.style.display = 'inline';
                btnLoading.style.display = 'none';
            }
        });
    }
});

// === ANIMATION ON SCROLL ===
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.stat-card, .opportunity-card, .investment-card, .impact-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// === UTILITY FUNCTIONS ===

// Format phone number
function formatPhoneNumber(phone) {
    const cleaned = ('' + phone).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return phone;
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const navMenu = document.getElementById('navMenu');
    const navHamburger = document.getElementById('navHamburger');
    
    if (navMenu && navHamburger) {
        if (!navMenu.contains(event.target) && !navHamburger.contains(event.target)) {
            navMenu.classList.remove('active');
        }
    }
});

// Escape key to close mobile menu
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const navMenu = document.getElementById('navMenu');
        if (navMenu) {
            navMenu.classList.remove('active');
        }
    }
});

// Console log for debugging
console.log('VCG Website Loaded Successfully');
console.log('Supabase Connection:', vcgSupabase ? 'Initialized' : 'Failed');

