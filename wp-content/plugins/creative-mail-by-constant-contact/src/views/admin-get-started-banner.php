<script>
function hideAdminGetStartedBanner () {
    document.querySelector('.notice-ce4wp-getting-started').hidden = true;
    fetch('', { method: 'POST' })
}
</script>

<style>.notice-ce4wp-getting-started {
    padding: 1em 3em 1.5em 2em;
    display: flex;
    position: relative;
    overflow: hidden;
}

.notice-ce4wp-getting-started .content {
    flex: 1;
}

.notice-ce4wp-getting-started .content p {
    margin-top: 0;
}

.notice-ce4wp-getting-started img {
    margin: -1em 0 -3em;
    align-self: flex-start;
}

.notice-ce4wp-getting-started #close {
    position: absolute;
    top: .25em;
    right: .25em;
    font-size: 2em;
    user-select: none;
    cursor: pointer;
    color: rgba(0, 0, 0, .5);
}

.notice-ce4wp-getting-started[hidden] {
    display: none !important;
}</style>


<div class="notice notice-warning notice-ce4wp-getting-started">
    <section class="content">
        <h1>
            <strong></strong>
</h1></section>
</div>