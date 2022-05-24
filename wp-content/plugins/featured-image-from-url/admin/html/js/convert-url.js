function fifu_convert($url) {
    if (fifu_from_google_drive($url))
        return fifu_google_drive_url($url);

    return $url;
}

//Google Drive

function fifu_from_google_drive($url) {
    return $url.includes('drive.google.com');
}

function fifu_google_drive_id($url) {
    return $url.match(/[-\w]{25,}/);
}

function fifu_google_drive_url($url) {
    return 'https://drive.google.com/uc?id=' + fifu_google_drive_id($url);
}
