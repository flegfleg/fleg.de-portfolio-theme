<?php
/**
 * Custom Post Types.
 *
 *
 * @package _s
 */

 add_action('init', '_s_cpt_works_init');
/**
 * Register a post type.
 *
 * @link http://codex.wordpress.org/Function_Reference/register_post_type
 */
function _s_cpt_works_init()
{
    $labels = array(
        'name'               => _x('Works', 'post type general name', '_s'),
        'singular_name'      => _x('Work', 'post type singular name', '_s'),
        'menu_name'          => _x('Works', 'admin menu', '_s'),
        'name_admin_bar'     => _x('Work', 'add new on admin bar', '_s'),
    );

    $args = array(
        'labels'             => $labels,
        'description'        => __('Description.', '_s'),
        'public'             => true,
        'publicly_queryable' => true,
        'show_ui'            => true,
        'show_in_menu'       => true,
        'query_var'          => true,
        'rewrite'            => array( 'slug' => 'works' ),
        'capability_type'    => 'post',
        'has_archive'        => true,
        'hierarchical'       => false,
        'menu_position'      => null,
        'supports'           => array( 'title', 'editor', 'thumbnail', 'revisions', 'sticky' ),
        'show_in_rest'       => true, // enable Gutenberg 
        'taxonomies'         => array( 'works_category', 'post_tag' ),
    );

    register_post_type('works', $args);
}


/**
 * Register a 'works_category' taxonomy for post type 'book', with a rewrite to match book CPT slug.
 *
 * @see register_post_type for registering post types.
 */
function _s_cpt_works_taxonomy_init() {
    register_taxonomy( 'works_category', 'works', array(
		'labels' => array(
			'name'          => 'Types',
			'singular_name' => 'Type',
			'search_items'  => 'Search Types',
			'edit_item'     => 'Edit Type',
			'add_new_item'  => 'Add New Type',
		),
		'hierarchical' => true,
		'query_var'    => true,
		'rewrite'      => array('slug' => 'type', 'with_front' => false),
        'show_in_rest' => true, // make the category visible in Gutenberg

    ) );
}
add_action( 'init', '_s_cpt_works_taxonomy_init', 0 );


// add_action('init', '_s_cpt_works_taxonomy_init');

// function _s_cpt_works_taxonomy_init()
// {
//     register_taxonomy(
//         'my-tax',
//         'cpt-works',
//         array(
//             'label' => __('my-tax'),
//             'rewrite' => array( 'slug' => 'my-tax' ),
//             'hierarchical' => true,
//         )
//     );
// }
