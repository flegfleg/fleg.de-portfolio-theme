<?php
/**
* Include and setup custom metaboxes and fields. (make sure you copy this file to outside the CMB2 directory)
*
* @category flegfleg-fleg2015
* @package  Demo_CMB2
* @license  http://www.opensource.org/licenses/gpl-license.php GPL v2.0 (or later)
* @link	 https://github.com/WebDevStudios/CMB2
*/


/**
* Portfolio Metabox
*/
function register_works_metabox() {
	
	// Start with an underscore to hide fields from custom fields list
	$prefix = '_works_';
	
	$cmb_works = new_cmb2_box( array(
		'id'			=> $prefix . 'metabox',
		'title'		 => __( 'Works meta', 'cmb2' ),
		'object_types'  => array( 'works', ), // Post type
		'description' => 'Printed in grid and single view below the title',
	) );

	$cmb_works->add_field( array(
		'name'	   => __( 'Type', 'cmb2' ),
		'id'		 => $prefix . 'type',
		'type'	   => 'text',
		'description' => 'Type of the work. Leave empty to use the works taxonomy'
	) );
			
	$cmb_works->add_field( array(
		'name'	   => __( 'Year', 'cmb2' ),
		'id'		 => $prefix . 'year',
		'type'	   => 'text',
		'description' => 'Used for sorting.',

	) );	
		
	$cmb_works->add_field( array(
		'name'	   => __( 'Time string format', 'cmb2' ),
		'id'		 => $prefix . 'timeformat',
		'type'	   => 'text',
		'default'	   => '%year%',
		'description' => 'Format the year. E.g. <br><code>Since %year%, ongoing project</code>',
	) );	
	
	$cmb_works->add_field( array(
		'name'	   => __( 'Description', 'cmb2' ),
		'id'		 => $prefix . 'description',
		'type'	   => 'text',
	) );	
			
}
add_action( 'cmb2_init', 'register_works_metabox' );

/**
* Portfolio Metabox
*/
function register_masonry_metabox() {
	
	// Start with an underscore to hide fields from custom fields list
	$prefix = '_masonry_';
	
	$cmb_masonry = new_cmb2_box( array(
		'id'			=> $prefix . 'metabox',
		'title'		 => __( 'Grid display settings', 'cmb2' ),
		'object_types'  => array( 'works', 'post' ), // Post type

	) );
	
	$cmb_masonry->add_field( array(
		'name'	   => __( 'Width', 'cmb2' ),
		'id'		 => $prefix . 'width',
		'type'    => 'radio_inline',
		'options' => array(
			'1' => __( '1x', 'cmb2' ),
			'2'   => __( '2x', 'cmb2' ),
			'3'     => __( '3x', 'cmb2' ),
			'4'     => __( '4x', 'cmb2' ),
		),
		'default' => '1',
		'description' => 'How much space this item will occupy in the grid.',

		) );	
		
}
add_action( 'cmb2_init', 'register_masonry_metabox' );

/**
* Page Style Metabox
*/
function register_page_style_metabox() {
	
	// Start with an underscore to hide fields from custom fields list
	$prefix = '_page_style_';
	
	$cmb_page_style = new_cmb2_box( array(
		'id'			=> $prefix . 'metabox',
		'title'		 => __( 'Page Style', 'cmb2' ),
		'object_types'  => array( 'works', 'post', 'page' ), // Post type
		'description' => 'Custom text & background options for this page/post.',
	) );
	
	$cmb_page_style->add_field( array(
		'name'	   => __( 'Text color', 'cmb2' ),
		'id'		 => $prefix . 'text_color',
		'type'    => 'colorpicker',
	) );	

	$cmb_page_style->add_field( array(
		'name'	   => __( 'Background color', 'cmb2' ),
		'id'		 => $prefix . 'bg_color',
		'type'    => 'colorpicker',
	) );		
	$cmb_page_style->add_field( array(
		'name'	   => __( 'Hide featured image', 'cmb2' ),
		'id'		 => $prefix . 'hide_featured_image',
		'type'    => 'checkbox',
		'description' => 'Show the featured image in the grid only, hide on single view.',

	) );	
	$cmb_page_style->add_field( array(
		'name'	   => __( 'Background image', 'cmb2' ),
		'id'		 => $prefix . 'bg_img',
		'type'	=> 'file',
		// Optional:
		'options' => array(
			'url' => false, // Hide the text input for the url
		),
		// query_args are passed to wp.media's library query.
		'query_args' => array(
			// Or only allow gif, jpg, or png images
			'type' => array(
				'image/gif',
				'image/jpeg',
				'image/png',
			),
		),
		'preview_size' => 'small', // Image size to use when previewing in the admin.
		) );	
		$cmb_page_style->add_field( array(
			'name'	   => __( 'Additional CSS', 'cmb2' ),
			'id'		 => $prefix . 'additional_css',
			'type' => 'textarea',
			// 'attributes' => array(
			// 	// 'readonly' => 'readonly',
			// 	'data-codeeditor' => json_encode( array(
			// 		'codemirror' => array(
			// 			'mode' => 'css'
			// 			),
			// 		) ),
			// 	),
		) );	
		
}
add_action( 'cmb2_init', 'register_page_style_metabox' );
