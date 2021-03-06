<?php
/**
 * The template for displaying tag pages.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package _s
 */

get_header(); ?>

	<main id="main" class="site-main">

		<?php if ( have_posts() ) : ?>

			<header class="page-header container">
				
				<?php
					the_archive_title( '<h1 class="page-title">', '</h1>' );
					printf ( __('Works tagged with "%s"', '_s'), get_the_archive_title() );
					the_archive_description( '<div class="archive-description">', '</div>' );
				?>
			</header><!-- .page-header -->

			<div class="grid-layout">
			<?php

			/* Start the Loop */
			while ( have_posts() ) :
				the_post(); ?>

				<?php	get_template_part( 'template-parts/content', 'grid' ); ?>

			<?php endwhile; ?>
			<?php _s_print_dummy_grid_sizer(); ?>
			</div><!-- grid-layout -->
			<?php 

		else :

			get_template_part( 'template-parts/content', 'none' );

		endif;
		?>

	</main><!-- #main -->
<?php get_footer(); ?>
