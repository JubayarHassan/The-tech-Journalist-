jQuery(document).ready(function () {
    fifu_open_quick_lightbox();
});

function fifu_open_quick_lightbox() {
    jQuery("div.fifu-quick").on('click', function (evt) {
        evt.stopImmediatePropagation();
        post_id = jQuery(this).attr('post-id');
        image_url = jQuery(this).attr('image-url');
        is_ctgr = jQuery(this).attr('is-ctgr');
        url = image_url;
        url = (url == 'about:invalid' ? '' : url);
        media = `<img id="fifu-quick-preview" src="${url}" post-id="${post_id}" style="max-height:600px; width:100%;">`;
        box = `
            <table>
                <tr>
                    <td id="fifu-left-column" style="min-width:170px; background-color:#f6f7f7">${media}</td>
                    <td style="vertical-align:top; padding: 10px; background-color:#f6f7f7">
                        <div class="fifu-pro"><div class="fifu-pro-out"><a class="fifu-pro-link" href="https://fifu.app/" target="_blank" title="Unlock all features"><h4 class="fifu-pro-text"><span class="dashicons dashicons-lock fifu-pro-icon"></span>PRO</h4></a></div></div>
                        <div>
                            <div style="padding-bottom:5px">
                                <span class="dashicons dashicons-camera" style="font-size:20px;cursor:auto;" title="${fifuColumnVars.tipImage}"></span>
                                <b>${fifuColumnVars.labelImage}</b>
                            </div>
                            <input id="fifu-quick-input-url" type="text" placeholder="${fifuColumnVars.urlImage}" value="${url}"/>
                            <br><br>

                            <div style="padding-bottom:5px">
                                <span class="dashicons dashicons-video-alt3" style="font-size:20px;cursor:auto;" title="${fifuColumnVars.tipVideo}"></span>
                                <b>${fifuColumnVars.labelVideo}</b>
                            </div>
                            <input id="fifu-quick-video-input-url" type="text" placeholder="${fifuColumnVars.urlVideo}" value=""/>
                            <br><br>

                            <div style="padding-bottom:5px">
                                <span class="dashicons dashicons-search" style="font-size:20px;cursor:auto" title="${fifuColumnVars.tipSearch}"></span>
                                <b>${fifuColumnVars.labelSearch}</b>
                            </div>
                            <div>
                                <input id="fifu-quick-search-input-keywords" type="text" placeholder="${fifuColumnVars.keywords}" value="" style="width:170px"/>
                                <button id="fifu-search-button" class="fifu-quick-button" type="button" style="width:50px;border-radius:5px;height:30px;position:absolute;background-color:#3c434a"><span class="dashicons dashicons-search" style="font-size:16px;cursor:auto"></span></button>
                            </div>
                            <br><br>
                        </div>
                        <div style="width:100%">
                            <button id="fifu-clean-button" class="fifu-quick-button" type="button" style="background-color: #e7e7e7; color: black;">Clean</button>
                            <button id="fifu-save-button" post-id="${post_id}" is-ctgr="${is_ctgr}" class="fifu-quick-button" type="button">Save</button>
                        </div>
                    </td>
                </tr>
            </table>
        `;
        jQuery.fancybox.open(box);
        jQuery('#fifu-left-column').css('display', url ? 'table-cell' : 'none');
        jQuery('#fifu-quick-input-url').select();
        fifu_keypress_event();
    });
}

function fifu_keypress_event() {
    jQuery('div.fancybox-container.fancybox-is-open').keyup(function (e) {
        switch (e.which) {
            case 27:
                // esc
                jQuery.fancybox.close();
                break;
            default:
                break;
        }
    });
}
