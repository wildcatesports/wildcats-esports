/**
 * Navbar Component
 * Handles mobile menu toggle functionality
 */

export class Navbar {
  constructor() {
    this.mobileMenuButton = document.getElementById('mobile-menu-button');
    this.mobileMenu = document.getElementById('mobile-menu');
    this.isOpen = false;

    this.init();
  }

  /**
   * Initialize navbar event listeners
   */
  init() {
    if (this.mobileMenuButton && this.mobileMenu) {
      this.mobileMenuButton.addEventListener('click', () => this.toggleMobileMenu());

      // Close mobile menu when clicking outside
      document.addEventListener('click', (e) => this.handleOutsideClick(e));

      // Close mobile menu on window resize to desktop size
      window.addEventListener('resize', () => this.handleResize());
    }
  }

  /**
   * Toggle mobile menu visibility
   */
  toggleMobileMenu() {
    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      this.mobileMenu.classList.remove('hidden');
      this.mobileMenuButton.setAttribute('aria-expanded', 'true');
    } else {
      this.mobileMenu.classList.add('hidden');
      this.mobileMenuButton.setAttribute('aria-expanded', 'false');
    }
  }

  /**
   * Close mobile menu if clicking outside of it
   * @param {Event} e - Click event
   */
  handleOutsideClick(e) {
    if (this.isOpen &&
        !this.mobileMenu.contains(e.target) &&
        !this.mobileMenuButton.contains(e.target)) {
      this.toggleMobileMenu();
    }
  }

  /**
   * Close mobile menu when resizing to desktop
   */
  handleResize() {
    if (window.innerWidth >= 768 && this.isOpen) {
      this.isOpen = false;
      this.mobileMenu.classList.add('hidden');
      this.mobileMenuButton.setAttribute('aria-expanded', 'false');
    }
  }
}
