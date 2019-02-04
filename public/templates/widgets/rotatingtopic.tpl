<div class="slider widget-rotating-topic hide">
    <!-- BEGIN topics -->
    <div>
        <br />
        <h3><a href="<!-- IF topics.slug -->{relative_path}/topic/{topics.slug}<!-- ELSE -->#<!-- ENDIF topics.slug -->">{topics.title}</a></h3>
        <br />
    </div>
    <!-- END topics -->
</div>

<script>
(function() {
    function loadSlider() {
        $('.slider').removeClass('hide').bxSlider({
            minSlides: 1,
            maxSlides: 1,
            pager: true
        });
    }

    if (typeof $ === 'undefined') {
        window.addEventListener('load', loadSlider);
    } else {
        loadSlider();
    }
}());
</script>
