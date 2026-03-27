/**
 * Gallery Component
 * Dynamically renders event gallery sections from events.json
 * and handles lightbox functionality for photo viewing.
 */

export class Gallery {
  constructor() {
    this.currentIndex = 0;
    this.galleryItems = [];
    this.activeGallery = [];
    this.totalImages = 0;

    // Modal elements
    this.modal = document.getElementById('lightbox-modal');
    this.imageContainer = document.getElementById('lightbox-image-container');
    this.counter = document.getElementById('lightbox-counter');
    this.closeBtn = document.getElementById('lightbox-close');
    this.prevBtn = document.getElementById('lightbox-prev');
    this.nextBtn = document.getElementById('lightbox-next');

    const container = document.getElementById('gallery-container');
    if (!container || !this.modal) return;

    this.renderGalleries(container);
  }

  async renderGalleries(container) {
    let events;
    try {
      const res = await fetch('/data/events.json');
      const data = await res.json();
      events = data.events || [];
    } catch {
      container.innerHTML = '<p class="text-periwinkle-gray text-center py-20">Could not load galleries.</p>';
      return;
    }

    // Only events with gallery images
    const galleryEvents = events.filter(e => e.gallery && e.gallery.length > 0);

    if (galleryEvents.length === 0) {
      container.innerHTML = '<p class="text-periwinkle-gray text-center py-20">No galleries available yet.</p>';
      return;
    }

    // Most recent first
    galleryEvents.sort((a, b) => new Date(b.date) - new Date(a.date));

    const bgClasses = ['bg-mirage', 'bg-port-gore'];

    const sectionsHTML = galleryEvents.map((event, i) => {
      const bg = bgClasses[i % 2];
      const itemsHTML = event.gallery.map((imgPath, idx) => `
        <button class="gallery-item aspect-square rounded-lg overflow-hidden"
                data-image-index="${idx}"
                data-gallery="${event.galleryId}">
          <img src="${imgPath}"
               alt="${event.title} Photo ${idx + 1}"
               class="w-full h-full object-cover hover:scale-110 transition-transform duration-300">
        </button>`).join('');

      return `
        <section id="${event.galleryId}" class="py-20 ${bg} scroll-mt-16">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center mb-8">
              <div>
                <h2 class="text-4xl font-black text-white mb-2 accent-line">${event.title}</h2>
                <p class="text-periwinkle-gray">${event.dateDisplay}</p>
              </div>
              <a href="./events.html" class="text-baby-blue hover:text-energy-yellow transition-colors font-semibold">← Back to Events</a>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              ${itemsHTML}
            </div>
          </div>
        </section>`;
    }).join('');

    container.innerHTML = sectionsHTML;

    // Re-query items now that they exist in the DOM, then attach listeners
    this.galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    this.init();

    // Handle hash-based deep linking (e.g. gallery.html#dave-busters)
    if (window.location.hash) {
      const target = document.querySelector(window.location.hash);
      if (target) {
        setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    }
  }

  init() {
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
    document.body.style.overflow = '';
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
    this.counter.textContent = `${this.currentIndex + 1} / ${this.totalImages}`;

    const currentItem = this.activeGallery[this.currentIndex];
    const imgEl = currentItem.querySelector('img');
    if (!imgEl) return;

    const img = document.createElement('img');
    img.src = imgEl.getAttribute('src');
    img.alt = imgEl.getAttribute('alt') || `Gallery image ${this.currentIndex + 1}`;
    img.className = 'w-full h-auto max-h-[90vh] object-contain';

    this.imageContainer.innerHTML = '';
    this.imageContainer.appendChild(img);
  }
}
