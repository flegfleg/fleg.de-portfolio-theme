<?php
/**
 * The template for displaying all single posts.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package _s
 */

get_header(); ?>

	<div class="display-flex grid-wrapper">
		<main id="main" class="site-main">

			<?php
			while ( have_posts() ) :
				the_post();

				get_template_part( 'template-parts/content', get_post_format() );

				// If comments are open or we have at least one comment, load up the comment template.
				if ( comments_open() || get_comments_number() ) :
					comments_template();
				endif;

			endwhile; // End of the loop.
			?>

			<h2 class="section-title related"><?php echo __('Other News', '_s'); ?></h2>
			<div class="grid-layout">
				<?php	
				$args = array(
					'ignore_sticky_posts'	=> 1,
					'no_found_rows'		  => false,
					'orderby'				=> 'date',
					'order'				  => 'DESC',
					'posts_per_page'		 => 9,
					'post__not_in'		   => array( get_the_ID() ),
					'update_post_meta_cache' => false,
					'update_post_term_cache' => false,
				);				
				// Custom query.
				$recent_posts = new WP_Query( $args );
				if ( $recent_posts->have_posts() ) {
					while ( $recent_posts->have_posts() ) {
						 $recent_posts->the_post();
						get_template_part( 'template-parts/content', 'grid-posts' );
					}
				}				 
				// Restore original post data.
				wp_reset_postdata();
				?>
			</div><!-- grid-layout -->		
			
			

		</main><!-- #main -->
		<aside>

		</aside>
	</div><!-- .grid-wrapper -->
<?php get_footer(); ?>
