<?php
/**
 * Custom queries.
 *
 * This file is used to house "getter" function, that fetch data from the database.
 *
 * @package _s
 */

/**
 * Build the query arguments for recent posts.
 *
 * Depending on the categories and tags a user selects via ACF, build the query args.
 *
 * @param bool|array $categories Categories selected from ACF.
 * @param bool|array $tags Tags selected from ACF.
 * @return array $args The query arguments.
 * @author Eric Fuller, Jeffrey de Wit
 */
function _s_get_recent_posts_query_arguments( $categories, $tags ) {

	$args = array();

	// If no tags and just categories.
	if ( ! $tags && $categories ) {
		$args['category__in'] = $categories;
	}

	// If no categories and just tags.
	if ( ! $categories && $tags ) {
		$args['tag__in'] = $tags;
	}

	// If both categories and tags.
	if ( $categories && $tags ) {
		$args = array_merge(
			$args,
			array(
				'tax_query' => array(
					'relation' => 'OR',
					array(
						'taxonomy' => 'category',
						'terms'    => $categories,
					),
					array(
						'taxonomy' => 'post_tag',
						'terms'    => $tags,
					),
				),
			)
		);
	}

	return $args;
}

/**
 * Get recent posts.
 *
 * If no taxonomies are provided, the most recent posts will be displayed.
 * Otherwise, posts from specified categories and tags will be displayed.
 *
 * @param  array $args   WP_Query arguments.
 * @return object        The related posts object.
 * @author Greg Rickaby, Eric Fuller, Jeffrey de Wit
 */
function _s_get_recent_posts( $args = array() ) {

	// Setup default WP_Query args.
	$defaults = array(
		'ignore_sticky_posts'    => 1,
		'no_found_rows'          => false,
		'orderby'                => 'date',
		'order'                  => 'DESC',
		'paged'                  => 1,
		'posts_per_page'         => 3,
		'post__not_in'           => array( get_the_ID() ),
		'update_post_meta_cache' => false,
		'update_post_term_cache' => false,
	);

	// Parse arguments.
	$args = wp_parse_args( $args, $defaults );

	// Run the query!
	$recent_posts = new WP_Query( $args );

	return $recent_posts;
}


function _s_get_adjacent_post( $where ){
        if (is_single()){
            global $wpdb, $post;
            if ( get_post_status ( ) == 'private' ) {
                $where = str_replace( "AND ( p.post_status = 'publish' OR p.post_status = 'private' )", "AND p.post_status = 'private'", $where );
                return $where;  
            } else {
                $where = str_replace( "AND ( p.post_status = 'publish' OR p.post_status = 'private' )", "AND p.post_status = 'publish'", $where );
                return $where;  
            }
        }
    }

function _s_get_previous_post_id( ) {
    // Get a global post reference since get_adjacent_post() references it
    global $post;

    // Store the existing post object for later so we don't lose it
    $oldGlobal = $post;

    // Get the post object for the specified post and place it in the global variable
    // $post = get_post( $post_id );

    // Get the post object for the previous post
    $previous_post = get_previous_post();

    // Reset our global object
    $post = $oldGlobal;

    if ( '' == $previous_post ) {
        return 0;
    }

    return $previous_post->ID;
}


		
/**
 * Sort works entries by year
 */
function _s_sort_portfolio( $query ) {
    if ( is_post_type_archive( 'works' ) && $query->is_main_query() && ! is_admin() ) {
        $query->set( 'orderby', 'meta_value' );
        $query->set( 'order', 'DESC' );
				$query->set( 'meta_key', '_works_year' );
				$query->set( 'posts_per_page', '-1' );
				$query->set( 'posts_per_page', '100' );
    }
}
add_action( 'pre_get_posts', '_s_sort_portfolio' );


/**
 * Query all the exhibitions and order them by start date
 */
function _s_query_all_works() {
 // Only return IDs
 $args = array(
  'post_type' => 'works',
  'posts_per_page' => -1,
  'orderby' => 'meta_value',
  'meta_key' => '_works_year',
  'order' => 'DESC',
  'fields' => 'ids'
 );
 $all_works = new WP_Query( $args );
 $all_works = $all_works->posts;
 set_transient( 'works_posts', $all_works );
}

function _s_update_portfolio_transient( $post_id, $post, $update ) {
 // Only do this for work post types
 if( 'works' == get_post_type( $post_id ) ) {
  	_s_query_all_works();
 }
 return true;
}
add_action( 'save_post', '_s_update_portfolio_transient', 10, 3 );


/**
 * Return ID for adjacent work within the loop
 * @param $previous Boolean - true if previous, false if next
 */
function _s_get_adjacent_work( $previous = TRUE ) {
 
	$post_id = get_the_ID();
	$works = get_transient( 'works_posts' );
	
 	if( false === $works ) {
		// Set the transient if it's empty
		_s_query_all_works();
		$works = get_transient( 'works_posts' );
	}
	// Get the position of the current work in the ordered array of all works
	$pos = array_search( $post_id, $works );
	if( $previous ) {
		$new_pos = $pos - 1;
	} else {
		$new_pos = $pos + 1;
	}
	if( isset ( $works[$new_pos] ) ) {
		$adjacent_work_id = $works[$new_pos];
		return $adjacent_work_id;
	}
	return false;
}
/**
 * Check if previous/next have the same meta
 * @param $previous Boolean - true if previous, false if next
 * @return BOOL
 */
function _s_has_same_meta( $previous = TRUE, $meta_key = '_works_year' ) {

	$post_id = get_the_ID();
	
	if( $previous ) {
		$compare_post_id = _s_get_adjacent_work( TRUE );
	} else {
		$compare_post_id = _s_get_adjacent_work( FALSE );
	}

	$post_meta =  get_post_meta( $post_id,  $meta_key, true );
	$prev_meta =  get_post_meta( $compare_post_id,  $meta_key, true );

	if ( $post_meta == $prev_meta ) {
		return TRUE; 
	}
	return FALSE;

}

function _s_get_page_style_meta() {

	$prefix = '_page_style_';

	$bg_color 	= get_post_meta( get_the_ID(), $prefix . 'bg_color', TRUE );
	$text_color = get_post_meta( get_the_ID(), $prefix . 'text_color', TRUE );

	$bg_img_url = get_post_meta( get_the_ID(), $prefix . 'bg_img', TRUE );
	$additional_css = get_post_meta( get_the_ID(), $prefix . 'additional_css', TRUE );

	// list of all content elements effected for text
	$text_content_els = array( 
		'h1', 'h2', 'h3', 'h4', 'h5',
		'body', 'input', 'select', 'textarea',
		'p', 'q', 'blockquote', 
		'address', 'fieldset', 'figcaption', 
		'table', 'td', 'tr', 'th',
		'ul', 'ol', 'dd', 'dt', 'pre'
	); 

	// list of all ACTIVE link elements, colorized & underlined
	$text_link_els_active = array( 
		'.site-main a:not(.button)',
		'.site-footer a',
		'.entry-title a',
		'#site-navigation .current_page_item a',
		'#site-navigation .current-menu-item a',
		'#site-navigation .current-cat a',
		'#site-navigation .current-works_category-ancestor a',
		'#site-navigation .current-works-ancestor a'
	); 	
	// list of navigation link elements, colorized but NOT underlined
	$text_link_els_nav = array( 
		'.site-header a',
		'.site-title a'
	); 

	$bg_image_css = ( empty ( $bg_img_url ) ) ? '' : 'url(' .  $bg_img_url . ') ';
	$bg_color_css = ( empty ( $bg_color ) ) ? '' : $bg_color ;

	$background_css_string = sprintf(
		'
		body {
			background: %s %s;
			background-size: cover;
		}',
			$bg_color_css,
			$bg_image_css 
	);

	$text_css_string = sprintf(
		'%s {
			color: %s;
		}	
		',
			implode(',', $text_content_els ),
			$text_color
	);

	$link_css_string = sprintf(
		'%s {
			color: %s;
			background-image: linear-gradient(to right, %s, %s);
		}	
		',
			implode(',', $text_link_els_active ),
			$text_color, $text_color, $text_color
	);	
	
	$link_css_string_nav = sprintf(
		'%s {
			color: %s;
			background-image: none;
		}	
		',
			implode(',', $text_link_els_nav ),
			$text_color
	);

	$buttons_css_string = sprintf(
		'button, .button, .button:visited {
			background-color: %s;
			color: %s;
			border: 1px solid %s
		}			
		button:hover, .button:hover, .button:visited:hover {
			background-color: %s;
			color: %s;
		}	
		', $bg_color, $text_color, $text_color 
		, $text_color, $bg_color
		
	);

	$blockquote_css_string = sprintf(
		'blockquote {
			border-color: %s;
		}	
		',
			$text_color
	);

	return $background_css_string . $text_css_string . $link_css_string . $link_css_string_nav . $buttons_css_string . $blockquote_css_string . $additional_css;
}

function _s_get_additional_custom_css() {
	return  get_post_meta( get_the_ID(),  '_additional_css', true );
}

function _s_get_children_or_sibling_taxonomies() {
 
	$term = get_queried_object();

	$children = get_terms( $term->taxonomy, array(
			'parent'    => $term->term_id,
			'hide_empty' => false
	) );

	if ( $children ) { 
			foreach( $children as $subcat )
			{
					echo '<li><a href="' . esc_url(get_term_link($subcat, $subcat->taxonomy)) . '">' . $subcat->name . '</a></li>';
			}
	}
}

/**
 * Get the top level parent category, even on sub-categories  
 * @return string
 */
function _s_get_parent_cat() {

	$term = get_queried_object();

	$children = get_terms( $term->taxonomy, array(
			'parent'    => $term->term_id,
			'hide_empty' => false
	) );

	$ancestor_ids = get_ancestors( $term->term_id, $term->taxonomy );
	

	if ( $children ) { // cat has children
		return $term->term_id;
	} else { // cat has no children
		$parent_id = $ancestor_ids[0];
		return $parent_id;
	}
}


function _s_get_works_category_name( $category_id ) {
	$term = get_term_by( 'id', $category_id, 'works_category', 'ARRAY_A' );
	return $term['name'];
}

function _s_is_works_child_category( $cat_ID ) {
	$term = get_term( $cat_ID, 'works_category' );
	return $term->parent == 0 ? true : false;
}

function _s_is_works_parent_category( $cat_ID ) {
	$term = get_term( $cat_ID, 'works_category' );
	$children = get_term_children( $term->term_id, 'works_category' );
	return !empty ($children);
}


/**
 * Retrieve the tags for a post, ordered by post count.
 *
 * @param string $before Optional. Before list.
 * @param string $sep    Optional. Separate items using this. 
 * @param string $after  Optional. After list.
 */
function _s_get_the_tags( $before = null, $sep = ', ', $after = '' ) {
	add_filter( 'get_the_terms', $callback = function( $tags ) {
		return wp_list_sort( $tags, 'count', 'desc' );
	}, 999 );
	$post_tags = get_the_tags( $before, $sep, $after );
	remove_filter( 'get_the_terms', $callback, 999 );  
	return $post_tags;
}
