<?php
/**
 * Action hooks and filters.
 *
 * A place to put hooks and filters that aren't necessarily template tags.
 *
 * @package _s
 */

/**
 * Adds custom classes to the array of body classes.
 *
 * @param array $classes Classes for the body element.
 * @author WDS
 * @return array
 */
function _s_body_classes( $classes ) {

	// @codingStandardsIgnoreStart
	// Allows for incorrect snake case like is_IE to be used without throwing errors.
	global $is_IE, $is_edge, $is_safari;

	// If it's IE, add a class.
	if ( $is_IE ) {
		$classes[] = 'ie';
	}

	// If it's Edge, add a class.
	if ( $is_edge ) {
		$classes[] = 'edge';
	}

	// If it's Safari, add a class.
	if ( $is_safari ) {
		$classes[] = 'safari';
	}

	// Are we on mobile?
	if ( wp_is_mobile() ) {
		$classes[] = 'mobile';
	}
	// @codingStandardsIgnoreEnd

	// Give all pages a unique class.
	if ( is_page() ) {
		$classes[] = 'page-' . basename( get_permalink() );
	}

	// Adds a class of hfeed to non-singular pages.
	if ( ! is_singular() ) {
		$classes[] = 'hfeed';
	}

	// Adds a class of group-blog to blogs with more than 1 published author.
	if ( is_multi_author() ) {
		$classes[] = 'group-blog';
	}

	// Adds "no-js" class. If JS is enabled, this will be replaced (by javascript) to "js".
	$classes[] = 'no-js';

	// Add a cleaner class for the scaffolding page template.
	if ( is_page_template( 'template-scaffolding.php' ) ) {
		$classes[] = 'template-scaffolding';
	}

	// Add a `has-sidebar` class if we're using the sidebar template.
	if ( is_page_template( 'template-sidebar-right.php' ) || is_page_template( 'template-sidebar-left.php' ) || is_singular( 'post' ) ) {
		$classes[] = 'has-sidebar';
	}

	return $classes;
}
add_filter( 'body_class', '_s_body_classes' );

/**
 * Flush out the transients used in _s_categorized_blog.
 *
 * @author WDS
 * @return string
 */
function _s_category_transient_flusher() {
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return false;
	}
	// Like, beat it. Dig?
	delete_transient( '_s_categories' );
}
add_action( 'delete_category', '_s_category_transient_flusher' );
add_action( 'save_post', '_s_category_transient_flusher' );

/**
 * Customize "Read More" string on <!-- more --> with the_content();
 *
 * @author WDS
 * @return string
 */
function _s_content_more_link() {
	return ' <a class="more-link" href="' . get_permalink() . '">' . esc_html__( 'Read More', '_s' ) . '...</a>';
}
add_filter( 'the_content_more_link', '_s_content_more_link' );

/**
 * Customize the [...] on the_excerpt();
 *
 * @author WDS
 * @param string $more The current $more string.
 * @return string
 */
function _s_excerpt_more( $more ) {
	return sprintf( ' <a class="more-link" href="%1$s">%2$s</a>', get_permalink( get_the_ID() ), esc_html__( 'Read more...', '_s' ) );
}
add_filter( 'excerpt_more', '_s_excerpt_more' );

/**
 * Enable custom mime types.
 *
 * @author WDS
 * @param array $mimes Current allowed mime types.
 * @return array
 */
function _s_custom_mime_types( $mimes ) {
	$mimes['svg']  = 'image/svg+xml';
	$mimes['svgz'] = 'image/svg+xml';
	return $mimes;
}
add_filter( 'upload_mimes', '_s_custom_mime_types' );

/**
 * Disable the "Cancel reply" link. It doesn't seem to work anyway, and it only makes the "Leave Reply" heading confusing.
 */
add_filter( 'cancel_comment_reply_link', '__return_false' );

// Create shortcode for SVG.
// Usage [svg icon="facebook-square" title="facebook" desc="like us on facebook" fill="#000000" height="20px" width="20px"].
add_shortcode( 'svg', '_s_display_svg' );

/**
 * Display the customizer header scripts.
 *
 * @author Greg Rickaby
 * @return string
 */
function _s_display_customizer_header_scripts() {

	// Check for header scripts.
	$scripts = get_theme_mod( '_s_header_scripts' );

	// None? Bail...
	if ( ! $scripts ) {
		return false;
	}

	// Otherwise, echo the scripts!
	echo _s_get_the_content( $scripts ); // WPCS XSS OK.
}
add_action( 'wp_head', '_s_display_customizer_header_scripts', 999 );

/**
 * Display the customizer footer scripts.
 *
 * @author Greg Rickaby
 * @return string
 */
function _s_display_customizer_footer_scripts() {

	// Check for footer scripts.
	$scripts = get_theme_mod( '_s_footer_scripts' );

	// None? Bail...
	if ( ! $scripts ) {
		return false;
	}

	// Otherwise, echo the scripts!
	echo _s_get_the_content( $scripts ); // WPCS XSS OK.
}
add_action( 'wp_footer', '_s_display_customizer_footer_scripts', 999 );

/**
 * Adds OG tags to the head for better social sharing.
 *
 * @return string Just an empty string if Yoast is found.
 * @author Corey Collins
 */
function _s_add_og_tags() {

	// Bail if Yoast is installed, since it will handle things.
	if ( class_exists( 'WPSEO_Options' ) ) {
		return '';
	}

	// Set a post global on single posts. This avoids grabbing content from the first post on an archive page.
	if ( is_singular() ) {
		global $post;
	}

	// Get the post content.
	$post_content = ! empty( $post ) ? $post->post_content : '';

	// Strip all tags from the post content we just grabbed.
	$default_content = ( $post_content ) ? wp_strip_all_tags( strip_shortcodes( $post_content ) ) : $post_content;

	// Set our default title.
	$default_title = get_bloginfo( 'name' );

	// Set our default URL.
	$default_url = get_permalink();

	// Set our base description.
	$default_base_description = ( get_bloginfo( 'description' ) ) ? get_bloginfo( 'description' ) : esc_html__( 'Visit our website to learn more.', '_s' );

	// Set the card type.
	$default_type = 'article';

	// Get our custom logo URL. We'll use this on archives and when no featured image is found.
	$logo_id    = get_theme_mod( 'custom_logo' );
	$logo_image = ( $logo_id ) ? wp_get_attachment_image_src( $logo_id, 'full' ) : '';
	$logo_url   = ( $logo_id ) ? $logo_image[0] : '';

	// Set our final defaults.
	$card_title            = $default_title;
	$card_description      = $default_base_description;
	$card_long_description = $default_base_description;
	$card_url              = $default_url;
	$card_image            = $logo_url;
	$card_type             = $default_type;

	// Let's start overriding!
	// All singles.
	if ( is_singular() ) {

		if ( has_post_thumbnail() ) {
			$card_image = get_the_post_thumbnail_url();
		}
	}

	// Single posts/pages that aren't the front page.
	if ( is_singular() && ! is_front_page() ) {

		$card_title            = get_the_title() . ' - ' . $default_title;
		$card_description      = ( $default_content ) ? wp_trim_words( $default_content, 53, '...' ) : $default_base_description;
		$card_long_description = ( $default_content ) ? wp_trim_words( $default_content, 140, '...' ) : $default_base_description;
	}

	// Categories, Tags, and Custom Taxonomies.
	if ( is_category() || is_tag() || is_tax() ) {

		$term_name      = single_term_title( '', false );
		$card_title     = $term_name . ' - ' . $default_title;
		$specify        = ( is_category() ) ? esc_html__( 'categorized in', '_s' ) : esc_html__( 'tagged with', '_s' );
		$queried_object = get_queried_object();
		$card_url       = get_term_link( $queried_object );
		$card_type      = 'website';

		// Translators: get the term name.
		$card_long_description = $card_description = sprintf( esc_html__( 'Posts %1$s %2$s.', '_s' ), $specify, $term_name );
	}

	// Search results.
	if ( is_search() ) {

		$search_term = get_search_query();
		$card_title  = $search_term . ' - ' . $default_title;
		$card_url    = get_search_link( $search_term );
		$card_type   = 'website';

		// Translators: get the search term.
		$card_long_description = $card_description = sprintf( esc_html__( 'Search results for %s.', '_s' ), $search_term );
	}

	if ( is_home() ) {

		$posts_page = get_option( 'page_for_posts' );
		$card_title = get_the_title( $posts_page ) . ' - ' . $default_title;
		$card_url   = get_permalink( $posts_page );
		$card_type  = 'website';
	}

	// Front page.
	if ( is_front_page() ) {

		$front_page = get_option( 'page_on_front' );
		$card_title = ( $front_page ) ? get_the_title( $front_page ) . ' - ' . $default_title : $default_title;
		$card_url   = get_home_url();
		$card_type  = 'website';
	}

	// Post type archives.
	if ( is_post_type_archive() ) {

		$post_type_name = get_post_type();
		$card_title     = $post_type_name . ' - ' . $default_title;
		$card_url       = get_post_type_archive_link( $post_type_name );
		$card_type      = 'website';
	}

	// Media page.
	if ( is_attachment() ) {
		$attachment_id = get_the_ID();
		$card_image    = ( wp_attachment_is_image( $attachment_id ) ) ? wp_get_attachment_image_url( $attachment_id, 'full' ) : $card_image;
	}

	?>
	<meta property="og:title" content="<?php echo esc_attr( $card_title ); ?>" />
	<meta property="og:description" content="<?php echo esc_attr( $card_description ); ?>" />
	<meta property="og:url" content="<?php echo esc_url( $card_url ); ?>" />
	<?php if ( $card_image ) : ?>
		<meta property="og:image" content="<?php echo esc_url( $card_image ); ?>" />
	<?php endif; ?>
	<meta property="og:site_name" content="<?php echo esc_attr( $default_title ); ?>" />
	<meta property="og:type" content="<?php echo esc_attr( $card_type ); ?>" />
	<meta name="description" content="<?php echo esc_attr( $card_long_description ); ?>" />
	<?php
}
add_action( 'wp_head', '_s_add_og_tags' );

/**
 * Removes or Adjusts the prefix on category archive page titles.
 *
 * @param string $block_title The default $block_title of the page.
 * @return string The updated $block_title.
 * @author Corey Collins
 */
function _s_adjust_archive_title_prefix( $block_title ) {

	// Get the single category title with no prefix.
	$single_cat_title = single_term_title( '', false );

	if ( is_tax( 'works_category' ) ) {
		return esc_html( $single_cat_title );
	} elseif ( is_category() || is_tax() ) {
		return esc_html( $single_cat_title );	
	} elseif ( is_tag() ) {
		return  esc_html( $single_cat_title );
	} elseif ( is_post_type_archive() ) {
		return  post_type_archive_title( '', false );
	} else {
		return __( 'News Archive', '_s' );
	}
	return $block_title;
}
add_filter( 'get_the_archive_title', '_s_adjust_archive_title_prefix' );

/**
 * Disables wpautop to remove empty p tags in rendered Gutenberg blocks.
 *
 * @param string $content The starting post content.
 * @return string The updated post content.
 * @author Corey Collins
 */
function _s_remove_empty_p_tags_from_content( $content ) {

	// If we have blocks in place, don't add wpautop.
	if ( has_blocks() ) {
		return $content;
	}

	return wpautop( $content );
}
remove_filter( 'the_content', 'wpautop' );
add_filter( 'the_content', '_s_remove_empty_p_tags_from_content' );


function _s_include_custom_css() {
	if (is_singular()) {
	?>
		<!-- injected css -->
	<style type="text/css">
		<?php echo _s_get_page_style_meta(); ?>
		<?php echo _s_get_additional_custom_css(); ?>
	</style>
	<?php
	}
}
add_action( 'wp_head', '_s_include_custom_css' );


function _s_add_class_to_all_menu_anchors( $atts ) {
    $atts['data-text'] = 'menu-item-anchor';
 
    return $atts;
}
add_filter( 'nav_menu_link_attributes', '_s_add_class_to_all_menu_anchors', 10 );
	

function _s_query_offset(&$query) {

	$offset = get_query_var( 'skip', 0 );

	if  (! is_admin() && $query->is_main_query() ) {
    
    //Next, determine how many posts per page you want (we'll use WordPress's settings)
    $ppp = get_option('posts_per_page');

    //Next, detect and handle pagination...
    if ( $query->is_paged ) {

        //Manually determine page query offset (offset + current page (minus one) x posts per page)
        $page_offset = $offset + ( ($query->query_vars['paged']-1) * $ppp );

        //Apply adjust page offset
        $query->set('offset', $page_offset );

    }
    else {

        //This is the first page. Just use the offset...
        $query->set('offset',$offset);
			}
		}
		
}
add_action('pre_get_posts', '_s_query_offset', 1 );


function _s_set_custom_query_vars( $vars ){
  $vars[] = "skip";
 return $vars;
}

//Add custom query vars
add_filter( 'query_vars', '_s_set_custom_query_vars' );

function _s_title_glitch( $vars ){
  $vars[] = "skip";
 return $vars;
}

add_filter( 'wp_title', '_s_title_glitch', 10, 2 );


/**
* Enable post tag archives to show not only posts, but also works
*/
function _s_tag_set_post_types( $query ){
	if( $query->is_tag() && $query->is_main_query() ){
		$query->set( 'post_type', array( 'post', 'works' ) );
	}
}
add_action( 'pre_get_posts', '_s_tag_set_post_types' );


/**
* Sort works archives by year meta value
*/
function _s_archive_order( $query ) {

	if ( $query->is_main_query() && is_tax('works_category') || $query->is_main_query() && is_tag() || is_post_type_archive( 'works' ) ) {
		$query->set( 'meta_key', '_works_year' );
		$query->set( 'orderby', 'meta_value_num' );
		$query->set( 'order', 'DESC' );

	}

}
add_action( 'pre_get_posts', '_s_archive_order' );
