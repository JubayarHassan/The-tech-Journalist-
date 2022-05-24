/* global jQuery:{} */

/**
 * tagdiv-theme.js - the main theme js
 */

/**
 * tagdivSearch.js - handles the search events
 */
;var tagdivSearch = {};

( function() {

    'use strict';

    tagdivSearch = {

        _is_search_open: false,
        _$body: undefined,
        _$dropDownSearch: undefined,

        init: function() {

            tagdivSearch._$body = jQuery('body');
            tagdivSearch._$dropDownSearch = jQuery('.td-drop-down-search');

            // hide the drop down if we click outside of it
            jQuery(document).on('click', function(event) {
                if (
                    tagdivSearch._is_search_open &&
                    'td-icon-search' !== event.target.className &&
                    'td-header-search' !== event.target.id &&
                    'td-header-search-top' !== event.target.id
                ) {
                    tagdivSearch._$dropDownSearch.removeClass( 'td-drop-down-search-open' );
                    tagdivSearch._$body.removeClass( 'td-search-opened' );
                    tagdivSearch._is_search_open = false;
                }
            } );

            // show and hide the drop down on the search icon
            jQuery('#td-header-search-button').on('click', function(event) {
                event.preventDefault();

                if ( tagdivSearch._is_search_open ) {
                    tagdivSearch._$dropDownSearch.removeClass( 'td-drop-down-search-open' );
                } else {
                    tagdivSearch._$dropDownSearch.addClass( 'td-drop-down-search-open' );
                }
                tagdivSearch._is_search_open = !tagdivSearch._is_search_open;
            });

            // show and hide the drop down on the search icon for mobile
            jQuery('#td-header-search-button-mob, #tdb-header-search-button-mob').on('click', function(){
                tagdivSearch._$body.addClass('td-search-opened');

                var search_input = jQuery('#td-header-search-mob');

                /**
                 * search input autofocus
                 * @note: the autofocus does not work for iOS and windows phone devices ..as it's considered bad user experience
                 */
                setTimeout( function(){
                    search_input.focus();
                }, 1300);
            });

            //close the search
            jQuery( '.td-search-close a' ).on( 'click', function(){
                tagdivSearch._$body.removeClass( 'td-search-opened' );
            });
        }
    };
} )();


jQuery(document).ready(function () {
    'use strict';

    var $body = jQuery('body');

    // handle open/close mobile menu
    jQuery('#td-top-mobile-toggle a, .td-mobile-close a').on('click', function(){
        $body.toggleClass('td-menu-mob-open-menu');
    });

    // move trough all the menu and find the item with sub-menues to atach a custom class to them
    jQuery(document).find('#td-mobile-nav .menu-item-has-children').each( function(i) {

        var $this = jQuery(this);

        $this.addClass('td_mobile_submenu td_mobile_elem_with_submenu_' + i);

        // click on link elements with #
        $this.children('a').addClass('td-link-element-after');
        $this.on('click',function(event) {

            /**
             * currentTarget - the li element
             * target - the element clicked inside of the currentTarget
             */
            var $eventTarget = jQuery( event.target );

            // html i element
            if ( $eventTarget.length &&
                ( ( $eventTarget.hasClass('td-element-after') || $eventTarget.hasClass('td-link-element-after') ) &&
                    ( '#' === $eventTarget.attr('href') || undefined === $eventTarget.attr('href') ) ) ) {

                event.preventDefault();
                event.stopPropagation();

                jQuery(this).toggleClass('td-sub-menu-open');
            }
        });
    });

    tagdivSearch.init();
});





