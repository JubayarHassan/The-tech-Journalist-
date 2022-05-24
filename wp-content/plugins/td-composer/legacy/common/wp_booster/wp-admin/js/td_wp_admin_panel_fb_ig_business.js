/* global jQuery:false, window, document, td_ajax_url, get_param_by_name, panel_navigate, tdConfirm, tb_remove */

jQuery(document).ready(function($) {
    var access_token = get_param_by_name('access_tk');
    var expires_in = get_param_by_name('expires_in');
    var user_id = get_param_by_name('user_id');

    function tdFbBusinessAfterSaveAccountUpdate(savedAccountData) {

        /*
        // test data
        var savedAccountData = {
            account_type: "business",
            fb_account_pages_data: [
                {
                    id: "253489681683688",
                    followers_count: 609,
                    instagram_business_account: {
                        followers: 75,
                        id: "17841403369848073",
                        media_count: 72,
                        name: "WPion",
                        profile_picture: "https://scontent.fotp3-2.fna.fbcdn.net/v/t51.2885-15/13715124_590400144466522_1751106519_a.jpg?_nc_cat=109&ccb=1-3&_nc_sid=86c713&_nc_ohc=lnE_Jkqez1kAX80RdIQ&_nc_ht=scontent.fotp3-2.fna&oh=4c1efaa433a386f6be0bc2fb2fc948d7&oe=60A71C83",
                        username: "wpionreview",
                        expires_in: "<span style=\"color: #0a9e01;\">expires in 89 days</span>",
                    },
                    likes: 588,
                    name: "WPion",
                    page_access_token: "EAAC0twN8wjQBAHqjsZC7AJANsEnWSZAL0BpAVBktQQ7RauqVi26Qn1yaahK4NsLZCATmY81cvDZCBqmv1IrdToxK6sKETdZATIxDO3lIOov9OucOZAUym031OQqggfu0rkZBeunecJVybH5LrB9RVcQNuo0eYot0oQNlOZAbLcmxYmhbwPNZCFceZAd30rJeCuMW0ZD",
                    username: "WPionReview"
                },
                {
                    id: "284924131624784",
                    followers_count: 23779,
                    // instagram_business_account: {
                    //     followers: 3073,
                    //     id: "17841400550719581",
                    //     media_count: 508,
                    //     name: "tagDiv",
                    //     profile_picture: "https://scontent.fotp3-1.fna.fbcdn.net/v/t51.2885-15/17881595_1900855133531349_5882882560064749568_a.jpg?_nc_cat=111&ccb=1-3&_nc_sid=86c713&_nc_ohc=t0rKppSHcbUAX-PHr1H&_nc_ht=scontent.fotp3-1.fna&oh=5a5965fcc5b3c336872806b3d21f1c42&oe=60A6C4CB",
                    //     username: "tagdiv",
                    //     expires_in: "<span style=\"color: #0a9e01;\">expires in 89 days</span>",
                    // },
                    instagram_business_account: {
                        error: 'Instagram business account error: blbal bla bla lba bla !!'
                    },
                    likes: 21843,
                    name: "TagDiv",
                    page_access_token: "EAAC0twN8wjQBALb4lRuRRRyDMh2g2QL6WLya8sOV0xpKkwB2yogFDBwIn535ZCZCisDIjtCGxJGDfaZClwfsVXbDjlWAGoVVpZAz7EUCK3Oweg9I0BfIwIzDGUjtSHg9gVIZAMuEUPrtOsiwbSI7tmUgTMm1nK8psiCFMd7XyIrq8YzW2QFvICiOh7qdaly0ZD",
                    username: "TagDiv"
                },
                {
                    id: "123456789",
                    followers_count: 7777,
                    // instagram_business_account: {
                    //     followers: 777,
                    //     id: "12345678900000",
                    //     media_count: 77,
                    //     name: "iFlowApp",
                    //     profile_picture: "https://scontent.fotp3-3.fna.fbcdn.net/v/t51.2885-15/84158688_207223920341987_1058682809666764800_n.jpg?_nc_cat=108&ccb=1-3&_nc_sid=86c713&_nc_ohc=cbMQ1Kqi3gQAX-7eAPZ&_nc_ht=scontent.fotp3-3.fna&oh=df7b2c8f08d69dca95d8a95ef74df788&oe=60A698BF",
                    //     username: "iflow",
                    //     expires_in: "<span style=\"color: #0a9e01;\">expires in 89 days</span>",
                    // },
                    likes: 21843,
                    name: "iiFFloww",
                    page_access_token: "EAAC0twN8wjQBADD3jHATvf4qUJCTZATOfh8TZCQBQKhp6sGpTBkNR95XZCOZCab6mNqo8eXrVJSQmUmM9NU6z9ZBy4rPd2pffbgu9HZB6a7mgPMS1YhIsB1ZCF8enfSxOLnHNCV8VscbLZC69JPiRj5qBnkmYZAo7FPWvcribLc1FzcEYgubJ4nl748CIAa50SosZD",
                    username: "iflowapp"
                },
            ],
            fb_login_access_token: "EAAC0twN8wjQBANJ5r8hfG1WXNLoTEfYSNmdFZAZCX1EHSvhyidcreQWTnwC0xXmKMxtb5yTnDZCvCuqFgOlmVRf52wu4jY9zASHHaNnaQb598nY97O5WAg11dKhIZAZBZAXIZAZAsUxqExcoRo3J6K21Vl2FC3eA0mSWLCZBjU0EgFHrdp94caJmXEBWFfruwZCKgZD",
            fb_login_access_token_expires_in: "<span style=\"color: #0a9e01;\">expires in 89 days</span>",
            fb_login_access_token_expires_in_ts: 1626766169
        };*/

        /* process fb account(user) data */
        if ( savedAccountData.fb_account_user !== undefined ) {
            $('.td-no-fb-account-message').hide();
            var fb_account_user_box_control = $('.td-box-control-fb-account-user');

            fb_account_user_box_control.empty(); // empty fb account user box control
            fb_account_user_box_control.append(
                '<div class="td-box-description">\n' +
                    '<span class="td-box-title">Facebook Account</span>\n' +
                    '<p>This is your connected facebook account.</p>\n' +
                '</div>\n' +
                '<div class="about-wrap">\n' +
                    '<div class="td-fb-user-wrap">\n' +
                        '<div class="td-fb-account-user-photo"><img src="' + savedAccountData.fb_account_user.profile_picture + '" alt="" /></div>\n' +
                        '<div class="td-fb-account-user-name">' + savedAccountData.fb_account_user.name + '</div>\n' +
                        '<div class="td-access-token-trigger">\n' +
                            '<div class="td-classic-check">\n' +
                                '<input type="checkbox" id="show_tokens_fb_login" name="" value="">\n' +
                                '<label for="show_tokens_fb_login" class="td-check-wrap">\n' +
                                    '<span class="td-check"></span><span class="td-check-title">Show FB Login Access Token</span>\n' +
                                '</label>\n' +
                            '</div>\n' +
                        '</div>\n' +
                        '<div class="td-fb-account-remove">\n' +
                            '<a class="button button-secondary td-fb-remove-account" href="#">Remove Connected FB Account</a>\n' +
                        '</div>\n' +
                    '</div>\n' +
                    '<div class="td-access-token">\n' +
                        '<div class="td-access-token-inner">\n' +
                            '<div>\n' +
                                '<div class="td-access-token-info">Facebook Login Access Token</div>\n' +
                                '<div class="td-access-token-code">' + savedAccountData.fb_login_access_token + '</div>\n' +
                                '<div class="td-access-token-expires-in">' + savedAccountData.fb_login_access_token_expires_in + '</div>\n' +
                            '<div>\n' +
                        '<div>\n' +
                    '<div>\n' +
                '</div>\n'
            );

        }

        if ( savedAccountData.fb_account_pages_data !== undefined && Array.isArray(savedAccountData.fb_account_pages_data) ) {

            $('.td-no-ig-business-accounts-message').hide();
            var ig_business_accounts_box_control = $('.td-box-control-ig-business-accounts');
            var fb_account_pages_box_control = $('.td-box-control-fb-account-pages');

            // add description
            if ( savedAccountData.fb_account_pages_data.length ) {
                ig_business_accounts_box_control.empty(); // empty ig business accounts box control
                fb_account_pages_box_control.empty(); // empty fb account pages box control
                fb_account_pages_box_control.append(
                    '<div class="td-box-description">\n' +
                        '<span class="td-box-title">Pages</span>\n' +
                        '<p>These are the business pages managed trough your facebook account.</p>\n' +
                    '</div>\n'
                );
            }

            savedAccountData.fb_account_pages_data.forEach( function (fb_account_page_data) {

                /* process fb page data */
                fb_account_pages_box_control.append(
                    '<div class="about-wrap">\n' +
                        '<div class="td-fb-page-wrap td-fb-page td-fb-page-id-' + fb_account_page_data.id + '">\n' +
                            '<div class="td-fb-page-img"><img src="' + fb_account_page_data.profile_picture + '" alt="" /></div>\n' +
                            '<div class="td-fb-page-name">' + fb_account_page_data.name + '</div>\n' +
                            '<div class="td-fb-page-expires"></div>\n' +
                            '<div class="td-fb-page-followers-count">Followers: ' + fb_account_page_data.followers_count + '</div>\n' +
                            '<div class="td-fb-page-likes-count">Likes: ' + fb_account_page_data.likes + '</div>\n' +
                            '<div class="td-access-token-trigger">\n' +
                                '<div class="td-classic-check">\n' +
                                    '<input type="checkbox" id="show_tokens_' + fb_account_page_data.id + '" name="" value="">\n' +
                                    '<label for="show_tokens_' + fb_account_page_data.id + '" class="td-check-wrap">\n' +
                                        '<span class="td-check"></span><span class="td-check-title">Show Access Tokens</span>\n' +
                                    '</label>\n' +
                                '</div>\n' +
                            '</div>\n' +
                            '<div class="td-fb-page-remove">\n' +
                                '<a class="button button-secondary td-remove-fb-page" href="#" data-id="' + fb_account_page_data.id + '" data-username="' + fb_account_page_data.username + '">Remove</a>' +
                            '</div>\n' +
                            '<div class="td-access-token">\n' +
                                '<div class="td-access-token-inner">\n' +
                                    //'<div>\n' +
                                        //'<div class="td-access-token-info">Access Token</div>\n' +
                                        //'<div class="td-access-token-code">' + savedAccountData.fb_login_access_token + '</div>\n' +
                                    //'</div>\n' +
                                    '<div>\n' +
                                        '<div class="td-access-token-info">Page Access Token</div>\n' +
                                        '<div class="td-access-token-code">' + fb_account_page_data.page_access_token + '</div>\n' +
                                    '</div>\n' +
                                '</div>\n' +
                            '</div>\n' +
                        '</div>\n' +
                    '</div>'
                );

                /* process instagram account data */
                if( fb_account_page_data.instagram_business_account === undefined ) {
                    ig_business_accounts_box_control.append(
                        '<div class="about-wrap">\n' +
                            '<div class="td-ig-business-account-wrap">\n' +
                                '<p class="td-no-ig-business-page-message">\n' +
                                    'No Instagram Business Account is associated with <strong>' + fb_account_page_data.name + '</strong> page!\n' +
                                '</p>\n' +
                            '</div>\n' +
                        '</div>'
                    );
                } else {
                    var instagram_business_account = fb_account_page_data.instagram_business_account;
                    if( instagram_business_account.error !== undefined ) {
                        ig_business_accounts_box_control.append(
                            '<div class="about-wrap">\n' +
                                '<div class="td-ig-business-account-wrap">\n' +
                                    '<p class="td-ig-business-account-error">' + instagram_business_account.error + '</p>\n' +
                                '</div>\n' +
                            '</div>'
                        );
                    } else {
                        ig_business_accounts_box_control.append(
                            '<div class="about-wrap">\n' +
                                '<div class="td-ig-business-account-wrap td-ig-business-account td-ig-id-' + instagram_business_account.id + '">\n' +
                                    '<div class="td-ig-business-account-photo"><img src="' + instagram_business_account.profile_picture + '" alt="" /></div>\n' +
                                    '<div class="td-ig-business-account-user">' + instagram_business_account.name + '</div>\n' +
                                    '<div class="td-ig-business-account-expires"></div>\n' +
                                    '<div class="td-ig-business-account-followers-count">Followers: ' + instagram_business_account.followers + '</div>\n' +
                                    '<div class="td-ig-business-account-media-count">Media: ' + instagram_business_account.media_count + '</div>\n' +
                                    '<div class="td-access-token-trigger">\n' +
                                        '<div class="td-classic-check">\n' +
                                            '<input type="checkbox" id="show_tokens_' + instagram_business_account.name + '" name="" value="">\n' +
                                            '<label for="show_tokens_' + instagram_business_account.name + '" class="td-check-wrap">\n' +
                                                '<span class="td-check"></span><span class="td-check-title">Show Access Tokens</span>\n' +
                                            '</label>\n' +
                                        '</div>\n' +
                                    '</div>\n' +
                                    '<div class="td-ig-business-account-remove">\n' +
                                        '<a class="button button-secondary td-remove-ig-business-account" href="#" data-id="' + instagram_business_account.id + '" data-username="' + instagram_business_account.username + '">Remove</a>' +
                                    '</div>\n' +
                                    '<div class="td-access-token">\n' +
                                        '<div class="td-access-token-inner">\n' +
                                            //'<div>\n' +
                                                //'<div class="td-access-token-info">Access Token</div>\n' +
                                                //'<div class="td-access-token-code">' + savedAccountData.fb_login_access_token + '</div>\n' +
                                            //'</div>\n' +
                                            '<div>\n' +
                                                '<div class="td-access-token-info">Page Access Token</div>\n' +
                                                '<div class="td-access-token-code">' + fb_account_page_data.page_access_token + '</div>\n' +
                                            '</div>\n' +
                                        '</div>\n' +
                                    '</div>\n' +
                                '</div>\n' +
                            '</div>'
                        );
                    }
                }

            });

        }

    }

    function tdFbBusinessSaveAccount(access_token,expires_in) {
        jQuery.ajax({
            url: td_ajax_url,
            type: 'post',
            data: {
                action: 'td_save_fb_account',
                access_token: access_token,
                expires_in: expires_in,
                user_id: user_id
            },
            success: function (data) {
                var reply = JSON.parse(data);
                if ( reply.status.includes('success') ) {
                    console.log( '%c' + reply.status, 'color: #008000c2');
                    console.group('saved fb account data');
                    console.log(reply.fb_account_data);
                    console.groupEnd();
                    $('.td-fb-add-account').text('Reconnect FB Account');
                    $('.fb-account-user-sep').show();
                    tdFbBusinessAfterSaveAccountUpdate(reply.fb_account_data);
                }
                if ( reply.status.includes('error') ) {
                    console.log( '%c' + reply.status, 'color: #dc2121c7');
                    //$('.td-no-ig-business-accounts-message').hide();
                    // $('#td-ig-error').append(reply.status.replace("error - ", "")).show();
                    $('.td-no-fb-account-message').hide();
                    $('#td-fb-error').append(reply.status.replace("error - ", "")).show();
                }
                if ( reply.status.includes('warning') ) {
                    console.log( '%c' + reply.status, 'color: #f48024e8');
                }
            },
            error: function (jqXHR,textStatus,errorThrown ) {
                console.log( '%c' + errorThrown, 'color: #dc2121c7');
            }
        });
    }

    function tdFbRemoveInstagramBusinessAccount(id,username) {
        jQuery.ajax({
            url: td_ajax_url,
            type: 'post',
            data: {
                action: 'td_remove_ig_account',
                account_id: id,
                account_username: username
            },
            success: function (data) {
                var reply = JSON.parse(data);

                if ( reply.status.includes('success') ) {
                    console.log( '%c' + reply.status, 'color: #008000c2');
                    //$('.td_panel_box_instagram_business .debug-pre').remove();
                    //$('.td-fb-add-account .td-account-error').remove();
                    $('.td-box-control-ig-business-accounts').find( '.td-ig-id-' + id ).remove();
                }

                if ( reply.status.includes('error') ) {
                    console.log( '%c' + reply.status, 'color: #dc2121c7');
                    $('#td-ig-error').append(reply.status).show();
                }

                if ( reply.status.includes('warning') ) {
                    console.log( '%c' + reply.status, 'color: #f48024e8');
                }

                console.log( '%c' + reply.ig_acc_images_remove_status, 'color: #4DB1EC');

            },
            error: function (jqXHR,textStatus,errorThrown ) {
                console.log( '%c' + errorThrown, 'color: #dc2121c7');
            }
        });
    }

    function tdFbRemoveFbPage(id,username) {
        jQuery.ajax({
            url: td_ajax_url,
            type: 'post',
            data: {
                action: 'td_remove_fb_page',
                account_id: id,
                account_username: username
            },
            success: function (data) {
                var reply = JSON.parse(data);

                if ( reply.status.includes('success') ) {
                    console.log( '%c' + reply.status, 'color: #008000c2');
                    //$('.td_panel_box_instagram_business_account .debug-pre').remove();
                    //$('.td-fb-add-account .td-account-error').remove();
                    $('.td-box-control-fb-account-pages').find( '.td-fb-page-id-' + id ).remove();
                }

                if ( reply.status.includes('error') ) {
                    console.log( '%c' + reply.status, 'color: #dc2121c7');
                    $('#td-fb-error').append( '<div>' + reply.status + '</div>' ).show();
                }

                if ( reply.status.includes('warning') ) {
                    console.log( '%c' + reply.status, 'color: #f48024e8');
                }

                console.log( '%c' + reply.fb_page_profile_image_remove_status, 'color: #4DB1EC');

            },
            error: function (jqXHR,textStatus,errorThrown ) {
                console.log( '%c' + errorThrown, 'color: #dc2121c7');
            }
        });
    }

    // if we have the access token set in url..
    // we will go further and generate & save the fb & ig business account data based on the permission given trough facebook login process
    if ( access_token.length > 40 ) {

        // navigate to the social networks section in theme panel
        panel_navigate('td-panel-social-networks');

        // process and save account data
        tdFbBusinessSaveAccount( access_token, expires_in, user_id );

        // remove url query params (access_token, expires_in .. etc. )
        var clean_uri = window.location.protocol + "//" + window.location.host + window.location.pathname + '?page=td_theme_panel';
        window.history.replaceState({}, document.title, clean_uri );

    }

    $(document).on('click', '.td-fb-add-account' , function(event) {
        var $this = $(this);

        if ( $this.hasClass('disabled') ) {
            event.preventDefault();

            if ( $this.siblings( ".td-account-error" ).length < 1 ) {
                $this.after('<div class="td-account-error" style="color: orangered; font-size: 12px; font-style: italic;">You already have a connected account. To connect to another, please remove the current one.</div>');
            }

        }
    });

    $(document).on('click', '.td-remove-ig-business-account' , function(event) {
        event.preventDefault();

        var $this = $(this);
        var account_id = $this.data('id');
        var account_username = $this.data('username');

        tdFbRemoveInstagramBusinessAccount(account_id,account_username);
    });

    $(document).on('click', '.td-remove-fb-page' , function(event) {
        event.preventDefault();

        var $this = $(this);
        var account_id = $this.data('id');
        var account_username = $this.data('username');

        tdFbRemoveFbPage(account_id,account_username);
    });

    $(document).on('click', '.td-fb-remove-account' , function(event) {
        event.preventDefault();

        // remove connected fb account modal confirmation
        tdConfirm.showModal( 'Remove Connected Facebook Account',
            window,
            function() {
                jQuery.ajax({
                    url: td_ajax_url,
                    type: 'post',
                    data: {
                        action: 'td_remove_fb_account'
                    },
                    success: function (data) {
                        var reply = JSON.parse(data);
                        if ( reply.status.includes('success') ) {
                            console.log( '%c' + reply.status, 'color: #008000c2');
                            $('.td-box-control-fb-account-pages').html('<p class="td-no-fb-account-message"><strong>No fb account connected!</strong></p>');
                            $('.td-box-control-fb-account-user').find('.td-box-description, .about-wrap').remove();
                            $('.fb-account-user-sep').hide();
                            $('.td-fb-add-account').text('Connect FB Account');
                        }
                        if ( reply.status.includes('error') ) {
                            console.log( '%c' + reply.status, 'color: #dc2121c7');
                            $('#td-fb-error').append( '<div>' + reply.status + '</div>' ).show();
                        }
                        if ( reply.status.includes('warning') ) {
                            console.log( '%c' + reply.status, 'color: #f48024e8');
                        }
                        console.log( '%c' + reply.fb_profile_images_remove_status, 'color: #4DB1EC');
                    },
                    error: function (jqXHR,textStatus,errorThrown ) {
                        console.log( '%c' + errorThrown, 'color: #dc2121c7');
                    }
                });
                tb_remove();
            },
            [],
            'Are you sure you want to remove this facebook account?<br>' +
            'This action will also remove all pages managed through your facebook account.<br><br>'
        );

    });

    $(document).on('click', '.td-ig-business-remove-all' , function(event) {
        event.preventDefault();

        // remove connected fb account modal confirmation
        tdConfirm.showModal( 'Remove All Connected Business Accounts',
            window,
            function() {
                jQuery.ajax({
                    url: td_ajax_url,
                    type: 'post',
                    data: {
                        action: 'td_ig_remove_all'
                    },
                    success: function (data) {
                        var reply = JSON.parse(data);
                        if ( reply.status.includes('success') ) {
                            console.log( '%c' + reply.status, 'color: #008000c2');
                            $('.td-box-control-ig-business-accounts').html('<p class="td-no-ig-business-accounts-message"><strong>No ig business accounts connected!</strong></p>');
                            $('.td-ig-business-remove-all').remove();
                            $('.ig-business-accounts-sep').hide();
                        }
                        if ( reply.status.includes('error') ) {
                            console.log( '%c' + reply.status, 'color: #dc2121c7');
                            $('#td-fb-error').append( '<div>' + reply.status + '</div>' ).show();
                        }
                        if ( reply.status.includes('warning') ) {
                            console.log( '%c' + reply.status, 'color: #f48024e8');
                        }
                        console.log( '%c' + reply.fb_profile_images_remove_status, 'color: #4DB1EC');
                    },
                    error: function (jqXHR,textStatus,errorThrown ) {
                        console.log( '%c' + errorThrown, 'color: #dc2121c7');
                    }
                });
                tb_remove();
            },
            [],
            'Are you sure you want to remove all connected business accounts?'
        );

    });

    $(document).on('click', '.td-access-token-trigger .td-check-wrap', function(){

        var $this = jQuery(this),
            token = $this.parents('.about-wrap').find('.td-access-token');

        if ( $this.parents('.td-classic-check').hasClass('active') ) { // we are deactivating
            $this.parents('.td-classic-check').removeClass('active');
            token.hide();
        } else { // we are activating
            $this.parents('.td-classic-check').addClass('active');
            token.show();
        }

    });

});