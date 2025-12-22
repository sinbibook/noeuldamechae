/**
 * Popup Modal Handler
 * - Auto-show on page load
 * - "Don't show today" functionality with localStorage
 * - Close on overlay click, button click, or ESC key
 */

(function() {
  'use strict';

  const STORAGE_KEY = 'popup_hidden_until';

  const popupOverlay = document.getElementById('popup-modal');
  const popupClose = document.querySelector('.popup-close');
  const popupConfirmBtn = document.querySelector('.popup-confirm-btn');
  const popupTodayHide = document.getElementById('popup-today-hide');
  const popupContainer = document.querySelector('.popup-container');

  if (!popupOverlay) return;

  /**
   * Check if popup should be shown
   */
  function shouldShowPopup() {
    const hiddenUntil = localStorage.getItem(STORAGE_KEY);
    if (!hiddenUntil) return true;

    const now = new Date().getTime();
    return now > parseInt(hiddenUntil, 10);
  }

  /**
   * Show popup with animation
   */
  function showPopup() {
    popupOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  /**
   * Hide popup with animation
   */
  function hidePopup() {
    // If "don't show today" is checked, save to localStorage
    if (popupTodayHide && popupTodayHide.checked) {
      const tomorrow = new Date();
      tomorrow.setHours(24, 0, 0, 0); // Set to midnight tonight
      localStorage.setItem(STORAGE_KEY, tomorrow.getTime().toString());
    }

    popupOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  /**
   * Initialize popup
   */
  function init() {
    // Check if popup should be shown
    if (!shouldShowPopup()) return;

    // Show popup after a short delay for better UX
    setTimeout(showPopup, 500);

    // Close button click
    if (popupClose) {
      popupClose.addEventListener('click', hidePopup);
    }

    // Confirm button click
    if (popupConfirmBtn) {
      popupConfirmBtn.addEventListener('click', hidePopup);
    }

    // Overlay click (close when clicking outside)
    popupOverlay.addEventListener('click', function(e) {
      if (e.target === popupOverlay) {
        hidePopup();
      }
    });

    // ESC key to close
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && popupOverlay.classList.contains('active')) {
        hidePopup();
      }
    });

    // Prevent popup container click from closing
    if (popupContainer) {
      popupContainer.addEventListener('click', function(e) {
        e.stopPropagation();
      });
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
