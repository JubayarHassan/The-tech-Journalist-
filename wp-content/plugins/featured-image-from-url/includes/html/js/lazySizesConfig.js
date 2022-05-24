(function () {
    window.lazySizesConfig = window.lazySizesConfig || {};
    window.lazySizesConfig.loadMode = 1;
    window.lazySizesConfig.expand = 1;
    window.lazySizesConfig.expFactor = 0.1;
    window.lazySizesConfig.hFac = 0.1;
    window.lazySizesConfig.throttleDelay = 0;
    window.lazySizesConfig.lazyClass = 'lazyload';
    window.lazySizesConfig.loadingClass = 'lazyloading';
    window.lazySizesConfig.loadedClass = 'lazyloaded';
})();

// 1920x1: https://png-pixel.com/
const FIFU_PLACEHOLDER = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAJxAAAAABCAQAAADS13yAAAAAK0lEQVR42u3BIQEAAAACIP1/2hsGoAEAAAAAAAAAAAAAAAAAAAAAAADgwgCcQgACWbaCCgAAAABJRU5ErkJggg==';

function fifu_lazy(selector = 'img') {

    jQuery(selector).each(function (index) {
        if (jQuery(this).hasClass('lazyload') || jQuery(this).hasClass('lazyloaded') || jQuery(this).hasClass('lazyloading'))
            return;

        // remove wp lazy load
        jQuery(this).removeAttr('loading');

        fifu_add_placeholder(this);

        // dont touch on slider
        if (!jQuery(this).hasClass('fifu'))
            fifu_add_lazyload(this);
    });
    fifu_add_srcset(selector);
}

function fifu_add_lazyload($) {
    jQuery($).addClass('lazyload');
}

function fifu_add_placeholder($) {
    src = jQuery($).attr('src');
    datasrc = jQuery($).attr('data-src');
    if (!src && datasrc) {
        if (fifuLazyVars.fifu_is_product && jQuery($).hasClass('lazyload')) {
            if (jQuery($).parents('.woocommerce-product-gallery__wrapper').length == 0)
                jQuery($).attr('src', FIFU_PLACEHOLDER);
        }
    }
}

function fifu_add_srcset(selector) {
    types = ['src', 'data-src'];
    for (i = 0; i < types.length; i++) {
        // jetpack
        jQuery('img[' + types[i] + '*=".wp.com/"]').each(function (index) {
            if (jQuery(this).attr('srcset') && jQuery(this).attr('data-srcset'))
                return;

            isMain = jQuery(this).parents('.woocommerce-product-gallery__image').length == 1;
            src = jQuery(this).attr(types[i])
            srcset = jQuery(this).attr(types[i] + 'set');

            if (!srcset && !isMain) {
                srcset = '';
                sizes = [75, 100, 150, 240, 320, 500, 640, 800, 1024, 1280, 1600];
                for (j = 0; j < sizes.length; j++) {
                    ssl = src.includes('ssl=1') ? '&ssl=1' : '';
                    srcset += ((j != 0) ? ', ' : '') + src.replace(src.split('?')[1], 'w=' + sizes[j] + '&resize=' + sizes[j] + ssl) + ' ' + sizes[j] + 'w';
                }
                jQuery(this).attr(types[i] + 'set', srcset);
                jQuery(this).attr('data-sizes', 'auto');
            }
        });
    }
}

document.addEventListener('lazybeforeunveil', function (e) {
    // background-image    
    var url = jQuery(e.target).attr('data-bg');
    if (url) {
        delimiter = fifu_get_delimiter(jQuery(e.target), 'data-bg');
        jQuery(e.target).css('background-image', 'url(' + fifu_get_delimited_url(url, delimiter) + ')');
    }

    // width & height
    // jQuery(e.target).attr('fifu-width', e.srcElement.clientWidth);
    // jQuery(e.target).attr('fifu-height', e.srcElement.clientHeight);
});

document.addEventListener('lazyunveilread', function (e) {
});

function fifu_get_delimiter($, attr) {
    return $[0].outerHTML.split(attr + '=')[1][0];
}

function fifu_get_delimited_url(url, delimiter) {
    return delimiter + url + delimiter;
}

function fifu_lazy_ajax(selector = 'img') {
    jQuery(selector).each(function () {
        if (jQuery(this).hasClass('lazyload') || jQuery(this).hasClass('lazyloaded') || jQuery(this).hasClass('lazyloading'))
            return;
        jQuery(this).attr('data-src', jQuery(this).attr('src'));
        jQuery(this).removeAttr('src');
    });
    fifu_lazy(selector);
}
