<!-- used to validate the theme settings reset input value -->
<script type="text/javascript">
    function tdValidateReset() {
        var resetInputField = document.forms["td_panel_reset_settings"]["td_unregistered[tds_reset_theme_options]"];

        if (resetInputField.value != "reset") {
            alert('Please make sure you wrote "reset" on the input field.');

            // clear field value
            resetInputField.value = '';
            return false;
        }
        return true;
    }
</script>

<div class="td_displaying_saving"></div>
<div class="td_wrapper_saving_gifs">
    <img class="td_displaying_saving_gif">
</div>