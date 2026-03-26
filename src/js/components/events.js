/**
 * Events Component
 * Fetches event data from /data/events.json and renders event cards
 * into the appropriate containers on index.html and events.html.
 */

const CALENDAR_ICON = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
</svg>`;

const LOCATION_ICON = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
</svg>`;

const PHOTO_ICON = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
</svg>`;

export class Events {
  constructor() {
    this.base = import.meta.env.BASE_URL;
    this.init();
  }

  async init() {
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}data/events.json`);
      const { events } = await res.json();

      // Sort by date descending (newest first)
      events.sort((a, b) => new Date(b.date) - new Date(a.date));

      const past = events.filter(e => e.status === 'past');
      const upcoming = events.filter(e => e.status === 'upcoming');

      this.renderHomePage(past);
      this.renderEventsPage(past, upcoming);
    } catch (err) {
      console.error('Failed to load events:', err);
    }
  }

  renderHomePage(past) {
    const container = document.getElementById('home-recent-event');
    if (!container) return;

    const event = past[0];
    if (!event) return;

    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-3 bg-mirage rounded-xl overflow-hidden">
        <div class="relative h-64 md:h-full min-h-[300px] bg-gray-900/50">
          <img
            src="${this.base}${event.image.replace(/^\//, '')}"
            alt="${event.imageAlt}"
            class="absolute inset-0 w-full h-full object-cover"
          />
          <div class="absolute top-4 left-4 z-10">
            <span class="${event.badgeClass} event-badge">Recent</span>
          </div>
        </div>
        <div class="md:col-span-2 p-8 lg:p-12 flex flex-col justify-center">
          <h4 class="text-3xl font-bold text-white mb-4">${event.title}</h4>
          <div class="flex flex-wrap gap-6 text-sm text-periwinkle-gray mb-6">
            <div class="flex items-center gap-2 ${event.dateColor}">
              ${CALENDAR_ICON}
              <span class="font-medium">${event.dateDisplay}</span>
            </div>
            ${event.location ? `
            <div class="flex items-center gap-2 ${event.dateColor}">
              ${LOCATION_ICON}
              <span class="font-medium">${event.location}</span>
            </div>` : ''}
          </div>
          <p class="text-periwinkle-gray leading-relaxed mb-8">${event.description}</p>
          <div>
            <a href="./events.html" class="btn-secondary inline-block">View All Events</a>
          </div>
        </div>
      </div>
    `;
  }

  renderEventsPage(past, upcoming) {
    const upcomingContainer = document.getElementById('upcoming-events-container');
    const pastContainer = document.getElementById('past-events-container');

    if (upcomingContainer) {
      if (upcoming.length === 0) {
        upcomingContainer.innerHTML = `
          <div class="text-center py-12">
            <p class="text-xl text-periwinkle-gray">Stay tuned for upcoming events! Follow us on Discord and Instagram for announcements.</p>
          </div>
        `;
      } else {
        upcomingContainer.innerHTML = upcoming.map(e => this.buildEventCard(e)).join('');
      }
    }

    if (pastContainer) {
      pastContainer.innerHTML = past.map(e => this.buildEventCard(e)).join('');
    }
  }

  buildEventCard(event) {
    const galleryLink = event.galleryId
      ? `./gallery.html#${event.galleryId}`
      : null;

    return `
      <article class="bg-mirage rounded-lg overflow-hidden border border-port-gore card-hover">
        <div class="grid grid-cols-1 md:grid-cols-3">
          <${galleryLink ? `a href="${galleryLink}"` : 'div'} class="relative h-64 md:h-auto overflow-hidden">
            <img src="${this.base}${event.image.replace(/^\//, '')}" alt="${event.imageAlt}" class="absolute inset-0 w-full h-full object-cover">
            <div class="absolute top-4 left-4">
              <span class="${event.badgeClass} event-badge">${event.badgeText}</span>
            </div>
          </${galleryLink ? 'a' : 'div'}>
          <div class="md:col-span-2 p-8">
            <h4 class="text-3xl font-bold text-white mb-4">${event.title}</h4>
            <div class="flex items-center gap-2 ${event.dateColor} mb-4">
              ${CALENDAR_ICON}
              <span class="font-semibold">${event.dateDisplay}</span>
            </div>
            <p class="text-periwinkle-gray leading-relaxed ${galleryLink ? 'mb-6' : ''}">${event.description}</p>
            ${galleryLink ? `
            <a href="${galleryLink}" class="inline-flex items-center gap-2 text-baby-blue hover:text-energy-yellow transition-colors font-semibold">
              ${PHOTO_ICON}
              <span>View Event Photos</span>
            </a>` : ''}
          </div>
        </div>
      </article>
    `;
  }
}
