/* global jQuery:{} */
/* global theme_plugins_setup_params:{} */
var ThemePluginsSetup = (function($){

    var t;

    function PluginManager(){

        var complete;
        var items_completed = 0;
        var current_item = '';
        var $current_node;
        var current_item_hash = '';

        function ajax_callback(response){

            if( typeof response === 'object' && typeof response.message !== 'undefined' ) {

                $current_node.find('.themes-plugin-status-txt').text( response.message );

                if( typeof response.url !== 'undefined' ) {

                    // we have an ajax url action to perform.
                    if( response.hash === current_item_hash ) {

                        $current_node.find('.themes-plugin-status-txt').text("Failed");
                        $current_node.data('status','failed');
                        find_next();

                    } else {

                        current_item_hash = response.hash;

                        jQuery.post( response.url, response, function(response2) {
                            process_current();
                            $current_node.find('.themes-plugin-status-txt').text( theme_plugins_setup_params.verify_text );
                        }).fail(ajax_callback);

                    }

                } else if( typeof response.done !== 'undefined' ) {

                    // finished processing this plugin, move onto next
                    find_next();

                } else {

                    // error processing this plugin
                    find_next();

                }
            } else {
                // error - try again with next plugin
                $current_node.find('.themes-plugin-status-txt').text("Ajax error");
                $current_node.data('status','failed');
                find_next();
            }

        }

        function process_current(){

            if( current_item ){

                // query our ajax handler to get the ajax to send to TGM
                // if we don't get a reply we can assume everything worked and continue onto the next one.
                jQuery.post(
                    theme_plugins_setup_params.ajaxurl,
                    {
                        action: 'theme_plugins_setup',
                        wpnonce: theme_plugins_setup_params.wpnonce,
                        slug: current_item
                    },
                    ajax_callback
                ).fail(ajax_callback);

            }

        }

        function find_next(){

            var do_next = false;
            if( $current_node ){

                if( ! $current_node.data( 'done_item' ) ){
                    items_completed++;
                    $current_node.data( 'done_item', 1 );
                }

                $current_node.find( '.spinner' ).css( 'visibility','hidden' );
            }

            var $li = $('.theme-plugins-setup li');
            $li.each( function(){
                if( current_item === '' || do_next ){
                    current_item = $(this).data('slug');
                    $current_node = $(this);
                    $current_node.find( '.spinner' ).css( 'visibility','visible' );

                    process_current();
                    do_next = false;
                } else if ( $(this).data('slug') === current_item ){
                    do_next = true;
                }
            });

            if( items_completed >= $li.length ){
                // finished all plugins!
                complete();
            }
        }

        return {
            init: function(btn){
                var pluginsWrap = $('.td-admin-plugins'),
                    pluginsInstalledImg = pluginsWrap.find('.theme-plugins-installed img');

                pluginsWrap.addClass('td-installing-plugins');
                jQuery(btn).attr( 'disabled', true );

                complete = function() {
                    setTimeout( function () {
                        var failedPlugins = [];

                        $('.theme-plugins-setup li').each( function () {
                            var $this = $(this);
                            if ( $this.data('status') === 'failed' ) {
                                failedPlugins.push( $this.data('slug') );
                            }
                        });

                        if ( ! failedPlugins.includes( 'td-composer' ) ) {
                            $('.nav-tab-wrapper a').each( function() {
                                var $this = $(this),
                                    hrefAttr = $this.attr('href');

                                if ( hrefAttr.indexOf( 'td_cake_panel' ) > 0 || hrefAttr.indexOf( 'td_theme_demos' ) > 0 || hrefAttr.indexOf( 'td_theme_panel' ) > 0 || hrefAttr.indexOf( 'td_theme_updates' ) > 0 ) {
                                    $this.show();
                                }
                            });

                            $('#adminmenu a').each( function() {
                                var $this = $(this),
                                    hrefAttr = $this.attr('href');

                                if ( hrefAttr.indexOf( 'td_cake_panel' ) > 0 || hrefAttr.indexOf( 'td_theme_demos' ) > 0 || hrefAttr.indexOf( 'td_theme_panel' ) > 0 || hrefAttr.indexOf( 'td_theme_updates' ) > 0 ) {
                                    $this.css( 'display', 'block');
                                }
                            });
                        }

                        if ( failedPlugins.length === 0 ) {
                            pluginsInstalledImg.attr( 'src', pluginsInstalledImg.data('src') );
                        } else {
                            $('.theme-plugins-setup').after(
                                '<p class="theme-plugins-error-msg">' +
                                    'An error occurred and we could not finish the process. <br>Please <a href="https://forum.tagdiv.com/newspaper-how-to-update-a-plugin/" target="_blank">manually update the plugins.</a>' +
                                '</p>' );

                            pluginsWrap.removeClass('td-installing-plugins');
                        }

                    }, 700);
                };

                pluginsInstalledImg.on( 'load', function () {
                    pluginsWrap.removeClass('td-installing-plugins');
                    pluginsWrap.addClass('td-installed-plugins');
                });

                find_next();
            }
        };

    }

    // callbacks from form button clicks.
    var callbacks = {
        install_plugins: function(btn){
            var plugins = new PluginManager();
            plugins.init(btn);
        }
    };

    function window_loaded(){
        // init button clicks:
        $('.td-button-install-plugins').on( 'click', function(e) {

            if( $(this).data('callback') && typeof callbacks[$(this).data('callback')] !== 'undefined' ){
                // we have to process a callback before continue with form submission
                callbacks[$(this).data('callback')](this);
                return false;
            } else {
                return true;
            }

        });
    }

    return {
        init: function(){
            t = this;
            $(window_loaded);
        }
    };

})(jQuery);

ThemePluginsSetup.init();
