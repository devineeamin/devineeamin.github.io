// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    
    // Lightbox functionality
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    const currentImageSpan = document.getElementById('current-image');
    const totalImagesSpan = document.getElementById('total-images');
    const galleryItems = document.querySelectorAll('.gallery-item img');
    
    let currentImageIndex = 0;
    const imageArray = Array.from(galleryItems);
    
    // Set total images
    totalImagesSpan.textContent = imageArray.length;
    
    // Open lightbox when clicking on gallery images
    galleryItems.forEach((img, index) => {
        img.addEventListener('click', function() {
            currentImageIndex = index;
            openLightbox(this.src);
        });
    });
    
    function openLightbox(src) {
        lightboxImage.src = src;
        lightbox.classList.add('active');
        currentImageSpan.textContent = currentImageIndex + 1;
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable scrolling
    }
    
    // Close lightbox
    closeBtn.addEventListener('click', closeLightbox);
    
    // Close on background click
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
    
    // Previous image
    prevBtn.addEventListener('click', function() {
        currentImageIndex = (currentImageIndex - 1 + imageArray.length) % imageArray.length;
        lightboxImage.src = imageArray[currentImageIndex].src;
        currentImageSpan.textContent = currentImageIndex + 1;
    });
    
    // Next image
    nextBtn.addEventListener('click', function() {
        currentImageIndex = (currentImageIndex + 1) % imageArray.length;
        lightboxImage.src = imageArray[currentImageIndex].src;
        currentImageSpan.textContent = currentImageIndex + 1;
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'ArrowLeft') {
                prevBtn.click();
            } else if (e.key === 'ArrowRight') {
                nextBtn.click();
            }
        }
    });
    
    // Mobile menu toggle (basic implementation)
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            if (navMenu.style.display === 'flex') {
                navMenu.style.display = 'none';
            } else {
                navMenu.style.display = 'flex';
                navMenu.style.flexDirection = 'column';
                navMenu.style.position = 'absolute';
                navMenu.style.top = '100%';
                navMenu.style.left = '0';
                navMenu.style.right = '0';
                navMenu.style.backgroundColor = '#fff';
                navMenu.style.padding = '1rem';
                navMenu.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
            }
        });
    }
    
    // Lazy loading enhancement (if browser doesn't support native lazy loading)
    if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading is supported
        console.log('Native lazy loading supported');
    } else {
        // Fallback for browsers that don't support lazy loading
        const images = document.querySelectorAll('img[loading="lazy"]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
});

function resizeGridItems() {
    const grid = document.querySelector('.gallery-grid');
    const items = document.querySelectorAll('.gallery-item');
    const rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
    const rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('gap'));

    items.forEach(item => {
        const img = item.querySelector('img');
        if (img.complete) {
            const rowSpan = Math.ceil((img.offsetHeight + rowGap) / (rowHeight + rowGap));
            item.style.gridRowEnd = `span ${rowSpan}`;
        }
    });
}

// Run on load and resize
window.addEventListener('load', resizeGridItems);
window.addEventListener('resize', resizeGridItems);

// Run after each image loads
document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('load', resizeGridItems);
});

