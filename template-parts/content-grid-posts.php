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
		<?php if ( has_post_thumbnail() ) { // thumbnail + title ?>
			<a href="<?php echo esc_url( get_permalink() ); ?>" class="thumbnail-link" rel="bookmark">
			<?php the_post_thumbnail( $cell_width ); // @TODO: Image sizes ?>
			</a>
			<?php
			the_title( '<h2 class="small-text"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h2>' );
		} else {
			the_title( '<h2 class="entry-title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h2>' );
			echo '<div class="entry-excerpt">';
			the_excerpt();
			echo '</div>';
		} ?>

	</article><!-- #post-## -->


