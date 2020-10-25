<?php
/**
 * The template for displaying work taxonomy 
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package _s
 */

global $wp_query;

get_header(); ?>

	<main id="main" class="site-main">

		<?php if ( have_posts() ) : ?>

			<header class="page-header container">
				<?php
					$category_id = _s_get_parent_cat(); 
					printf( '<h1 class="page-title">%s</h1>', 
					_s_get_works_category_name($category_id)
					);
					_s_the_filter_nav();
				?>
			</header><!-- .page-header -->
			
			<div class="grid-layout">
			<?php

			/* Start the Loop */
			while ( have_posts() ) :
				the_post(); ?>

				<?php get_template_part( 'template-parts/content', 'grid' ); ?>


			<?php endwhile; ?>
			<?php _s_print_dummy_grid_sizer(); ?>
			</div><!-- grid-layout -->			
			<?php 
			_s_display_numeric_pagination();

		else :

			get_template_part( 'template-parts/content', 'none' );

		endif;
		?>

	</main><!-- #main -->
<?php get_footer(); ?>
