'use strict';

/**
 * Accordion block functionality
 *
 * @author Shannon MacMillan, Corey Collins
 */
window.accordionBlockToggle = {};
(function (window, $, app) {

	// Constructor
	app.init = function () {
		app.cache();

		// If we're in an ACF edit page.
		if (window.acf) {
			window.acf.addAction('render_block_preview', app.bindEvents);
		}

		if (app.meetsRequirements()) {
			app.bindEvents();
		}
	};

	// Cache all the things
	app.cache = function () {
		app.$c = {
			window: $(window),
			html: $('html'),
			accordion: $('.accordion'),
			items: $('.accordion-item'),
			headers: $('.accordion-item-header'),
			contents: $('.accordion-item-content'),
			button: $('.accordion-item-toggle'),
			anchorID: $(window.location.hash)
		};
	};

	// Combine all events
	app.bindEvents = function () {
		$('.accordion-item-header').on('click touchstart', app.toggleAccordion);
		$('.accordion-item-toggle').on('click touchstart', app.toggleAccordion);
		app.$c.window.on('load', app.openHashAccordion);
	};

	// Do we meet the requirements?
	app.meetsRequirements = function () {
		return app.$c.accordion.length;
	};

	app.toggleAccordion = function () {

		// Add the open class to the item.
		$(this).parents('.accordion-item').toggleClass('open');

		// Is this one expanded?
		var isExpanded = $(this).parents('.accordion-item').hasClass('open');

		// Set this button's aria-expanded value.
		$(this).parents('.accordion-item').find('.accordion-item-toggle').attr('aria-expanded', isExpanded ? 'true' : 'false');

		// Set all other items in this block to aria-hidden=true.
		$(this).parents('.accordion-block').find('.accordion-item-content').not($(this).parents('.accordion-item')).attr('aria-hidden', 'true');

		// Set this item to aria-hidden=false.
		$(this).parents('.accordion-item').find('.accordion-item-content').attr('aria-hidden', isExpanded ? 'false' : 'true');

		// Hide the other panels.
		$(this).parents('.accordion-block').find('.accordion-item').not($(this).parents('.accordion-item')).removeClass('open');
		$(this).parents('.accordion-block').find('.accordion-item-toggle').not($(this)).attr('aria-expanded', 'false');

		return false;
	};

	app.openHashAccordion = function () {

		if (!app.$c.anchorID.selector) {
			return;
		}

		// Trigger a click on the button closest to this accordion.
		app.$c.anchorID.parents('.accordion-item').find('.accordion-item-toggle').trigger('click');

		// Not setting a cached variable as it doesn't seem to grab the height properly.
		var adminBarHeight = $('#wpadminbar').length ? $('#wpadminbar').height() : 0;

		// Animate to the div for a nicer experience.
		app.$c.html.animate({
			scrollTop: app.$c.anchorID.offset().top - adminBarHeight
		}, 'slow');
	};

	// Engage
	app.init();
})(window, jQuery, window.accordionBlockToggle);
'use strict';

/**
 * File carousel.js
 *
 * Deal with the Slick carousel.
 */
window.wdsCarousel = {};
(function (window, $, app) {

	// Constructor.
	app.init = function () {
		app.cache();

		// If we're in an ACF edit page.
		if (window.acf) {
			app.doSlick();
		}

		if (app.meetsRequirements()) {
			app.bindEvents();
		}
	};

	// Cache all the things.
	app.cache = function () {
		app.$c = {
			window: $(window),
			theCarousel: $('.carousel-block')
		};
	};

	// Combine all events.
	app.bindEvents = function () {
		app.$c.window.on('load', app.doSlick);
		app.$c.window.on('load', app.doFirstAnimation);
	};

	// Do we meet the requirements?
	app.meetsRequirements = function () {
		return app.$c.theCarousel.length;
	};

	// Animate the first slide on window load.
	app.doFirstAnimation = function () {

		// Get the first slide content area and animation attribute.
		var firstSlide = app.$c.theCarousel.find('[data-slick-index=0]'),
			firstSlideContent = firstSlide.find('.slide-content'),
			firstAnimation = firstSlideContent.attr('data-animation');

		// Add the animation class to the first slide.
		firstSlideContent.addClass(firstAnimation);
	};

	// Allow background videos to autoplay.
	app.playBackgroundVideos = function () {

		// Get all the videos in our slides object.
		$('video').each(function () {

			// Let them autoplay. TODO: Possibly change this later to only play the visible slide video.
			this.play();
		});
	};

	// Initialize our carousel.
	app.initializeCarousel = function () {

		$('.carousel-block').not('.slick-initialized').slick({
			autoplay: true,
			autoplaySpeed: 5000,
			arrows: true,
			dots: true,
			focusOnSelect: true,
			waitForAnimate: true
		});
	};

	// Kick off Slick.
	app.doSlick = function () {

		// Render on the frontend.
		$(document).ready(function () {
			app.playBackgroundVideos;
			app.initializeCarousel();
		});

		// Render on the backend.
		if (window.acf) {
			window.acf.addAction('render_block_preview', app.initializeCarousel);
		}
	};

	// Engage!
	$(app.init);
})(window, jQuery, window.wdsCarousel);
'use strict';

/**
 * Show/Hide the Search Form in the header.
 *
 * @author Corey Collins
 */
window.ShowHideSearchForm = {};
(function (window, $, app) {

	// Constructor
	app.init = function () {
		app.cache();

		if (app.meetsRequirements()) {
			app.bindEvents();
		}
	};

	// Cache all the things
	app.cache = function () {
		app.$c = {
			window: $(window),
			body: $('body'),
			headerSearchToggle: $('.site-header-action .cta-button'),
			headerSearchForm: $('.site-header-action .form-container')
		};
	};

	// Combine all events
	app.bindEvents = function () {
		app.$c.headerSearchToggle.on('keyup touchstart click', app.showHideSearchForm);
		app.$c.body.on('keyup touchstart click', app.hideSearchForm);
	};

	// Do we meet the requirements?
	app.meetsRequirements = function () {
		return app.$c.headerSearchToggle.length;
	};

	// Checks to see if the menu has been opened.
	app.searchIsOpen = function () {

		if (app.$c.body.hasClass('search-form-visible')) {
			return true;
		}

		return false;
	};

	// Adds the toggle class for the search form.
	app.showHideSearchForm = function () {
		app.$c.body.toggleClass('search-form-visible');

		app.toggleSearchFormAriaLabel();
		app.toggleSearchToggleAriaLabel();

		return false;
	};

	// Hides the search form if we click outside of its container.
	app.hideSearchForm = function (event) {

		if (!$(event.target).parents('div').hasClass('site-header-action')) {
			app.$c.body.removeClass('search-form-visible');
			app.toggleSearchFormAriaLabel();
			app.toggleSearchToggleAriaLabel();
		}
	};

	// Toggles the aria-hidden label on the form container.
	app.toggleSearchFormAriaLabel = function () {
		app.$c.headerSearchForm.attr('aria-hidden', app.searchIsOpen() ? 'false' : 'true');
	};

	// Toggles the aria-hidden label on the toggle button.
	app.toggleSearchToggleAriaLabel = function () {
		app.$c.headerSearchToggle.attr('aria-expanded', app.searchIsOpen() ? 'true' : 'false');
	};

	// Engage
	$(app.init);
})(window, jQuery, window.ShowHideSearchForm);
'use strict';

/**
 * File js-enabled.js
 *
 * If Javascript is enabled, replace the <body> class "no-js".
 */
document.body.className = document.body.className.replace('no-js', 'js');
"use strict";

(function ($) {
  // init Masonry
  var $grid = $(".grid-layout").masonry({
	// set itemSelector so .grid-sizer is not used in layout
	columnWidth: ".span-1",
	itemSelector: ".grid-item"
	// stamp: '.stamp'
  });
  // layout Masonry after each image loads
  $grid.imagesLoaded().progress(function () {
	$grid.masonry("layout");
	console.log('layouted');
  });
})(jQuery);
'use strict';

/**
 * File: mobile-menu.js
 *
 * Create an accordion style dropdown.
 */
window.wdsMobileMenu = {};
(function (window, $, app) {

	// Constructor.
	app.init = function () {
		app.cache();

		if (app.meetsRequirements()) {
			app.bindEvents();
		}
	};

	// Cache all the things.
	app.cache = function () {
		app.$c = {
			body: $('body'),
			window: $(window),
			subMenuContainer: $('.mobile-menu .sub-menu, .utility-navigation .sub-menu'),
			subSubMenuContainer: $('.mobile-menu .sub-menu .sub-menu'),
			subMenuParentItem: $('.mobile-menu li.menu-item-has-children, .utility-navigation li.menu-item-has-children'),
			offCanvasContainer: $('.off-canvas-container')
		};
	};

	// Combine all events.
	app.bindEvents = function () {
		app.$c.window.on('load', app.addDownArrow);
		app.$c.subMenuParentItem.on('click', app.toggleSubmenu);
		app.$c.subMenuParentItem.on('transitionend', app.resetSubMenu);
		app.$c.offCanvasContainer.on('transitionend', app.forceCloseSubmenus);
	};

	// Do we meet the requirements?
	app.meetsRequirements = function () {
		return app.$c.subMenuContainer.length;
	};

	// Reset the submenus after it's done closing.
	app.resetSubMenu = function () {

		// When the list item is done transitioning in height,
		// remove the classes from the submenu so it is ready to toggle again.
		if ($(this).is('li.menu-item-has-children') && !$(this).hasClass('is-visible')) {
			$(this).find('ul.sub-menu').removeClass('slideOutLeft is-visible');
		}
	};

	// Slide out the submenu items.
	app.slideOutSubMenus = function (el) {

		// If this item's parent is visible and this is not, bail.
		if (el.parent().hasClass('is-visible') && !el.hasClass('is-visible')) {
			return;
		}

		// If this item's parent is visible and this item is visible, hide its submenu then bail.
		if (el.parent().hasClass('is-visible') && el.hasClass('is-visible')) {
			el.removeClass('is-visible').find('.sub-menu').removeClass('slideInLeft').addClass('slideOutLeft');
			return;
		}

		app.$c.subMenuContainer.each(function () {

			// Only try to close submenus that are actually open.
			if ($(this).hasClass('slideInLeft')) {

				// Close the parent list item, and set the corresponding button aria to false.
				$(this).parent().removeClass('is-visible').find('.parent-indicator').attr('aria-expanded', false);

				// Slide out the submenu.
				$(this).removeClass('slideInLeft').addClass('slideOutLeft');
			}
		});
	};

	// Add the down arrow to submenu parents.
	app.addDownArrow = function () {

		app.$c.subMenuParentItem.find('a:first').after('<button type="button" aria-expanded="false" class="parent-indicator" aria-label="Open submenu"><span class="down-arrow"></span></button>');
	};

	// Deal with the submenu.
	app.toggleSubmenu = function (e) {

		var el = $(this),
			// The menu element which was clicked on.
		subMenu = el.children('ul.sub-menu'),
			// The nearest submenu.
		$target = $(e.target); // the element that's actually being clicked (child of the li that triggered the click event).

		// Figure out if we're clicking the button or its arrow child,
		// if so, we can just open or close the menu and bail.
		if ($target.hasClass('down-arrow') || $target.hasClass('parent-indicator')) {

			// First, collapse any already opened submenus.
			app.slideOutSubMenus(el);

			if (!subMenu.hasClass('is-visible')) {

				// Open the submenu.
				app.openSubmenu(el, subMenu);
			}

			return false;
		}
	};

	// Open a submenu.
	app.openSubmenu = function (parent, subMenu) {

		// Expand the list menu item, and set the corresponding button aria to true.
		parent.addClass('is-visible').find('.parent-indicator').attr('aria-expanded', true);

		// Slide the menu in.
		subMenu.addClass('is-visible animated slideInLeft');
	};

	// Force close all the submenus when the main menu container is closed.
	app.forceCloseSubmenus = function (event) {
		if ($(event.target).hasClass('off-canvas-container')) {

			// Focus offcanvas menu for a11y.
			app.$c.offCanvasContainer.focus();

			// The transitionend event triggers on open and on close, need to make sure we only do this on close.
			if (!$(this).hasClass('is-visible')) {
				app.$c.subMenuParentItem.removeClass('is-visible').find('.parent-indicator').attr('aria-expanded', false);
				app.$c.subMenuContainer.removeClass('is-visible slideInLeft');
				app.$c.body.css('overflow', 'visible');
				app.$c.body.unbind('touchstart');
			}

			if ($(this).hasClass('is-visible')) {
				app.$c.body.css('overflow', 'hidden');
				app.$c.body.bind('touchstart', function (e) {
					if (!$(e.target).parents('.contact-modal')[0]) {
						e.preventDefault();
					}
				});
			}
		}
	};

	// Engage!
	$(app.init);
})(window, jQuery, window.wdsMobileMenu);
'use strict';

/**
 * File modal.js
 *
 * Deal with multiple modals and their media.
 */
window.wdsModal = {};
(function (window, $, app) {

	var $modalToggle = void 0,
		$focusableChildren = void 0,
		$player = void 0,
		$tag = document.createElement('script'),
		$firstScriptTag = document.getElementsByTagName('script')[0],
		YT = void 0;

	// Constructor.
	app.init = function () {
		app.cache();

		if (app.meetsRequirements()) {
			$firstScriptTag.parentNode.insertBefore($tag, $firstScriptTag);
			app.bindEvents();
		}
	};

	// Cache all the things.
	app.cache = function () {
		app.$c = {
			'body': $('body')
		};
	};

	// Do we meet the requirements?
	app.meetsRequirements = function () {
		return $('.modal-trigger').length;
	};

	// Combine all events.
	app.bindEvents = function () {

		// Trigger a modal to open.
		app.$c.body.on('click touchstart', '.modal-trigger', app.openModal);

		// Trigger the close button to close the modal.
		app.$c.body.on('click touchstart', '.close', app.closeModal);

		// Allow the user to close the modal by hitting the esc key.
		app.$c.body.on('keydown', app.escKeyClose);

		// Allow the user to close the modal by clicking outside of the modal.
		app.$c.body.on('click touchstart', 'div.modal-open', app.closeModalByClick);

		// Listen to tabs, trap keyboard if we need to
		app.$c.body.on('keydown', app.trapKeyboardMaybe);
	};

	// Open the modal.
	app.openModal = function () {

		// Store the modal toggle element
		$modalToggle = $(this);

		// Figure out which modal we're opening and store the object.
		var $modal = $($(this).data('target'));

		// Display the modal.
		$modal.addClass('modal-open');

		// Add body class.
		app.$c.body.addClass('modal-open');

		// Find the focusable children of the modal.
		// This list may be incomplete, really wish jQuery had the :focusable pseudo like jQuery UI does.
		// For more about :input see: https://api.jquery.com/input-selector/
		$focusableChildren = $modal.find('a, :input, [tabindex]');

		// Ideally, there is always one (the close button), but you never know.
		if (0 < $focusableChildren.length) {

			// Shift focus to the first focusable element.
			$focusableChildren[0].focus();
		}
	};

	// Close the modal.
	app.closeModal = function () {

		// Figure the opened modal we're closing and store the object.
		var $modal = $($('div.modal-open .close').data('target')),


		// Find the iframe in the $modal object.
		$iframe = $modal.find('iframe');

		// Only do this if there are any iframes.
		if ($iframe.length) {

			// Get the iframe src URL.
			var url = $iframe.attr('src');

			// Removing/Readding the URL will effectively break the YouTube API.
			// So let's not do that when the iframe URL contains the enablejsapi parameter.
			if (!url.includes('enablejsapi=1')) {

				// Remove the source URL, then add it back, so the video can be played again later.
				$iframe.attr('src', '').attr('src', url);
			} else {

				// Use the YouTube API to stop the video.
				$player.stopVideo();
			}
		}

		// Finally, hide the modal.
		$modal.removeClass('modal-open');

		// Remove the body class.
		app.$c.body.removeClass('modal-open');

		// Revert focus back to toggle element
		$modalToggle.focus();
	};

	// Close if "esc" key is pressed.
	app.escKeyClose = function (event) {
		if (27 === event.keyCode) {
			app.closeModal();
		}
	};

	// Close if the user clicks outside of the modal
	app.closeModalByClick = function (event) {

		// If the parent container is NOT the modal dialog container, close the modal
		if (!$(event.target).parents('div').hasClass('modal-dialog')) {
			app.closeModal();
		}
	};

	// Trap the keyboard into a modal when one is active.
	app.trapKeyboardMaybe = function (event) {

		// We only need to do stuff when the modal is open and tab is pressed.
		if (9 === event.which && 0 < $('.modal-open').length) {
			var $focused = $(':focus'),
				focusIndex = $focusableChildren.index($focused);

			if (0 === focusIndex && event.shiftKey) {

				// If this is the first focusable element, and shift is held when pressing tab, go back to last focusable element.
				$focusableChildren[$focusableChildren.length - 1].focus();
				event.preventDefault();
			} else if (!event.shiftKey && focusIndex === $focusableChildren.length - 1) {

				// If this is the last focusable element, and shift is not held, go back to the first focusable element.
				$focusableChildren[0].focus();
				event.preventDefault();
			}
		}
	};

	// Hook into YouTube <iframe>.
	app.onYouTubeIframeAPIReady = function () {
		var $modal = $('div.modal'),
			$iframeid = $modal.find('iframe').attr('id');

		$player = new YT.Player($iframeid, {
			events: {
				'onReady': app.onPlayerReady,
				'onStateChange': app.onPlayerStateChange
			}
		});
	};

	// Do something on player ready.
	app.onPlayerReady = function () {};

	// Do something on player state change.
	app.onPlayerStateChange = function () {

		// Set focus to the first focusable element inside of the modal the player is in.
		$(event.target.a).parents('.modal').find('a, :input, [tabindex]').first().focus();
	};

	// Engage!
	$(app.init);
})(window, jQuery, window.wdsModal);
'use strict';

/**
 * File: navigation-primary.js
 *
 * Helpers for the primary navigation.
 */
window.wdsPrimaryNavigation = {};
(function (window, $, app) {

	// Constructor.
	app.init = function () {
		app.cache();

		if (app.meetsRequirements()) {
			app.bindEvents();
		}
	};

	// Cache all the things.
	app.cache = function () {
		app.$c = {
			window: $(window),
			subMenuContainer: $('.main-navigation .sub-menu'),
			subMenuParentItem: $('.main-navigation li.menu-item-has-children')
		};
	};

	// Combine all events.
	app.bindEvents = function () {
		app.$c.window.on('load', app.addDownArrow);
		app.$c.subMenuParentItem.find('a').on('focusin focusout', app.toggleFocus);
	};

	// Do we meet the requirements?
	app.meetsRequirements = function () {
		return app.$c.subMenuContainer.length;
	};

	// Add the down arrow to submenu parents.
	app.addDownArrow = function () {
		app.$c.subMenuParentItem.find('> a').append('<span class="caret-down" aria-hidden="true"></span>');
	};

	// Toggle the focus class on the link parent.
	app.toggleFocus = function () {
		$(this).parents('li.menu-item-has-children').toggleClass('focus');
	};

	// Engage!
	$(app.init);
})(window, jQuery, window.wdsPrimaryNavigation);
'use strict';

/**
 * File: off-canvas.js
 *
 * Help deal with the off-canvas mobile menu.
 */
window.wdsoffCanvas = {};
(function (window, $, app) {

	// Constructor.
	app.init = function () {
		app.cache();

		if (app.meetsRequirements()) {
			app.bindEvents();
		}
	};

	// Cache all the things.
	app.cache = function () {
		app.$c = {
			body: $('body'),
			offCanvasClose: $('.off-canvas-close'),
			offCanvasContainer: $('.off-canvas-container'),
			offCanvasOpen: $('.off-canvas-open'),
			offCanvasScreen: $('.off-canvas-screen')
		};
	};

	// Combine all events.
	app.bindEvents = function () {
		app.$c.body.on('keydown', app.escKeyClose);
		app.$c.offCanvasClose.on('click', app.closeoffCanvas);
		app.$c.offCanvasOpen.on('click', app.toggleoffCanvas);
		app.$c.offCanvasScreen.on('click', app.closeoffCanvas);
	};

	// Do we meet the requirements?
	app.meetsRequirements = function () {
		return app.$c.offCanvasContainer.length;
	};

	// To show or not to show?
	app.toggleoffCanvas = function () {

		if ('true' === $(this).attr('aria-expanded')) {
			app.closeoffCanvas();
		} else {
			app.openoffCanvas();
		}
	};

	// Show that drawer!
	app.openoffCanvas = function () {
		app.$c.offCanvasContainer.addClass('is-visible');
		app.$c.offCanvasOpen.addClass('is-visible');
		app.$c.offCanvasScreen.addClass('is-visible');

		app.$c.offCanvasOpen.attr('aria-expanded', true);
		app.$c.offCanvasContainer.attr('aria-hidden', false);
	};

	// Close that drawer!
	app.closeoffCanvas = function () {
		app.$c.offCanvasContainer.removeClass('is-visible');
		app.$c.offCanvasOpen.removeClass('is-visible');
		app.$c.offCanvasScreen.removeClass('is-visible');

		app.$c.offCanvasOpen.attr('aria-expanded', false);
		app.$c.offCanvasContainer.attr('aria-hidden', true);

		app.$c.offCanvasOpen.focus();
	};

	// Close drawer if "esc" key is pressed.
	app.escKeyClose = function (event) {
		if (27 === event.keyCode) {
			app.closeoffCanvas();
		}
	};

	// Engage!
	$(app.init);
})(window, jQuery, window.wdsoffCanvas);
'use strict';

/**
 * File skip-link-focus-fix.js.
 *
 * Helps with accessibility for keyboard only users.
 *
 * Learn more: https://git.io/vWdr2
 */
(function () {
	var isWebkit = -1 < navigator.userAgent.toLowerCase().indexOf('webkit'),
		isOpera = -1 < navigator.userAgent.toLowerCase().indexOf('opera'),
		isIe = -1 < navigator.userAgent.toLowerCase().indexOf('msie');

	if ((isWebkit || isOpera || isIe) && document.getElementById && window.addEventListener) {
		window.addEventListener('hashchange', function () {
			var id = location.hash.substring(1),
				element;

			if (!/^[A-z0-9_-]+$/.test(id)) {
				return;
			}

			element = document.getElementById(id);

			if (element) {
				if (!/^(?:a|select|input|button|textarea)$/i.test(element.tagName)) {
					element.tabIndex = -1;
				}

				element.focus();
			}
		}, false);
	}
})();
'use strict';

/**
 * Make tables responsive again.
 *
 * @author Haris Zulfiqar
 */
window.wdsTables = {};
(function (window, $, app) {

	// Constructor
	app.init = function () {
		app.cache();

		if (app.meetsRequirements()) {
			app.bindEvents();
		}
	};

	// Cache all the things
	app.cache = function () {
		app.$c = {
			window: $(window),
			table: $('table')
		};
	};

	// Combine all events
	app.bindEvents = function () {
		app.$c.window.on('load', app.addDataLabel);
	};

	// Do we meet the requirements?
	app.meetsRequirements = function () {
		return app.$c.table.length;
	};

	// Adds data-label to td based on th.
	app.addDataLabel = function () {
		var table = app.$c.table;
		var tableHeaders = table.find('thead th');
		var tableRow = table.find('tbody tr');

		tableRow.each(function () {
			var td = $(this).find('td');

			td.each(function (index) {
				if ($(tableHeaders.get(index))) {
					$(this).attr('data-label', $(tableHeaders.get(index)).text());
				}
			});
		});

		return false;
	};

	// Engage
	$(app.init);
})(window, jQuery, window.wdsTables);
'use strict';

/**
 * Video Playback Script.
 */
window.WDSVideoBackgroundObject = {};
(function (window, $, app) {

	// Constructor.
	app.init = function () {
		app.cache();

		if (app.meetsRequirements()) {
			app.bindEvents();
		}
	};

	// Cache all the things.
	app.cache = function () {
		app.$c = {
			window: $(window),
			videoButton: $('.video-toggle')
		};
	};

	// Combine all events.
	app.bindEvents = function () {
		app.$c.videoButton.on('click', app.doTogglePlayback);
	};

	// Do we meet the requirements?
	app.meetsRequirements = function () {
		return app.$c.videoButton.length;
	};

	// Video Playback.
	app.doTogglePlayback = function () {
		$(this).parents('.content-block').toggleClass('video-toggled');

		if ($(this).parents('.content-block').hasClass('video-toggled')) {
			$(this).siblings('.video-background').trigger('pause');
		} else {
			$(this).siblings('.video-background').trigger('play');
		}
	};

	// Engage!
	$(app.init);
})(window, jQuery, window.WDSVideoBackgroundObject);
'use strict';

/**
 * File window-ready.js
 *
 * Add a "ready" class to <body> when window is ready.
 */
window.wdsWindowReady = {};
(function (window, $, app) {

	// Constructor.
	app.init = function () {
		app.cache();
		app.bindEvents();
	};

	// Cache document elements.
	app.cache = function () {
		app.$c = {
			'window': $(window),
			'body': $(document.body)
		};
	};

	// Combine all events.
	app.bindEvents = function () {
		app.$c.window.load(app.addBodyClass);
	};

	// Add a class to <body>.
	app.addBodyClass = function () {
		app.$c.body.addClass('ready');
	};

	// Engage!
	$(app.init);
})(window, jQuery, window.wdsWindowReady);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFjY29yZGlvbi5qcyIsImNhcm91c2VsLmpzIiwiaGVhZGVyLWJ1dHRvbi5qcyIsImpzLWVuYWJsZWQuanMiLCJtYXNvbnJ5LmpzIiwibW9iaWxlLW1lbnUuanMiLCJtb2RhbC5qcyIsIm5hdmlnYXRpb24tcHJpbWFyeS5qcyIsIm9mZi1jYW52YXMuanMiLCJza2lwLWxpbmstZm9jdXMtZml4LmpzIiwidGFibGUuanMiLCJ2aWRlby5qcyIsIndpbmRvdy1yZWFkeS5qcyJdLCJuYW1lcyI6WyJ3aW5kb3ciLCJhY2NvcmRpb25CbG9ja1RvZ2dsZSIsIiQiLCJhcHAiLCJpbml0IiwiY2FjaGUiLCJhY2YiLCJhZGRBY3Rpb24iLCJiaW5kRXZlbnRzIiwibWVldHNSZXF1aXJlbWVudHMiLCIkYyIsImh0bWwiLCJhY2NvcmRpb24iLCJpdGVtcyIsImhlYWRlcnMiLCJjb250ZW50cyIsImJ1dHRvbiIsImFuY2hvcklEIiwibG9jYXRpb24iLCJoYXNoIiwib24iLCJ0b2dnbGVBY2NvcmRpb24iLCJvcGVuSGFzaEFjY29yZGlvbiIsImxlbmd0aCIsInBhcmVudHMiLCJ0b2dnbGVDbGFzcyIsImlzRXhwYW5kZWQiLCJoYXNDbGFzcyIsImZpbmQiLCJhdHRyIiwibm90IiwicmVtb3ZlQ2xhc3MiLCJzZWxlY3RvciIsInRyaWdnZXIiLCJhZG1pbkJhckhlaWdodCIsImhlaWdodCIsImFuaW1hdGUiLCJzY3JvbGxUb3AiLCJvZmZzZXQiLCJ0b3AiLCJqUXVlcnkiLCJ3ZHNDYXJvdXNlbCIsImRvU2xpY2siLCJ0aGVDYXJvdXNlbCIsImRvRmlyc3RBbmltYXRpb24iLCJmaXJzdFNsaWRlIiwiZmlyc3RTbGlkZUNvbnRlbnQiLCJmaXJzdEFuaW1hdGlvbiIsImFkZENsYXNzIiwicGxheUJhY2tncm91bmRWaWRlb3MiLCJlYWNoIiwicGxheSIsImluaXRpYWxpemVDYXJvdXNlbCIsInNsaWNrIiwiYXV0b3BsYXkiLCJhdXRvcGxheVNwZWVkIiwiYXJyb3dzIiwiZG90cyIsImZvY3VzT25TZWxlY3QiLCJ3YWl0Rm9yQW5pbWF0ZSIsImRvY3VtZW50IiwicmVhZHkiLCJTaG93SGlkZVNlYXJjaEZvcm0iLCJib2R5IiwiaGVhZGVyU2VhcmNoVG9nZ2xlIiwiaGVhZGVyU2VhcmNoRm9ybSIsInNob3dIaWRlU2VhcmNoRm9ybSIsImhpZGVTZWFyY2hGb3JtIiwic2VhcmNoSXNPcGVuIiwidG9nZ2xlU2VhcmNoRm9ybUFyaWFMYWJlbCIsInRvZ2dsZVNlYXJjaFRvZ2dsZUFyaWFMYWJlbCIsImV2ZW50IiwidGFyZ2V0IiwiY2xhc3NOYW1lIiwicmVwbGFjZSIsIiRncmlkIiwibWFzb25yeSIsImNvbHVtbldpZHRoIiwiaXRlbVNlbGVjdG9yIiwiaW1hZ2VzTG9hZGVkIiwicHJvZ3Jlc3MiLCJjb25zb2xlIiwibG9nIiwid2RzTW9iaWxlTWVudSIsInN1Yk1lbnVDb250YWluZXIiLCJzdWJTdWJNZW51Q29udGFpbmVyIiwic3ViTWVudVBhcmVudEl0ZW0iLCJvZmZDYW52YXNDb250YWluZXIiLCJhZGREb3duQXJyb3ciLCJ0b2dnbGVTdWJtZW51IiwicmVzZXRTdWJNZW51IiwiZm9yY2VDbG9zZVN1Ym1lbnVzIiwiaXMiLCJzbGlkZU91dFN1Yk1lbnVzIiwiZWwiLCJwYXJlbnQiLCJhZnRlciIsImUiLCJzdWJNZW51IiwiY2hpbGRyZW4iLCIkdGFyZ2V0Iiwib3BlblN1Ym1lbnUiLCJmb2N1cyIsImNzcyIsInVuYmluZCIsImJpbmQiLCJwcmV2ZW50RGVmYXVsdCIsIndkc01vZGFsIiwiJG1vZGFsVG9nZ2xlIiwiJGZvY3VzYWJsZUNoaWxkcmVuIiwiJHBsYXllciIsIiR0YWciLCJjcmVhdGVFbGVtZW50IiwiJGZpcnN0U2NyaXB0VGFnIiwiZ2V0RWxlbWVudHNCeVRhZ05hbWUiLCJZVCIsInBhcmVudE5vZGUiLCJpbnNlcnRCZWZvcmUiLCJvcGVuTW9kYWwiLCJjbG9zZU1vZGFsIiwiZXNjS2V5Q2xvc2UiLCJjbG9zZU1vZGFsQnlDbGljayIsInRyYXBLZXlib2FyZE1heWJlIiwiJG1vZGFsIiwiZGF0YSIsIiRpZnJhbWUiLCJ1cmwiLCJpbmNsdWRlcyIsInN0b3BWaWRlbyIsImtleUNvZGUiLCJ3aGljaCIsIiRmb2N1c2VkIiwiZm9jdXNJbmRleCIsImluZGV4Iiwic2hpZnRLZXkiLCJvbllvdVR1YmVJZnJhbWVBUElSZWFkeSIsIiRpZnJhbWVpZCIsIlBsYXllciIsImV2ZW50cyIsIm9uUGxheWVyUmVhZHkiLCJvblBsYXllclN0YXRlQ2hhbmdlIiwiYSIsImZpcnN0Iiwid2RzUHJpbWFyeU5hdmlnYXRpb24iLCJ0b2dnbGVGb2N1cyIsImFwcGVuZCIsIndkc29mZkNhbnZhcyIsIm9mZkNhbnZhc0Nsb3NlIiwib2ZmQ2FudmFzT3BlbiIsIm9mZkNhbnZhc1NjcmVlbiIsImNsb3Nlb2ZmQ2FudmFzIiwidG9nZ2xlb2ZmQ2FudmFzIiwib3Blbm9mZkNhbnZhcyIsImlzV2Via2l0IiwibmF2aWdhdG9yIiwidXNlckFnZW50IiwidG9Mb3dlckNhc2UiLCJpbmRleE9mIiwiaXNPcGVyYSIsImlzSWUiLCJnZXRFbGVtZW50QnlJZCIsImFkZEV2ZW50TGlzdGVuZXIiLCJpZCIsInN1YnN0cmluZyIsImVsZW1lbnQiLCJ0ZXN0IiwidGFnTmFtZSIsInRhYkluZGV4Iiwid2RzVGFibGVzIiwidGFibGUiLCJhZGREYXRhTGFiZWwiLCJ0YWJsZUhlYWRlcnMiLCJ0YWJsZVJvdyIsInRkIiwiZ2V0IiwidGV4dCIsIldEU1ZpZGVvQmFja2dyb3VuZE9iamVjdCIsInZpZGVvQnV0dG9uIiwiZG9Ub2dnbGVQbGF5YmFjayIsInNpYmxpbmdzIiwid2RzV2luZG93UmVhZHkiLCJsb2FkIiwiYWRkQm9keUNsYXNzIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7OztBQUtBQSxPQUFPQyxvQkFBUCxHQUE4QixFQUE5QjtBQUNFLFdBQVVELE1BQVYsRUFBa0JFLENBQWxCLEVBQXFCQyxHQUFyQixFQUEyQjs7QUFFNUI7QUFDQUEsS0FBSUMsSUFBSixHQUFXLFlBQVc7QUFDckJELE1BQUlFLEtBQUo7O0FBRUE7QUFDQSxNQUFLTCxPQUFPTSxHQUFaLEVBQWtCO0FBQ2pCTixVQUFPTSxHQUFQLENBQVdDLFNBQVgsQ0FBc0Isc0JBQXRCLEVBQThDSixJQUFJSyxVQUFsRDtBQUNBOztBQUVELE1BQUtMLElBQUlNLGlCQUFKLEVBQUwsRUFBK0I7QUFDOUJOLE9BQUlLLFVBQUo7QUFDQTtBQUNELEVBWEQ7O0FBYUE7QUFDQUwsS0FBSUUsS0FBSixHQUFZLFlBQVc7QUFDdEJGLE1BQUlPLEVBQUosR0FBUztBQUNSVixXQUFRRSxFQUFHRixNQUFILENBREE7QUFFUlcsU0FBTVQsRUFBRyxNQUFILENBRkU7QUFHUlUsY0FBV1YsRUFBRyxZQUFILENBSEg7QUFJUlcsVUFBT1gsRUFBRyxpQkFBSCxDQUpDO0FBS1JZLFlBQVNaLEVBQUcsd0JBQUgsQ0FMRDtBQU1SYSxhQUFVYixFQUFHLHlCQUFILENBTkY7QUFPUmMsV0FBUWQsRUFBRyx3QkFBSCxDQVBBO0FBUVJlLGFBQVVmLEVBQUdGLE9BQU9rQixRQUFQLENBQWdCQyxJQUFuQjtBQVJGLEdBQVQ7QUFVQSxFQVhEOztBQWFBO0FBQ0FoQixLQUFJSyxVQUFKLEdBQWlCLFlBQVc7QUFDM0JOLElBQUcsd0JBQUgsRUFBOEJrQixFQUE5QixDQUFrQyxrQkFBbEMsRUFBc0RqQixJQUFJa0IsZUFBMUQ7QUFDQW5CLElBQUcsd0JBQUgsRUFBOEJrQixFQUE5QixDQUFrQyxrQkFBbEMsRUFBc0RqQixJQUFJa0IsZUFBMUQ7QUFDQWxCLE1BQUlPLEVBQUosQ0FBT1YsTUFBUCxDQUFjb0IsRUFBZCxDQUFrQixNQUFsQixFQUEwQmpCLElBQUltQixpQkFBOUI7QUFDQSxFQUpEOztBQU1BO0FBQ0FuQixLQUFJTSxpQkFBSixHQUF3QixZQUFXO0FBQ2xDLFNBQU9OLElBQUlPLEVBQUosQ0FBT0UsU0FBUCxDQUFpQlcsTUFBeEI7QUFDQSxFQUZEOztBQUlBcEIsS0FBSWtCLGVBQUosR0FBc0IsWUFBVzs7QUFFaEM7QUFDQW5CLElBQUcsSUFBSCxFQUFVc0IsT0FBVixDQUFtQixpQkFBbkIsRUFBdUNDLFdBQXZDLENBQW9ELE1BQXBEOztBQUVBO0FBQ0EsTUFBSUMsYUFBYXhCLEVBQUcsSUFBSCxFQUFVc0IsT0FBVixDQUFtQixpQkFBbkIsRUFBdUNHLFFBQXZDLENBQWlELE1BQWpELENBQWpCOztBQUVBO0FBQ0F6QixJQUFHLElBQUgsRUFBVXNCLE9BQVYsQ0FBbUIsaUJBQW5CLEVBQXVDSSxJQUF2QyxDQUE2Qyx3QkFBN0MsRUFBd0VDLElBQXhFLENBQThFLGVBQTlFLEVBQStGSCxhQUFhLE1BQWIsR0FBc0IsT0FBckg7O0FBRUE7QUFDQXhCLElBQUcsSUFBSCxFQUFVc0IsT0FBVixDQUFtQixrQkFBbkIsRUFBd0NJLElBQXhDLENBQThDLHlCQUE5QyxFQUEwRUUsR0FBMUUsQ0FBK0U1QixFQUFHLElBQUgsRUFBVXNCLE9BQVYsQ0FBbUIsaUJBQW5CLENBQS9FLEVBQXdISyxJQUF4SCxDQUE4SCxhQUE5SCxFQUE2SSxNQUE3STs7QUFFQTtBQUNBM0IsSUFBRyxJQUFILEVBQVVzQixPQUFWLENBQW1CLGlCQUFuQixFQUF1Q0ksSUFBdkMsQ0FBNkMseUJBQTdDLEVBQXlFQyxJQUF6RSxDQUErRSxhQUEvRSxFQUE4RkgsYUFBYSxPQUFiLEdBQXVCLE1BQXJIOztBQUVBO0FBQ0F4QixJQUFHLElBQUgsRUFBVXNCLE9BQVYsQ0FBbUIsa0JBQW5CLEVBQXdDSSxJQUF4QyxDQUE4QyxpQkFBOUMsRUFBa0VFLEdBQWxFLENBQXVFNUIsRUFBRyxJQUFILEVBQVVzQixPQUFWLENBQW1CLGlCQUFuQixDQUF2RSxFQUFnSE8sV0FBaEgsQ0FBNkgsTUFBN0g7QUFDQTdCLElBQUcsSUFBSCxFQUFVc0IsT0FBVixDQUFtQixrQkFBbkIsRUFBd0NJLElBQXhDLENBQThDLHdCQUE5QyxFQUF5RUUsR0FBekUsQ0FBOEU1QixFQUFHLElBQUgsQ0FBOUUsRUFBMEYyQixJQUExRixDQUFnRyxlQUFoRyxFQUFpSCxPQUFqSDs7QUFFQSxTQUFPLEtBQVA7QUFDQSxFQXRCRDs7QUF3QkExQixLQUFJbUIsaUJBQUosR0FBd0IsWUFBVzs7QUFFbEMsTUFBSyxDQUFFbkIsSUFBSU8sRUFBSixDQUFPTyxRQUFQLENBQWdCZSxRQUF2QixFQUFrQztBQUNqQztBQUNBOztBQUVEO0FBQ0E3QixNQUFJTyxFQUFKLENBQU9PLFFBQVAsQ0FBZ0JPLE9BQWhCLENBQXlCLGlCQUF6QixFQUE2Q0ksSUFBN0MsQ0FBbUQsd0JBQW5ELEVBQThFSyxPQUE5RSxDQUF1RixPQUF2Rjs7QUFFQTtBQUNBLE1BQU1DLGlCQUFpQmhDLEVBQUcsYUFBSCxFQUFtQnFCLE1BQW5CLEdBQTRCckIsRUFBRyxhQUFILEVBQW1CaUMsTUFBbkIsRUFBNUIsR0FBMEQsQ0FBakY7O0FBRUE7QUFDQWhDLE1BQUlPLEVBQUosQ0FBT0MsSUFBUCxDQUFZeUIsT0FBWixDQUFxQjtBQUNwQkMsY0FBV2xDLElBQUlPLEVBQUosQ0FBT08sUUFBUCxDQUFnQnFCLE1BQWhCLEdBQXlCQyxHQUF6QixHQUErQkw7QUFEdEIsR0FBckIsRUFFRyxNQUZIO0FBR0EsRUFoQkQ7O0FBa0JBO0FBQ0EvQixLQUFJQyxJQUFKO0FBRUEsQ0F2RkMsRUF1RkVKLE1BdkZGLEVBdUZVd0MsTUF2RlYsRUF1RmtCeEMsT0FBT0Msb0JBdkZ6QixDQUFGOzs7QUNOQTs7Ozs7QUFLQUQsT0FBT3lDLFdBQVAsR0FBcUIsRUFBckI7QUFDRSxXQUFVekMsTUFBVixFQUFrQkUsQ0FBbEIsRUFBcUJDLEdBQXJCLEVBQTJCOztBQUU1QjtBQUNBQSxLQUFJQyxJQUFKLEdBQVcsWUFBVztBQUNyQkQsTUFBSUUsS0FBSjs7QUFFQTtBQUNBLE1BQUtMLE9BQU9NLEdBQVosRUFBa0I7QUFDakJILE9BQUl1QyxPQUFKO0FBQ0E7O0FBRUQsTUFBS3ZDLElBQUlNLGlCQUFKLEVBQUwsRUFBK0I7QUFDOUJOLE9BQUlLLFVBQUo7QUFDQTtBQUNELEVBWEQ7O0FBYUE7QUFDQUwsS0FBSUUsS0FBSixHQUFZLFlBQVc7QUFDdEJGLE1BQUlPLEVBQUosR0FBUztBQUNSVixXQUFRRSxFQUFHRixNQUFILENBREE7QUFFUjJDLGdCQUFhekMsRUFBRyxpQkFBSDtBQUZMLEdBQVQ7QUFJQSxFQUxEOztBQU9BO0FBQ0FDLEtBQUlLLFVBQUosR0FBaUIsWUFBVztBQUMzQkwsTUFBSU8sRUFBSixDQUFPVixNQUFQLENBQWNvQixFQUFkLENBQWtCLE1BQWxCLEVBQTBCakIsSUFBSXVDLE9BQTlCO0FBQ0F2QyxNQUFJTyxFQUFKLENBQU9WLE1BQVAsQ0FBY29CLEVBQWQsQ0FBa0IsTUFBbEIsRUFBMEJqQixJQUFJeUMsZ0JBQTlCO0FBQ0EsRUFIRDs7QUFLQTtBQUNBekMsS0FBSU0saUJBQUosR0FBd0IsWUFBVztBQUNsQyxTQUFPTixJQUFJTyxFQUFKLENBQU9pQyxXQUFQLENBQW1CcEIsTUFBMUI7QUFDQSxFQUZEOztBQUlBO0FBQ0FwQixLQUFJeUMsZ0JBQUosR0FBdUIsWUFBVzs7QUFFakM7QUFDQSxNQUFJQyxhQUFhMUMsSUFBSU8sRUFBSixDQUFPaUMsV0FBUCxDQUFtQmYsSUFBbkIsQ0FBeUIsc0JBQXpCLENBQWpCO0FBQUEsTUFDQ2tCLG9CQUFvQkQsV0FBV2pCLElBQVgsQ0FBaUIsZ0JBQWpCLENBRHJCO0FBQUEsTUFFQ21CLGlCQUFpQkQsa0JBQWtCakIsSUFBbEIsQ0FBd0IsZ0JBQXhCLENBRmxCOztBQUlBO0FBQ0FpQixvQkFBa0JFLFFBQWxCLENBQTRCRCxjQUE1QjtBQUNBLEVBVEQ7O0FBV0E7QUFDQTVDLEtBQUk4QyxvQkFBSixHQUEyQixZQUFXOztBQUVyQztBQUNBL0MsSUFBRyxPQUFILEVBQWFnRCxJQUFiLENBQW1CLFlBQVc7O0FBRTdCO0FBQ0EsUUFBS0MsSUFBTDtBQUNBLEdBSkQ7QUFLQSxFQVJEOztBQVVBO0FBQ0FoRCxLQUFJaUQsa0JBQUosR0FBeUIsWUFBVzs7QUFFbkNsRCxJQUFHLGlCQUFILEVBQXVCNEIsR0FBdkIsQ0FBNEIsb0JBQTVCLEVBQW1EdUIsS0FBbkQsQ0FBMEQ7QUFDekRDLGFBQVUsSUFEK0M7QUFFekRDLGtCQUFlLElBRjBDO0FBR3pEQyxXQUFRLElBSGlEO0FBSXpEQyxTQUFNLElBSm1EO0FBS3pEQyxrQkFBZSxJQUwwQztBQU16REMsbUJBQWdCO0FBTnlDLEdBQTFEO0FBUUEsRUFWRDs7QUFZQTtBQUNBeEQsS0FBSXVDLE9BQUosR0FBYyxZQUFXOztBQUd4QjtBQUNBeEMsSUFBRzBELFFBQUgsRUFBY0MsS0FBZCxDQUFxQixZQUFXO0FBQy9CMUQsT0FBSThDLG9CQUFKO0FBQ0E5QyxPQUFJaUQsa0JBQUo7QUFDQSxHQUhEOztBQUtBO0FBQ0EsTUFBS3BELE9BQU9NLEdBQVosRUFBa0I7QUFDakJOLFVBQU9NLEdBQVAsQ0FBV0MsU0FBWCxDQUFzQixzQkFBdEIsRUFBOENKLElBQUlpRCxrQkFBbEQ7QUFDQTtBQUNELEVBYkQ7O0FBZUE7QUFDQWxELEdBQUdDLElBQUlDLElBQVA7QUFDQSxDQXpGQyxFQXlGRUosTUF6RkYsRUF5RlV3QyxNQXpGVixFQXlGa0J4QyxPQUFPeUMsV0F6RnpCLENBQUY7OztBQ05BOzs7OztBQUtBekMsT0FBTzhELGtCQUFQLEdBQTRCLEVBQTVCO0FBQ0UsV0FBVTlELE1BQVYsRUFBa0JFLENBQWxCLEVBQXFCQyxHQUFyQixFQUEyQjs7QUFFNUI7QUFDQUEsS0FBSUMsSUFBSixHQUFXLFlBQVc7QUFDckJELE1BQUlFLEtBQUo7O0FBRUEsTUFBS0YsSUFBSU0saUJBQUosRUFBTCxFQUErQjtBQUM5Qk4sT0FBSUssVUFBSjtBQUNBO0FBQ0QsRUFORDs7QUFRQTtBQUNBTCxLQUFJRSxLQUFKLEdBQVksWUFBVztBQUN0QkYsTUFBSU8sRUFBSixHQUFTO0FBQ1JWLFdBQVFFLEVBQUdGLE1BQUgsQ0FEQTtBQUVSK0QsU0FBTTdELEVBQUcsTUFBSCxDQUZFO0FBR1I4RCx1QkFBb0I5RCxFQUFHLGlDQUFILENBSFo7QUFJUitELHFCQUFrQi9ELEVBQUcscUNBQUg7QUFKVixHQUFUO0FBTUEsRUFQRDs7QUFTQTtBQUNBQyxLQUFJSyxVQUFKLEdBQWlCLFlBQVc7QUFDM0JMLE1BQUlPLEVBQUosQ0FBT3NELGtCQUFQLENBQTBCNUMsRUFBMUIsQ0FBOEIsd0JBQTlCLEVBQXdEakIsSUFBSStELGtCQUE1RDtBQUNBL0QsTUFBSU8sRUFBSixDQUFPcUQsSUFBUCxDQUFZM0MsRUFBWixDQUFnQix3QkFBaEIsRUFBMENqQixJQUFJZ0UsY0FBOUM7QUFDQSxFQUhEOztBQUtBO0FBQ0FoRSxLQUFJTSxpQkFBSixHQUF3QixZQUFXO0FBQ2xDLFNBQU9OLElBQUlPLEVBQUosQ0FBT3NELGtCQUFQLENBQTBCekMsTUFBakM7QUFDQSxFQUZEOztBQUlBO0FBQ0FwQixLQUFJaUUsWUFBSixHQUFtQixZQUFXOztBQUU3QixNQUFLakUsSUFBSU8sRUFBSixDQUFPcUQsSUFBUCxDQUFZcEMsUUFBWixDQUFzQixxQkFBdEIsQ0FBTCxFQUFxRDtBQUNwRCxVQUFPLElBQVA7QUFDQTs7QUFFRCxTQUFPLEtBQVA7QUFDQSxFQVBEOztBQVNBO0FBQ0F4QixLQUFJK0Qsa0JBQUosR0FBeUIsWUFBVztBQUNuQy9ELE1BQUlPLEVBQUosQ0FBT3FELElBQVAsQ0FBWXRDLFdBQVosQ0FBeUIscUJBQXpCOztBQUVBdEIsTUFBSWtFLHlCQUFKO0FBQ0FsRSxNQUFJbUUsMkJBQUo7O0FBRUEsU0FBTyxLQUFQO0FBQ0EsRUFQRDs7QUFTQTtBQUNBbkUsS0FBSWdFLGNBQUosR0FBcUIsVUFBVUksS0FBVixFQUFrQjs7QUFFdEMsTUFBSyxDQUFFckUsRUFBR3FFLE1BQU1DLE1BQVQsRUFBa0JoRCxPQUFsQixDQUEyQixLQUEzQixFQUFtQ0csUUFBbkMsQ0FBNkMsb0JBQTdDLENBQVAsRUFBNkU7QUFDNUV4QixPQUFJTyxFQUFKLENBQU9xRCxJQUFQLENBQVloQyxXQUFaLENBQXlCLHFCQUF6QjtBQUNBNUIsT0FBSWtFLHlCQUFKO0FBQ0FsRSxPQUFJbUUsMkJBQUo7QUFDQTtBQUNELEVBUEQ7O0FBU0E7QUFDQW5FLEtBQUlrRSx5QkFBSixHQUFnQyxZQUFXO0FBQzFDbEUsTUFBSU8sRUFBSixDQUFPdUQsZ0JBQVAsQ0FBd0JwQyxJQUF4QixDQUE4QixhQUE5QixFQUE2QzFCLElBQUlpRSxZQUFKLEtBQXFCLE9BQXJCLEdBQStCLE1BQTVFO0FBQ0EsRUFGRDs7QUFJQTtBQUNBakUsS0FBSW1FLDJCQUFKLEdBQWtDLFlBQVc7QUFDNUNuRSxNQUFJTyxFQUFKLENBQU9zRCxrQkFBUCxDQUEwQm5DLElBQTFCLENBQWdDLGVBQWhDLEVBQWlEMUIsSUFBSWlFLFlBQUosS0FBcUIsTUFBckIsR0FBOEIsT0FBL0U7QUFDQSxFQUZEOztBQUlBO0FBQ0FsRSxHQUFHQyxJQUFJQyxJQUFQO0FBRUEsQ0EzRUMsRUEyRUVKLE1BM0VGLEVBMkVVd0MsTUEzRVYsRUEyRWtCeEMsT0FBTzhELGtCQTNFekIsQ0FBRjs7O0FDTkE7Ozs7O0FBS0FGLFNBQVNHLElBQVQsQ0FBY1UsU0FBZCxHQUEwQmIsU0FBU0csSUFBVCxDQUFjVSxTQUFkLENBQXdCQyxPQUF4QixDQUFpQyxPQUFqQyxFQUEwQyxJQUExQyxDQUExQjs7O0FDTEEsQ0FBQyxVQUFVeEUsQ0FBVixFQUFhO0FBQ1o7QUFDQSxNQUFJeUUsUUFBUXpFLEVBQUUsY0FBRixFQUFrQjBFLE9BQWxCLENBQTBCO0FBQ3BDO0FBQ0FDLGlCQUFhLFNBRnVCO0FBR3BDQyxrQkFBYztBQUNkO0FBSm9DLEdBQTFCLENBQVo7QUFNQTtBQUNBSCxRQUFNSSxZQUFOLEdBQXFCQyxRQUFyQixDQUE4QixZQUFZO0FBQ3hDTCxVQUFNQyxPQUFOLENBQWMsUUFBZDtBQUNBSyxZQUFRQyxHQUFSLENBQVksVUFBWjtBQUNELEdBSEQ7QUFJRCxDQWJELEVBYUcxQyxNQWJIOzs7QUNBQTs7Ozs7QUFLQXhDLE9BQU9tRixhQUFQLEdBQXVCLEVBQXZCO0FBQ0UsV0FBVW5GLE1BQVYsRUFBa0JFLENBQWxCLEVBQXFCQyxHQUFyQixFQUEyQjs7QUFFNUI7QUFDQUEsS0FBSUMsSUFBSixHQUFXLFlBQVc7QUFDckJELE1BQUlFLEtBQUo7O0FBRUEsTUFBS0YsSUFBSU0saUJBQUosRUFBTCxFQUErQjtBQUM5Qk4sT0FBSUssVUFBSjtBQUNBO0FBQ0QsRUFORDs7QUFRQTtBQUNBTCxLQUFJRSxLQUFKLEdBQVksWUFBVztBQUN0QkYsTUFBSU8sRUFBSixHQUFTO0FBQ1JxRCxTQUFNN0QsRUFBRyxNQUFILENBREU7QUFFUkYsV0FBUUUsRUFBR0YsTUFBSCxDQUZBO0FBR1JvRixxQkFBa0JsRixFQUFHLHVEQUFILENBSFY7QUFJUm1GLHdCQUFxQm5GLEVBQUcsa0NBQUgsQ0FKYjtBQUtSb0Ysc0JBQW1CcEYsRUFBRyx1RkFBSCxDQUxYO0FBTVJxRix1QkFBb0JyRixFQUFHLHVCQUFIO0FBTlosR0FBVDtBQVFBLEVBVEQ7O0FBV0E7QUFDQUMsS0FBSUssVUFBSixHQUFpQixZQUFXO0FBQzNCTCxNQUFJTyxFQUFKLENBQU9WLE1BQVAsQ0FBY29CLEVBQWQsQ0FBa0IsTUFBbEIsRUFBMEJqQixJQUFJcUYsWUFBOUI7QUFDQXJGLE1BQUlPLEVBQUosQ0FBTzRFLGlCQUFQLENBQXlCbEUsRUFBekIsQ0FBNkIsT0FBN0IsRUFBc0NqQixJQUFJc0YsYUFBMUM7QUFDQXRGLE1BQUlPLEVBQUosQ0FBTzRFLGlCQUFQLENBQXlCbEUsRUFBekIsQ0FBNkIsZUFBN0IsRUFBOENqQixJQUFJdUYsWUFBbEQ7QUFDQXZGLE1BQUlPLEVBQUosQ0FBTzZFLGtCQUFQLENBQTBCbkUsRUFBMUIsQ0FBOEIsZUFBOUIsRUFBK0NqQixJQUFJd0Ysa0JBQW5EO0FBQ0EsRUFMRDs7QUFPQTtBQUNBeEYsS0FBSU0saUJBQUosR0FBd0IsWUFBVztBQUNsQyxTQUFPTixJQUFJTyxFQUFKLENBQU8wRSxnQkFBUCxDQUF3QjdELE1BQS9CO0FBQ0EsRUFGRDs7QUFJQTtBQUNBcEIsS0FBSXVGLFlBQUosR0FBbUIsWUFBVzs7QUFFN0I7QUFDQTtBQUNBLE1BQUt4RixFQUFHLElBQUgsRUFBVTBGLEVBQVYsQ0FBYywyQkFBZCxLQUErQyxDQUFFMUYsRUFBRyxJQUFILEVBQVV5QixRQUFWLENBQW9CLFlBQXBCLENBQXRELEVBQTJGO0FBQzFGekIsS0FBRyxJQUFILEVBQVUwQixJQUFWLENBQWdCLGFBQWhCLEVBQWdDRyxXQUFoQyxDQUE2Qyx5QkFBN0M7QUFDQTtBQUVELEVBUkQ7O0FBVUE7QUFDQTVCLEtBQUkwRixnQkFBSixHQUF1QixVQUFVQyxFQUFWLEVBQWU7O0FBRXJDO0FBQ0EsTUFBS0EsR0FBR0MsTUFBSCxHQUFZcEUsUUFBWixDQUFzQixZQUF0QixLQUF3QyxDQUFFbUUsR0FBR25FLFFBQUgsQ0FBYSxZQUFiLENBQS9DLEVBQTZFO0FBQzVFO0FBQ0E7O0FBRUQ7QUFDQSxNQUFLbUUsR0FBR0MsTUFBSCxHQUFZcEUsUUFBWixDQUFzQixZQUF0QixLQUF3Q21FLEdBQUduRSxRQUFILENBQWEsWUFBYixDQUE3QyxFQUEyRTtBQUMxRW1FLE1BQUcvRCxXQUFILENBQWdCLFlBQWhCLEVBQStCSCxJQUEvQixDQUFxQyxXQUFyQyxFQUFtREcsV0FBbkQsQ0FBZ0UsYUFBaEUsRUFBZ0ZpQixRQUFoRixDQUEwRixjQUExRjtBQUNBO0FBQ0E7O0FBRUQ3QyxNQUFJTyxFQUFKLENBQU8wRSxnQkFBUCxDQUF3QmxDLElBQXhCLENBQThCLFlBQVc7O0FBRXhDO0FBQ0EsT0FBS2hELEVBQUcsSUFBSCxFQUFVeUIsUUFBVixDQUFvQixhQUFwQixDQUFMLEVBQTJDOztBQUUxQztBQUNBekIsTUFBRyxJQUFILEVBQVU2RixNQUFWLEdBQW1CaEUsV0FBbkIsQ0FBZ0MsWUFBaEMsRUFBK0NILElBQS9DLENBQXFELG1CQUFyRCxFQUEyRUMsSUFBM0UsQ0FBaUYsZUFBakYsRUFBa0csS0FBbEc7O0FBRUE7QUFDQTNCLE1BQUcsSUFBSCxFQUFVNkIsV0FBVixDQUF1QixhQUF2QixFQUF1Q2lCLFFBQXZDLENBQWlELGNBQWpEO0FBQ0E7QUFFRCxHQVpEO0FBYUEsRUExQkQ7O0FBNEJBO0FBQ0E3QyxLQUFJcUYsWUFBSixHQUFtQixZQUFXOztBQUU3QnJGLE1BQUlPLEVBQUosQ0FBTzRFLGlCQUFQLENBQXlCMUQsSUFBekIsQ0FBK0IsU0FBL0IsRUFBMkNvRSxLQUEzQyxDQUFrRCwwSUFBbEQ7QUFDQSxFQUhEOztBQUtBO0FBQ0E3RixLQUFJc0YsYUFBSixHQUFvQixVQUFVUSxDQUFWLEVBQWM7O0FBRWpDLE1BQUlILEtBQUs1RixFQUFHLElBQUgsQ0FBVDtBQUFBLE1BQW9CO0FBQ25CZ0csWUFBVUosR0FBR0ssUUFBSCxDQUFhLGFBQWIsQ0FEWDtBQUFBLE1BQ3lDO0FBQ3hDQyxZQUFVbEcsRUFBRytGLEVBQUV6QixNQUFMLENBRlgsQ0FGaUMsQ0FJUDs7QUFFMUI7QUFDQTtBQUNBLE1BQUs0QixRQUFRekUsUUFBUixDQUFrQixZQUFsQixLQUFvQ3lFLFFBQVF6RSxRQUFSLENBQWtCLGtCQUFsQixDQUF6QyxFQUFrRjs7QUFFakY7QUFDQXhCLE9BQUkwRixnQkFBSixDQUFzQkMsRUFBdEI7O0FBRUEsT0FBSyxDQUFFSSxRQUFRdkUsUUFBUixDQUFrQixZQUFsQixDQUFQLEVBQTBDOztBQUV6QztBQUNBeEIsUUFBSWtHLFdBQUosQ0FBaUJQLEVBQWpCLEVBQXFCSSxPQUFyQjtBQUVBOztBQUVELFVBQU8sS0FBUDtBQUNBO0FBRUQsRUF2QkQ7O0FBeUJBO0FBQ0EvRixLQUFJa0csV0FBSixHQUFrQixVQUFVTixNQUFWLEVBQWtCRyxPQUFsQixFQUE0Qjs7QUFFN0M7QUFDQUgsU0FBTy9DLFFBQVAsQ0FBaUIsWUFBakIsRUFBZ0NwQixJQUFoQyxDQUFzQyxtQkFBdEMsRUFBNERDLElBQTVELENBQWtFLGVBQWxFLEVBQW1GLElBQW5GOztBQUVBO0FBQ0FxRSxVQUFRbEQsUUFBUixDQUFrQixpQ0FBbEI7QUFDQSxFQVBEOztBQVNBO0FBQ0E3QyxLQUFJd0Ysa0JBQUosR0FBeUIsVUFBVXBCLEtBQVYsRUFBa0I7QUFDMUMsTUFBS3JFLEVBQUdxRSxNQUFNQyxNQUFULEVBQWtCN0MsUUFBbEIsQ0FBNEIsc0JBQTVCLENBQUwsRUFBNEQ7O0FBRTNEO0FBQ0F4QixPQUFJTyxFQUFKLENBQU82RSxrQkFBUCxDQUEwQmUsS0FBMUI7O0FBRUE7QUFDQSxPQUFLLENBQUVwRyxFQUFHLElBQUgsRUFBVXlCLFFBQVYsQ0FBb0IsWUFBcEIsQ0FBUCxFQUE0QztBQUMzQ3hCLFFBQUlPLEVBQUosQ0FBTzRFLGlCQUFQLENBQXlCdkQsV0FBekIsQ0FBc0MsWUFBdEMsRUFBcURILElBQXJELENBQTJELG1CQUEzRCxFQUFpRkMsSUFBakYsQ0FBdUYsZUFBdkYsRUFBd0csS0FBeEc7QUFDQTFCLFFBQUlPLEVBQUosQ0FBTzBFLGdCQUFQLENBQXdCckQsV0FBeEIsQ0FBcUMsd0JBQXJDO0FBQ0E1QixRQUFJTyxFQUFKLENBQU9xRCxJQUFQLENBQVl3QyxHQUFaLENBQWlCLFVBQWpCLEVBQTZCLFNBQTdCO0FBQ0FwRyxRQUFJTyxFQUFKLENBQU9xRCxJQUFQLENBQVl5QyxNQUFaLENBQW9CLFlBQXBCO0FBQ0E7O0FBRUQsT0FBS3RHLEVBQUcsSUFBSCxFQUFVeUIsUUFBVixDQUFvQixZQUFwQixDQUFMLEVBQTBDO0FBQ3pDeEIsUUFBSU8sRUFBSixDQUFPcUQsSUFBUCxDQUFZd0MsR0FBWixDQUFpQixVQUFqQixFQUE2QixRQUE3QjtBQUNBcEcsUUFBSU8sRUFBSixDQUFPcUQsSUFBUCxDQUFZMEMsSUFBWixDQUFrQixZQUFsQixFQUFnQyxVQUFVUixDQUFWLEVBQWM7QUFDN0MsU0FBSyxDQUFFL0YsRUFBRytGLEVBQUV6QixNQUFMLEVBQWNoRCxPQUFkLENBQXVCLGdCQUF2QixFQUEwQyxDQUExQyxDQUFQLEVBQXNEO0FBQ3JEeUUsUUFBRVMsY0FBRjtBQUNBO0FBQ0QsS0FKRDtBQUtBO0FBQ0Q7QUFDRCxFQXZCRDs7QUF5QkE7QUFDQXhHLEdBQUdDLElBQUlDLElBQVA7QUFFQSxDQW5KQyxFQW1KQ0osTUFuSkQsRUFtSlN3QyxNQW5KVCxFQW1KaUJ4QyxPQUFPbUYsYUFuSnhCLENBQUY7OztBQ05BOzs7OztBQUtBbkYsT0FBTzJHLFFBQVAsR0FBa0IsRUFBbEI7QUFDRSxXQUFVM0csTUFBVixFQUFrQkUsQ0FBbEIsRUFBcUJDLEdBQXJCLEVBQTJCOztBQUU1QixLQUFJeUcscUJBQUo7QUFBQSxLQUNDQywyQkFERDtBQUFBLEtBRUNDLGdCQUZEO0FBQUEsS0FHQ0MsT0FBT25ELFNBQVNvRCxhQUFULENBQXdCLFFBQXhCLENBSFI7QUFBQSxLQUlDQyxrQkFBa0JyRCxTQUFTc0Qsb0JBQVQsQ0FBK0IsUUFBL0IsRUFBMEMsQ0FBMUMsQ0FKbkI7QUFBQSxLQUtDQyxXQUxEOztBQU9BO0FBQ0FoSCxLQUFJQyxJQUFKLEdBQVcsWUFBVztBQUNyQkQsTUFBSUUsS0FBSjs7QUFFQSxNQUFLRixJQUFJTSxpQkFBSixFQUFMLEVBQStCO0FBQzlCd0csbUJBQWdCRyxVQUFoQixDQUEyQkMsWUFBM0IsQ0FBeUNOLElBQXpDLEVBQStDRSxlQUEvQztBQUNBOUcsT0FBSUssVUFBSjtBQUNBO0FBQ0QsRUFQRDs7QUFTQTtBQUNBTCxLQUFJRSxLQUFKLEdBQVksWUFBVztBQUN0QkYsTUFBSU8sRUFBSixHQUFTO0FBQ1IsV0FBUVIsRUFBRyxNQUFIO0FBREEsR0FBVDtBQUdBLEVBSkQ7O0FBTUE7QUFDQUMsS0FBSU0saUJBQUosR0FBd0IsWUFBVztBQUNsQyxTQUFPUCxFQUFHLGdCQUFILEVBQXNCcUIsTUFBN0I7QUFDQSxFQUZEOztBQUlBO0FBQ0FwQixLQUFJSyxVQUFKLEdBQWlCLFlBQVc7O0FBRTNCO0FBQ0FMLE1BQUlPLEVBQUosQ0FBT3FELElBQVAsQ0FBWTNDLEVBQVosQ0FBZ0Isa0JBQWhCLEVBQW9DLGdCQUFwQyxFQUFzRGpCLElBQUltSCxTQUExRDs7QUFFQTtBQUNBbkgsTUFBSU8sRUFBSixDQUFPcUQsSUFBUCxDQUFZM0MsRUFBWixDQUFnQixrQkFBaEIsRUFBb0MsUUFBcEMsRUFBOENqQixJQUFJb0gsVUFBbEQ7O0FBRUE7QUFDQXBILE1BQUlPLEVBQUosQ0FBT3FELElBQVAsQ0FBWTNDLEVBQVosQ0FBZ0IsU0FBaEIsRUFBMkJqQixJQUFJcUgsV0FBL0I7O0FBRUE7QUFDQXJILE1BQUlPLEVBQUosQ0FBT3FELElBQVAsQ0FBWTNDLEVBQVosQ0FBZ0Isa0JBQWhCLEVBQW9DLGdCQUFwQyxFQUFzRGpCLElBQUlzSCxpQkFBMUQ7O0FBRUE7QUFDQXRILE1BQUlPLEVBQUosQ0FBT3FELElBQVAsQ0FBWTNDLEVBQVosQ0FBZ0IsU0FBaEIsRUFBMkJqQixJQUFJdUgsaUJBQS9CO0FBRUEsRUFqQkQ7O0FBbUJBO0FBQ0F2SCxLQUFJbUgsU0FBSixHQUFnQixZQUFXOztBQUUxQjtBQUNBVixpQkFBZTFHLEVBQUcsSUFBSCxDQUFmOztBQUVBO0FBQ0EsTUFBSXlILFNBQVN6SCxFQUFHQSxFQUFHLElBQUgsRUFBVTBILElBQVYsQ0FBZ0IsUUFBaEIsQ0FBSCxDQUFiOztBQUVBO0FBQ0FELFNBQU8zRSxRQUFQLENBQWlCLFlBQWpCOztBQUVBO0FBQ0E3QyxNQUFJTyxFQUFKLENBQU9xRCxJQUFQLENBQVlmLFFBQVosQ0FBc0IsWUFBdEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E2RCx1QkFBcUJjLE9BQU8vRixJQUFQLENBQWEsdUJBQWIsQ0FBckI7O0FBRUE7QUFDQSxNQUFLLElBQUlpRixtQkFBbUJ0RixNQUE1QixFQUFxQzs7QUFFcEM7QUFDQXNGLHNCQUFtQixDQUFuQixFQUFzQlAsS0FBdEI7QUFDQTtBQUVELEVBMUJEOztBQTRCQTtBQUNBbkcsS0FBSW9ILFVBQUosR0FBaUIsWUFBVzs7QUFFM0I7QUFDQSxNQUFJSSxTQUFTekgsRUFBR0EsRUFBRyx1QkFBSCxFQUE2QjBILElBQTdCLENBQW1DLFFBQW5DLENBQUgsQ0FBYjs7O0FBRUM7QUFDQUMsWUFBVUYsT0FBTy9GLElBQVAsQ0FBYSxRQUFiLENBSFg7O0FBS0E7QUFDQSxNQUFLaUcsUUFBUXRHLE1BQWIsRUFBc0I7O0FBRXJCO0FBQ0EsT0FBSXVHLE1BQU1ELFFBQVFoRyxJQUFSLENBQWMsS0FBZCxDQUFWOztBQUVBO0FBQ0E7QUFDQSxPQUFLLENBQUVpRyxJQUFJQyxRQUFKLENBQWMsZUFBZCxDQUFQLEVBQXlDOztBQUV4QztBQUNBRixZQUFRaEcsSUFBUixDQUFjLEtBQWQsRUFBcUIsRUFBckIsRUFBMEJBLElBQTFCLENBQWdDLEtBQWhDLEVBQXVDaUcsR0FBdkM7QUFDQSxJQUpELE1BSU87O0FBRU47QUFDQWhCLFlBQVFrQixTQUFSO0FBQ0E7QUFDRDs7QUFFRDtBQUNBTCxTQUFPNUYsV0FBUCxDQUFvQixZQUFwQjs7QUFFQTtBQUNBNUIsTUFBSU8sRUFBSixDQUFPcUQsSUFBUCxDQUFZaEMsV0FBWixDQUF5QixZQUF6Qjs7QUFFQTtBQUNBNkUsZUFBYU4sS0FBYjtBQUVBLEVBcENEOztBQXNDQTtBQUNBbkcsS0FBSXFILFdBQUosR0FBa0IsVUFBVWpELEtBQVYsRUFBa0I7QUFDbkMsTUFBSyxPQUFPQSxNQUFNMEQsT0FBbEIsRUFBNEI7QUFDM0I5SCxPQUFJb0gsVUFBSjtBQUNBO0FBQ0QsRUFKRDs7QUFNQTtBQUNBcEgsS0FBSXNILGlCQUFKLEdBQXdCLFVBQVVsRCxLQUFWLEVBQWtCOztBQUV6QztBQUNBLE1BQUssQ0FBRXJFLEVBQUdxRSxNQUFNQyxNQUFULEVBQWtCaEQsT0FBbEIsQ0FBMkIsS0FBM0IsRUFBbUNHLFFBQW5DLENBQTZDLGNBQTdDLENBQVAsRUFBdUU7QUFDdEV4QixPQUFJb0gsVUFBSjtBQUNBO0FBQ0QsRUFORDs7QUFRQTtBQUNBcEgsS0FBSXVILGlCQUFKLEdBQXdCLFVBQVVuRCxLQUFWLEVBQWtCOztBQUV6QztBQUNBLE1BQUssTUFBTUEsTUFBTTJELEtBQVosSUFBcUIsSUFBSWhJLEVBQUcsYUFBSCxFQUFtQnFCLE1BQWpELEVBQTBEO0FBQ3pELE9BQUk0RyxXQUFXakksRUFBRyxRQUFILENBQWY7QUFBQSxPQUNDa0ksYUFBYXZCLG1CQUFtQndCLEtBQW5CLENBQTBCRixRQUExQixDQURkOztBQUdBLE9BQUssTUFBTUMsVUFBTixJQUFvQjdELE1BQU0rRCxRQUEvQixFQUEwQzs7QUFFekM7QUFDQXpCLHVCQUFvQkEsbUJBQW1CdEYsTUFBbkIsR0FBNEIsQ0FBaEQsRUFBb0QrRSxLQUFwRDtBQUNBL0IsVUFBTW1DLGNBQU47QUFDQSxJQUxELE1BS08sSUFBSyxDQUFFbkMsTUFBTStELFFBQVIsSUFBb0JGLGVBQWV2QixtQkFBbUJ0RixNQUFuQixHQUE0QixDQUFwRSxFQUF3RTs7QUFFOUU7QUFDQXNGLHVCQUFtQixDQUFuQixFQUFzQlAsS0FBdEI7QUFDQS9CLFVBQU1tQyxjQUFOO0FBQ0E7QUFDRDtBQUNELEVBbkJEOztBQXFCQTtBQUNBdkcsS0FBSW9JLHVCQUFKLEdBQThCLFlBQVc7QUFDeEMsTUFBSVosU0FBU3pILEVBQUcsV0FBSCxDQUFiO0FBQUEsTUFDQ3NJLFlBQVliLE9BQU8vRixJQUFQLENBQWEsUUFBYixFQUF3QkMsSUFBeEIsQ0FBOEIsSUFBOUIsQ0FEYjs7QUFHQWlGLFlBQVUsSUFBSUssR0FBR3NCLE1BQVAsQ0FBZUQsU0FBZixFQUEwQjtBQUNuQ0UsV0FBUTtBQUNQLGVBQVd2SSxJQUFJd0ksYUFEUjtBQUVQLHFCQUFpQnhJLElBQUl5STtBQUZkO0FBRDJCLEdBQTFCLENBQVY7QUFNQSxFQVZEOztBQVlBO0FBQ0F6SSxLQUFJd0ksYUFBSixHQUFvQixZQUFXLENBQzlCLENBREQ7O0FBR0E7QUFDQXhJLEtBQUl5SSxtQkFBSixHQUEwQixZQUFXOztBQUVwQztBQUNBMUksSUFBR3FFLE1BQU1DLE1BQU4sQ0FBYXFFLENBQWhCLEVBQW9CckgsT0FBcEIsQ0FBNkIsUUFBN0IsRUFBd0NJLElBQXhDLENBQThDLHVCQUE5QyxFQUF3RWtILEtBQXhFLEdBQWdGeEMsS0FBaEY7QUFDQSxFQUpEOztBQU9BO0FBQ0FwRyxHQUFHQyxJQUFJQyxJQUFQO0FBQ0EsQ0F4TEMsRUF3TENKLE1BeExELEVBd0xTd0MsTUF4TFQsRUF3TGlCeEMsT0FBTzJHLFFBeEx4QixDQUFGOzs7QUNOQTs7Ozs7QUFLQTNHLE9BQU8rSSxvQkFBUCxHQUE4QixFQUE5QjtBQUNFLFdBQVUvSSxNQUFWLEVBQWtCRSxDQUFsQixFQUFxQkMsR0FBckIsRUFBMkI7O0FBRTVCO0FBQ0FBLEtBQUlDLElBQUosR0FBVyxZQUFXO0FBQ3JCRCxNQUFJRSxLQUFKOztBQUVBLE1BQUtGLElBQUlNLGlCQUFKLEVBQUwsRUFBK0I7QUFDOUJOLE9BQUlLLFVBQUo7QUFDQTtBQUNELEVBTkQ7O0FBUUE7QUFDQUwsS0FBSUUsS0FBSixHQUFZLFlBQVc7QUFDdEJGLE1BQUlPLEVBQUosR0FBUztBQUNSVixXQUFRRSxFQUFHRixNQUFILENBREE7QUFFUm9GLHFCQUFrQmxGLEVBQUcsNEJBQUgsQ0FGVjtBQUdSb0Ysc0JBQW1CcEYsRUFBRyw0Q0FBSDtBQUhYLEdBQVQ7QUFLQSxFQU5EOztBQVFBO0FBQ0FDLEtBQUlLLFVBQUosR0FBaUIsWUFBVztBQUMzQkwsTUFBSU8sRUFBSixDQUFPVixNQUFQLENBQWNvQixFQUFkLENBQWtCLE1BQWxCLEVBQTBCakIsSUFBSXFGLFlBQTlCO0FBQ0FyRixNQUFJTyxFQUFKLENBQU80RSxpQkFBUCxDQUF5QjFELElBQXpCLENBQStCLEdBQS9CLEVBQXFDUixFQUFyQyxDQUF5QyxrQkFBekMsRUFBNkRqQixJQUFJNkksV0FBakU7QUFDQSxFQUhEOztBQUtBO0FBQ0E3SSxLQUFJTSxpQkFBSixHQUF3QixZQUFXO0FBQ2xDLFNBQU9OLElBQUlPLEVBQUosQ0FBTzBFLGdCQUFQLENBQXdCN0QsTUFBL0I7QUFDQSxFQUZEOztBQUlBO0FBQ0FwQixLQUFJcUYsWUFBSixHQUFtQixZQUFXO0FBQzdCckYsTUFBSU8sRUFBSixDQUFPNEUsaUJBQVAsQ0FBeUIxRCxJQUF6QixDQUErQixLQUEvQixFQUF1Q3FILE1BQXZDLENBQStDLHFEQUEvQztBQUNBLEVBRkQ7O0FBSUE7QUFDQTlJLEtBQUk2SSxXQUFKLEdBQWtCLFlBQVc7QUFDNUI5SSxJQUFHLElBQUgsRUFBVXNCLE9BQVYsQ0FBbUIsMkJBQW5CLEVBQWlEQyxXQUFqRCxDQUE4RCxPQUE5RDtBQUNBLEVBRkQ7O0FBSUE7QUFDQXZCLEdBQUdDLElBQUlDLElBQVA7QUFFQSxDQTVDQyxFQTRDQ0osTUE1Q0QsRUE0Q1N3QyxNQTVDVCxFQTRDaUJ4QyxPQUFPK0ksb0JBNUN4QixDQUFGOzs7QUNOQTs7Ozs7QUFLQS9JLE9BQU9rSixZQUFQLEdBQXNCLEVBQXRCO0FBQ0UsV0FBVWxKLE1BQVYsRUFBa0JFLENBQWxCLEVBQXFCQyxHQUFyQixFQUEyQjs7QUFFNUI7QUFDQUEsS0FBSUMsSUFBSixHQUFXLFlBQVc7QUFDckJELE1BQUlFLEtBQUo7O0FBRUEsTUFBS0YsSUFBSU0saUJBQUosRUFBTCxFQUErQjtBQUM5Qk4sT0FBSUssVUFBSjtBQUNBO0FBQ0QsRUFORDs7QUFRQTtBQUNBTCxLQUFJRSxLQUFKLEdBQVksWUFBVztBQUN0QkYsTUFBSU8sRUFBSixHQUFTO0FBQ1JxRCxTQUFNN0QsRUFBRyxNQUFILENBREU7QUFFUmlKLG1CQUFnQmpKLEVBQUcsbUJBQUgsQ0FGUjtBQUdScUYsdUJBQW9CckYsRUFBRyx1QkFBSCxDQUhaO0FBSVJrSixrQkFBZWxKLEVBQUcsa0JBQUgsQ0FKUDtBQUtSbUosb0JBQWlCbkosRUFBRyxvQkFBSDtBQUxULEdBQVQ7QUFPQSxFQVJEOztBQVVBO0FBQ0FDLEtBQUlLLFVBQUosR0FBaUIsWUFBVztBQUMzQkwsTUFBSU8sRUFBSixDQUFPcUQsSUFBUCxDQUFZM0MsRUFBWixDQUFnQixTQUFoQixFQUEyQmpCLElBQUlxSCxXQUEvQjtBQUNBckgsTUFBSU8sRUFBSixDQUFPeUksY0FBUCxDQUFzQi9ILEVBQXRCLENBQTBCLE9BQTFCLEVBQW1DakIsSUFBSW1KLGNBQXZDO0FBQ0FuSixNQUFJTyxFQUFKLENBQU8wSSxhQUFQLENBQXFCaEksRUFBckIsQ0FBeUIsT0FBekIsRUFBa0NqQixJQUFJb0osZUFBdEM7QUFDQXBKLE1BQUlPLEVBQUosQ0FBTzJJLGVBQVAsQ0FBdUJqSSxFQUF2QixDQUEyQixPQUEzQixFQUFvQ2pCLElBQUltSixjQUF4QztBQUNBLEVBTEQ7O0FBT0E7QUFDQW5KLEtBQUlNLGlCQUFKLEdBQXdCLFlBQVc7QUFDbEMsU0FBT04sSUFBSU8sRUFBSixDQUFPNkUsa0JBQVAsQ0FBMEJoRSxNQUFqQztBQUNBLEVBRkQ7O0FBSUE7QUFDQXBCLEtBQUlvSixlQUFKLEdBQXNCLFlBQVc7O0FBRWhDLE1BQUssV0FBV3JKLEVBQUcsSUFBSCxFQUFVMkIsSUFBVixDQUFnQixlQUFoQixDQUFoQixFQUFvRDtBQUNuRDFCLE9BQUltSixjQUFKO0FBQ0EsR0FGRCxNQUVPO0FBQ05uSixPQUFJcUosYUFBSjtBQUNBO0FBRUQsRUFSRDs7QUFVQTtBQUNBckosS0FBSXFKLGFBQUosR0FBb0IsWUFBVztBQUM5QnJKLE1BQUlPLEVBQUosQ0FBTzZFLGtCQUFQLENBQTBCdkMsUUFBMUIsQ0FBb0MsWUFBcEM7QUFDQTdDLE1BQUlPLEVBQUosQ0FBTzBJLGFBQVAsQ0FBcUJwRyxRQUFyQixDQUErQixZQUEvQjtBQUNBN0MsTUFBSU8sRUFBSixDQUFPMkksZUFBUCxDQUF1QnJHLFFBQXZCLENBQWlDLFlBQWpDOztBQUVBN0MsTUFBSU8sRUFBSixDQUFPMEksYUFBUCxDQUFxQnZILElBQXJCLENBQTJCLGVBQTNCLEVBQTRDLElBQTVDO0FBQ0ExQixNQUFJTyxFQUFKLENBQU82RSxrQkFBUCxDQUEwQjFELElBQTFCLENBQWdDLGFBQWhDLEVBQStDLEtBQS9DO0FBQ0EsRUFQRDs7QUFTQTtBQUNBMUIsS0FBSW1KLGNBQUosR0FBcUIsWUFBVztBQUMvQm5KLE1BQUlPLEVBQUosQ0FBTzZFLGtCQUFQLENBQTBCeEQsV0FBMUIsQ0FBdUMsWUFBdkM7QUFDQTVCLE1BQUlPLEVBQUosQ0FBTzBJLGFBQVAsQ0FBcUJySCxXQUFyQixDQUFrQyxZQUFsQztBQUNBNUIsTUFBSU8sRUFBSixDQUFPMkksZUFBUCxDQUF1QnRILFdBQXZCLENBQW9DLFlBQXBDOztBQUVBNUIsTUFBSU8sRUFBSixDQUFPMEksYUFBUCxDQUFxQnZILElBQXJCLENBQTJCLGVBQTNCLEVBQTRDLEtBQTVDO0FBQ0ExQixNQUFJTyxFQUFKLENBQU82RSxrQkFBUCxDQUEwQjFELElBQTFCLENBQWdDLGFBQWhDLEVBQStDLElBQS9DOztBQUVBMUIsTUFBSU8sRUFBSixDQUFPMEksYUFBUCxDQUFxQjlDLEtBQXJCO0FBQ0EsRUFURDs7QUFXQTtBQUNBbkcsS0FBSXFILFdBQUosR0FBa0IsVUFBVWpELEtBQVYsRUFBa0I7QUFDbkMsTUFBSyxPQUFPQSxNQUFNMEQsT0FBbEIsRUFBNEI7QUFDM0I5SCxPQUFJbUosY0FBSjtBQUNBO0FBQ0QsRUFKRDs7QUFNQTtBQUNBcEosR0FBR0MsSUFBSUMsSUFBUDtBQUVBLENBOUVDLEVBOEVDSixNQTlFRCxFQThFU3dDLE1BOUVULEVBOEVpQnhDLE9BQU9rSixZQTlFeEIsQ0FBRjs7O0FDTkE7Ozs7Ozs7QUFPRSxhQUFXO0FBQ1osS0FBSU8sV0FBVyxDQUFDLENBQUQsR0FBS0MsVUFBVUMsU0FBVixDQUFvQkMsV0FBcEIsR0FBa0NDLE9BQWxDLENBQTJDLFFBQTNDLENBQXBCO0FBQUEsS0FDQ0MsVUFBVSxDQUFDLENBQUQsR0FBS0osVUFBVUMsU0FBVixDQUFvQkMsV0FBcEIsR0FBa0NDLE9BQWxDLENBQTJDLE9BQTNDLENBRGhCO0FBQUEsS0FFQ0UsT0FBTyxDQUFDLENBQUQsR0FBS0wsVUFBVUMsU0FBVixDQUFvQkMsV0FBcEIsR0FBa0NDLE9BQWxDLENBQTJDLE1BQTNDLENBRmI7O0FBSUEsS0FBSyxDQUFFSixZQUFZSyxPQUFaLElBQXVCQyxJQUF6QixLQUFtQ25HLFNBQVNvRyxjQUE1QyxJQUE4RGhLLE9BQU9pSyxnQkFBMUUsRUFBNkY7QUFDNUZqSyxTQUFPaUssZ0JBQVAsQ0FBeUIsWUFBekIsRUFBdUMsWUFBVztBQUNqRCxPQUFJQyxLQUFLaEosU0FBU0MsSUFBVCxDQUFjZ0osU0FBZCxDQUF5QixDQUF6QixDQUFUO0FBQUEsT0FDQ0MsT0FERDs7QUFHQSxPQUFLLENBQUksZUFBRixDQUFvQkMsSUFBcEIsQ0FBMEJILEVBQTFCLENBQVAsRUFBd0M7QUFDdkM7QUFDQTs7QUFFREUsYUFBVXhHLFNBQVNvRyxjQUFULENBQXlCRSxFQUF6QixDQUFWOztBQUVBLE9BQUtFLE9BQUwsRUFBZTtBQUNkLFFBQUssQ0FBSSx1Q0FBRixDQUE0Q0MsSUFBNUMsQ0FBa0RELFFBQVFFLE9BQTFELENBQVAsRUFBNkU7QUFDNUVGLGFBQVFHLFFBQVIsR0FBbUIsQ0FBQyxDQUFwQjtBQUNBOztBQUVESCxZQUFROUQsS0FBUjtBQUNBO0FBQ0QsR0FqQkQsRUFpQkcsS0FqQkg7QUFrQkE7QUFDRCxDQXpCQyxHQUFGOzs7QUNQQTs7Ozs7QUFLQXRHLE9BQU93SyxTQUFQLEdBQW1CLEVBQW5CO0FBQ0UsV0FBVXhLLE1BQVYsRUFBa0JFLENBQWxCLEVBQXFCQyxHQUFyQixFQUEyQjs7QUFFNUI7QUFDQUEsS0FBSUMsSUFBSixHQUFXLFlBQVc7QUFDckJELE1BQUlFLEtBQUo7O0FBRUEsTUFBS0YsSUFBSU0saUJBQUosRUFBTCxFQUErQjtBQUM5Qk4sT0FBSUssVUFBSjtBQUNBO0FBQ0QsRUFORDs7QUFRQTtBQUNBTCxLQUFJRSxLQUFKLEdBQVksWUFBVztBQUN0QkYsTUFBSU8sRUFBSixHQUFTO0FBQ1JWLFdBQVFFLEVBQUdGLE1BQUgsQ0FEQTtBQUVSeUssVUFBT3ZLLEVBQUcsT0FBSDtBQUZDLEdBQVQ7QUFJQSxFQUxEOztBQU9BO0FBQ0FDLEtBQUlLLFVBQUosR0FBaUIsWUFBVztBQUMzQkwsTUFBSU8sRUFBSixDQUFPVixNQUFQLENBQWNvQixFQUFkLENBQWtCLE1BQWxCLEVBQTBCakIsSUFBSXVLLFlBQTlCO0FBQ0EsRUFGRDs7QUFJQTtBQUNBdkssS0FBSU0saUJBQUosR0FBd0IsWUFBVztBQUNsQyxTQUFPTixJQUFJTyxFQUFKLENBQU8rSixLQUFQLENBQWFsSixNQUFwQjtBQUNBLEVBRkQ7O0FBSUE7QUFDQXBCLEtBQUl1SyxZQUFKLEdBQW1CLFlBQVc7QUFDN0IsTUFBTUQsUUFBUXRLLElBQUlPLEVBQUosQ0FBTytKLEtBQXJCO0FBQ0EsTUFBTUUsZUFBZUYsTUFBTTdJLElBQU4sQ0FBWSxVQUFaLENBQXJCO0FBQ0EsTUFBTWdKLFdBQVdILE1BQU03SSxJQUFOLENBQVksVUFBWixDQUFqQjs7QUFFQWdKLFdBQVMxSCxJQUFULENBQWUsWUFBVztBQUN6QixPQUFNMkgsS0FBSzNLLEVBQUcsSUFBSCxFQUFVMEIsSUFBVixDQUFnQixJQUFoQixDQUFYOztBQUVBaUosTUFBRzNILElBQUgsQ0FBUyxVQUFVbUYsS0FBVixFQUFrQjtBQUMxQixRQUFLbkksRUFBR3lLLGFBQWFHLEdBQWIsQ0FBa0J6QyxLQUFsQixDQUFILENBQUwsRUFBc0M7QUFDckNuSSxPQUFHLElBQUgsRUFBVTJCLElBQVYsQ0FBZ0IsWUFBaEIsRUFBOEIzQixFQUFHeUssYUFBYUcsR0FBYixDQUFrQnpDLEtBQWxCLENBQUgsRUFBK0IwQyxJQUEvQixFQUE5QjtBQUNBO0FBQ0QsSUFKRDtBQUtBLEdBUkQ7O0FBVUEsU0FBTyxLQUFQO0FBQ0EsRUFoQkQ7O0FBa0JBO0FBQ0E3SyxHQUFHQyxJQUFJQyxJQUFQO0FBRUEsQ0FuREMsRUFtREVKLE1BbkRGLEVBbURVd0MsTUFuRFYsRUFtRGtCeEMsT0FBT3dLLFNBbkR6QixDQUFGOzs7QUNOQTs7O0FBR0F4SyxPQUFPZ0wsd0JBQVAsR0FBa0MsRUFBbEM7QUFDRSxXQUFVaEwsTUFBVixFQUFrQkUsQ0FBbEIsRUFBcUJDLEdBQXJCLEVBQTJCOztBQUU1QjtBQUNBQSxLQUFJQyxJQUFKLEdBQVcsWUFBVztBQUNyQkQsTUFBSUUsS0FBSjs7QUFFQSxNQUFLRixJQUFJTSxpQkFBSixFQUFMLEVBQStCO0FBQzlCTixPQUFJSyxVQUFKO0FBQ0E7QUFDRCxFQU5EOztBQVFBO0FBQ0FMLEtBQUlFLEtBQUosR0FBWSxZQUFXO0FBQ3RCRixNQUFJTyxFQUFKLEdBQVM7QUFDUlYsV0FBUUUsRUFBR0YsTUFBSCxDQURBO0FBRVJpTCxnQkFBYS9LLEVBQUcsZUFBSDtBQUZMLEdBQVQ7QUFJQSxFQUxEOztBQU9BO0FBQ0FDLEtBQUlLLFVBQUosR0FBaUIsWUFBVztBQUMzQkwsTUFBSU8sRUFBSixDQUFPdUssV0FBUCxDQUFtQjdKLEVBQW5CLENBQXVCLE9BQXZCLEVBQWdDakIsSUFBSStLLGdCQUFwQztBQUNBLEVBRkQ7O0FBSUE7QUFDQS9LLEtBQUlNLGlCQUFKLEdBQXdCLFlBQVc7QUFDbEMsU0FBT04sSUFBSU8sRUFBSixDQUFPdUssV0FBUCxDQUFtQjFKLE1BQTFCO0FBQ0EsRUFGRDs7QUFJQTtBQUNBcEIsS0FBSStLLGdCQUFKLEdBQXVCLFlBQVc7QUFDakNoTCxJQUFHLElBQUgsRUFBVXNCLE9BQVYsQ0FBbUIsZ0JBQW5CLEVBQXNDQyxXQUF0QyxDQUFtRCxlQUFuRDs7QUFFQSxNQUFLdkIsRUFBRyxJQUFILEVBQVVzQixPQUFWLENBQW1CLGdCQUFuQixFQUFzQ0csUUFBdEMsQ0FBZ0QsZUFBaEQsQ0FBTCxFQUF5RTtBQUN4RXpCLEtBQUcsSUFBSCxFQUFVaUwsUUFBVixDQUFvQixtQkFBcEIsRUFBMENsSixPQUExQyxDQUFtRCxPQUFuRDtBQUNBLEdBRkQsTUFFTztBQUNOL0IsS0FBRyxJQUFILEVBQVVpTCxRQUFWLENBQW9CLG1CQUFwQixFQUEwQ2xKLE9BQTFDLENBQW1ELE1BQW5EO0FBQ0E7QUFDRCxFQVJEOztBQVVBO0FBQ0EvQixHQUFHQyxJQUFJQyxJQUFQO0FBRUEsQ0EzQ0MsRUEyQ0NKLE1BM0NELEVBMkNTd0MsTUEzQ1QsRUEyQ2lCeEMsT0FBT2dMLHdCQTNDeEIsQ0FBRjs7O0FDSkE7Ozs7O0FBS0FoTCxPQUFPb0wsY0FBUCxHQUF3QixFQUF4QjtBQUNFLFdBQVVwTCxNQUFWLEVBQWtCRSxDQUFsQixFQUFxQkMsR0FBckIsRUFBMkI7O0FBRTVCO0FBQ0FBLEtBQUlDLElBQUosR0FBVyxZQUFXO0FBQ3JCRCxNQUFJRSxLQUFKO0FBQ0FGLE1BQUlLLFVBQUo7QUFDQSxFQUhEOztBQUtBO0FBQ0FMLEtBQUlFLEtBQUosR0FBWSxZQUFXO0FBQ3RCRixNQUFJTyxFQUFKLEdBQVM7QUFDUixhQUFVUixFQUFHRixNQUFILENBREY7QUFFUixXQUFRRSxFQUFHMEQsU0FBU0csSUFBWjtBQUZBLEdBQVQ7QUFJQSxFQUxEOztBQU9BO0FBQ0E1RCxLQUFJSyxVQUFKLEdBQWlCLFlBQVc7QUFDM0JMLE1BQUlPLEVBQUosQ0FBT1YsTUFBUCxDQUFjcUwsSUFBZCxDQUFvQmxMLElBQUltTCxZQUF4QjtBQUNBLEVBRkQ7O0FBSUE7QUFDQW5MLEtBQUltTCxZQUFKLEdBQW1CLFlBQVc7QUFDN0JuTCxNQUFJTyxFQUFKLENBQU9xRCxJQUFQLENBQVlmLFFBQVosQ0FBc0IsT0FBdEI7QUFDQSxFQUZEOztBQUlBO0FBQ0E5QyxHQUFHQyxJQUFJQyxJQUFQO0FBQ0EsQ0E1QkMsRUE0QkNKLE1BNUJELEVBNEJTd0MsTUE1QlQsRUE0QmlCeEMsT0FBT29MLGNBNUJ4QixDQUFGIiwiZmlsZSI6InByb2plY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEFjY29yZGlvbiBibG9jayBmdW5jdGlvbmFsaXR5XG4gKlxuICogQGF1dGhvciBTaGFubm9uIE1hY01pbGxhbiwgQ29yZXkgQ29sbGluc1xuICovXG53aW5kb3cuYWNjb3JkaW9uQmxvY2tUb2dnbGUgPSB7fTtcbiggZnVuY3Rpb24oIHdpbmRvdywgJCwgYXBwICkge1xuXG5cdC8vIENvbnN0cnVjdG9yXG5cdGFwcC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLmNhY2hlKCk7XG5cblx0XHQvLyBJZiB3ZSdyZSBpbiBhbiBBQ0YgZWRpdCBwYWdlLlxuXHRcdGlmICggd2luZG93LmFjZiApIHtcblx0XHRcdHdpbmRvdy5hY2YuYWRkQWN0aW9uKCAncmVuZGVyX2Jsb2NrX3ByZXZpZXcnLCBhcHAuYmluZEV2ZW50cyApO1xuXHRcdH1cblxuXHRcdGlmICggYXBwLm1lZXRzUmVxdWlyZW1lbnRzKCkgKSB7XG5cdFx0XHRhcHAuYmluZEV2ZW50cygpO1xuXHRcdH1cblx0fTtcblxuXHQvLyBDYWNoZSBhbGwgdGhlIHRoaW5nc1xuXHRhcHAuY2FjaGUgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMgPSB7XG5cdFx0XHR3aW5kb3c6ICQoIHdpbmRvdyApLFxuXHRcdFx0aHRtbDogJCggJ2h0bWwnICksXG5cdFx0XHRhY2NvcmRpb246ICQoICcuYWNjb3JkaW9uJyApLFxuXHRcdFx0aXRlbXM6ICQoICcuYWNjb3JkaW9uLWl0ZW0nICksXG5cdFx0XHRoZWFkZXJzOiAkKCAnLmFjY29yZGlvbi1pdGVtLWhlYWRlcicgKSxcblx0XHRcdGNvbnRlbnRzOiAkKCAnLmFjY29yZGlvbi1pdGVtLWNvbnRlbnQnICksXG5cdFx0XHRidXR0b246ICQoICcuYWNjb3JkaW9uLWl0ZW0tdG9nZ2xlJyApLFxuXHRcdFx0YW5jaG9ySUQ6ICQoIHdpbmRvdy5sb2NhdGlvbi5oYXNoIClcblx0XHR9O1xuXHR9O1xuXG5cdC8vIENvbWJpbmUgYWxsIGV2ZW50c1xuXHRhcHAuYmluZEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdCQoICcuYWNjb3JkaW9uLWl0ZW0taGVhZGVyJyApLm9uKCAnY2xpY2sgdG91Y2hzdGFydCcsIGFwcC50b2dnbGVBY2NvcmRpb24gKTtcblx0XHQkKCAnLmFjY29yZGlvbi1pdGVtLXRvZ2dsZScgKS5vbiggJ2NsaWNrIHRvdWNoc3RhcnQnLCBhcHAudG9nZ2xlQWNjb3JkaW9uICk7XG5cdFx0YXBwLiRjLndpbmRvdy5vbiggJ2xvYWQnLCBhcHAub3Blbkhhc2hBY2NvcmRpb24gKTtcblx0fTtcblxuXHQvLyBEbyB3ZSBtZWV0IHRoZSByZXF1aXJlbWVudHM/XG5cdGFwcC5tZWV0c1JlcXVpcmVtZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBhcHAuJGMuYWNjb3JkaW9uLmxlbmd0aDtcblx0fTtcblxuXHRhcHAudG9nZ2xlQWNjb3JkaW9uID0gZnVuY3Rpb24oKSB7XG5cblx0XHQvLyBBZGQgdGhlIG9wZW4gY2xhc3MgdG8gdGhlIGl0ZW0uXG5cdFx0JCggdGhpcyApLnBhcmVudHMoICcuYWNjb3JkaW9uLWl0ZW0nICkudG9nZ2xlQ2xhc3MoICdvcGVuJyApO1xuXG5cdFx0Ly8gSXMgdGhpcyBvbmUgZXhwYW5kZWQ/XG5cdFx0bGV0IGlzRXhwYW5kZWQgPSAkKCB0aGlzICkucGFyZW50cyggJy5hY2NvcmRpb24taXRlbScgKS5oYXNDbGFzcyggJ29wZW4nICk7XG5cblx0XHQvLyBTZXQgdGhpcyBidXR0b24ncyBhcmlhLWV4cGFuZGVkIHZhbHVlLlxuXHRcdCQoIHRoaXMgKS5wYXJlbnRzKCAnLmFjY29yZGlvbi1pdGVtJyApLmZpbmQoICcuYWNjb3JkaW9uLWl0ZW0tdG9nZ2xlJyApLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgaXNFeHBhbmRlZCA/ICd0cnVlJyA6ICdmYWxzZScgKTtcblxuXHRcdC8vIFNldCBhbGwgb3RoZXIgaXRlbXMgaW4gdGhpcyBibG9jayB0byBhcmlhLWhpZGRlbj10cnVlLlxuXHRcdCQoIHRoaXMgKS5wYXJlbnRzKCAnLmFjY29yZGlvbi1ibG9jaycgKS5maW5kKCAnLmFjY29yZGlvbi1pdGVtLWNvbnRlbnQnICkubm90KCAkKCB0aGlzICkucGFyZW50cyggJy5hY2NvcmRpb24taXRlbScgKSApLmF0dHIoICdhcmlhLWhpZGRlbicsICd0cnVlJyApO1xuXG5cdFx0Ly8gU2V0IHRoaXMgaXRlbSB0byBhcmlhLWhpZGRlbj1mYWxzZS5cblx0XHQkKCB0aGlzICkucGFyZW50cyggJy5hY2NvcmRpb24taXRlbScgKS5maW5kKCAnLmFjY29yZGlvbi1pdGVtLWNvbnRlbnQnICkuYXR0ciggJ2FyaWEtaGlkZGVuJywgaXNFeHBhbmRlZCA/ICdmYWxzZScgOiAndHJ1ZScgKTtcblxuXHRcdC8vIEhpZGUgdGhlIG90aGVyIHBhbmVscy5cblx0XHQkKCB0aGlzICkucGFyZW50cyggJy5hY2NvcmRpb24tYmxvY2snICkuZmluZCggJy5hY2NvcmRpb24taXRlbScgKS5ub3QoICQoIHRoaXMgKS5wYXJlbnRzKCAnLmFjY29yZGlvbi1pdGVtJyApICkucmVtb3ZlQ2xhc3MoICdvcGVuJyApO1xuXHRcdCQoIHRoaXMgKS5wYXJlbnRzKCAnLmFjY29yZGlvbi1ibG9jaycgKS5maW5kKCAnLmFjY29yZGlvbi1pdGVtLXRvZ2dsZScgKS5ub3QoICQoIHRoaXMgKSApLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyApO1xuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9O1xuXG5cdGFwcC5vcGVuSGFzaEFjY29yZGlvbiA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0aWYgKCAhIGFwcC4kYy5hbmNob3JJRC5zZWxlY3RvciApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBUcmlnZ2VyIGEgY2xpY2sgb24gdGhlIGJ1dHRvbiBjbG9zZXN0IHRvIHRoaXMgYWNjb3JkaW9uLlxuXHRcdGFwcC4kYy5hbmNob3JJRC5wYXJlbnRzKCAnLmFjY29yZGlvbi1pdGVtJyApLmZpbmQoICcuYWNjb3JkaW9uLWl0ZW0tdG9nZ2xlJyApLnRyaWdnZXIoICdjbGljaycgKTtcblxuXHRcdC8vIE5vdCBzZXR0aW5nIGEgY2FjaGVkIHZhcmlhYmxlIGFzIGl0IGRvZXNuJ3Qgc2VlbSB0byBncmFiIHRoZSBoZWlnaHQgcHJvcGVybHkuXG5cdFx0Y29uc3QgYWRtaW5CYXJIZWlnaHQgPSAkKCAnI3dwYWRtaW5iYXInICkubGVuZ3RoID8gJCggJyN3cGFkbWluYmFyJyApLmhlaWdodCgpIDogMDtcblxuXHRcdC8vIEFuaW1hdGUgdG8gdGhlIGRpdiBmb3IgYSBuaWNlciBleHBlcmllbmNlLlxuXHRcdGFwcC4kYy5odG1sLmFuaW1hdGUoIHtcblx0XHRcdHNjcm9sbFRvcDogYXBwLiRjLmFuY2hvcklELm9mZnNldCgpLnRvcCAtIGFkbWluQmFySGVpZ2h0XG5cdFx0fSwgJ3Nsb3cnICk7XG5cdH07XG5cblx0Ly8gRW5nYWdlXG5cdGFwcC5pbml0KCk7XG5cbn0gKCB3aW5kb3csIGpRdWVyeSwgd2luZG93LmFjY29yZGlvbkJsb2NrVG9nZ2xlICkgKTtcbiIsIi8qKlxuICogRmlsZSBjYXJvdXNlbC5qc1xuICpcbiAqIERlYWwgd2l0aCB0aGUgU2xpY2sgY2Fyb3VzZWwuXG4gKi9cbndpbmRvdy53ZHNDYXJvdXNlbCA9IHt9O1xuKCBmdW5jdGlvbiggd2luZG93LCAkLCBhcHAgKSB7XG5cblx0Ly8gQ29uc3RydWN0b3IuXG5cdGFwcC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLmNhY2hlKCk7XG5cblx0XHQvLyBJZiB3ZSdyZSBpbiBhbiBBQ0YgZWRpdCBwYWdlLlxuXHRcdGlmICggd2luZG93LmFjZiApIHtcblx0XHRcdGFwcC5kb1NsaWNrKCk7XG5cdFx0fVxuXG5cdFx0aWYgKCBhcHAubWVldHNSZXF1aXJlbWVudHMoKSApIHtcblx0XHRcdGFwcC5iaW5kRXZlbnRzKCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIENhY2hlIGFsbCB0aGUgdGhpbmdzLlxuXHRhcHAuY2FjaGUgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMgPSB7XG5cdFx0XHR3aW5kb3c6ICQoIHdpbmRvdyApLFxuXHRcdFx0dGhlQ2Fyb3VzZWw6ICQoICcuY2Fyb3VzZWwtYmxvY2snIClcblx0XHR9O1xuXHR9O1xuXG5cdC8vIENvbWJpbmUgYWxsIGV2ZW50cy5cblx0YXBwLmJpbmRFdmVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMud2luZG93Lm9uKCAnbG9hZCcsIGFwcC5kb1NsaWNrICk7XG5cdFx0YXBwLiRjLndpbmRvdy5vbiggJ2xvYWQnLCBhcHAuZG9GaXJzdEFuaW1hdGlvbiApO1xuXHR9O1xuXG5cdC8vIERvIHdlIG1lZXQgdGhlIHJlcXVpcmVtZW50cz9cblx0YXBwLm1lZXRzUmVxdWlyZW1lbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGFwcC4kYy50aGVDYXJvdXNlbC5sZW5ndGg7XG5cdH07XG5cblx0Ly8gQW5pbWF0ZSB0aGUgZmlyc3Qgc2xpZGUgb24gd2luZG93IGxvYWQuXG5cdGFwcC5kb0ZpcnN0QW5pbWF0aW9uID0gZnVuY3Rpb24oKSB7XG5cblx0XHQvLyBHZXQgdGhlIGZpcnN0IHNsaWRlIGNvbnRlbnQgYXJlYSBhbmQgYW5pbWF0aW9uIGF0dHJpYnV0ZS5cblx0XHRsZXQgZmlyc3RTbGlkZSA9IGFwcC4kYy50aGVDYXJvdXNlbC5maW5kKCAnW2RhdGEtc2xpY2staW5kZXg9MF0nICksXG5cdFx0XHRmaXJzdFNsaWRlQ29udGVudCA9IGZpcnN0U2xpZGUuZmluZCggJy5zbGlkZS1jb250ZW50JyApLFxuXHRcdFx0Zmlyc3RBbmltYXRpb24gPSBmaXJzdFNsaWRlQ29udGVudC5hdHRyKCAnZGF0YS1hbmltYXRpb24nICk7XG5cblx0XHQvLyBBZGQgdGhlIGFuaW1hdGlvbiBjbGFzcyB0byB0aGUgZmlyc3Qgc2xpZGUuXG5cdFx0Zmlyc3RTbGlkZUNvbnRlbnQuYWRkQ2xhc3MoIGZpcnN0QW5pbWF0aW9uICk7XG5cdH07XG5cblx0Ly8gQWxsb3cgYmFja2dyb3VuZCB2aWRlb3MgdG8gYXV0b3BsYXkuXG5cdGFwcC5wbGF5QmFja2dyb3VuZFZpZGVvcyA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0Ly8gR2V0IGFsbCB0aGUgdmlkZW9zIGluIG91ciBzbGlkZXMgb2JqZWN0LlxuXHRcdCQoICd2aWRlbycgKS5lYWNoKCBmdW5jdGlvbigpIHtcblxuXHRcdFx0Ly8gTGV0IHRoZW0gYXV0b3BsYXkuIFRPRE86IFBvc3NpYmx5IGNoYW5nZSB0aGlzIGxhdGVyIHRvIG9ubHkgcGxheSB0aGUgdmlzaWJsZSBzbGlkZSB2aWRlby5cblx0XHRcdHRoaXMucGxheSgpO1xuXHRcdH0gKTtcblx0fTtcblxuXHQvLyBJbml0aWFsaXplIG91ciBjYXJvdXNlbC5cblx0YXBwLmluaXRpYWxpemVDYXJvdXNlbCA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0JCggJy5jYXJvdXNlbC1ibG9jaycgKS5ub3QoICcuc2xpY2staW5pdGlhbGl6ZWQnICkuc2xpY2soIHtcblx0XHRcdGF1dG9wbGF5OiB0cnVlLFxuXHRcdFx0YXV0b3BsYXlTcGVlZDogNTAwMCxcblx0XHRcdGFycm93czogdHJ1ZSxcblx0XHRcdGRvdHM6IHRydWUsXG5cdFx0XHRmb2N1c09uU2VsZWN0OiB0cnVlLFxuXHRcdFx0d2FpdEZvckFuaW1hdGU6IHRydWVcblx0XHR9ICk7XG5cdH07XG5cblx0Ly8gS2ljayBvZmYgU2xpY2suXG5cdGFwcC5kb1NsaWNrID0gZnVuY3Rpb24oKSB7XG5cblxuXHRcdC8vIFJlbmRlciBvbiB0aGUgZnJvbnRlbmQuXG5cdFx0JCggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oKSB7XG5cdFx0XHRhcHAucGxheUJhY2tncm91bmRWaWRlb3M7XG5cdFx0XHRhcHAuaW5pdGlhbGl6ZUNhcm91c2VsKCk7XG5cdFx0fSApO1xuXG5cdFx0Ly8gUmVuZGVyIG9uIHRoZSBiYWNrZW5kLlxuXHRcdGlmICggd2luZG93LmFjZiApIHtcblx0XHRcdHdpbmRvdy5hY2YuYWRkQWN0aW9uKCAncmVuZGVyX2Jsb2NrX3ByZXZpZXcnLCBhcHAuaW5pdGlhbGl6ZUNhcm91c2VsICk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIEVuZ2FnZSFcblx0JCggYXBwLmluaXQgKTtcbn0gKCB3aW5kb3csIGpRdWVyeSwgd2luZG93Lndkc0Nhcm91c2VsICkgKTtcbiIsIi8qKlxuICogU2hvdy9IaWRlIHRoZSBTZWFyY2ggRm9ybSBpbiB0aGUgaGVhZGVyLlxuICpcbiAqIEBhdXRob3IgQ29yZXkgQ29sbGluc1xuICovXG53aW5kb3cuU2hvd0hpZGVTZWFyY2hGb3JtID0ge307XG4oIGZ1bmN0aW9uKCB3aW5kb3csICQsIGFwcCApIHtcblxuXHQvLyBDb25zdHJ1Y3RvclxuXHRhcHAuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC5jYWNoZSgpO1xuXG5cdFx0aWYgKCBhcHAubWVldHNSZXF1aXJlbWVudHMoKSApIHtcblx0XHRcdGFwcC5iaW5kRXZlbnRzKCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIENhY2hlIGFsbCB0aGUgdGhpbmdzXG5cdGFwcC5jYWNoZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYyA9IHtcblx0XHRcdHdpbmRvdzogJCggd2luZG93ICksXG5cdFx0XHRib2R5OiAkKCAnYm9keScgKSxcblx0XHRcdGhlYWRlclNlYXJjaFRvZ2dsZTogJCggJy5zaXRlLWhlYWRlci1hY3Rpb24gLmN0YS1idXR0b24nICksXG5cdFx0XHRoZWFkZXJTZWFyY2hGb3JtOiAkKCAnLnNpdGUtaGVhZGVyLWFjdGlvbiAuZm9ybS1jb250YWluZXInICksXG5cdFx0fTtcblx0fTtcblxuXHQvLyBDb21iaW5lIGFsbCBldmVudHNcblx0YXBwLmJpbmRFdmVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMuaGVhZGVyU2VhcmNoVG9nZ2xlLm9uKCAna2V5dXAgdG91Y2hzdGFydCBjbGljaycsIGFwcC5zaG93SGlkZVNlYXJjaEZvcm0gKTtcblx0XHRhcHAuJGMuYm9keS5vbiggJ2tleXVwIHRvdWNoc3RhcnQgY2xpY2snLCBhcHAuaGlkZVNlYXJjaEZvcm0gKTtcblx0fTtcblxuXHQvLyBEbyB3ZSBtZWV0IHRoZSByZXF1aXJlbWVudHM/XG5cdGFwcC5tZWV0c1JlcXVpcmVtZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBhcHAuJGMuaGVhZGVyU2VhcmNoVG9nZ2xlLmxlbmd0aDtcblx0fTtcblxuXHQvLyBDaGVja3MgdG8gc2VlIGlmIHRoZSBtZW51IGhhcyBiZWVuIG9wZW5lZC5cblx0YXBwLnNlYXJjaElzT3BlbiA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0aWYgKCBhcHAuJGMuYm9keS5oYXNDbGFzcyggJ3NlYXJjaC1mb3JtLXZpc2libGUnICkgKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH07XG5cblx0Ly8gQWRkcyB0aGUgdG9nZ2xlIGNsYXNzIGZvciB0aGUgc2VhcmNoIGZvcm0uXG5cdGFwcC5zaG93SGlkZVNlYXJjaEZvcm0gPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMuYm9keS50b2dnbGVDbGFzcyggJ3NlYXJjaC1mb3JtLXZpc2libGUnICk7XG5cblx0XHRhcHAudG9nZ2xlU2VhcmNoRm9ybUFyaWFMYWJlbCgpO1xuXHRcdGFwcC50b2dnbGVTZWFyY2hUb2dnbGVBcmlhTGFiZWwoKTtcblxuXHRcdHJldHVybiBmYWxzZTtcblx0fTtcblxuXHQvLyBIaWRlcyB0aGUgc2VhcmNoIGZvcm0gaWYgd2UgY2xpY2sgb3V0c2lkZSBvZiBpdHMgY29udGFpbmVyLlxuXHRhcHAuaGlkZVNlYXJjaEZvcm0gPSBmdW5jdGlvbiggZXZlbnQgKSB7XG5cblx0XHRpZiAoICEgJCggZXZlbnQudGFyZ2V0ICkucGFyZW50cyggJ2RpdicgKS5oYXNDbGFzcyggJ3NpdGUtaGVhZGVyLWFjdGlvbicgKSApIHtcblx0XHRcdGFwcC4kYy5ib2R5LnJlbW92ZUNsYXNzKCAnc2VhcmNoLWZvcm0tdmlzaWJsZScgKTtcblx0XHRcdGFwcC50b2dnbGVTZWFyY2hGb3JtQXJpYUxhYmVsKCk7XG5cdFx0XHRhcHAudG9nZ2xlU2VhcmNoVG9nZ2xlQXJpYUxhYmVsKCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIFRvZ2dsZXMgdGhlIGFyaWEtaGlkZGVuIGxhYmVsIG9uIHRoZSBmb3JtIGNvbnRhaW5lci5cblx0YXBwLnRvZ2dsZVNlYXJjaEZvcm1BcmlhTGFiZWwgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMuaGVhZGVyU2VhcmNoRm9ybS5hdHRyKCAnYXJpYS1oaWRkZW4nLCBhcHAuc2VhcmNoSXNPcGVuKCkgPyAnZmFsc2UnIDogJ3RydWUnICk7XG5cdH07XG5cblx0Ly8gVG9nZ2xlcyB0aGUgYXJpYS1oaWRkZW4gbGFiZWwgb24gdGhlIHRvZ2dsZSBidXR0b24uXG5cdGFwcC50b2dnbGVTZWFyY2hUb2dnbGVBcmlhTGFiZWwgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMuaGVhZGVyU2VhcmNoVG9nZ2xlLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgYXBwLnNlYXJjaElzT3BlbigpID8gJ3RydWUnIDogJ2ZhbHNlJyApO1xuXHR9O1xuXG5cdC8vIEVuZ2FnZVxuXHQkKCBhcHAuaW5pdCApO1xuXG59ICggd2luZG93LCBqUXVlcnksIHdpbmRvdy5TaG93SGlkZVNlYXJjaEZvcm0gKSApO1xuIiwiLyoqXG4gKiBGaWxlIGpzLWVuYWJsZWQuanNcbiAqXG4gKiBJZiBKYXZhc2NyaXB0IGlzIGVuYWJsZWQsIHJlcGxhY2UgdGhlIDxib2R5PiBjbGFzcyBcIm5vLWpzXCIuXG4gKi9cbmRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gZG9jdW1lbnQuYm9keS5jbGFzc05hbWUucmVwbGFjZSggJ25vLWpzJywgJ2pzJyApO1xuIiwiKGZ1bmN0aW9uICgkKSB7XG4gIC8vIGluaXQgTWFzb25yeVxuICB2YXIgJGdyaWQgPSAkKFwiLmdyaWQtbGF5b3V0XCIpLm1hc29ucnkoe1xuICAgIC8vIHNldCBpdGVtU2VsZWN0b3Igc28gLmdyaWQtc2l6ZXIgaXMgbm90IHVzZWQgaW4gbGF5b3V0XG4gICAgY29sdW1uV2lkdGg6IFwiLnNwYW4tMVwiLFxuICAgIGl0ZW1TZWxlY3RvcjogXCIuZ3JpZC1pdGVtXCIsXG4gICAgLy8gc3RhbXA6ICcuc3RhbXAnXG4gIH0pO1xuICAvLyBsYXlvdXQgTWFzb25yeSBhZnRlciBlYWNoIGltYWdlIGxvYWRzXG4gICRncmlkLmltYWdlc0xvYWRlZCgpLnByb2dyZXNzKGZ1bmN0aW9uICgpIHtcbiAgICAkZ3JpZC5tYXNvbnJ5KFwibGF5b3V0XCIpO1xuICAgIGNvbnNvbGUubG9nKCdsYXlvdXRlZCcpO1xuICB9KTtcbn0pKGpRdWVyeSk7XG4iLCIvKipcbiAqIEZpbGU6IG1vYmlsZS1tZW51LmpzXG4gKlxuICogQ3JlYXRlIGFuIGFjY29yZGlvbiBzdHlsZSBkcm9wZG93bi5cbiAqL1xud2luZG93Lndkc01vYmlsZU1lbnUgPSB7fTtcbiggZnVuY3Rpb24oIHdpbmRvdywgJCwgYXBwICkge1xuXG5cdC8vIENvbnN0cnVjdG9yLlxuXHRhcHAuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC5jYWNoZSgpO1xuXG5cdFx0aWYgKCBhcHAubWVldHNSZXF1aXJlbWVudHMoKSApIHtcblx0XHRcdGFwcC5iaW5kRXZlbnRzKCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIENhY2hlIGFsbCB0aGUgdGhpbmdzLlxuXHRhcHAuY2FjaGUgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMgPSB7XG5cdFx0XHRib2R5OiAkKCAnYm9keScgKSxcblx0XHRcdHdpbmRvdzogJCggd2luZG93ICksXG5cdFx0XHRzdWJNZW51Q29udGFpbmVyOiAkKCAnLm1vYmlsZS1tZW51IC5zdWItbWVudSwgLnV0aWxpdHktbmF2aWdhdGlvbiAuc3ViLW1lbnUnICksXG5cdFx0XHRzdWJTdWJNZW51Q29udGFpbmVyOiAkKCAnLm1vYmlsZS1tZW51IC5zdWItbWVudSAuc3ViLW1lbnUnICksXG5cdFx0XHRzdWJNZW51UGFyZW50SXRlbTogJCggJy5tb2JpbGUtbWVudSBsaS5tZW51LWl0ZW0taGFzLWNoaWxkcmVuLCAudXRpbGl0eS1uYXZpZ2F0aW9uIGxpLm1lbnUtaXRlbS1oYXMtY2hpbGRyZW4nICksXG5cdFx0XHRvZmZDYW52YXNDb250YWluZXI6ICQoICcub2ZmLWNhbnZhcy1jb250YWluZXInIClcblx0XHR9O1xuXHR9O1xuXG5cdC8vIENvbWJpbmUgYWxsIGV2ZW50cy5cblx0YXBwLmJpbmRFdmVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMud2luZG93Lm9uKCAnbG9hZCcsIGFwcC5hZGREb3duQXJyb3cgKTtcblx0XHRhcHAuJGMuc3ViTWVudVBhcmVudEl0ZW0ub24oICdjbGljaycsIGFwcC50b2dnbGVTdWJtZW51ICk7XG5cdFx0YXBwLiRjLnN1Yk1lbnVQYXJlbnRJdGVtLm9uKCAndHJhbnNpdGlvbmVuZCcsIGFwcC5yZXNldFN1Yk1lbnUgKTtcblx0XHRhcHAuJGMub2ZmQ2FudmFzQ29udGFpbmVyLm9uKCAndHJhbnNpdGlvbmVuZCcsIGFwcC5mb3JjZUNsb3NlU3VibWVudXMgKTtcblx0fTtcblxuXHQvLyBEbyB3ZSBtZWV0IHRoZSByZXF1aXJlbWVudHM/XG5cdGFwcC5tZWV0c1JlcXVpcmVtZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBhcHAuJGMuc3ViTWVudUNvbnRhaW5lci5sZW5ndGg7XG5cdH07XG5cblx0Ly8gUmVzZXQgdGhlIHN1Ym1lbnVzIGFmdGVyIGl0J3MgZG9uZSBjbG9zaW5nLlxuXHRhcHAucmVzZXRTdWJNZW51ID0gZnVuY3Rpb24oKSB7XG5cblx0XHQvLyBXaGVuIHRoZSBsaXN0IGl0ZW0gaXMgZG9uZSB0cmFuc2l0aW9uaW5nIGluIGhlaWdodCxcblx0XHQvLyByZW1vdmUgdGhlIGNsYXNzZXMgZnJvbSB0aGUgc3VibWVudSBzbyBpdCBpcyByZWFkeSB0byB0b2dnbGUgYWdhaW4uXG5cdFx0aWYgKCAkKCB0aGlzICkuaXMoICdsaS5tZW51LWl0ZW0taGFzLWNoaWxkcmVuJyApICYmICEgJCggdGhpcyApLmhhc0NsYXNzKCAnaXMtdmlzaWJsZScgKSApIHtcblx0XHRcdCQoIHRoaXMgKS5maW5kKCAndWwuc3ViLW1lbnUnICkucmVtb3ZlQ2xhc3MoICdzbGlkZU91dExlZnQgaXMtdmlzaWJsZScgKTtcblx0XHR9XG5cblx0fTtcblxuXHQvLyBTbGlkZSBvdXQgdGhlIHN1Ym1lbnUgaXRlbXMuXG5cdGFwcC5zbGlkZU91dFN1Yk1lbnVzID0gZnVuY3Rpb24oIGVsICkge1xuXG5cdFx0Ly8gSWYgdGhpcyBpdGVtJ3MgcGFyZW50IGlzIHZpc2libGUgYW5kIHRoaXMgaXMgbm90LCBiYWlsLlxuXHRcdGlmICggZWwucGFyZW50KCkuaGFzQ2xhc3MoICdpcy12aXNpYmxlJyApICYmICEgZWwuaGFzQ2xhc3MoICdpcy12aXNpYmxlJyApICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIElmIHRoaXMgaXRlbSdzIHBhcmVudCBpcyB2aXNpYmxlIGFuZCB0aGlzIGl0ZW0gaXMgdmlzaWJsZSwgaGlkZSBpdHMgc3VibWVudSB0aGVuIGJhaWwuXG5cdFx0aWYgKCBlbC5wYXJlbnQoKS5oYXNDbGFzcyggJ2lzLXZpc2libGUnICkgJiYgZWwuaGFzQ2xhc3MoICdpcy12aXNpYmxlJyApICkge1xuXHRcdFx0ZWwucmVtb3ZlQ2xhc3MoICdpcy12aXNpYmxlJyApLmZpbmQoICcuc3ViLW1lbnUnICkucmVtb3ZlQ2xhc3MoICdzbGlkZUluTGVmdCcgKS5hZGRDbGFzcyggJ3NsaWRlT3V0TGVmdCcgKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRhcHAuJGMuc3ViTWVudUNvbnRhaW5lci5lYWNoKCBmdW5jdGlvbigpIHtcblxuXHRcdFx0Ly8gT25seSB0cnkgdG8gY2xvc2Ugc3VibWVudXMgdGhhdCBhcmUgYWN0dWFsbHkgb3Blbi5cblx0XHRcdGlmICggJCggdGhpcyApLmhhc0NsYXNzKCAnc2xpZGVJbkxlZnQnICkgKSB7XG5cblx0XHRcdFx0Ly8gQ2xvc2UgdGhlIHBhcmVudCBsaXN0IGl0ZW0sIGFuZCBzZXQgdGhlIGNvcnJlc3BvbmRpbmcgYnV0dG9uIGFyaWEgdG8gZmFsc2UuXG5cdFx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5yZW1vdmVDbGFzcyggJ2lzLXZpc2libGUnICkuZmluZCggJy5wYXJlbnQtaW5kaWNhdG9yJyApLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgZmFsc2UgKTtcblxuXHRcdFx0XHQvLyBTbGlkZSBvdXQgdGhlIHN1Ym1lbnUuXG5cdFx0XHRcdCQoIHRoaXMgKS5yZW1vdmVDbGFzcyggJ3NsaWRlSW5MZWZ0JyApLmFkZENsYXNzKCAnc2xpZGVPdXRMZWZ0JyApO1xuXHRcdFx0fVxuXG5cdFx0fSApO1xuXHR9O1xuXG5cdC8vIEFkZCB0aGUgZG93biBhcnJvdyB0byBzdWJtZW51IHBhcmVudHMuXG5cdGFwcC5hZGREb3duQXJyb3cgPSBmdW5jdGlvbigpIHtcblxuXHRcdGFwcC4kYy5zdWJNZW51UGFyZW50SXRlbS5maW5kKCAnYTpmaXJzdCcgKS5hZnRlciggJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiIGNsYXNzPVwicGFyZW50LWluZGljYXRvclwiIGFyaWEtbGFiZWw9XCJPcGVuIHN1Ym1lbnVcIj48c3BhbiBjbGFzcz1cImRvd24tYXJyb3dcIj48L3NwYW4+PC9idXR0b24+JyApO1xuXHR9O1xuXG5cdC8vIERlYWwgd2l0aCB0aGUgc3VibWVudS5cblx0YXBwLnRvZ2dsZVN1Ym1lbnUgPSBmdW5jdGlvbiggZSApIHtcblxuXHRcdGxldCBlbCA9ICQoIHRoaXMgKSwgLy8gVGhlIG1lbnUgZWxlbWVudCB3aGljaCB3YXMgY2xpY2tlZCBvbi5cblx0XHRcdHN1Yk1lbnUgPSBlbC5jaGlsZHJlbiggJ3VsLnN1Yi1tZW51JyApLCAvLyBUaGUgbmVhcmVzdCBzdWJtZW51LlxuXHRcdFx0JHRhcmdldCA9ICQoIGUudGFyZ2V0ICk7IC8vIHRoZSBlbGVtZW50IHRoYXQncyBhY3R1YWxseSBiZWluZyBjbGlja2VkIChjaGlsZCBvZiB0aGUgbGkgdGhhdCB0cmlnZ2VyZWQgdGhlIGNsaWNrIGV2ZW50KS5cblxuXHRcdC8vIEZpZ3VyZSBvdXQgaWYgd2UncmUgY2xpY2tpbmcgdGhlIGJ1dHRvbiBvciBpdHMgYXJyb3cgY2hpbGQsXG5cdFx0Ly8gaWYgc28sIHdlIGNhbiBqdXN0IG9wZW4gb3IgY2xvc2UgdGhlIG1lbnUgYW5kIGJhaWwuXG5cdFx0aWYgKCAkdGFyZ2V0Lmhhc0NsYXNzKCAnZG93bi1hcnJvdycgKSB8fCAkdGFyZ2V0Lmhhc0NsYXNzKCAncGFyZW50LWluZGljYXRvcicgKSApIHtcblxuXHRcdFx0Ly8gRmlyc3QsIGNvbGxhcHNlIGFueSBhbHJlYWR5IG9wZW5lZCBzdWJtZW51cy5cblx0XHRcdGFwcC5zbGlkZU91dFN1Yk1lbnVzKCBlbCApO1xuXG5cdFx0XHRpZiAoICEgc3ViTWVudS5oYXNDbGFzcyggJ2lzLXZpc2libGUnICkgKSB7XG5cblx0XHRcdFx0Ly8gT3BlbiB0aGUgc3VibWVudS5cblx0XHRcdFx0YXBwLm9wZW5TdWJtZW51KCBlbCwgc3ViTWVudSApO1xuXG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0fTtcblxuXHQvLyBPcGVuIGEgc3VibWVudS5cblx0YXBwLm9wZW5TdWJtZW51ID0gZnVuY3Rpb24oIHBhcmVudCwgc3ViTWVudSApIHtcblxuXHRcdC8vIEV4cGFuZCB0aGUgbGlzdCBtZW51IGl0ZW0sIGFuZCBzZXQgdGhlIGNvcnJlc3BvbmRpbmcgYnV0dG9uIGFyaWEgdG8gdHJ1ZS5cblx0XHRwYXJlbnQuYWRkQ2xhc3MoICdpcy12aXNpYmxlJyApLmZpbmQoICcucGFyZW50LWluZGljYXRvcicgKS5hdHRyKCAnYXJpYS1leHBhbmRlZCcsIHRydWUgKTtcblxuXHRcdC8vIFNsaWRlIHRoZSBtZW51IGluLlxuXHRcdHN1Yk1lbnUuYWRkQ2xhc3MoICdpcy12aXNpYmxlIGFuaW1hdGVkIHNsaWRlSW5MZWZ0JyApO1xuXHR9O1xuXG5cdC8vIEZvcmNlIGNsb3NlIGFsbCB0aGUgc3VibWVudXMgd2hlbiB0aGUgbWFpbiBtZW51IGNvbnRhaW5lciBpcyBjbG9zZWQuXG5cdGFwcC5mb3JjZUNsb3NlU3VibWVudXMgPSBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0aWYgKCAkKCBldmVudC50YXJnZXQgKS5oYXNDbGFzcyggJ29mZi1jYW52YXMtY29udGFpbmVyJyApICkge1xuXG5cdFx0XHQvLyBGb2N1cyBvZmZjYW52YXMgbWVudSBmb3IgYTExeS5cblx0XHRcdGFwcC4kYy5vZmZDYW52YXNDb250YWluZXIuZm9jdXMoKTtcblxuXHRcdFx0Ly8gVGhlIHRyYW5zaXRpb25lbmQgZXZlbnQgdHJpZ2dlcnMgb24gb3BlbiBhbmQgb24gY2xvc2UsIG5lZWQgdG8gbWFrZSBzdXJlIHdlIG9ubHkgZG8gdGhpcyBvbiBjbG9zZS5cblx0XHRcdGlmICggISAkKCB0aGlzICkuaGFzQ2xhc3MoICdpcy12aXNpYmxlJyApICkge1xuXHRcdFx0XHRhcHAuJGMuc3ViTWVudVBhcmVudEl0ZW0ucmVtb3ZlQ2xhc3MoICdpcy12aXNpYmxlJyApLmZpbmQoICcucGFyZW50LWluZGljYXRvcicgKS5hdHRyKCAnYXJpYS1leHBhbmRlZCcsIGZhbHNlICk7XG5cdFx0XHRcdGFwcC4kYy5zdWJNZW51Q29udGFpbmVyLnJlbW92ZUNsYXNzKCAnaXMtdmlzaWJsZSBzbGlkZUluTGVmdCcgKTtcblx0XHRcdFx0YXBwLiRjLmJvZHkuY3NzKCAnb3ZlcmZsb3cnLCAndmlzaWJsZScgKTtcblx0XHRcdFx0YXBwLiRjLmJvZHkudW5iaW5kKCAndG91Y2hzdGFydCcgKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCAkKCB0aGlzICkuaGFzQ2xhc3MoICdpcy12aXNpYmxlJyApICkge1xuXHRcdFx0XHRhcHAuJGMuYm9keS5jc3MoICdvdmVyZmxvdycsICdoaWRkZW4nICk7XG5cdFx0XHRcdGFwcC4kYy5ib2R5LmJpbmQoICd0b3VjaHN0YXJ0JywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdFx0aWYgKCAhICQoIGUudGFyZ2V0ICkucGFyZW50cyggJy5jb250YWN0LW1vZGFsJyApWzBdICkge1xuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHQvLyBFbmdhZ2UhXG5cdCQoIGFwcC5pbml0ICk7XG5cbn0oIHdpbmRvdywgalF1ZXJ5LCB3aW5kb3cud2RzTW9iaWxlTWVudSApICk7XG4iLCIvKipcbiAqIEZpbGUgbW9kYWwuanNcbiAqXG4gKiBEZWFsIHdpdGggbXVsdGlwbGUgbW9kYWxzIGFuZCB0aGVpciBtZWRpYS5cbiAqL1xud2luZG93Lndkc01vZGFsID0ge307XG4oIGZ1bmN0aW9uKCB3aW5kb3csICQsIGFwcCApIHtcblxuXHRsZXQgJG1vZGFsVG9nZ2xlLFxuXHRcdCRmb2N1c2FibGVDaGlsZHJlbixcblx0XHQkcGxheWVyLFxuXHRcdCR0YWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnc2NyaXB0JyApLFxuXHRcdCRmaXJzdFNjcmlwdFRhZyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCAnc2NyaXB0JyApWzBdLFxuXHRcdFlUO1xuXG5cdC8vIENvbnN0cnVjdG9yLlxuXHRhcHAuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC5jYWNoZSgpO1xuXG5cdFx0aWYgKCBhcHAubWVldHNSZXF1aXJlbWVudHMoKSApIHtcblx0XHRcdCRmaXJzdFNjcmlwdFRhZy5wYXJlbnROb2RlLmluc2VydEJlZm9yZSggJHRhZywgJGZpcnN0U2NyaXB0VGFnICk7XG5cdFx0XHRhcHAuYmluZEV2ZW50cygpO1xuXHRcdH1cblx0fTtcblxuXHQvLyBDYWNoZSBhbGwgdGhlIHRoaW5ncy5cblx0YXBwLmNhY2hlID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjID0ge1xuXHRcdFx0J2JvZHknOiAkKCAnYm9keScgKVxuXHRcdH07XG5cdH07XG5cblx0Ly8gRG8gd2UgbWVldCB0aGUgcmVxdWlyZW1lbnRzP1xuXHRhcHAubWVldHNSZXF1aXJlbWVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gJCggJy5tb2RhbC10cmlnZ2VyJyApLmxlbmd0aDtcblx0fTtcblxuXHQvLyBDb21iaW5lIGFsbCBldmVudHMuXG5cdGFwcC5iaW5kRXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cblx0XHQvLyBUcmlnZ2VyIGEgbW9kYWwgdG8gb3Blbi5cblx0XHRhcHAuJGMuYm9keS5vbiggJ2NsaWNrIHRvdWNoc3RhcnQnLCAnLm1vZGFsLXRyaWdnZXInLCBhcHAub3Blbk1vZGFsICk7XG5cblx0XHQvLyBUcmlnZ2VyIHRoZSBjbG9zZSBidXR0b24gdG8gY2xvc2UgdGhlIG1vZGFsLlxuXHRcdGFwcC4kYy5ib2R5Lm9uKCAnY2xpY2sgdG91Y2hzdGFydCcsICcuY2xvc2UnLCBhcHAuY2xvc2VNb2RhbCApO1xuXG5cdFx0Ly8gQWxsb3cgdGhlIHVzZXIgdG8gY2xvc2UgdGhlIG1vZGFsIGJ5IGhpdHRpbmcgdGhlIGVzYyBrZXkuXG5cdFx0YXBwLiRjLmJvZHkub24oICdrZXlkb3duJywgYXBwLmVzY0tleUNsb3NlICk7XG5cblx0XHQvLyBBbGxvdyB0aGUgdXNlciB0byBjbG9zZSB0aGUgbW9kYWwgYnkgY2xpY2tpbmcgb3V0c2lkZSBvZiB0aGUgbW9kYWwuXG5cdFx0YXBwLiRjLmJvZHkub24oICdjbGljayB0b3VjaHN0YXJ0JywgJ2Rpdi5tb2RhbC1vcGVuJywgYXBwLmNsb3NlTW9kYWxCeUNsaWNrICk7XG5cblx0XHQvLyBMaXN0ZW4gdG8gdGFicywgdHJhcCBrZXlib2FyZCBpZiB3ZSBuZWVkIHRvXG5cdFx0YXBwLiRjLmJvZHkub24oICdrZXlkb3duJywgYXBwLnRyYXBLZXlib2FyZE1heWJlICk7XG5cblx0fTtcblxuXHQvLyBPcGVuIHRoZSBtb2RhbC5cblx0YXBwLm9wZW5Nb2RhbCA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0Ly8gU3RvcmUgdGhlIG1vZGFsIHRvZ2dsZSBlbGVtZW50XG5cdFx0JG1vZGFsVG9nZ2xlID0gJCggdGhpcyApO1xuXG5cdFx0Ly8gRmlndXJlIG91dCB3aGljaCBtb2RhbCB3ZSdyZSBvcGVuaW5nIGFuZCBzdG9yZSB0aGUgb2JqZWN0LlxuXHRcdGxldCAkbW9kYWwgPSAkKCAkKCB0aGlzICkuZGF0YSggJ3RhcmdldCcgKSApO1xuXG5cdFx0Ly8gRGlzcGxheSB0aGUgbW9kYWwuXG5cdFx0JG1vZGFsLmFkZENsYXNzKCAnbW9kYWwtb3BlbicgKTtcblxuXHRcdC8vIEFkZCBib2R5IGNsYXNzLlxuXHRcdGFwcC4kYy5ib2R5LmFkZENsYXNzKCAnbW9kYWwtb3BlbicgKTtcblxuXHRcdC8vIEZpbmQgdGhlIGZvY3VzYWJsZSBjaGlsZHJlbiBvZiB0aGUgbW9kYWwuXG5cdFx0Ly8gVGhpcyBsaXN0IG1heSBiZSBpbmNvbXBsZXRlLCByZWFsbHkgd2lzaCBqUXVlcnkgaGFkIHRoZSA6Zm9jdXNhYmxlIHBzZXVkbyBsaWtlIGpRdWVyeSBVSSBkb2VzLlxuXHRcdC8vIEZvciBtb3JlIGFib3V0IDppbnB1dCBzZWU6IGh0dHBzOi8vYXBpLmpxdWVyeS5jb20vaW5wdXQtc2VsZWN0b3IvXG5cdFx0JGZvY3VzYWJsZUNoaWxkcmVuID0gJG1vZGFsLmZpbmQoICdhLCA6aW5wdXQsIFt0YWJpbmRleF0nICk7XG5cblx0XHQvLyBJZGVhbGx5LCB0aGVyZSBpcyBhbHdheXMgb25lICh0aGUgY2xvc2UgYnV0dG9uKSwgYnV0IHlvdSBuZXZlciBrbm93LlxuXHRcdGlmICggMCA8ICRmb2N1c2FibGVDaGlsZHJlbi5sZW5ndGggKSB7XG5cblx0XHRcdC8vIFNoaWZ0IGZvY3VzIHRvIHRoZSBmaXJzdCBmb2N1c2FibGUgZWxlbWVudC5cblx0XHRcdCRmb2N1c2FibGVDaGlsZHJlblswXS5mb2N1cygpO1xuXHRcdH1cblxuXHR9O1xuXG5cdC8vIENsb3NlIHRoZSBtb2RhbC5cblx0YXBwLmNsb3NlTW9kYWwgPSBmdW5jdGlvbigpIHtcblxuXHRcdC8vIEZpZ3VyZSB0aGUgb3BlbmVkIG1vZGFsIHdlJ3JlIGNsb3NpbmcgYW5kIHN0b3JlIHRoZSBvYmplY3QuXG5cdFx0bGV0ICRtb2RhbCA9ICQoICQoICdkaXYubW9kYWwtb3BlbiAuY2xvc2UnICkuZGF0YSggJ3RhcmdldCcgKSApLFxuXG5cdFx0XHQvLyBGaW5kIHRoZSBpZnJhbWUgaW4gdGhlICRtb2RhbCBvYmplY3QuXG5cdFx0XHQkaWZyYW1lID0gJG1vZGFsLmZpbmQoICdpZnJhbWUnICk7XG5cblx0XHQvLyBPbmx5IGRvIHRoaXMgaWYgdGhlcmUgYXJlIGFueSBpZnJhbWVzLlxuXHRcdGlmICggJGlmcmFtZS5sZW5ndGggKSB7XG5cblx0XHRcdC8vIEdldCB0aGUgaWZyYW1lIHNyYyBVUkwuXG5cdFx0XHRsZXQgdXJsID0gJGlmcmFtZS5hdHRyKCAnc3JjJyApO1xuXG5cdFx0XHQvLyBSZW1vdmluZy9SZWFkZGluZyB0aGUgVVJMIHdpbGwgZWZmZWN0aXZlbHkgYnJlYWsgdGhlIFlvdVR1YmUgQVBJLlxuXHRcdFx0Ly8gU28gbGV0J3Mgbm90IGRvIHRoYXQgd2hlbiB0aGUgaWZyYW1lIFVSTCBjb250YWlucyB0aGUgZW5hYmxlanNhcGkgcGFyYW1ldGVyLlxuXHRcdFx0aWYgKCAhIHVybC5pbmNsdWRlcyggJ2VuYWJsZWpzYXBpPTEnICkgKSB7XG5cblx0XHRcdFx0Ly8gUmVtb3ZlIHRoZSBzb3VyY2UgVVJMLCB0aGVuIGFkZCBpdCBiYWNrLCBzbyB0aGUgdmlkZW8gY2FuIGJlIHBsYXllZCBhZ2FpbiBsYXRlci5cblx0XHRcdFx0JGlmcmFtZS5hdHRyKCAnc3JjJywgJycgKS5hdHRyKCAnc3JjJywgdXJsICk7XG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdC8vIFVzZSB0aGUgWW91VHViZSBBUEkgdG8gc3RvcCB0aGUgdmlkZW8uXG5cdFx0XHRcdCRwbGF5ZXIuc3RvcFZpZGVvKCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gRmluYWxseSwgaGlkZSB0aGUgbW9kYWwuXG5cdFx0JG1vZGFsLnJlbW92ZUNsYXNzKCAnbW9kYWwtb3BlbicgKTtcblxuXHRcdC8vIFJlbW92ZSB0aGUgYm9keSBjbGFzcy5cblx0XHRhcHAuJGMuYm9keS5yZW1vdmVDbGFzcyggJ21vZGFsLW9wZW4nICk7XG5cblx0XHQvLyBSZXZlcnQgZm9jdXMgYmFjayB0byB0b2dnbGUgZWxlbWVudFxuXHRcdCRtb2RhbFRvZ2dsZS5mb2N1cygpO1xuXG5cdH07XG5cblx0Ly8gQ2xvc2UgaWYgXCJlc2NcIiBrZXkgaXMgcHJlc3NlZC5cblx0YXBwLmVzY0tleUNsb3NlID0gZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdGlmICggMjcgPT09IGV2ZW50LmtleUNvZGUgKSB7XG5cdFx0XHRhcHAuY2xvc2VNb2RhbCgpO1xuXHRcdH1cblx0fTtcblxuXHQvLyBDbG9zZSBpZiB0aGUgdXNlciBjbGlja3Mgb3V0c2lkZSBvZiB0aGUgbW9kYWxcblx0YXBwLmNsb3NlTW9kYWxCeUNsaWNrID0gZnVuY3Rpb24oIGV2ZW50ICkge1xuXG5cdFx0Ly8gSWYgdGhlIHBhcmVudCBjb250YWluZXIgaXMgTk9UIHRoZSBtb2RhbCBkaWFsb2cgY29udGFpbmVyLCBjbG9zZSB0aGUgbW9kYWxcblx0XHRpZiAoICEgJCggZXZlbnQudGFyZ2V0ICkucGFyZW50cyggJ2RpdicgKS5oYXNDbGFzcyggJ21vZGFsLWRpYWxvZycgKSApIHtcblx0XHRcdGFwcC5jbG9zZU1vZGFsKCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIFRyYXAgdGhlIGtleWJvYXJkIGludG8gYSBtb2RhbCB3aGVuIG9uZSBpcyBhY3RpdmUuXG5cdGFwcC50cmFwS2V5Ym9hcmRNYXliZSA9IGZ1bmN0aW9uKCBldmVudCApIHtcblxuXHRcdC8vIFdlIG9ubHkgbmVlZCB0byBkbyBzdHVmZiB3aGVuIHRoZSBtb2RhbCBpcyBvcGVuIGFuZCB0YWIgaXMgcHJlc3NlZC5cblx0XHRpZiAoIDkgPT09IGV2ZW50LndoaWNoICYmIDAgPCAkKCAnLm1vZGFsLW9wZW4nICkubGVuZ3RoICkge1xuXHRcdFx0bGV0ICRmb2N1c2VkID0gJCggJzpmb2N1cycgKSxcblx0XHRcdFx0Zm9jdXNJbmRleCA9ICRmb2N1c2FibGVDaGlsZHJlbi5pbmRleCggJGZvY3VzZWQgKTtcblxuXHRcdFx0aWYgKCAwID09PSBmb2N1c0luZGV4ICYmIGV2ZW50LnNoaWZ0S2V5ICkge1xuXG5cdFx0XHRcdC8vIElmIHRoaXMgaXMgdGhlIGZpcnN0IGZvY3VzYWJsZSBlbGVtZW50LCBhbmQgc2hpZnQgaXMgaGVsZCB3aGVuIHByZXNzaW5nIHRhYiwgZ28gYmFjayB0byBsYXN0IGZvY3VzYWJsZSBlbGVtZW50LlxuXHRcdFx0XHQkZm9jdXNhYmxlQ2hpbGRyZW5bICRmb2N1c2FibGVDaGlsZHJlbi5sZW5ndGggLSAxIF0uZm9jdXMoKTtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdH0gZWxzZSBpZiAoICEgZXZlbnQuc2hpZnRLZXkgJiYgZm9jdXNJbmRleCA9PT0gJGZvY3VzYWJsZUNoaWxkcmVuLmxlbmd0aCAtIDEgKSB7XG5cblx0XHRcdFx0Ly8gSWYgdGhpcyBpcyB0aGUgbGFzdCBmb2N1c2FibGUgZWxlbWVudCwgYW5kIHNoaWZ0IGlzIG5vdCBoZWxkLCBnbyBiYWNrIHRvIHRoZSBmaXJzdCBmb2N1c2FibGUgZWxlbWVudC5cblx0XHRcdFx0JGZvY3VzYWJsZUNoaWxkcmVuWzBdLmZvY3VzKCk7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdC8vIEhvb2sgaW50byBZb3VUdWJlIDxpZnJhbWU+LlxuXHRhcHAub25Zb3VUdWJlSWZyYW1lQVBJUmVhZHkgPSBmdW5jdGlvbigpIHtcblx0XHRsZXQgJG1vZGFsID0gJCggJ2Rpdi5tb2RhbCcgKSxcblx0XHRcdCRpZnJhbWVpZCA9ICRtb2RhbC5maW5kKCAnaWZyYW1lJyApLmF0dHIoICdpZCcgKTtcblxuXHRcdCRwbGF5ZXIgPSBuZXcgWVQuUGxheWVyKCAkaWZyYW1laWQsIHtcblx0XHRcdGV2ZW50czoge1xuXHRcdFx0XHQnb25SZWFkeSc6IGFwcC5vblBsYXllclJlYWR5LFxuXHRcdFx0XHQnb25TdGF0ZUNoYW5nZSc6IGFwcC5vblBsYXllclN0YXRlQ2hhbmdlXG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9O1xuXG5cdC8vIERvIHNvbWV0aGluZyBvbiBwbGF5ZXIgcmVhZHkuXG5cdGFwcC5vblBsYXllclJlYWR5ID0gZnVuY3Rpb24oKSB7XG5cdH07XG5cblx0Ly8gRG8gc29tZXRoaW5nIG9uIHBsYXllciBzdGF0ZSBjaGFuZ2UuXG5cdGFwcC5vblBsYXllclN0YXRlQ2hhbmdlID0gZnVuY3Rpb24oKSB7XG5cblx0XHQvLyBTZXQgZm9jdXMgdG8gdGhlIGZpcnN0IGZvY3VzYWJsZSBlbGVtZW50IGluc2lkZSBvZiB0aGUgbW9kYWwgdGhlIHBsYXllciBpcyBpbi5cblx0XHQkKCBldmVudC50YXJnZXQuYSApLnBhcmVudHMoICcubW9kYWwnICkuZmluZCggJ2EsIDppbnB1dCwgW3RhYmluZGV4XScgKS5maXJzdCgpLmZvY3VzKCk7XG5cdH07XG5cblxuXHQvLyBFbmdhZ2UhXG5cdCQoIGFwcC5pbml0ICk7XG59KCB3aW5kb3csIGpRdWVyeSwgd2luZG93Lndkc01vZGFsICkgKTtcbiIsIi8qKlxuICogRmlsZTogbmF2aWdhdGlvbi1wcmltYXJ5LmpzXG4gKlxuICogSGVscGVycyBmb3IgdGhlIHByaW1hcnkgbmF2aWdhdGlvbi5cbiAqL1xud2luZG93Lndkc1ByaW1hcnlOYXZpZ2F0aW9uID0ge307XG4oIGZ1bmN0aW9uKCB3aW5kb3csICQsIGFwcCApIHtcblxuXHQvLyBDb25zdHJ1Y3Rvci5cblx0YXBwLmluaXQgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuY2FjaGUoKTtcblxuXHRcdGlmICggYXBwLm1lZXRzUmVxdWlyZW1lbnRzKCkgKSB7XG5cdFx0XHRhcHAuYmluZEV2ZW50cygpO1xuXHRcdH1cblx0fTtcblxuXHQvLyBDYWNoZSBhbGwgdGhlIHRoaW5ncy5cblx0YXBwLmNhY2hlID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjID0ge1xuXHRcdFx0d2luZG93OiAkKCB3aW5kb3cgKSxcblx0XHRcdHN1Yk1lbnVDb250YWluZXI6ICQoICcubWFpbi1uYXZpZ2F0aW9uIC5zdWItbWVudScgKSxcblx0XHRcdHN1Yk1lbnVQYXJlbnRJdGVtOiAkKCAnLm1haW4tbmF2aWdhdGlvbiBsaS5tZW51LWl0ZW0taGFzLWNoaWxkcmVuJyApXG5cdFx0fTtcblx0fTtcblxuXHQvLyBDb21iaW5lIGFsbCBldmVudHMuXG5cdGFwcC5iaW5kRXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjLndpbmRvdy5vbiggJ2xvYWQnLCBhcHAuYWRkRG93bkFycm93ICk7XG5cdFx0YXBwLiRjLnN1Yk1lbnVQYXJlbnRJdGVtLmZpbmQoICdhJyApLm9uKCAnZm9jdXNpbiBmb2N1c291dCcsIGFwcC50b2dnbGVGb2N1cyApO1xuXHR9O1xuXG5cdC8vIERvIHdlIG1lZXQgdGhlIHJlcXVpcmVtZW50cz9cblx0YXBwLm1lZXRzUmVxdWlyZW1lbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGFwcC4kYy5zdWJNZW51Q29udGFpbmVyLmxlbmd0aDtcblx0fTtcblxuXHQvLyBBZGQgdGhlIGRvd24gYXJyb3cgdG8gc3VibWVudSBwYXJlbnRzLlxuXHRhcHAuYWRkRG93bkFycm93ID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjLnN1Yk1lbnVQYXJlbnRJdGVtLmZpbmQoICc+IGEnICkuYXBwZW5kKCAnPHNwYW4gY2xhc3M9XCJjYXJldC1kb3duXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPicgKTtcblx0fTtcblxuXHQvLyBUb2dnbGUgdGhlIGZvY3VzIGNsYXNzIG9uIHRoZSBsaW5rIHBhcmVudC5cblx0YXBwLnRvZ2dsZUZvY3VzID0gZnVuY3Rpb24oKSB7XG5cdFx0JCggdGhpcyApLnBhcmVudHMoICdsaS5tZW51LWl0ZW0taGFzLWNoaWxkcmVuJyApLnRvZ2dsZUNsYXNzKCAnZm9jdXMnICk7XG5cdH07XG5cblx0Ly8gRW5nYWdlIVxuXHQkKCBhcHAuaW5pdCApO1xuXG59KCB3aW5kb3csIGpRdWVyeSwgd2luZG93Lndkc1ByaW1hcnlOYXZpZ2F0aW9uICkgKTtcbiIsIi8qKlxuICogRmlsZTogb2ZmLWNhbnZhcy5qc1xuICpcbiAqIEhlbHAgZGVhbCB3aXRoIHRoZSBvZmYtY2FudmFzIG1vYmlsZSBtZW51LlxuICovXG53aW5kb3cud2Rzb2ZmQ2FudmFzID0ge307XG4oIGZ1bmN0aW9uKCB3aW5kb3csICQsIGFwcCApIHtcblxuXHQvLyBDb25zdHJ1Y3Rvci5cblx0YXBwLmluaXQgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuY2FjaGUoKTtcblxuXHRcdGlmICggYXBwLm1lZXRzUmVxdWlyZW1lbnRzKCkgKSB7XG5cdFx0XHRhcHAuYmluZEV2ZW50cygpO1xuXHRcdH1cblx0fTtcblxuXHQvLyBDYWNoZSBhbGwgdGhlIHRoaW5ncy5cblx0YXBwLmNhY2hlID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjID0ge1xuXHRcdFx0Ym9keTogJCggJ2JvZHknICksXG5cdFx0XHRvZmZDYW52YXNDbG9zZTogJCggJy5vZmYtY2FudmFzLWNsb3NlJyApLFxuXHRcdFx0b2ZmQ2FudmFzQ29udGFpbmVyOiAkKCAnLm9mZi1jYW52YXMtY29udGFpbmVyJyApLFxuXHRcdFx0b2ZmQ2FudmFzT3BlbjogJCggJy5vZmYtY2FudmFzLW9wZW4nICksXG5cdFx0XHRvZmZDYW52YXNTY3JlZW46ICQoICcub2ZmLWNhbnZhcy1zY3JlZW4nIClcblx0XHR9O1xuXHR9O1xuXG5cdC8vIENvbWJpbmUgYWxsIGV2ZW50cy5cblx0YXBwLmJpbmRFdmVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMuYm9keS5vbiggJ2tleWRvd24nLCBhcHAuZXNjS2V5Q2xvc2UgKTtcblx0XHRhcHAuJGMub2ZmQ2FudmFzQ2xvc2Uub24oICdjbGljaycsIGFwcC5jbG9zZW9mZkNhbnZhcyApO1xuXHRcdGFwcC4kYy5vZmZDYW52YXNPcGVuLm9uKCAnY2xpY2snLCBhcHAudG9nZ2xlb2ZmQ2FudmFzICk7XG5cdFx0YXBwLiRjLm9mZkNhbnZhc1NjcmVlbi5vbiggJ2NsaWNrJywgYXBwLmNsb3Nlb2ZmQ2FudmFzICk7XG5cdH07XG5cblx0Ly8gRG8gd2UgbWVldCB0aGUgcmVxdWlyZW1lbnRzP1xuXHRhcHAubWVldHNSZXF1aXJlbWVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gYXBwLiRjLm9mZkNhbnZhc0NvbnRhaW5lci5sZW5ndGg7XG5cdH07XG5cblx0Ly8gVG8gc2hvdyBvciBub3QgdG8gc2hvdz9cblx0YXBwLnRvZ2dsZW9mZkNhbnZhcyA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0aWYgKCAndHJ1ZScgPT09ICQoIHRoaXMgKS5hdHRyKCAnYXJpYS1leHBhbmRlZCcgKSApIHtcblx0XHRcdGFwcC5jbG9zZW9mZkNhbnZhcygpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRhcHAub3Blbm9mZkNhbnZhcygpO1xuXHRcdH1cblxuXHR9O1xuXG5cdC8vIFNob3cgdGhhdCBkcmF3ZXIhXG5cdGFwcC5vcGVub2ZmQ2FudmFzID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjLm9mZkNhbnZhc0NvbnRhaW5lci5hZGRDbGFzcyggJ2lzLXZpc2libGUnICk7XG5cdFx0YXBwLiRjLm9mZkNhbnZhc09wZW4uYWRkQ2xhc3MoICdpcy12aXNpYmxlJyApO1xuXHRcdGFwcC4kYy5vZmZDYW52YXNTY3JlZW4uYWRkQ2xhc3MoICdpcy12aXNpYmxlJyApO1xuXG5cdFx0YXBwLiRjLm9mZkNhbnZhc09wZW4uYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCB0cnVlICk7XG5cdFx0YXBwLiRjLm9mZkNhbnZhc0NvbnRhaW5lci5hdHRyKCAnYXJpYS1oaWRkZW4nLCBmYWxzZSApO1xuXHR9O1xuXG5cdC8vIENsb3NlIHRoYXQgZHJhd2VyIVxuXHRhcHAuY2xvc2VvZmZDYW52YXMgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMub2ZmQ2FudmFzQ29udGFpbmVyLnJlbW92ZUNsYXNzKCAnaXMtdmlzaWJsZScgKTtcblx0XHRhcHAuJGMub2ZmQ2FudmFzT3Blbi5yZW1vdmVDbGFzcyggJ2lzLXZpc2libGUnICk7XG5cdFx0YXBwLiRjLm9mZkNhbnZhc1NjcmVlbi5yZW1vdmVDbGFzcyggJ2lzLXZpc2libGUnICk7XG5cblx0XHRhcHAuJGMub2ZmQ2FudmFzT3Blbi5hdHRyKCAnYXJpYS1leHBhbmRlZCcsIGZhbHNlICk7XG5cdFx0YXBwLiRjLm9mZkNhbnZhc0NvbnRhaW5lci5hdHRyKCAnYXJpYS1oaWRkZW4nLCB0cnVlICk7XG5cblx0XHRhcHAuJGMub2ZmQ2FudmFzT3Blbi5mb2N1cygpO1xuXHR9O1xuXG5cdC8vIENsb3NlIGRyYXdlciBpZiBcImVzY1wiIGtleSBpcyBwcmVzc2VkLlxuXHRhcHAuZXNjS2V5Q2xvc2UgPSBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0aWYgKCAyNyA9PT0gZXZlbnQua2V5Q29kZSApIHtcblx0XHRcdGFwcC5jbG9zZW9mZkNhbnZhcygpO1xuXHRcdH1cblx0fTtcblxuXHQvLyBFbmdhZ2UhXG5cdCQoIGFwcC5pbml0ICk7XG5cbn0oIHdpbmRvdywgalF1ZXJ5LCB3aW5kb3cud2Rzb2ZmQ2FudmFzICkgKTtcbiIsIi8qKlxuICogRmlsZSBza2lwLWxpbmstZm9jdXMtZml4LmpzLlxuICpcbiAqIEhlbHBzIHdpdGggYWNjZXNzaWJpbGl0eSBmb3Iga2V5Ym9hcmQgb25seSB1c2Vycy5cbiAqXG4gKiBMZWFybiBtb3JlOiBodHRwczovL2dpdC5pby92V2RyMlxuICovXG4oIGZ1bmN0aW9uKCkge1xuXHR2YXIgaXNXZWJraXQgPSAtMSA8IG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5pbmRleE9mKCAnd2Via2l0JyApLFxuXHRcdGlzT3BlcmEgPSAtMSA8IG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5pbmRleE9mKCAnb3BlcmEnICksXG5cdFx0aXNJZSA9IC0xIDwgbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoICdtc2llJyApO1xuXG5cdGlmICggKCBpc1dlYmtpdCB8fCBpc09wZXJhIHx8IGlzSWUgKSAmJiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCAmJiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciApIHtcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ2hhc2hjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBpZCA9IGxvY2F0aW9uLmhhc2guc3Vic3RyaW5nKCAxICksXG5cdFx0XHRcdGVsZW1lbnQ7XG5cblx0XHRcdGlmICggISAoIC9eW0EtejAtOV8tXSskLyApLnRlc3QoIGlkICkgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0ZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBpZCApO1xuXG5cdFx0XHRpZiAoIGVsZW1lbnQgKSB7XG5cdFx0XHRcdGlmICggISAoIC9eKD86YXxzZWxlY3R8aW5wdXR8YnV0dG9ufHRleHRhcmVhKSQvaSApLnRlc3QoIGVsZW1lbnQudGFnTmFtZSApICkge1xuXHRcdFx0XHRcdGVsZW1lbnQudGFiSW5kZXggPSAtMTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGVsZW1lbnQuZm9jdXMoKTtcblx0XHRcdH1cblx0XHR9LCBmYWxzZSApO1xuXHR9XG59KCkgKTtcbiIsIi8qKlxuICogTWFrZSB0YWJsZXMgcmVzcG9uc2l2ZSBhZ2Fpbi5cbiAqXG4gKiBAYXV0aG9yIEhhcmlzIFp1bGZpcWFyXG4gKi9cbndpbmRvdy53ZHNUYWJsZXMgPSB7fTtcbiggZnVuY3Rpb24oIHdpbmRvdywgJCwgYXBwICkge1xuXG5cdC8vIENvbnN0cnVjdG9yXG5cdGFwcC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLmNhY2hlKCk7XG5cblx0XHRpZiAoIGFwcC5tZWV0c1JlcXVpcmVtZW50cygpICkge1xuXHRcdFx0YXBwLmJpbmRFdmVudHMoKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gQ2FjaGUgYWxsIHRoZSB0aGluZ3Ncblx0YXBwLmNhY2hlID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjID0ge1xuXHRcdFx0d2luZG93OiAkKCB3aW5kb3cgKSxcblx0XHRcdHRhYmxlOiAkKCAndGFibGUnIClcblx0XHR9O1xuXHR9O1xuXG5cdC8vIENvbWJpbmUgYWxsIGV2ZW50c1xuXHRhcHAuYmluZEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy53aW5kb3cub24oICdsb2FkJywgYXBwLmFkZERhdGFMYWJlbCApO1xuXHR9O1xuXG5cdC8vIERvIHdlIG1lZXQgdGhlIHJlcXVpcmVtZW50cz9cblx0YXBwLm1lZXRzUmVxdWlyZW1lbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGFwcC4kYy50YWJsZS5sZW5ndGg7XG5cdH07XG5cblx0Ly8gQWRkcyBkYXRhLWxhYmVsIHRvIHRkIGJhc2VkIG9uIHRoLlxuXHRhcHAuYWRkRGF0YUxhYmVsID0gZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgdGFibGUgPSBhcHAuJGMudGFibGU7XG5cdFx0Y29uc3QgdGFibGVIZWFkZXJzID0gdGFibGUuZmluZCggJ3RoZWFkIHRoJyApO1xuXHRcdGNvbnN0IHRhYmxlUm93ID0gdGFibGUuZmluZCggJ3Rib2R5IHRyJyApO1xuXG5cdFx0dGFibGVSb3cuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCB0ZCA9ICQoIHRoaXMgKS5maW5kKCAndGQnICk7XG5cblx0XHRcdHRkLmVhY2goIGZ1bmN0aW9uKCBpbmRleCApIHtcblx0XHRcdFx0aWYgKCAkKCB0YWJsZUhlYWRlcnMuZ2V0KCBpbmRleCApICkgKSB7XG5cdFx0XHRcdFx0JCggdGhpcyApLmF0dHIoICdkYXRhLWxhYmVsJywgJCggdGFibGVIZWFkZXJzLmdldCggaW5kZXggKSApLnRleHQoKSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9O1xuXG5cdC8vIEVuZ2FnZVxuXHQkKCBhcHAuaW5pdCApO1xuXG59ICggd2luZG93LCBqUXVlcnksIHdpbmRvdy53ZHNUYWJsZXMgKSApO1xuIiwiLyoqXG4gKiBWaWRlbyBQbGF5YmFjayBTY3JpcHQuXG4gKi9cbndpbmRvdy5XRFNWaWRlb0JhY2tncm91bmRPYmplY3QgPSB7fTtcbiggZnVuY3Rpb24oIHdpbmRvdywgJCwgYXBwICkge1xuXG5cdC8vIENvbnN0cnVjdG9yLlxuXHRhcHAuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC5jYWNoZSgpO1xuXG5cdFx0aWYgKCBhcHAubWVldHNSZXF1aXJlbWVudHMoKSApIHtcblx0XHRcdGFwcC5iaW5kRXZlbnRzKCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIENhY2hlIGFsbCB0aGUgdGhpbmdzLlxuXHRhcHAuY2FjaGUgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMgPSB7XG5cdFx0XHR3aW5kb3c6ICQoIHdpbmRvdyApLFxuXHRcdFx0dmlkZW9CdXR0b246ICQoICcudmlkZW8tdG9nZ2xlJyApXG5cdFx0fTtcblx0fTtcblxuXHQvLyBDb21iaW5lIGFsbCBldmVudHMuXG5cdGFwcC5iaW5kRXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjLnZpZGVvQnV0dG9uLm9uKCAnY2xpY2snLCBhcHAuZG9Ub2dnbGVQbGF5YmFjayApO1xuXHR9O1xuXG5cdC8vIERvIHdlIG1lZXQgdGhlIHJlcXVpcmVtZW50cz9cblx0YXBwLm1lZXRzUmVxdWlyZW1lbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGFwcC4kYy52aWRlb0J1dHRvbi5sZW5ndGg7XG5cdH07XG5cblx0Ly8gVmlkZW8gUGxheWJhY2suXG5cdGFwcC5kb1RvZ2dsZVBsYXliYWNrID0gZnVuY3Rpb24oKSB7XG5cdFx0JCggdGhpcyApLnBhcmVudHMoICcuY29udGVudC1ibG9jaycgKS50b2dnbGVDbGFzcyggJ3ZpZGVvLXRvZ2dsZWQnICk7XG5cblx0XHRpZiAoICQoIHRoaXMgKS5wYXJlbnRzKCAnLmNvbnRlbnQtYmxvY2snICkuaGFzQ2xhc3MoICd2aWRlby10b2dnbGVkJyApICkge1xuXHRcdFx0JCggdGhpcyApLnNpYmxpbmdzKCAnLnZpZGVvLWJhY2tncm91bmQnICkudHJpZ2dlciggJ3BhdXNlJyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkKCB0aGlzICkuc2libGluZ3MoICcudmlkZW8tYmFja2dyb3VuZCcgKS50cmlnZ2VyKCAncGxheScgKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gRW5nYWdlIVxuXHQkKCBhcHAuaW5pdCApO1xuXG59KCB3aW5kb3csIGpRdWVyeSwgd2luZG93LldEU1ZpZGVvQmFja2dyb3VuZE9iamVjdCApICk7XG4iLCIvKipcbiAqIEZpbGUgd2luZG93LXJlYWR5LmpzXG4gKlxuICogQWRkIGEgXCJyZWFkeVwiIGNsYXNzIHRvIDxib2R5PiB3aGVuIHdpbmRvdyBpcyByZWFkeS5cbiAqL1xud2luZG93Lndkc1dpbmRvd1JlYWR5ID0ge307XG4oIGZ1bmN0aW9uKCB3aW5kb3csICQsIGFwcCApIHtcblxuXHQvLyBDb25zdHJ1Y3Rvci5cblx0YXBwLmluaXQgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuY2FjaGUoKTtcblx0XHRhcHAuYmluZEV2ZW50cygpO1xuXHR9O1xuXG5cdC8vIENhY2hlIGRvY3VtZW50IGVsZW1lbnRzLlxuXHRhcHAuY2FjaGUgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMgPSB7XG5cdFx0XHQnd2luZG93JzogJCggd2luZG93ICksXG5cdFx0XHQnYm9keSc6ICQoIGRvY3VtZW50LmJvZHkgKVxuXHRcdH07XG5cdH07XG5cblx0Ly8gQ29tYmluZSBhbGwgZXZlbnRzLlxuXHRhcHAuYmluZEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy53aW5kb3cubG9hZCggYXBwLmFkZEJvZHlDbGFzcyApO1xuXHR9O1xuXG5cdC8vIEFkZCBhIGNsYXNzIHRvIDxib2R5Pi5cblx0YXBwLmFkZEJvZHlDbGFzcyA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy5ib2R5LmFkZENsYXNzKCAncmVhZHknICk7XG5cdH07XG5cblx0Ly8gRW5nYWdlIVxuXHQkKCBhcHAuaW5pdCApO1xufSggd2luZG93LCBqUXVlcnksIHdpbmRvdy53ZHNXaW5kb3dSZWFkeSApICk7XG4iXX0=
