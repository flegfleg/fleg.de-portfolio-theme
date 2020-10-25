(function ($) {
  // init Masonry
  var $grid = $(".grid-layout").masonry({
    // set itemSelector so .grid-sizer is not used in layout
    columnWidth: ".span-1",
    itemSelector: ".grid-item",
    // stamp: '.stamp'
  });
  // layout Masonry after each image loads
  $grid.imagesLoaded().progress(function () {
    $grid.masonry("layout");
    console.log('layouted');
  });
})(jQuery);
