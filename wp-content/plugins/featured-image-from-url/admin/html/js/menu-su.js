var restUrl = fifu_get_rest_url();

function message(data, box) {
    selector = "#" + box + "_response_message";
    jQuery(selector).css('background-color', data['color']);
    jQuery(selector).css('border-radius', '3px');
    jQuery(selector).css('padding', '6px');
    jQuery(selector).css('color', 'white');
    jQuery(selector).css('font-size', '15px');
    jQuery(selector).val(data['message']);
    jQuery(selector).show();
}

function fifu_block() {
    jQuery('#tabs-top').block({message: '', css: {backgroundColor: 'none', border: 'none', color: 'white'}});
    jQuery('button').attr('disabled', 'true');
}

function fifu_unblock() {
    jQuery('#tabs-top').unblock();
    jQuery('button').removeAttr('disabled');
}
