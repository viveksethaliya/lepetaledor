document.addEventListener('DOMContentLoaded', () => {
    
    // --- Sidebar Navigation Logic ---
    const menuBtn = document.querySelector('.menu-btn');
    const closeBtn = document.querySelector('.close-btn');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');

    // Function to handle opening and closing the sidebar
    function toggleSidebar() {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('active');
        
        // Prevent background scrolling when sidebar is open
        if (sidebar.classList.contains('open')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    // Event Listeners for sidebar interactions
    menuBtn.addEventListener('click', toggleSidebar);
    closeBtn.addEventListener('click', toggleSidebar);
    overlay.addEventListener('click', toggleSidebar);

    // --- Hero Slideshow Logic ---
    const slideshowContainer = document.querySelector('.slideshow-container');
    if (slideshowContainer) {
        let slideIndex = 1;
    let slideInterval;
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const intervalTime = 5000; // 5 seconds per slide

    // Function to display the correct slide
    function showSlides(n) {
        if (n > slides.length) { slideIndex = 1 }
        if (n < 1) { slideIndex = slides.length }
        
        // Remove active class from all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });

        // Add active class to current slide and dot
        if (slides[slideIndex - 1] && dots[slideIndex - 1]) {
            slides[slideIndex - 1].classList.add('active');
            dots[slideIndex - 1].classList.add('active');
        }
    }

    // Function to advance to the next slide
    function nextSlide() {
        showSlides(slideIndex += 1);
    }

    // Function to start the continuous slideshow
    function startSlideshow() {
        slideInterval = setInterval(nextSlide, intervalTime);
    }

    // Function to reset the timer when a user manually clicks a dot
    function resetInterval() {
        clearInterval(slideInterval);
        startSlideshow();
    }

    // Expose currentSlide function to global scope so inline onclick handles it
    window.currentSlide = function(n) {
        showSlides(slideIndex = n);
        resetInterval();
    };

    // Initialize the slideshow on load
    showSlides(slideIndex);
    startSlideshow();
    }

    // --- Navbar Scroll Effect ---
    const navbar = document.querySelector('.navbar');
    const announcementBar = document.getElementById('announcementBar');
    const closeAnnouncement = document.querySelector('.close-announcement');
    
    // Check if the announcement was previously closed
    if (announcementBar) {
        const closedAt = localStorage.getItem('announcementClosedAt');
        let isClosed = false;

        if (closedAt) {
            const closedTime = parseInt(closedAt, 10);
            const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
            if (Date.now() - closedTime < sevenDaysInMs) {
                isClosed = true;
            } else {
                // Expired, clear it
                localStorage.removeItem('announcementClosedAt');
            }
        }

        if (isClosed) {
            announcementBar.style.display = 'none';
            document.documentElement.style.setProperty('--announcement-height', '0px');
        } else if (closeAnnouncement) {
            // Close announcement bar logic
            closeAnnouncement.addEventListener('click', () => {
                announcementBar.style.height = '0px';
                document.documentElement.style.setProperty('--announcement-height', '0px');
                
                // Save preference to localStorage with timestamp
                localStorage.setItem('announcementClosedAt', Date.now().toString());
                
                setTimeout(() => {
                    announcementBar.style.display = 'none';
                }, 300); // match css transition time
            });
        }
    }
    
    window.addEventListener('scroll', () => {
        // Calculate the height offset. If the announcement bar is visible, we trigger 'scrolled' when we pass it.
        let offset = announcementBar && announcementBar.style.display !== 'none' ? announcementBar.offsetHeight : 0;
        let threshold = offset > 0 ? offset : 50;
        
        if (window.scrollY > threshold) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Testimonial Slider Logic ---
    const testiWrapper = document.getElementById('testi-wrapper');
    if (testiWrapper) {
        const tPrevBtn = document.querySelector('.testi-controls .prev-btn');
        const tNextBtn = document.querySelector('.testi-controls .next-btn');
        const tSlides = document.querySelectorAll('.testimonial-slide');
        const tDots = document.querySelectorAll('.testi-dot');
        let tIndex = 0;
        let tInterval;

        window.showTestimonial = function(index) {
            if (index >= tSlides.length) {
                tIndex = 0;
            } else if (index < 0) {
                tIndex = tSlides.length - 1;
            } else {
                tIndex = index;
            }
            
            testiWrapper.style.transform = `translateX(-${tIndex * 100}%)`;
            
            tDots.forEach(dot => dot.classList.remove('active'));
            if(tDots[tIndex]) {
                tDots[tIndex].classList.add('active');
            }

            clearInterval(tInterval);
            tInterval = setInterval(() => {
                showTestimonial(tIndex + 1);
            }, 8000);
        };

        if (tNextBtn) {
            tNextBtn.addEventListener('click', () => {
                showTestimonial(tIndex + 1);
            });
        }

        if (tPrevBtn) {
            tPrevBtn.addEventListener('click', () => {
                showTestimonial(tIndex - 1);
            });
        }
        
        tInterval = setInterval(() => {
            showTestimonial(tIndex + 1);
        }, 8000);
    }

    // --- Before/After Slider Logic ---
    const baSlider = document.querySelector('.ba-slider');
    if (baSlider) {
        const baImgBefore = document.querySelector('.ba-img-before');
        const baSliderLine = document.querySelector('.ba-slider-line');
        const baSliderButton = document.querySelector('.ba-slider-button');

        baSlider.addEventListener('input', (e) => {
            const sliderValue = e.target.value;
            // The before image is clipped from the right
            baImgBefore.style.clipPath = `inset(0 ${100 - sliderValue}% 0 0)`;
            baSliderLine.style.left = `${sliderValue}%`;
            baSliderButton.style.left = `${sliderValue}%`;
        });
    }

});

// --- WhatsApp VIP Form ---
window.sendToWhatsapp = function(event) {
    event.preventDefault();
    const name = document.getElementById('vipName').value;
    const email = document.getElementById('vipEmail').value;
    const text = `Hi, I would like to join the VIP list for Flower Pressing for Beginners.\nMy name is ${name} and my email is ${email}.`;
    const whatsappUrl = `https://wa.me/918849553370?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
}

// --- Memorial Flowers Form ---
window.memorialFormSubmit = function(event) {
    event.preventDefault();
    const fName = document.getElementById('memFirstName').value;
    const lName = document.getElementById('memLastName').value;
    const email = document.getElementById('memEmail').value;
    const phone = document.getElementById('memPhone').value;
    
    // Get checked services
    const servicesChecked = Array.from(document.querySelectorAll('input[name="services"]:checked'))
                                 .map(cb => cb.value)
                                 .join(', ');
    const servicesText = servicesChecked ? servicesChecked : 'None selected';
    
    const hear = document.getElementById('memHear').value;
    const message = document.getElementById('memMessage').value;
    
    const text = `Hi, I'm inquiring about Memorial Flowers.\n\nName: ${fName} ${lName}\nEmail: ${email}\nPhone: ${phone}\nServices Interested In: ${servicesText}\nHeard About Us: ${hear}\nMessage: ${message}`;
    const whatsappUrl = `https://wa.me/918849553370?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
}

// --- Active Sidebar Link Highlighting ---
(function() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    sidebarLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href !== '#' && currentPage === href) {
            link.classList.add('active');
        }
    });
})();
