<?php
/**
 * The template for displaying search results pages.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#search-result
 *
 * @package _s
 */

get_header(); ?>

	<main id="main" class="site-main">

		<?php if ( have_posts() ) : ?>

			<header class="page-header container">
				<h1 class="page-title"><?php /* translators: the term(s) searched */ printf( esc_html__( 'Search Results for: %s', '_s' ), '<span>' . get_search_query() . '</span>' ); ?></h1>
			</header><!-- .page-header -->

			<?php
			/* Start the Loop */
			while ( have_posts() ) :
				the_post();

				/**
					* Run the loop for the search to output the results.
					* If you want to overload this in a child theme then include a file
					* called content-search.php and that will be used instead.
					*/
				get_template_part( 'template-parts/content', 'search' );

			endwhile;

			_s_display_numeric_pagination();

		else :

			get_template_part( 'template-parts/content', 'none' );

		endif;
		?>

	</main><!-- #main -->

<?php get_footer(); ?>
