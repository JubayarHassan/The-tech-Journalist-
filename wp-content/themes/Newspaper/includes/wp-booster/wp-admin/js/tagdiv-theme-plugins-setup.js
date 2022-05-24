
var ThemePluginsSetup = (function($){

    'use strict';

    var t;

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
                var pluginsWrap = $('.td-admin-setup-plugins'),
                    pluginsInstalled = $('.theme-plugins-installed'),
                    $widgetCloudLibrary = $('.td-cloud-library-widget');

                pluginsWrap.addClass('td-installing-plugins');
                jQuery(btn).attr( 'disabled', true );

                complete = function() {

                    setTimeout( function () {
                        var failedPlugins = [];
                        var instaledPlugins = [];

                        $('.theme-plugins-setup li').each( function () {
                            var $this = $(this);
                            if ( $this.data('status') === 'failed' ) {
                                failedPlugins.push( $this.data('slug') );
                            } else {
                                instaledPlugins.push( $this.data('slug') );
                            }
                        });

                        if ( ! failedPlugins.includes( 'td-composer' ) && instaledPlugins.includes( 'td-composer' ) ) {

                            // this checks the theme activation status via ajax and adds the activation tab accordingly
                            jQuery.get(
                                theme_plugins_setup_params.ajaxurl,
                                {
                                    action: 'td_ajax_theme_status_check',
                                    wpnonce: theme_plugins_setup_params.wpnonce
                                },
                                function (response) {
                                    if( response.status === false ) {
                                        $('.nav-tab-wrapper').append(
                                            '<a href="admin.php?page=td_cake_panel" class="nav-tab  " style="display: inline;">Activate theme</a>'
                                        );

                                        $('#toplevel_page_td_theme_welcome').find('.wp-submenu').append(
                                            '<li><a href="admin.php?page=td_cake_panel" style="display: block;">Activate theme</a></li>'
                                        );
                                    }
                                },
                                'json'
                            ).fail(function(MLHttpRequest, textStatus, errorThrown){
                                console.log(errorThrown);
                            });

                            $('.nav-tab-wrapper').find('a[href$="td_theme_plugins"]').after(
                                '<a href="admin.php?page=td_theme_demos" class="nav-tab">Prebuilt Websites</a>\n' +
                                '<a href="admin.php?page=td_system_status" class="nav-tab  ">System status</a>\n' +
                                '<a href="admin.php?page=td_theme_updates" class="nav-tab">Updates</a>' +
                                '<a href="admin.php?page=td_theme_panel" class="nav-tab"">Theme panel</a>'
                            );

                            $('#toplevel_page_td_theme_welcome').find('.wp-submenu').find('li:nth-child(3)').after(
                                '<li><a href="admin.php?page=td_theme_demos">Prebuilt Websites</a></li>' +
                                '<li><a href="admin.php?page=td_system_status">System status</a>' +
                                '<li><a href="admin.php?page=td_system_updates">Updates</a>' +
                                '<li><a href="admin.php?page=td_theme_panel">Theme panel</a></li>'
                            );
                        }

                        if ( failedPlugins.length === 0 ) {
                            pluginsInstalled.show();
                            pluginsWrap.hide();
                            $widgetCloudLibrary.show();

                            // we need refresh to load js from plugins
                            if ( window.self === window.top ){
                                window.location.href = pluginsWrap.find('#td_theme_welcome_link').val();
                            } else {
                                window.top.location.href = pluginsWrap.find('#td_theme_welcome_link').val();
                            }


                        } else {
                            $('.theme-plugins-setup').after(
                                '<p class="theme-plugins-error-msg">' +
                                    'An error occurred and we could not finish the process. <br>Please <a href="https://forum.tagdiv.com/newspaper-how-to-update-a-plugin/" target="_blank">manually update the plugins.</a>' +
                                '</p>' );
                        }

                        pluginsWrap.removeClass('td-installing-plugins');

                    }, 700);
                };

                // pluginsInstalledImg.on('load', function () {
                //     pluginsWrap.removeClass('td-installing-plugins');
                //     pluginsWrap.addClass('td-installed-plugins');
                // });

                find_next();
            }
        }
    }

    return {
        init: function(){
            t = this;
            $(window_loaded);
        }
    }

})(jQuery);

ThemePluginsSetup.init();

jQuery(window).on( "YoastSEO:ready", function() {

    if ('undefined' !== typeof YoastSEO) {

        YoastSEO.app.registerPlugin( 'tdYoastSEOPlugin', {status: 'loading'} );

        window.tdYoastSEOUpdateContent = function() {

            if ( 'undefined' !== typeof window.tdYoastSEOUpdateContentFlag ) {
                return;
            }

            window.tdYoastSEOUpdateContentFlag = setTimeout(function() {
                window.tdYoastSEOUpdateContentFlag = undefined;
            }, 1500);

            var content = wp.data.select('core/editor').getEditedPostContent();

            jQuery.ajax({
                timeout: 10000,
                type: 'POST',

                url: td_ajax_url,

                beforeSend: function ( xhr ) {
                    xhr.setRequestHeader( 'X-WP-Nonce', window.tdwGlobal.wpRestNonce);
                },

                dataType: 'json',
                data: {
                    action: 'td_render_content',
                    content: content
                }
            }).done(function( data, textStatus, jqXHR ) {

                if ( 'success' === textStatus && 'undefined' !== typeof data.content ) {

                    YoastSEO.app.registerModification( 'content', function() { return data.content; }, 'tdYoastSEOPlugin', 5 );

                    // wp.data.dispatch( 'core/notices' ).createNotice( 'info', 'Yoast SEO Analysis has been updated!', { id: 'td_yoast_info'} );
                    //
                    // setTimeout(function() {
                    //     wp.data.dispatch( 'core/notices' ).removeNotice('td_yoast_info');
                    // }, 1200);
                }
            });
        };

        // Commented function call! There're some issues with wp 3.5 (yoast couldn't get the subheading, outbound/inbound links, etc)
        //tdYoastSEOUpdateContent();

        YoastSEO.app.pluginReady( 'tdYoastSEOPlugin' );
    }
});


jQuery(window).on('load', function () {

    var $body = jQuery('body');

    $body.on( 'mousedown', '.theme.active .update-message, .td-welcome-update-theme, #update-theme', function (event) {
        event.preventDefault();
        event.stopPropagation();

        if ( 'undefined' !== typeof window.tdData ) {
            tdConfirm.modal({
                caption: 'Update Theme & Plugins',
                //htmlInfoContent: 'The theme version will change to ' + Object.keys(window.tdData.version)[0] + '. The activated plugins should be automatically updated and reactivated!',
                url: '#TB_inline?inlineId=td-confirm&width=780',
                htmlInfoContent: 'VERY IMPORTANT! Before you update to ' + Object.keys(window.tdData.version)[0] + ' version, please take a full website and database backup. This step ensures that you can easily revert to your previous version if something unexpected happens during the update. <a target="_blank" href="https://forum.tagdiv.com/how-to-update-the-theme-2/">Read more</a><br><br><br>Continue to update?',
                switchButtons: false,
                textYes: 'Update',
                callbackYes: function () {

                    jQuery.ajax({
                        type: 'POST',
                        url: td_ajax_url,
                        data: {
                            action: 'td_ajax_change_theme_version',
                            version: Object.keys(window.tdData.version)[0],
                            url: Object.values(window.tdData.version)[0],
                        },
                        success: function (data, textStatus, XMLHttpRequest) {
                            console.log('success');
                            console.log(textStatus);
                            console.log(data);

                            window.location.replace( window.tdData.adminUrl + 'update-core.php?action=do-theme-upgrade&update_theme=' + window.tdData.themeName );
                        },
                        error: function (MLHttpRequest, textStatus, errorThrown) {
                            //console.log(errorThrown);
                        }
                    });
                    tb_remove();
                },
            });
        }

        return false;

    });
});



var tdReports = {

    initialized: false,

    _error: undefined,
    _themeName: undefined,
    _themeVersion: undefined,

    $_iframe: undefined,

    _buffer: [],

    init: function () {

        if (tdReports.initialized) {
            return;
        }

        jQuery('#iframe-reports').on('load', function () {
            tdReports.$_iframe = jQuery(this);

            if ( tdReports._buffer.length ) {
                tdReports._buffer.forEach(function(msg) {
                    tdReports.$_iframe[0].contentWindow.postMessage(msg, '*');
                });
                tdReports._buffer = [];
            }
        });

        tdReports.initialized = true;
    },

    report: function(serverName, httpHost, httpReferer, httpUserAgent, themeName, themeVersion, plugins, errNo, errStr, errFile, errLine ) {

        jQuery(document).ready(function () {
            tdReports.init();
        });

        var msg = JSON.stringify({
            serverName: serverName,
            httpHost: httpHost,
            httpReferer: httpReferer,
            httpUserAgent: httpUserAgent,
            themeName: themeName,
            themeVersion: themeVersion,
            plugins: plugins,
            errNo: errNo,
            errStr: errStr,
            errFile: errFile,
            errLine: errLine
        });

        if ( 'undefined' === typeof tdReports.$_iframe ) {
            tdReports._buffer.push(msg);
        } else {
            tdReports.$_iframe[0].contentWindow.postMessage(msg, '*');
        }
    }
};

jQuery(document).ready(function () {
    tdReports.init();
});
