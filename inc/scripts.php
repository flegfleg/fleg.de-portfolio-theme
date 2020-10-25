<?php
/**
 * Custom scripts and styles.
 *
 * @package _s
 */

/**
 * Enqueue scripts and styles.
 *
 * @author WDS
 */
function _s_scripts() {
	/**
	 * If WP is in script debug, or we pass ?script_debug in a URL - set debug to true.
	 */
	$debug = ( defined( 'SCRIPT_DEBUG' ) && true === SCRIPT_DEBUG ) || ( isset( $_GET['script_debug'] ) ) ? true : false; // WPCS: CSRF OK.

	/**
	 * If we are debugging the site, use a unique version every page load so as to ensure no cache issues.
	 */
	$version = '1.0.0';

	/**
	 * Should we load minified files?
	 */
	$suffix = ( true === $debug ) ? '' : '.min';

	/**
	 * Global variable for IE.
	 */
	global $is_IE; // @codingStandardsIgnoreLine

	// Register styles & scripts.
	wp_register_style( 'slick-carousel', get_template_directory_uri() . '/assets/bower_components/slick-carousel/slick/slick.css', null, '1.8.1' );
	wp_register_script( 'slick-carousel', get_template_directory_uri() . '/assets/bower_components/slick-carousel/slick/slick' . $suffix . '.js', array( 'jquery' ), '1.8.1', true );

		// Enqueue the masonry Library script.
	wp_register_script( 'masonry-layout', get_template_directory_uri() . '/assets/bower_components/masonry-layout/dist/masonry.pkgd.min.js', array( 'jquery', 'imagesloaded' ), $version, false );

	// Enqueue the masonry imagesloaded script.
	wp_register_script( 'imagesloaded', get_template_directory_uri() . '/assets/bower_components/imagesloaded/imagesloaded.pkgd.min.js', array( 'jquery' ), $version, false );

	// Enqueue styles.
	wp_enqueue_style( '_s-style', get_stylesheet_directory_uri() . '/style' . $suffix . '.css', array(), $version );

	// Enqueue scripts.
	if ( $is_IE ) {
		wp_enqueue_script( '_s-babel-polyfill', get_template_directory_uri() . '/assets/scripts/babel-polyfill.min.js', array(), $version, true );
	}

	wp_enqueue_script( '_s-scripts', get_template_directory_uri() . '/assets/scripts/project' . $suffix . '.js', array( 'jquery' ), $version, true );

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}

	// Enqueue the scaffolding Library script.
	if ( is_page_template( 'template-scaffolding.php' ) ) {
		wp_enqueue_script( '_s-scaffolding', get_template_directory_uri() . '/assets/scripts/scaffolding' . $suffix . '.js', array( 'jquery' ), $version, true );
	}

}
add_action( 'wp_enqueue_scripts', '_s_scripts' );

/**
 * Enqueue Slick scripts. This is done to avoid enqueueing scripts in the wrong spot by enqueuing them directly.
 *
 * @author Corey Collins
 */
function _s_enqueue_slick_scripts() {
	wp_enqueue_style( 'slick-carousel' );
	wp_enqueue_script( 'slick-carousel' );
}
add_action( 'wp_enqueue_scripts', '_s_enqueue_slick_scripts' );

/**
 * Enqueue Masonry scripts. This is done to avoid enqueueing scripts in the wrong spot by enqueuing them directly.
 *
 * @author Corey Collins
 */
function _s_enqueue_masonry_scripts() {
	wp_enqueue_script( 'masonry-layout' );
	wp_enqueue_script( 'imagesloaded' );
}
add_action( 'wp_enqueue_scripts', '_s_enqueue_masonry_scripts' );

/**
 * Enqueue scripts for the customizer.
 *
 * @author Corey Collins
 */
function _s_customizer_scripts() {

	/**
	 * If WP is in script debug, or we pass ?script_debug in a URL - set debug to true.
	 */
	$debug = ( defined( 'SCRIPT_DEBUG' ) && true === SCRIPT_DEBUG ) || ( isset( $_GET['script_debug'] ) ) ? true : false; // WPCS: CSRF OK.

	/**
	 * If we are debugging the site, use a unique version every page load so as to ensure no cache issues.
	 */
	$version = '1.0.0';

	/**
	 * Should we load minified files?
	 */
	$suffix = ( true === $debug ) ? '' : '.min';

	wp_enqueue_script( '_s_customizer', get_template_directory_uri() . '/assets/scripts/customizer' . $suffix . '.js', array( 'jquery' ), $version, true );
}
add_action( 'customize_controls_enqueue_scripts', '_s_customizer_scripts' );

/**
 * Add SVG definitions to footer.
 *
 * @author WDS
 */
function _s_include_svg_icons() {

	// Define SVG sprite file.
	$svg_icons = get_template_directory() . '/assets/images/svg-icons.svg';

	// If it exists, include it.
	if ( file_exists( $svg_icons ) ) {
		require_once $svg_icons;
	}
}
add_action( 'wp_footer', '_s_include_svg_icons', 9999 );
