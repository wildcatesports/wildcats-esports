/**
 * TV Display Board
 * Fullscreen slideshow for club meetings.
 * Slides: upcoming events → recent event photos → membership perks → schedule
 */

const BASE = import.meta.env.BASE_URL;

const CALENDAR_SVG = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>`;
const LOCATION_SVG = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`;
const DISCORD_SVG = `<svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>`;
const INSTAGRAM_SVG = `<svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`;

class DisplayBoard {
  constructor() {
    this.slides = [];
    this.currentIndex = 0;
    this.slideDuration = 12000;
    this.photoInterval = null;
    this.slideTimer = null;
  }

  async init() {
    this.startClock();
    await this.loadSlides();
    if (this.slides.length === 0) return;
    this.showSlide(0);
    this.scheduleNext();
  }

  startClock() {
    const el = document.getElementById('clock');
    const tick = () => {
      el.textContent = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    };
    tick();
    setInterval(tick, 1000);
  }

  async loadSlides() {
    try {
      const res = await fetch(`${BASE}data/events.json`);
      const { events } = await res.json();
      events.sort((a, b) => new Date(b.date) - new Date(a.date));

      const upcoming = events.filter(e => e.status === 'upcoming');
      const past = events.filter(e => e.status === 'past');

      if (upcoming.length > 0) {
        this.slides.push({ type: 'upcoming', events: upcoming });
      }

      past.slice(0, 3).forEach(event => {
        this.slides.push({ type: 'event', event });
      });

      this.slides.push({ type: 'membership' });
      this.slides.push({ type: 'schedule' });
    } catch (err) {
      console.error('Failed to load events:', err);
    }
  }

  showSlide(index) {
    clearInterval(this.photoInterval);
    this.photoInterval = null;

    const container = document.getElementById('slide-content');
    container.style.opacity = '0';

    setTimeout(() => {
      const slide = this.slides[index];
      container.innerHTML = this.renderSlide(slide);
      container.style.opacity = '1';
      this.resetProgress();

      if (slide.type === 'event' && slide.event.gallery.length > 1) {
        this.startPhotoCarousel(slide.event.gallery);
      }
    }, 400);
  }

  scheduleNext() {
    clearTimeout(this.slideTimer);
    this.slideTimer = setTimeout(() => {
      this.currentIndex = (this.currentIndex + 1) % this.slides.length;
      this.showSlide(this.currentIndex);
      this.scheduleNext();
    }, this.slideDuration);
  }

  resetProgress() {
    const bar = document.getElementById('progress-fill');
    bar.style.animation = 'none';
    void bar.offsetHeight; // force reflow to restart animation
    bar.style.animation = `progress ${this.slideDuration}ms linear forwards`;
  }

  startPhotoCarousel(gallery) {
    let idx = 0;
    this.photoInterval = setInterval(() => {
      idx = (idx + 1) % gallery.length;
      const bg = document.getElementById('event-bg');
      if (!bg) return;
      bg.style.opacity = '0';
      setTimeout(() => {
        bg.style.backgroundImage = `url('${this.imgUrl(gallery[idx])}')`;
        bg.style.opacity = '1';
      }, 500);
    }, 3000);
  }

  imgUrl(path) {
    return `${BASE}${path.replace(/^\//, '')}`;
  }

  daysUntil(dateStr) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    const diff = Math.round((target - today) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'TODAY';
    if (diff === 1) return 'TOMORROW';
    if (diff < 0) return 'RECENTLY';
    return `IN ${diff} DAYS`;
  }

  renderSlide(slide) {
    switch (slide.type) {
      case 'upcoming':   return this.renderUpcoming(slide.events);
      case 'event':      return this.renderEvent(slide.event);
      case 'membership': return this.renderMembership();
      case 'schedule':   return this.renderSchedule();
      default:           return '';
    }
  }

  // ─── Upcoming Events Slide ───────────────────────────────────────────────────

  renderUpcoming(events) {
    const ev = events[0];
    const countdown = this.daysUntil(ev.date);
    return `
      <div class="flex items-center justify-center h-full px-20 gap-16">

        <!-- Left: giant label + countdown -->
        <div class="flex-shrink-0 text-center">
          <div class="text-baby-blue text-xs font-black uppercase tracking-widest mb-4">Next Up</div>
          <div class="font-black text-white leading-none mb-8" style="font-size: clamp(4rem, 8vw, 7rem); line-height: 0.95;">
            COMING<br/>UP
          </div>
          <div class="inline-block bg-energy-yellow text-mirage font-black px-8 py-3 rounded-xl tracking-widest"
               style="font-size: clamp(1rem, 2vw, 1.5rem);">
            ${countdown}
          </div>
        </div>

        <!-- Divider -->
        <div class="flex-shrink-0 w-px h-56 bg-baby-blue/25 rounded-full"></div>

        <!-- Right: event info -->
        <div class="flex-1 min-w-0">
          <div class="text-baby-blue text-xs font-black uppercase tracking-widest mb-4">Upcoming Event</div>
          <h2 class="font-black text-white leading-tight mb-6"
              style="font-size: clamp(2.5rem, 5vw, 4rem);">
            ${ev.title}
          </h2>
          <div class="flex flex-wrap gap-8 mb-6">
            <div class="flex items-center gap-2 text-energy-yellow font-semibold text-lg">
              ${CALENDAR_SVG}
              <span>${ev.dateDisplay}</span>
            </div>
            ${ev.location ? `
            <div class="flex items-center gap-2 text-baby-blue font-semibold text-lg">
              ${LOCATION_SVG}
              <span>${ev.location}</span>
            </div>` : ''}
          </div>
          <p class="text-periwinkle-gray leading-relaxed" style="font-size: clamp(1rem, 1.5vw, 1.25rem);">
            ${ev.description}
          </p>
        </div>

      </div>
    `;
  }

  // ─── Recent Event Photo Slide ─────────────────────────────────────────────────

  renderEvent(event) {
    const firstImg = event.gallery.length > 0 ? event.gallery[0] : event.image;
    return `
      <div class="relative h-full w-full overflow-hidden">

        <!-- Background photo (fades between gallery images) -->
        <div
          id="event-bg"
          style="
            background-image: url('${this.imgUrl(firstImg)}');
            background-size: cover;
            background-position: center;
            transition: opacity 0.6s ease;
          "
          class="absolute inset-0"
        ></div>

        <!-- Gradient overlay: dark at bottom, subtle at top -->
        <div class="absolute inset-0"
             style="background: linear-gradient(to top,
               rgba(29,25,50,0.97) 0%,
               rgba(29,25,50,0.55) 45%,
               rgba(29,25,50,0.1) 100%);">
        </div>

        <!-- Badge: top-left -->
        <div class="absolute top-8 left-10">
          <span class="border border-baby-blue text-baby-blue text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full"
                style="background: rgba(130,214,255,0.12);">
            Recent Event
          </span>
        </div>

        <!-- Photo count: top-right -->
        ${event.gallery.length > 1 ? `
        <div class="absolute top-8 right-10 text-white text-sm font-semibold px-3 py-1.5 rounded-full"
             style="background: rgba(0,0,0,0.45); backdrop-filter: blur(4px);">
          ${event.gallery.length} photos
        </div>` : ''}

        <!-- Event info: bottom-left -->
        <div class="absolute bottom-10 left-10 right-10">
          <h2 class="font-black text-white leading-tight mb-4"
              style="font-size: clamp(2.5rem, 5vw, 4rem); text-shadow: 0 2px 12px rgba(0,0,0,0.6);">
            ${event.title}
          </h2>
          <div class="flex flex-wrap gap-8 mb-3">
            <div class="flex items-center gap-2 text-energy-yellow font-semibold text-lg">
              ${CALENDAR_SVG}
              <span>${event.dateDisplay}</span>
            </div>
            ${event.location ? `
            <div class="flex items-center gap-2 text-baby-blue font-semibold text-lg">
              ${LOCATION_SVG}
              <span>${event.location}</span>
            </div>` : ''}
          </div>
          <p class="text-periwinkle-gray leading-relaxed" style="font-size: clamp(0.95rem, 1.4vw, 1.15rem); text-shadow: 0 1px 6px rgba(0,0,0,0.8);">
            ${event.description}
          </p>
        </div>

      </div>
    `;
  }

  // ─── Membership Perks Slide ───────────────────────────────────────────────────

  renderMembership() {
    return `
      <div class="flex flex-col items-center justify-center h-full px-16 gap-8">

        <div class="text-baby-blue text-xs font-black uppercase tracking-widest">Wildcats Esports Club</div>
        <h2 class="font-black text-white text-center leading-tight"
            style="font-size: clamp(2.5rem, 5vw, 4rem);">
          JOIN OUR MEMBERSHIP <span class="text-energy-yellow">$5</span>
        </h2>

        <!-- Card -->
        <div class="relative w-full rounded-2xl overflow-hidden border border-baby-blue/25"
             style="max-width: 860px; background: linear-gradient(135deg, #2b2353 0%, #1d1932 55%, #3a1a5a 100%);">

          <!-- Decorative glow -->
          <div class="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none"
               style="background: radial-gradient(circle, rgba(130,214,255,0.18), transparent); transform: translate(30%,-30%);"></div>

          <div class="relative p-10">
            <!-- Card header -->
            <div class="flex items-center mb-8">
              <div>
                <div class="text-baby-blue/60 text-xs font-black uppercase tracking-widest mb-1">Membership Card</div>
                <div class="text-white font-black text-2xl">WILDCATS ESPORTS</div>
              </div>
            </div>

            <!-- Perks grid -->
            <div class="grid grid-cols-3 gap-5">
              <div class="flex flex-col items-center text-center gap-3 rounded-xl p-5"
                   style="background: rgba(255,255,255,0.06);">
                <div style="font-size: 2.5rem;">🛒</div>
                <div class="text-white font-bold text-xl">10% Off</div>
                <div class="text-periwinkle-gray text-sm">at Comic Bug</div>
              </div>
              <div class="flex flex-col items-center text-center gap-3 rounded-xl p-5"
                   style="background: rgba(255,255,255,0.06);">
                <div style="font-size: 2.5rem;">🎮</div>
                <div class="text-white font-bold text-xl">Free Entry</div>
                <div class="text-periwinkle-gray text-sm">to all club tournaments</div>
              </div>
              <div class="flex flex-col items-center text-center gap-3 rounded-xl p-5"
                   style="background: rgba(255,255,255,0.06);">
                <div style="font-size: 2.5rem;">🍕</div>
                <div class="text-white font-bold text-xl">Free Pizza</div>
                <div class="text-periwinkle-gray text-sm">at tournaments</div>
              </div>
            </div>
          </div>
        </div>

        <div class="text-periwinkle-gray text-lg">Ask any officer to sign up today!</div>

      </div>
    `;
  }

  // ─── Schedule / Info Slide ────────────────────────────────────────────────────

  renderSchedule() {
    const days = [
      { day: 'MON', time: '12:00 – 1:30 PM' },
      { day: 'TUE', time: '12:00 – 2:00 PM' },
      { day: 'WED', time: '12:00 – 1:30 PM' },
    ];
    return `
      <div class="flex items-center justify-center h-full px-20 gap-20">

        <!-- Left: schedule -->
        <div class="flex-1">
          <div class="text-baby-blue text-xs font-black uppercase tracking-widest mb-4">Come hang with us</div>
          <h2 class="font-black text-white leading-tight mb-8"
              style="font-size: clamp(2rem, 4vw, 3rem);">
            WILDCATS ESPORTS<br/>
            <span class="text-baby-blue">OPEN HOURS</span>
          </h2>

          <div class="space-y-5 mb-8">
            ${days.map(({ day, time }) => `
              <div class="flex items-center gap-6">
                <div class="text-energy-yellow font-black text-2xl w-16 flex-shrink-0">${day}</div>
                <div class="flex-1 h-px" style="background: rgba(43,35,83,0.8);"></div>
                <div class="text-white font-semibold text-2xl">${time}</div>
              </div>
            `).join('')}
          </div>

          <div class="flex items-center gap-3 text-xl">
            <span class="text-baby-blue">${LOCATION_SVG}</span>
            <span class="text-periwinkle-gray font-semibold">TLC 405</span>
          </div>
        </div>

        <!-- Divider -->
        <div class="flex-shrink-0 w-px h-64 rounded-full" style="background: rgba(130,214,255,0.2);"></div>

        <!-- Right: social + join -->
        <div class="flex-1">
          <div class="text-baby-blue text-xs font-black uppercase tracking-widest mb-6">Find us online</div>

          <div class="flex gap-8 mb-10">
            <div class="flex flex-col items-center gap-2">
              <img src="${BASE}images/discord-qr-code.jpg"
                   alt="Discord QR Code"
                   class="rounded-xl"
                   style="width: 120px; height: 120px; object-fit: cover;" />
              <div class="flex items-center gap-2 text-white font-bold">
                <span style="color: #5865F2;">${DISCORD_SVG}</span>
                Discord
              </div>
            </div>
            <div class="flex flex-col items-center gap-2">
              <img src="${BASE}images/wlac-ig-qr-code.png"
                   alt="Instagram QR Code"
                   class="rounded-xl"
                   style="width: 120px; height: 120px; object-fit: cover;" />
              <div class="flex items-center gap-2 text-white font-bold">
                <span style="color: #f472b6;">${INSTAGRAM_SVG}</span>
                Instagram
              </div>
            </div>
          </div>

          <div class="rounded-xl px-6 py-4 border"
               style="background: rgba(130,214,255,0.07); border-color: rgba(130,214,255,0.25);">
            <div class="text-baby-blue font-black uppercase tracking-wide text-lg">
              Free to join &mdash; $5 membership card available
            </div>
          </div>
        </div>

      </div>
    `;
  }
}

new DisplayBoard().init();
