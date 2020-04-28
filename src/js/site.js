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
            dataDelayStep = $(this).attr('data-delay-step'),
            dataOffset = $(this).attr('data-offset'),
            step = 0.25,
            offset = 0;

        // Change defaults if provided
        if (typeof dataDelayStep != 'undefined') {
            step = parseFloat(dataDelayStep);
        }
        console.log('INFO: Current auto step: ' + step);

        if (typeof dataOffset != 'undefined') {
            offset = parseFloat(dataOffset);
        }
        console.log('INFO: Current offset: ' + offset);

        $elms.each(function (index) {
            var delay = (index + 1) * step;

            $(this).attr('data-wow-delay', delay + 's');
            $(this).attr('data-wow-offset', offset);
        });
    });

    /**
     * Init WOW.js
     */
    new WOW().init();

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

    // Smooth scroll
    $('.plugin-smooth-scroll a').click(function (e) {
        var href = $(this).attr('href');
        var type = href.substring(0, 1); 

        if(type !== '#') {
            return true;
        }

        e.preventDefault();

        var start_y = $(href).offset().top;
        /* var header_offset = 0;
        window.scroll({ top: start_y - header_offset, left: 0, behavior: 'smooth' }); */

        $('html, body').animate({
            scrollTop: start_y - 48
        }, 1000);

        return false;
    });

    /**
     * Collapse menu on click
     * 
     */
    var navMain = $(".navbar-collapse"); // avoid dependency on #id

    navMain.find('a').click(function () {
        console.log('Click');
        navMain.collapse('hide');
    });


});

$(window).on('load', function () {
    $('#preloader').delay(1000).fadeOut(1000, function () {
        $('body').addClass('ready');
    });
});