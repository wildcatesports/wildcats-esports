/**
 * Gallery Component
 * Handles lightbox functionality for photo galleries
 */

export class Gallery {
  constructor() {
    this.currentIndex = 0;
    this.galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    this.activeGallery = [];
    this.totalImages = this.galleryItems.length;
    
    // Modal elements
    this.modal = document.getElementById('lightbox-modal');
    this.imageContainer = document.getElementById('lightbox-image-container');
    this.counter = document.getElementById('lightbox-counter');
    this.closeBtn = document.getElementById('lightbox-close');
    this.prevBtn = document.getElementById('lightbox-prev');
    this.nextBtn = document.getElementById('lightbox-next');

    if (!this.modal || this.galleryItems.length === 0) {
      return; // Not on gallery page or no items
    }

    this.init();
  }

  init() {
    // Add click handlers to all gallery items
    this.galleryItems.forEach((item) => {
      item.addEventListener('click', () => {
        const galleryName = item.dataset.gallery;

        this.activeGallery = this.galleryItems.filter(
          el => el.dataset.gallery === galleryName
      );

      const index = this.activeGallery.indexOf(item);
      this.openLightbox(index);
  });
});

    // Modal controls
    this.closeBtn.addEventListener('click', () => this.closeLightbox());
    this.prevBtn.addEventListener('click', () => this.navigate('prev'));
    this.nextBtn.addEventListener('click', () => this.navigate('next'));

    // Click outside to close
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.closeLightbox();
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!this.modal.classList.contains('hidden')) {
        if (e.key === 'Escape') {
          this.closeLightbox();
        } else if (e.key === 'ArrowLeft') {
          this.navigate('prev');
        } else if (e.key === 'ArrowRight') {
          this.navigate('next');
        }
      }
    });
  }
  openLightbox(index) {
    this.currentIndex = index;
    this.totalImages = this.activeGallery.length;
    this.modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    this.updateDisplay();
}


  closeLightbox() {
    this.modal.classList.add('hidden');
    document.body.style.overflow = ''; // Restore scrolling
  }

  navigate(direction) {
    if (direction === 'prev') {
      this.currentIndex = (this.currentIndex - 1 + this.totalImages) % this.totalImages;
    } else {
      this.currentIndex = (this.currentIndex + 1) % this.totalImages;
    }
    this.updateDisplay();
  }
  updateDisplay() {
  // Update counter
  this.counter.textContent = `${this.currentIndex + 1} / ${this.totalImages}`;

  // Get current gallery item + image
  const currentItem = this.activeGallery[this.currentIndex];
  const imgEl = currentItem.querySelector('img');

  if (!imgEl) return;

  const src = imgEl.getAttribute('src');
  const alt = imgEl.getAttribute('alt') || `Gallery image ${this.currentIndex + 1}`;

  // Create real image for lightbox
  const img = document.createElement('img');
  img.src = src;
  img.alt = alt;
  img.className = 'w-full h-auto max-h-[90vh] object-contain';

  // Clear + inject
  this.imageContainer.innerHTML = '';
  this.imageContainer.appendChild(img);
}

}
