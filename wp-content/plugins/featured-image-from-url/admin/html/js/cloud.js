// don't lose your images again
// don't torture your website anymore
// don't make your visitors wait

// lighthouse (perfect score)
// 1. lazy load enabled
// 2. new incognito tab
// 3. DevTools > Undock into a separate window
// 4. deactivate plugins
// 5. activate Astra

jQuery(document).ready(function () {
    jQuery('link[href*="jquery-ui.css"]').attr("disabled", "true");
    jQuery('div.wrap div.header-box div.notice').hide();
    jQuery('div.wrap div.header-box div#message').hide();
    jQuery('div.wrap div.header-box div.updated').remove();

    jQuery("#availableImages").append(fifuScriptCloudVars.availableImages);
});

jQuery(function () {
    jQuery("#tabs-top").tabs();

    window.scrollTo(0, 0);
    jQuery('.wrap').css('opacity', 1);
});