<?php
/**
 * Template part for displaying content in the grid.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package _s
 */

$cell_width = _s_grid_el_class();

?>

	<article <?php post_class( 'container grid-item ' . $cell_width ); ?>>
		<div class="grid-inner">
			<a href="<?php echo esc_url( get_permalink() ); ?>"><?php the_post_thumbnail( $cell_width ); ?></a>
			<?php
				the_title( '<h2 class="entry-title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h2>' );
			if ( 'post' === get_post_type() ) :
			?>
			<div class="entry-meta">
				<?php _s_posted_on(); ?>
			</div><!-- .entry-meta -->
			<?php elseif ( 'works' === get_post_type() ) : ?>
			<div class="work-meta">
				<?php _s_the_work_meta(); ?>
			</div><!-- .work-meta -->
			<?php endif; ?>
		</div>
	</article><!-- #post-## -->
	<?php // } ?>
