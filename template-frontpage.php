<?php
/**
 * Template Name: Front page
 *
 * Template Post Type: page
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package _s
 */


get_header(); ?>

	<main id="main" class="site-main ">

		<?php

		if ( have_posts() ) :

				/* Start the Loop */
				while ( have_posts() ) :
					the_post();
	
					/*
						* Include the Post-Format-specific template for the content.
						* If you want to override this in a child theme, then include a file
						* called content-___.php (where ___ is the Post Format name) and that will be used instead.
						*/
					get_template_part( 'template-parts/content', 'page' );
	
				endwhile;

				?>


				<!-- <header>
					<h1 id="glitch" class="page-title" data-text="artist activist astronaut">artist activist astronaut</h1>
				</header> -->


<h2 class="section-title"><?php echo __('The latest'); ?></h2>
			<div class="grid-layout">
				<?php

				global $post;

				$news_query_args = array(
						'post_type'  	  => 'post',
						'posts_per_page' => 10,
						'category'       => 1,
						'paged' => 	$paged
				);

				$news_query = new WP_Query( $news_query_args );
     
				if ( $news_query->have_posts() ) :
						while ( $news_query->have_posts() ) : $news_query->the_post(); 
								get_template_part( 'template-parts/content', 'grid-posts' );
						endwhile;

				endif;

				?>
			</div><!-- grid-layout -->
			<div class="archive-link-container container">
			<?php	$url = add_query_arg( 'skip', 10, get_permalink( get_option( 'page_for_posts' ) ) ); ?>
			<a href="<?php echo $url;?>" class="archive-link button"><?php echo __('More current things', '_s'); ?></a>
			</div>
			<?php 

		else :

			get_template_part( 'template-parts/content', 'none' );

		endif;
		?>

	</main><!-- #main -->

<?php get_footer(); ?>
