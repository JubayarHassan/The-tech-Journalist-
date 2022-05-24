/**
 * Created by ra on 5/14/2015.
 */

/* global jQuery:{} */
/* global console:{} */
/* global alert:{} */
/* global confirm:{} */
/* global td_ajax_url:{} */
/* global td_admin_url:{} */
/* global tdDemoProgressBar:{} */
/* global tdDemoFullInstaller:{} */
/* global theme_plugins_list:{} */

var td_wp_admin_demos = {};

(function () {
    'use strict';

    td_wp_admin_demos = {

        init: function init() {

            jQuery().ready(function() {

                //add custom body class for disabled demos tooltip popup style
                var body = jQuery(document.body);

                if ( jQuery('.td-demo-req-plugins-disabled').length !== 0 ) {
                    body.addClass('td-demo-req-plug-tooltip');
                }

                // demo installed info html
                jQuery('.td-demo-filter ul').after(
                    '<div class="td-theme-demo-installed" style="display: none">' +
                        '<span>Current demo installed: </span>' +
                        '<span class="td-theme-demo-name"></span>' +
                        '<div class="td-wp-admin-demo">' +
                            '<a class="button button-primary td-theme-demo-button td-button-uninstall-demo" href="#" data-demo-id="">Uninstall</a>' +
                        '</div>' +
                    '</div>'
                );
                td_wp_admin_demos._update_installed_demo();

                // disable the demo install button for demos that require additional plugins installation/activation
                jQuery('.td-req-demo-disabled').on( 'click', function(event) {
                    event.preventDefault();
                });

                // quick install - right menu
                jQuery('.td-button-install-demo-quick').on( 'click', function(event) {
                    event.preventDefault();

                    if (jQuery(this).hasClass('td-demo-installing') || jQuery(this).hasClass('td-demo-disabled') || jQuery(this).hasClass('td-demo-installed') || jQuery(this).hasClass('td-req-demo-disabled')) {
                        return;
                    }

                    // install from the small sidebar list of demos
                    tdConfirm.showModal( 'Install the full demo',
                        td_wp_admin_demos,
                        function(demoId) {

                            td_wp_admin_demos._install(demoId);

                            tb_remove();
                        },
                        [jQuery(this).data('demo-id')],
                        'Are you sure you want to install the full demo? This will import homepages, sample content with images, backgrounds, template layouts, fonts, colors.<br><br>' +
                        '<strong>Notice</strong>: The demo can be fully uninstalled and the system will attempt to rollback to your previous state. Any content, menus and attachment created by the demo are removable via the uninstall button.<br><br>' +
                        '<strong>Please backup your settings</strong> to be sure that you don\'t lose them by accident.'
                    );
                });

                // install (via normal button)
                jQuery('.td-wp-admin-demo .td-button-install-demo').on( 'click', function(event) {
                    event.preventDefault();
                    var include_demo_content_check = jQuery(this).parent().parent().find('input[type=hidden]');
                    var demo_id = jQuery(this).data('demo-id');
                    var demo_req_plugins = jQuery(this).data('demo-req-plugins');
                    var demo_plugins = ( demo_req_plugins !== undefined ) ? demo_req_plugins : [];
                    var td_confirm = '';

                    if ( include_demo_content_check.val() === 'no' ) {

                        // install no content
                        tdConfirm.showModal( 'Install demo without content',
                            td_wp_admin_demos,
                            function(demoId,demoPlugins) {
                                td_wp_admin_demos._install(demoId, true, demoPlugins);
                                tb_remove();
                            },
                            [demo_id,demo_plugins],
                            'Are you sure you want to install the demo without the sample content? This will import our predefined settings for the demo (background, template layouts, fonts, colors etc...) but no sample content will be added to the site.<br>'
                        );

                    } else {

                        // install with content
                        tdConfirm.showModal( 'Install the full demo',
                            td_wp_admin_demos,
                            function(demoId,demoPlugins) {
                                td_wp_admin_demos._install(demoId, false, demoPlugins);
                                tb_remove();
                            },
                            [demo_id,demo_plugins],
                            'Are you sure you want to install the full demo? This will import homepages, sample content with images, backgrounds, template layouts, fonts, colors.<br><br>' +
                            '<strong>Notice</strong>: The demo can be fully uninstalled and the system will attempt to rollback to your previous state. Any content, menus and attachment created by the demo are removable via the uninstall button.<br><br>' +
                            '<strong>Please backup your settings</strong> to be sure that you don\'t lose them by accident.'
                        );
                    }

                });
                
                // uninstall
                jQuery('.td-wp-admin-demo .td-button-uninstall-demo').on( 'click', function(event) {
                    event.preventDefault();

                    var $this = jQuery(this),
                        dataDemoId = $this.data('demo-id'),
                        dataText = $this.data('text');

                    if ('undefined' === typeof dataText) {
                        dataText = 'Are you sure? The theme will remove all the installed content and settings and it will try to revert your site to the previous state.';
                    }

                    // install with content
                    tdConfirm.showModal( 'Uninstall demo',
                        td_wp_admin_demos,
                        function(demoId) {

                            td_wp_admin_demos._uninstall(demoId);
                            tb_remove();
                        },
                        [dataDemoId],
                        dataText
                    );
                });


                //toggle between only settings and full demo
                jQuery('.td-wp-admin-demo .td-checkbox').on( 'click', function(event){
                    event.preventDefault();

                    if (jQuery(this).hasClass('td-checkbox-active')) {
                        // we are deactivating
                        jQuery(this).parent().find('p').text('Design only');

                    } else {
                        // we are activating
                        jQuery(this).parent().find('p').text('Include content');
                    }

                });
            });

        },

        _update_installed_demo: function() {
            setTimeout(function() {
                var tdInstalledDemo = jQuery('.td-demo-installed');
                if ( tdInstalledDemo.length > 0 ) {
                    var demoTitle = tdInstalledDemo.find('.td-demo-titles').text();
                    var demoId = tdInstalledDemo.find('.td-button-install-demo').data('demo-id');
                    jQuery('.td-theme-demo-name').text(demoTitle);
                    jQuery('.td-theme-demo-button').attr('data-demo-id', demoId);
                    jQuery('.td-theme-demo-installed').show();
                }

                //remove old demo which has a PRO version, but keep the uninstall option
                jQuery('.td-hide-demo').remove();

            }, 500);
        },

        _uninstall: function(demo_id) {
            td_wp_admin_demos._block_navigation();


            // disable the rest of the demos + remove the installed class form the other demo
            jQuery('.td-wp-admin-demo:not(.td-demo-' + demo_id + ')')
                .addClass('td-demo-disabled')
            ;

            //add the installing class
            jQuery('.td-demo-' + demo_id)
                .addClass('td-demo-uninstalling')
                .removeClass('td-demo-installed')
            ;

            // show the progressbar
            tdDemoProgressBar.progress_bar_wrapper_element = jQuery('.td-demo-' + demo_id + ' .td-progress-bar-wrap');
            tdDemoProgressBar.progress_bar_element = jQuery('.td-demo-' + demo_id + ' .td-progress-bar');
            tdDemoProgressBar.show();
            tdDemoProgressBar.change(2);

            tdDemoProgressBar.timer_change(98);

            var request_data = {
                action: 'td_ajax_demo_install',
                td_demo_action:'uninstall_demo',
                td_demo_id: demo_id,
                td_magic_token: tdWpAdminImportNonce
            };
            jQuery.ajax({
                type: 'POST',
                url: td_wp_admin_demos._getAdminAjax('uninstall_demo'),
                cache:false,
                data: request_data,
                dataType: 'json',
                success: function(data, textStatus, XMLHttpRequest){
                    //tdAjaxBlockProcessResponse(data, td_user_action);

                    tdDemoProgressBar.change(100);


                    setTimeout(function() {
                        // hide and reset the progress bar
                        tdDemoProgressBar.hide();
                        tdDemoProgressBar.reset();

                        //remove the installing class and add the installed class
                        jQuery('.td-demo-' + demo_id)
                            .removeClass('td-demo-uninstalling');

                        // remove the disable class from the other demos
                        jQuery('.td-demo-disabled').removeClass('td-demo-disabled');

                        td_wp_admin_demos._unblock_navigation();

                        jQuery('.td-theme-demo-installed').hide();

                    }, 500);
                },
                error: function(MLHttpRequest, textStatus, errorThrown){
                    td_wp_admin_demos._show_network_error('uninstall', MLHttpRequest, textStatus, errorThrown);
                }
            });


        },

        // _install_no_content: function (demo_id) {
        //     td_wp_admin_demos._block_navigation();
        //     td_wp_admin_demos._ui_install_start(demo_id);
        //
        //     tdDemoProgressBar.timer_change(70);
        //
        //
        //     /* ---------------------------------------------------------------------------------------
        //      Remove content before install
        //      */
        //     var request_data = {
        //         action: 'td_ajax_demo_install',
        //         td_demo_action:'remove_content_before_install',
        //         td_demo_id: demo_id,
        //         td_magic_token: tdWpAdminImportNonce
        //     };
        //     jQuery.ajax({
        //         type: 'POST',
        //         url: td_wp_admin_demos._getAdminAjax('remove_content_before_install'),
        //         cache:false,
        //         data: request_data,
        //         dataType: 'json',
        //         success: function(data, textStatus, XMLHttpRequest){
        //
        //
        //             /* ---------------------------------------------------------------------------------------
        //              install_no_content_demo
        //              */
        //             tdDemoProgressBar.timer_change(98);
        //             //tdAjaxBlockProcessResponse(data, td_user_action);
        //             var request_data = {
        //                 action: 'td_ajax_demo_install',
        //                 td_demo_action:'install_no_content_demo',
        //                 td_demo_id: demo_id,
        //                 td_magic_token: tdWpAdminImportNonce
        //             };
        //             jQuery.ajax({
        //                 type: 'POST',
        //                 url: td_wp_admin_demos._getAdminAjax('install_no_content_demo'),
        //                 cache:false,
        //                 data: request_data,
        //                 dataType: 'json',
        //                 success: function(data, textStatus, XMLHttpRequest){
        //                     //tdAjaxBlockProcessResponse(data, td_user_action);
        //                     td_wp_admin_demos._unblock_navigation();
        //                     td_wp_admin_demos._ui_install_end(demo_id);
        //                 },
        //                 error: function(MLHttpRequest, textStatus, errorThrown){
        //                     td_wp_admin_demos._show_network_error('no_content_install_demo', MLHttpRequest, textStatus, errorThrown);
        //                 }
        //             });
        //
        //
        //
        //         },
        //         error: function(MLHttpRequest, textStatus, errorThrown){
        //             td_wp_admin_demos._show_network_error('no_content_remove_content_before_install', MLHttpRequest, textStatus, errorThrown);
        //         }
        //     });
        //
        //
        //
        //
        // },

        //
        // _install_full: function (demoId ) {
        //     td_wp_admin_demos._block_navigation();
        //     td_wp_admin_demos._ui_install_start(demoId);
        //     tdDemoProgressBar.timer_change(10);
        //
        //     tdDemoFullInstaller.installNextStep(demoId, 0, function () {
        //         // on finish!
        //         td_wp_admin_demos._unblock_navigation();
        //         td_wp_admin_demos._ui_install_end(demoId);
        //     });
        // },

        _install: function(demoId, noContent, demoPlugins) {

            var content;
            if ( 'undefined' !== typeof noContent && true === noContent ) {
                content = true;
            }

            td_wp_admin_demos._block_navigation();
            td_wp_admin_demos._ui_install_start(demoId);
            tdDemoProgressBar.timer_change(10);

            // plugins
            if ( 'undefined' !== typeof demoPlugins && demoPlugins.length ) {

                // console.log( '%c plugins to install: ' + demoPlugins.toString(), 'color: #40a200;' );

                var plugins = new DemoPluginManager;
                plugins.init(demoPlugins);

                // trigger the demo installer event to continue demo install after plugins install
                jQuery(document).on('tdDemoFullInstaller', function ( event, data ) {

                    var failed_plugins = data.failed_plugins;

                    if ( failed_plugins.length ) {

                        var failed_plugins_names = [];
                        failed_plugins.forEach( function(plugin) {
                            failed_plugins_names.push( theme_plugins_list[plugin] );
                        });

                        var td_theme_plugins_url = td_admin_url + 'admin.php?page=td_theme_plugins';

                        tdConfirm.showModalOk(
                            'Demo Required Plugins Install Failed',
                            '<p>An error occurred, and demo required plugins installation failed. <br>Please <a href="' + td_theme_plugins_url + '" target="_blank">manually install/activate</a> the following plugins:<br><span style="font-weight: bold;">' + failed_plugins_names.toString() + '</span><br> and install demo again.</p>',
                            function () {
                                td_wp_admin_demos._ui_install_stop(demoId);
                                tb_remove();
                            }
                        );

                    } else {
                        tdDemoFullInstaller.installNextStep( demoId, 0, function () {
                            // on finish !
                            td_wp_admin_demos._unblock_navigation();
                            td_wp_admin_demos._ui_install_end(demoId);
                            td_wp_admin_demos._update_installed_demo();
                        }, content );
                    }

                });

            } else {
                //console.log( '%c no plugins to install !', 'color: #40a200;' );
                tdDemoFullInstaller.installNextStep( demoId, 0, function () {
                    // on finish !
                    td_wp_admin_demos._unblock_navigation();
                    td_wp_admin_demos._ui_install_end(demoId);
                    td_wp_admin_demos._update_installed_demo();
                }, content );
            }

        },

        _show_network_error:function (td_ajax_request_name, MLHttpRequest, textStatus, errorThrown) {

            var responseText = MLHttpRequest.responseText.replace(/<br>/g, '\n');

            alert(
                'Ajax error. Cannot connect to server, it may be due to a misconfiguration on the server.\n' +
                'textStatus: ' + textStatus + '\n' +
                'td_ajax_request_name: ' + td_ajax_request_name + '\n' +
                'errorThrown: ' + errorThrown + '\n' + '\n' +
                'responseText: ' + responseText
            );

            console.log(responseText);
        },

        _ui_install_start:function (demo_id) {
            // disable the rest of the demos + remove the installed class form the other demo
            jQuery('.td-wp-admin-demo:not(.td-demo-' + demo_id + ')')
                .addClass('td-demo-disabled')
                .removeClass('td-demo-installed')
            ;

            //add the installing class
            jQuery('.td-demo-' + demo_id).addClass('td-demo-installing');

            // show the progressbar
            tdDemoProgressBar.progress_bar_wrapper_element = jQuery('.td-demo-' + demo_id + ' .td-progress-bar-wrap');
            tdDemoProgressBar.progress_bar_element = jQuery('.td-demo-' + demo_id + ' .td-progress-bar');
            tdDemoProgressBar.show();
            tdDemoProgressBar.change(2);
        },

        _ui_install_end: function (demo_id) {
            tdDemoProgressBar.change(100);
            setTimeout(function() {
                // hide and reset the progress bar
                tdDemoProgressBar.hide();
                tdDemoProgressBar.reset();

                //remove the installing class and add the installed class
                jQuery('.td-demo-' + demo_id)
                    .removeClass('td-demo-installing')
                    .addClass('td-demo-installed');


                // remove the disabled class from the other demos
                jQuery('.td-demo-disabled').removeClass('td-demo-disabled');

                // unbind `tdDemoFullInstaller` event
                jQuery(document).unbind('tdDemoFullInstaller');

            }, 500);

        },

        _ui_install_stop: function (demo_id) {
            tdDemoProgressBar.change(100);
            setTimeout(function() {
                // hide and reset the progress bar
                tdDemoProgressBar.hide();
                tdDemoProgressBar.reset();

                //remove the installing class and add the installed class
                jQuery('.td-demo-' + demo_id).removeClass('td-demo-installing');

                // remove the disabled class from the other demos
                jQuery('.td-demo-disabled').removeClass('td-demo-disabled');

                // unbind `tdDemoFullInstaller` event
                jQuery(document).unbind('tdDemoFullInstaller');

            }, 500);
            td_wp_admin_demos._unblock_navigation();
        },

        _block_navigation: function () {
            window.onbeforeunload = function() {
                return "Are you sure you want to navigate away? The demo is still installing. If it's stuck, refresh this page and Uninstall the demo, it should bring your site to the previous state";
            };
        },

        _unblock_navigation: function () {
            window.onbeforeunload = '';
        },

        /**
         * generates an unique ID. Used for cache busting
         * @returns {string}
         * @private
         */
        _getAdminAjax: function (stepName) {
            if (typeof stepName === 'undefined') {
                stepName = 'not_set';
            }

            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return td_ajax_url + '&step=' + stepName + '&uid=' + s4() + s4() + s4() + s4();
        }

    };

})();

function DemoPluginManager() {

    var plugins_to_process;
    var failed_plugins = [];
    var completed = [];
    var current_item = '';
    var current_item_hash = '';

    function ajax_callback(response) {

        if( typeof response === 'object' && typeof response.message !== 'undefined' ) {

            //console.log( 'ajax_callback > response.message: ' + response.message );

            if( typeof response.url !== 'undefined' ) {

                // we have an ajax url action to perform.
                if( response.hash === current_item_hash ) {

                    //console.log( 'response.hash === current_item_hash: ' + response.hash );
                    failed_plugins.push( current_item ); // add current to failed list

                    find_next();

                } else {

                    current_item_hash = response.hash;

                    jQuery.post( response.url, response, function() { process_current(); } ).fail( ajax_callback );

                }

            } else if( typeof response.done !== 'undefined' ) {

                // finished processing this plugin, move onto next
                find_next();

            } else {

                // error processing this plugin
                find_next();

            }
        } else {

            failed_plugins.push( current_item ); // add current to failed list

            // error - try again with next plugin
            //console.log( 'ajax_callback > status: failed: Ajax error !' );
            find_next();
        }

    }

    function process_current() {

        if ( current_item ) {

            //console.log( '%c process_current: current_plugin: ' + current_item, 'color: orangered;' );

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

    function find_next() {

        var do_next = false;
        if ( current_item !== '' && !completed.includes(current_item) ) {
            completed.push(current_item);
        }

        plugins_to_process.forEach( function(plugin) {

            if ( current_item === '' || do_next ) {
                current_item = plugin;
                process_current();
                do_next = false;
            } else if ( plugin === current_item ) {
                do_next = true;
            }

        });

        if( completed.length >= plugins_to_process.length ) {

            // finished all plugins!
            //console.log( '%c finished all plugins!', 'color: orangered;' );

            // ..trigger demo installer
            jQuery(document).trigger( 'tdDemoFullInstaller', { 'failed_plugins': failed_plugins } );

        }

    }

    return {
        init: function(plugins) {
            //console.log(plugins);
            plugins_to_process = plugins;
            find_next();

        }
    }

}

td_wp_admin_demos.init();


var _extends=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e},_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};!function(e,t){"object"===("undefined"==typeof exports?"undefined":_typeof(exports))&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):e.LazyLoad=t()}(this,function(){"use strict";var e={elements_selector:"img",container:window,threshold:300,throttle:150,data_src:"src",data_srcset:"srcset",class_loading:"loading",class_loaded:"loaded",class_error:"error",class_initial:"initial",skip_invisible:!0,callback_load:null,callback_error:null,callback_set:null,callback_processed:null},t=!("onscroll"in window)||/glebot/.test(navigator.userAgent),n=function(e,t){e&&e(t)},o=function(e){return e.getBoundingClientRect().top+window.pageYOffset-e.ownerDocument.documentElement.clientTop},i=function(e,t,n){return(t===window?window.innerHeight+window.pageYOffset:o(t)+t.offsetHeight)<=o(e)-n},s=function(e){return e.getBoundingClientRect().left+window.pageXOffset-e.ownerDocument.documentElement.clientLeft},r=function(e,t,n){var o=window.innerWidth;return(t===window?o+window.pageXOffset:s(t)+o)<=s(e)-n},l=function(e,t,n){return(t===window?window.pageYOffset:o(t))>=o(e)+n+e.offsetHeight},a=function(e,t,n){return(t===window?window.pageXOffset:s(t))>=s(e)+n+e.offsetWidth},c=function(e,t,n){return!(i(e,t,n)||l(e,t,n)||r(e,t,n)||a(e,t,n))},u=function(e,t){var n,o=new e(t);try{n=new CustomEvent("LazyLoad::Initialized",{detail:{instance:o}})}catch(e){(n=document.createEvent("CustomEvent")).initCustomEvent("LazyLoad::Initialized",!1,!1,{instance:o})}window.dispatchEvent(n)},d=function(e,t){return e.getAttribute("data-"+t)},h=function(e,t,n){return e.setAttribute("data-"+t,n)},f=function(e,t){var n=e.parentNode;if("PICTURE"===n.tagName)for(var o=0;o<n.children.length;o++){var i=n.children[o];if("SOURCE"===i.tagName){var s=d(i,t);s&&i.setAttribute("srcset",s)}}},_=function(e,t,n){var o=e.tagName,i=d(e,n);if("IMG"===o){f(e,t);var s=d(e,t);return s&&e.setAttribute("srcset",s),void(i&&e.setAttribute("src",i))}"IFRAME"!==o?i&&(e.style.backgroundImage='url("'+i+'")'):i&&e.setAttribute("src",i)},p="classList"in document.createElement("p"),m=function(e,t){p?e.classList.add(t):e.className+=(e.className?" ":"")+t},g=function(e,t){p?e.classList.remove(t):e.className=e.className.replace(new RegExp("(^|\\s+)"+t+"(\\s+|$)")," ").replace(/^\s+/,"").replace(/\s+$/,"")},v=function(t){this._settings=_extends({},e,t),this._queryOriginNode=this._settings.container===window?document:this._settings.container,this._previousLoopTime=0,this._loopTimeout=null,this._boundHandleScroll=this.handleScroll.bind(this),this._isFirstLoop=!0,window.addEventListener("resize",this._boundHandleScroll),this.update()};v.prototype={_reveal:function(e){var t=this._settings,o=function o(){t&&(e.removeEventListener("load",i),e.removeEventListener("error",o),g(e,t.class_loading),m(e,t.class_error),n(t.callback_error,e))},i=function i(){t&&(g(e,t.class_loading),m(e,t.class_loaded),e.removeEventListener("load",i),e.removeEventListener("error",o),n(t.callback_load,e))};"IMG"!==e.tagName&&"IFRAME"!==e.tagName||(e.addEventListener("load",i),e.addEventListener("error",o),m(e,t.class_loading)),_(e,t.data_srcset,t.data_src),n(t.callback_set,e)},_loopThroughElements:function(){var e=this._settings,o=this._elements,i=o?o.length:0,s=void 0,r=[],l=this._isFirstLoop;for(s=0;s<i;s++){var a=o[s];e.skip_invisible&&null===a.offsetParent||(t||c(a,e.container,e.threshold))&&(l&&m(a,e.class_initial),this._reveal(a),r.push(s),h(a,"was-processed",!0))}for(;r.length;)o.splice(r.pop(),1),n(e.callback_processed,o.length);0===i&&this._stopScrollHandler(),l&&(this._isFirstLoop=!1)},_purgeElements:function(){var e=this._elements,t=e.length,n=void 0,o=[];for(n=0;n<t;n++){var i=e[n];d(i,"was-processed")&&o.push(n)}for(;o.length>0;)e.splice(o.pop(),1)},_startScrollHandler:function(){this._isHandlingScroll||(this._isHandlingScroll=!0,this._settings.container.addEventListener("scroll",this._boundHandleScroll))},_stopScrollHandler:function(){this._isHandlingScroll&&(this._isHandlingScroll=!1,this._settings.container.removeEventListener("scroll",this._boundHandleScroll))},handleScroll:function(){var e=this._settings.throttle;if(0!==e){var t=Date.now(),n=e-(t-this._previousLoopTime);n<=0||n>e?(this._loopTimeout&&(clearTimeout(this._loopTimeout),this._loopTimeout=null),this._previousLoopTime=t,this._loopThroughElements()):this._loopTimeout||(this._loopTimeout=setTimeout(function(){this._previousLoopTime=Date.now(),this._loopTimeout=null,this._loopThroughElements()}.bind(this),n))}else this._loopThroughElements()},update:function(){this._elements=Array.prototype.slice.call(this._queryOriginNode.querySelectorAll(this._settings.elements_selector)),this._purgeElements(),this._loopThroughElements(),this._startScrollHandler()},destroy:function(){window.removeEventListener("resize",this._boundHandleScroll),this._loopTimeout&&(clearTimeout(this._loopTimeout),this._loopTimeout=null),this._stopScrollHandler(),this._elements=null,this._queryOriginNode=null,this._settings=null}};var w=window.lazyLoadOptions;return w&&function(e,t){var n=t.length;if(n)for(var o=0;o<n;o++)u(e,t[o]);else u(e,t)}(v,w),v});


// jQuery(document).bind('mousewheel DOMMouseScroll MozMousePixelScroll', function(e){
//     if (tdIsScrollingAnimation === false) {
//         return;
//     } else {
//         tdIsScrollingAnimation = false;
//         td_mouse_wheel_or_touch_moved = true;
//         jQuery("html, body").stop();
//     }
// });
if (document.addEventListener){
    document.addEventListener('touchmove', function(e) {
        if (tdIsScrollingAnimation === false) {
            return;
        } else {
            tdIsScrollingAnimation = false;
            td_mouse_wheel_or_touch_moved = true;
            jQuery("html, body").stop();
        }
    }, false);
}
function scrollToPosition ( pxFromTop, duration ) {
    tdIsScrollingAnimation = true;
    jQuery("html, body").stop();
    jQuery("html, body").animate(
        { scrollTop: pxFromTop },{
            duration: duration,
            easing:'easeInOutQuart',
            complete: function(){
                tdIsScrollingAnimation = false;
            }
        }
    );
}
jQuery(document).ready(function($) {
    $(".td-to-demos").on('click', function(event){
        event.preventDefault();
        if(tdIsScrollingAnimation) {
            return;
        }
        scrollToPosition($(this.hash).offset().top, 800);
    });

    // click on the little mouse :)
    $(".td-scroll-to-demos").on('click', function(event){
        event.preventDefault();
        if(tdIsScrollingAnimation) {
            return;
        }
        scrollToPosition($("#demos").offset().top, 800);
    });



});

jQuery(document).ready(function($) {
    $(".td-to-support").on('click', function(event){
        event.preventDefault();
        if(tdIsScrollingAnimation) {
            return;
        }
        scrollToPosition($(this.hash).offset().top, 1200);
    });



    tdFilter.init();
    tdFilter.add( jQuery( '.td-demos:first'), jQuery( '.td-demos:first .td-demo-filter') );


    tdPresentation.init();

    jQuery( '.td-mfp-video').each(function(index, element) {
        var $element = jQuery( element );
        $element.magnificPopup({
            type: 'iframe',
            iframe: {
                patterns: {
                    youtube: {
                        index: 'youtube.com/', // String that detects type of video (in this case YouTube). Simply via url.indexOf(index).

                        id: function(url) {
                            var m = url.match(/[\\?\\&]v=([^\\?\\&]+)/);
                            if ( !m || !m[1] ) return null;

                            return m[1];
                        },

                        src: '//www.youtube.com/embed/%id%?autoplay=1'
                    }
                },

                srcAction: 'iframe_src' // Templating object key. First part defines CSS selector, second attribute. "iframe_src" means: find "iframe" and set attribute "src".
            }
        });
    });
});

jQuery(window).on( 'load', function($) {

    jQuery('.td-pro-list-item > a').trigger('click');

});

var tdFilter = {};

(function( jQuery ) {



    'use strict';

    tdFilter = {

        items: [],

        item: function( $container, $filterLinks ) {
            this.$container = $container;
            this.$filterLinks = $filterLinks;

            this.timeoutWindowResize = undefined;
            this.itemWidth = undefined;
            this.itemHeight = undefined;

            this.setFilterMeasure = function( $filterMeasure ) {
                this.$filterMeasure = $filterMeasure;
                this.itemWidth = $filterMeasure.outerWidth( true );
                this.itemHeight = $filterMeasure.outerHeight( true );
            }
        },



        init: function() {

            jQuery( window).on('resize', function(event) {

                for ( var i = 0; i < tdFilter.items.length; i++ ) {

                    (function(){

                        var currentItem = tdFilter.items[i];

                        clearTimeout( currentItem.timeoutWindowResize );

                        currentItem.timeoutWindowResize = setTimeout(function() {

                            currentItem.itemWidth = currentItem.$filterMeasure.outerWidth( true );
                            currentItem.itemHeight = currentItem.$filterMeasure.outerHeight( true );

                            var $tdFilterNotSelected = currentItem.$container.find( '.td-filter').not( '.not-selected' );

                            $tdFilterNotSelected.each(function(index, element) {
                                var $element = jQuery( element ),
                                    row = Math.floor( index / tdFilter.getColumns() ),
                                    col = index % tdFilter.getColumns(),
                                    extraLeft = 0; // add extraLeft to the elements of the last row (to center them)

                                if ( $tdFilterNotSelected.length % tdFilter.getColumns() > 0 && ($tdFilterNotSelected.length - index ) < ( $tdFilterNotSelected.length % tdFilter.getColumns() + 1 ) ) {
                                    extraLeft = ( tdFilter.getColumns() - ($tdFilterNotSelected.length % tdFilter.getColumns()) ) / 2 * currentItem.itemWidth;
                                }

                                var computedLeft = extraLeft + ( col * currentItem.itemWidth ),
                                    computedTop = row * currentItem.itemHeight;

                                if ( window.innerWidth < 768 ) {
                                    computedLeft = 0;
                                    computedTop = index * currentItem.itemHeight;
                                }

                                $element.css({
                                    'float': 'none',
                                    'position': 'absolute',
                                    'left': computedLeft,
                                    'top': computedTop,
                                    'transition': 'all 0.3s'
                                    // 'transition': 'all 0.6s'
                                });
                            });

                            var newHeight = Math.ceil( $tdFilterNotSelected.length / tdFilter.getColumns() ) * currentItem.itemHeight;
                            if ( window.innerWidth < 768 ) {
                                newHeight = $tdFilterNotSelected.length * currentItem.itemHeight;
                            }
                            currentItem.$container.find( '.td-filter-wrap' ).height( newHeight );
                            if ( currentItem.$container.parent().hasClass( 'td-detail' ) ) {
                                currentItem.$container.height( newHeight + currentItem.$filterLinks.outerHeight( true ) );
                            }

                        }, 350);

                    })();

                }
            });
        },

        getColumns: function() {
            if ( window.innerWidth < 768 ) {
                return 1;
            }
            if( window.innerWidth >= 768 && window.innerWidth <= 1018 ) {
                return 2;
            }
            if( window.innerWidth >= 1019 && window.innerWidth <= 1380 ) {
                return 3;
            }
            if( window.innerWidth >= 1381 && window.innerWidth <= 1640 ) {
                return 4;
            }
            return 5;
        },



        add: function( $container, $filterLinks ) {

            var filterItem = new tdFilter.item( $container, $filterLinks ),
                $tdFilterAll = $container.find( '.td-filter' );

            if ( ! $tdFilterAll.length ) {
                return;
            }

            $tdFilterAll.each(function(index, element) {
                var $element = jQuery( element ),
                    row = Math.floor( index / tdFilter.getColumns() ),
                    col = index % tdFilter.getColumns(),
                    extraLeft = 0; // add extraLeft to the elements of the last row (to center them)

                if ( 0 === index ) {
                    filterItem.setFilterMeasure( $element );
                }

                if ( $tdFilterAll.length % tdFilter.getColumns() > 0 && ($tdFilterAll.length - index ) < ( $tdFilterAll.length % tdFilter.getColumns() + 1 ) ) {
                    extraLeft = ( tdFilter.getColumns() - ($tdFilterAll.length % tdFilter.getColumns()) ) / 2 * filterItem.itemWidth;
                }

                $element.css({
                    'float': 'none',
                    'position': 'absolute',
                    'left': extraLeft + ( col * filterItem.itemWidth ),
                    'top': row * filterItem.itemHeight,
                    'transition': 'all 0.6s'
                });
            });

            var newHeight = Math.ceil( $tdFilterAll.length / tdFilter.getColumns() ) * filterItem.itemHeight;
            if ( window.innerWidth < 768 ) {
                newHeight = $tdFilterAll.length * filterItem.itemHeight;
            }
            $container.find( '.td-filter-wrap' ).height( newHeight );
            //$container.height( newHeight );


            if ( $container.parent().hasClass( 'td-detail' ) ) {
                $container.height( newHeight + $filterLinks.outerHeight( true ) );
            }




            tdFilter.items.push( filterItem );





            $filterLinks.find('a').on('click', function(event) {

                event.preventDefault();

                var $this = jQuery( this ),
                    dataType = $this.data( 'type' );


                $this.closest( '.td-demo-filter' ).find( '.td-demo-filter-active').removeClass( 'td-demo-filter-active' );
                $this.addClass( 'td-demo-filter-active' );

                //console.log( filterItem.itemHeight );

                if ( 'undefined' === typeof dataType ) {

                    $tdFilterAll.each(function(index, element) {
                        var $element = jQuery( element );
                        $element.removeClass( 'not-selected' );
                    });

                    if ( window.innerWidth < 768 ) {
                        $container.find( '.td-filter-wrap' ).height( $tdFilterAll.length * filterItem.itemHeight );
                    } else {
                        $container.find( '.td-filter-wrap' ).height( Math.ceil( $tdFilterAll.length / tdFilter.getColumns() ) * filterItem.itemHeight );
                    }

                } else {

                    var notSelectedElements = 0;

                    $tdFilterAll.each(function(index, element) {
                        var $element = jQuery( element ),
                            elementDataType = $element.data( 'type' );

                        if ( elementDataType.indexOf(dataType) !== -1 ) {
                            $element.removeClass( 'not-selected' );
                        } else {
                            $element.addClass( 'not-selected' );
                            notSelectedElements++;
                        }
                    });

                    var newHeight = Math.ceil( ( $tdFilterAll.length - notSelectedElements ) / tdFilter.getColumns() ) * filterItem.itemHeight;
                    if ( window.innerWidth < 768 ) {
                        newHeight = ( $tdFilterAll.length - notSelectedElements ) * filterItem.itemHeight;
                    }
                    $container.find( '.td-filter-wrap' ).height( newHeight );
                    //

                    //$container.height( newHeight );
                    //$container.height( newHeight + filterItem.$filterLinks.outerHeight( true ) );

                    if ( $container.parent().hasClass( 'td-detail' ) ) {
                        $container.height( newHeight + filterItem.$filterLinks.outerHeight( true ) );
                    }
                }

                var $tdFilterNotSelected = $container.find( '.td-filter').not( '.not-selected' );

                $tdFilterNotSelected.each(function(index, element) {

                    var $element = jQuery( element ),
                        row = Math.floor( index / tdFilter.getColumns() ),
                        col = index % tdFilter.getColumns(),
                        extraLeft = 0; // add extraLeft to the elements of the last row (to center them)

                    if ( $tdFilterNotSelected.length % tdFilter.getColumns() > 0 && ($tdFilterNotSelected.length - index ) < ( $tdFilterNotSelected.length % tdFilter.getColumns() + 1 ) ) {
                        extraLeft = ( tdFilter.getColumns() - ($tdFilterNotSelected.length % tdFilter.getColumns()) ) / 2 * filterItem.itemWidth;
                    }

                    var computedLeft = extraLeft + ( col * filterItem.itemWidth ),
                        computedTop = row * filterItem.itemHeight;

                    if ( window.innerWidth < 768 ) {
                        computedLeft = 0;
                        computedTop = index * filterItem.itemHeight;
                    }

                    $element.css({
                        'float': 'none',
                        'position': 'absolute',
                        'left': computedLeft,
                        'top': computedTop
                    });
                });

                if ( 'undefined' === typeof $this.data( 'lazyload' )) {
                    $this.data( 'lazyload', 1 );
                    setTimeout(function() {
                        new LazyLoad(window.lazyLoadOptions);
                    }, 500);
                }
            });
        }
    };
})( jQuery );

var tdImageLoader = {};
var tdPresentation = {};

(function( jQuery ) {

    'use strict';


    tdImageLoader = {
        loadImage: function ($image) {
            if ($image.hasClass("td-image-loaded") ) {
                return;
            }

            var $preloadImage = $('<img/>');

            var tdsrc = $image.data('tdsrc');
            $preloadImage[0].src = tdsrc;

            $preloadImage.on( 'load', function(){
                $image.addClass("td-image-loaded");
                $image.attr("src", tdsrc);
            });
        }
    };



    tdPresentation = {

        _inClosing: false,

        items: [],

        item: function( $element) {
            this.$element = $element;
        },

        init: function() {
            var $tdPresentationReadMore = jQuery( '.td-presentation-read-more' );
            if ( $tdPresentationReadMore.length ) {
                $tdPresentationReadMore.each(function(index, element) {
                    var $element = jQuery( element );

                    tdPresentation.items.push( new tdPresentation.item( $element ) );
                });
            }
            if ( tdPresentation.items.length ) {
                tdPresentation._bindEvents();
            }
        },

        //step: function() {
        //    var $this = jQuery( '.xxx'),
        //        thisParentHeight = $this.parent().height();
        //    if ( thisParentHeight < 200 ) {
        //        $this.parent().height ( thisParentHeight + 10 );
        //        console.log(thisParentHeight);
        //    }
        //
        //    window.requestAnimationFrame( tdPresentation.step );
        //},

        _bindEvents: function() {

            for ( var i = 0; i < tdPresentation.items.length; i++ ) {

                tdPresentation.items[i].$element.on('click', function(event) {
                    event.preventDefault();



                    var $this = jQuery( this ),
                        $parent = $this.parent( '.td-container' ),
                        parentOffset = $parent.offset(),
                        parentHeight = $parent.outerHeight( true ),
                        $window = jQuery( window ),
                        windowScrollTop = $window.scrollTop(),
                        windowHeight = $window.height();


                    setTimeout(function() {
                        // load images @added on 23.11.2017
                        $parent.find( "img[data-tdsrc]" ).each(function( index ) {
                            tdImageLoader.loadImage(jQuery(this));
                        });
                    }, 400);




                    if ( $this.hasClass( 'td-read-more-fixed' ) ) {


                        $this.css({
                            'opacity': 0
                        });

                        tdPresentation._inClosing = true;

                        //if ( ( parentOffset.top > windowScrollTop ) && ( ( parentOffset.top + $parent.outerHeight( true ) ) - 100 < windowScrollTop ) ) {

                        // The bottom of the transited content is in viewport
                        if ( parentOffset.top + parentHeight < windowScrollTop + windowHeight ) {

                            $parent.css({
                                'margin-top': -1 * parentHeight
                            });

                            jQuery( '#demos' ).css({
                                'margin-top': parentHeight,
                                transition: $parent.data( 'transition' )
                            });

                            //var transitionDuration = parseFloat( $parent.css( 'transition-duration').replace( 's', '' ) ) * 1000;
                            var timeTransition = parseFloat( $parent.data( 'time_transition' ) ) * 1000;

                            setTimeout(function(){
                                $this.find( 'i' )
                                    .toggleClass( 'td-ion-round-arrow-down' )
                                    .toggleClass( 'td-ion-round-close' );

                                $this.toggleClass( 'td-read-more-close' );

                                if ( ! $this.hasClass( '.td-read-more-close' ) ) {
                                    $this.removeClass( 'td-read-more-fixed' );
                                }

                            }, 300);



                            var $tdDetail = $this.closest( '.td-detail' );


                            $tdDetail.css( 'transition', 'none' );
                            $tdDetail.removeClass( 'td-extend' );
                            $window.scrollTop( windowScrollTop + 50 );


                            setTimeout(function() {

                                $parent.addClass( 'hidden' );

                                jQuery( '#demos' ).css({
                                    'margin-top': '',
                                    transition: ''
                                });

                                $parent.css({
                                    'margin-top': '',
                                    'transition': ''
                                });

                                $window.scrollTop( windowScrollTop + 50 - parentHeight );

                                $tdDetail.css({
                                    'transition': $parent.data( 'transition' )
                                });

                                setTimeout(function(){

                                    $this.css({
                                        'opacity': 1
                                    });
                                    $tdDetail.removeClass( 'td-detail-hidden' );
                                    tdPresentation._inClosing = false;

                                    $parent.css({
                                        'transition': $parent.data( 'transition' )
                                    });

                                }, timeTransition + 30 );

                            }, timeTransition + 20 );

                        } else {

                            // The bottom of the transited content is below the viewport

                            // 70% top - 30% bottom

                            var windowUpSectionHeight = parseInt( 0.7 * windowHeight ),
                                topMovement = windowScrollTop + windowUpSectionHeight - parentOffset.top,
                                bottomMovement = parentHeight - topMovement;

                            $parent.css({
                                'margin-top': -1 * topMovement,
                                'margin-bottom': -1 * bottomMovement
                            });

                            jQuery( '#demos' ).css({
                                'margin-top': topMovement,
                                'margin-bottom': bottomMovement,
                                transition: $parent.data( 'transition' )
                            });

                            //var transitionDuration = parseFloat( $parent.css( 'transition-duration').replace( 's', '' ) ) * 1000;
                            var timeTransition = parseFloat( $parent.data( 'time_transition' ) ) * 1000;

                            setTimeout(function(){
                                $this.find( 'i' )
                                    .toggleClass( 'td-ion-round-arrow-down' )
                                    .toggleClass( 'td-ion-round-close' );

                                $this.toggleClass( 'td-read-more-close' );

                                if ( ! $this.hasClass( '.td-read-more-close' ) ) {
                                    $this.removeClass( 'td-read-more-fixed' );
                                }

                            }, 300);



                            var $tdDetail = $this.closest( '.td-detail' );


                            $tdDetail.css( 'transition', 'none' );
                            $tdDetail.removeClass( 'td-extend' );
                            $window.scrollTop( windowScrollTop + 50 );


                            setTimeout(function() {

                                $parent.addClass( 'hidden' );

                                jQuery( '#demos' ).css({
                                    'margin-top': '',
                                    'margin-bottom': '',
                                    transition: ''
                                });

                                $parent.css({
                                    'margin-top': '',
                                    'margin-bottom': '',
                                    'transition': ''
                                });

                                $window.scrollTop( windowScrollTop + 50 - topMovement );

                                $tdDetail.css({
                                    'transition': $parent.data( 'transition' )
                                });

                                setTimeout(function(){

                                    $this.css({
                                        'opacity': 1
                                    });
                                    $tdDetail.removeClass( 'td-detail-hidden' );
                                    tdPresentation._inClosing = false;

                                    $parent.css({
                                        'transition': $parent.data( 'transition' )
                                    });

                                }, timeTransition + 30 );

                            }, timeTransition + 20 );
                        }

                    } else {


                        //$this.addClass( 'xxx' );
                        //
                        //$this.parent().toggleClass( 'hidden' );
                        //
                        ////$this.parent().parent().toggleClass( 'td-extend' );
                        //
                        //$this.parent().parent().css({transform: 'translateZ(0);'});
                        //$this.parent().css({transform: 'translateZ(0);'});
                        //
                        //
                        //window.requestAnimationFrame( tdPresentation.step )

                        $this.parent().toggleClass( 'hidden' );
                        $this.parent().parent().toggleClass( 'td-extend' );

                        setTimeout(function(){
                            $this.find( 'i' )
                                .toggleClass( 'td-ion-round-arrow-down' )
                                .toggleClass( 'td-ion-round-close' );

                            $this.toggleClass( 'td-read-more-close' );

                            if ( ! $this.hasClass( '.td-read-more-close' ) ) {
                                $this.removeClass( 'td-read-more-fixed' );
                            }

                        }, 300);
                    }
                });
            }


            // window scroll
            jQuery( window).scroll(function(event) {
                event.preventDefault();

                if ( tdPresentation._inClosing ) {
                    return false;
                }

                jQuery( '.td-read-more-close').each(function(index, element) {
                    var $element = jQuery( element ),
                        parentOffset = $element.parent().offset(),
                        $tdDetail = $element.closest( '.td-detail' );

                    if ( ( parentOffset.top <= jQuery(window).scrollTop() ) && ( ( parentOffset.top + $element.parent().outerHeight( true ) ) - 100 >= jQuery(window).scrollTop() ) ) {
                        $element.addClass( 'td-read-more-fixed' );
                        $tdDetail.addClass( 'td-detail-hidden' );
                    } else {
                        $element.removeClass( 'td-read-more-fixed' );
                        $tdDetail.removeClass( 'td-detail-hidden' );
                    }
                });
            });


            // window resize
            jQuery( window).resize(function(event) {
                tdPresentation.computeResize();

            });
        },

        computeResize: function() {
            jQuery( '.td-detail .td-container').each(function(index, element) {

                (function(){
                    var $element = jQuery(element);

                    if ($element.parent().hasClass('td-demo-content-wrap')) {
                        return;
                    }

                    if ( $element.hasClass( 'hidden' ) ) {

                        var elementTransition = $element.css( 'transition' );

                        $element.css({
                            'height': 'auto',
                            'transition': ''
                        });

                        $element.removeClass( 'hidden' );

                        $element.css({
                            'height': $element.height(),
                            'transition': elementTransition
                        });

                        $element.addClass( 'hidden' );

                    } else {


                        // Important! The css 'transition' must be detached and reattached because of iPod safari

                        var elementTimeout = $element.data( 'element_timeout' );
                        elementTransition = $element.data( 'element_transition' );

                        if ( 'undefined' === typeof elementTimeout ) {
                            elementTransition = $element.css( 'transition' );
                            $element.data( 'element_transition', elementTransition );
                        } else {
                            clearTimeout( elementTimeout );
                        }

                        $element.css({
                            'height': 'auto',
                            'transition': ''
                        });

                        $element.css({
                            'height': $element.height()
                        });

                        //console.log( '1 : ' + elementTransition);

                        elementTimeout = setTimeout(function(){
                            var elementTransition = $element.data( 'element_transition' );

                            //console.log( '2 : ' + elementTransition);
                            $element.css({
                                'transition': elementTransition
                            });

                        }, 100);

                        $element.data( 'element_timeout', elementTimeout );




                        // Important! Close button must be repositioned

                        setTimeout(function() {
                            jQuery( window).trigger( 'scroll' );
                        }, 500);
                    }
                })();
            });
        }

    };

})( jQuery );
