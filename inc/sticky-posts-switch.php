<?php
/**
 * Sticky posts functionality for post type archives
 * 
 * Requires https://wordpress.org/plugins/sticky-custom-post-types/
 *
 * @package _s
 */

function _s_cpt_sticky_at_top($posts)
{

	// apply it on the archives only
	if (is_main_query() && is_post_type_archive()) {
		global $wp_query;

		$sticky_posts = get_option('sticky_posts');

		$num_posts = count($posts);
		$sticky_offset = 0;

		// Find the sticky posts
		for ($i = 0; $i < $num_posts; $i++) {

			// Put sticky posts at the top of the posts array
			if (in_array($posts[$i]->ID, $sticky_posts)) {
				$sticky_post = $posts[$i];

				// Remove sticky from current position
				array_splice($posts, $i, 1);

				// Move to front, after other stickies
				array_splice($posts, $sticky_offset, 0, array($sticky_post));
				$sticky_offset++;

				// Remove post from sticky posts array
				$offset = array_search($sticky_post->ID, $sticky_posts);
				unset($sticky_posts[$offset]);
			}
		}

		// Look for more sticky posts if needed
		if (!empty($sticky_posts)) {

			$stickies = get_posts(array(
				'post__in' => $sticky_posts,
				'post_type' => $wp_query->query_vars['post_type'],
				'post_status' => 'publish',
				'nopaging' => true
			));

			foreach ($stickies as $sticky_post) {
				array_splice($posts, $sticky_offset, 0, array($sticky_post));
				$sticky_offset++;
			}
		}
	}

	return $posts;
}

add_filter('the_posts', '_s_cpt_sticky_at_top');

// Add sticky class in article title to style sticky posts differently
function _s_cpt_sticky_class($classes)
{
	if (is_sticky()) :
		$classes[] = 'sticky';
		return $classes;
	endif;
	return $classes;
}
add_filter('post_class', '_s_cpt_sticky_class');
