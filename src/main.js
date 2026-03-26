/**
 * Main Entry Point
 * Initializes all interactive components
 */

import './style.css';
import { Navbar } from './js/components/navbar.js';
import { Mascot } from './js/components/mascot.js';
import { Gallery } from './js/components/gallery.js';
import { Events } from './js/components/events.js';


/**
 * Initialize application on DOM content loaded
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize navbar with mobile menu functionality
  new Navbar();

  // Initialize 3D mascot (placeholder for now)
  new Mascot('mascot-canvas');

  // Initialize gallery lightbox functionality
  new Gallery();

  // Load and render events from data/events.json
  new Events();
});
