<!-- IF count -->
<div class="slider widget-rotating-topic hide">
    <!-- BEGIN topics -->
    <div>
        <br />
        <h3><a href="{relative_path}/topic/{topics.slug}">{topics.title}</a></h3>
        <br />
    </div>
    <!-- END topics -->
</div>
<!-- ELSE -->
<p>No new posts.</p>
<!-- ENDIF count -->
<script>
window.addEventListener('load', function () {
    $('.slider').removeClass('hide').bxSlider({
        minSlides: 1,
        maxSlides: 1,
        pager: true
    });
});
</script>