/**
 * Universal JS for whole site
 */
var isTouch = window.DocumentTouch && document instanceof DocumentTouch;

jQuery(document).ready(function ($) {
    // say hello
    console.log('%cHello, Want to hire me? Go to: http://realhe.ro', 'color: Red');

    /**
     * Anti spam
     * <span class="at">address[at]domain.com></span> will be replaced with <a href="mailto:address@domain.com">address@domain.com</span>
     */
    var r = 'at';

    $('.' + r).each(function () {
        var $this = $(this),
            value = new String($this.text());

        value = value.replace('[' + r + ']', '@');

        $this.replaceWith($('<a></a>').text(value).attr('href', 'mailto:' + value));
    });

    /**
     * Automatic WOW delay
     */
    $('.wow-auto-delay').each(function () {
        var $elms = $(this).find('.wow'),
            step = 0.25;

        $elms.each(function (index) {
            var delay = (index + 1) * step;

            $(this).attr('data-wow-delay', delay + 's');
        });
    });

    /**
     * Cookie consent support
     */
    var $cookieConsent = $('#cookies-consent');

    // determine state of consent
    if (Cookies.get('consent') !== undefined) {
        $cookieConsent.hide();
    } else {
        $cookieConsent
            .find('a.btn-ok')
            .click(function (e) {
                e.preventDefault();

                console.log('INFO: Hiding cookie consent.');

                Cookies.set('consent', 'true', { expires: 365 });

                $cookieConsent
                    .one('transitionend webkitTransitionEnd oTransitionEnd', function (e) {
                        if (e.target.id == 'cookies-consent') {
                            $cookieConsent.remove();
                        }
                    })
                    .css('bottom', '-' + $cookieConsent.outerHeight() + 'px');
            });
    }
});

$(window).on('load', function () {
    $('#preloader').delay(500).fadeOut(1000, function () {
        $('body').addClass('ready');
    });
});