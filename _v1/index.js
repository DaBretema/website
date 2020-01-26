// ----------------------- //
// Daniel Camba Lamas
// <cambalamas@gmail.com>
// ----------------------- //

// HELPERS

/**
 * Check the current scroll position using 'window' or 'document' as fallback.
 */
function currScrollPos() {
    return window.pageYOffset || document.documentElement.scrollTop;
}

/**
 * Gived a html string generate html nodes
 */
function str2html(html) {
    var template = document.createElement('template');
    template.innerHTML = html;
    return template.content.childNodes;
}

/**
 * Pop a message box with a gived text and color
 */
function msgAlert(text, color, hide = true) {
    $('#msgAlert').stop()
    $('#msgAlert').css('background-color', color)
    $('#msgAlert').fadeTo(250, 1);
    $('#msgAlert').text(text);
    if (hide) {
        $('#msgAlert').fadeOut(7500);
    }
}

// BROWSER HACKS

/**
 * Use regex over userAgent to check if the browser is Chrome based.
 */
function isChrome() {
    return /chrom(e|ium)/.test(navigator.userAgent.toLowerCase());
}

/**
 * Link buttons with sections with animation
 * and update url hash using 'pushState'.
 *
 * Smooth scroll only works on Chrome by default and jQuery bugs its behaviour
 * in Chrome but allow the effect in the rest of browsers.
 */
function smoothScrollButton(buttonID, sectionID) {
    if (!isChrome()) {
        $(`[id*=${buttonID}]`).each((_, e) => {
            $(e).click(() => {
                $('html,body').animate({
                    scrollTop: $(sectionID).offset().top
                }, 'slow');
                window.history.pushState({}, "", sectionID);
            });
        });
    } else {
        $(`[id*=${buttonID}]`).each((_, e) => {
            $(e).attr("href", sectionID);
        });
    }
}


// SCROLL EVENTS

/**
 * Set a fadeIn or fadeOut based on current scroll position.
 */
function setFade(scrollPosToHide, selector) {
    const time = 200;

    (currScrollPos() > scrollPosToHide)
        ? $(selector).fadeIn(time)
        : $(selector).fadeOut(time);
}

/**
 * Append section id to the end of url, allowing to share specific section.
 */
function setSectionToURL() {

    const limit = currScrollPos() + 30;
    const sections = ['#top', '#about', '#portfolio', '#contact', '#footer'];

    for (const se of sections) {
        if ((se !== window.location.hash) &&
            $(se).offset().top < limit &&
            $(se).offset().top + $(se).height() > limit) {
            window.history.pushState({}, "", se);
        }
    }
}


// DOM MANIPULATION

/**
 * Load imgs when is needed, not before.
 */
function lazyLoadImgs() {
    yall();
}

/**
 * For each 'video-container' tag generates desired html from tag's attributes
 */
function populatePortfolio() {
    $('video-container').each((_, e) => {

        const img = $(e).attr("img") || "";
        const ytID = $(e).attr("ytID") || "";
        const slides = $(e).attr("slides") || "";
        const gitRepo = $(e).attr("gitRepo") || "";
        const vidTitle = $(e).attr("vidTitle") || "";
        const vidDesc = $(e).attr("vidDesc") || "";
        $(e).removeAttr("ytQ ytID slides gitRepo vidTitle vidDesc");


        // Main elements
        let mainDiv = $("<div>").addClass("video-description");
        let iconSection = $("<section>").addClass("video-links");

        // Youtube link and icon
        if (ytID && ytID !== "") {
            $(iconSection).append($("<a>")
                .attr("href", `https://www.youtube.com/watch?v=${ytID}`)
                .attr("target", "_blank").append($('<i>').addClass('icon-youtube-play'))
            );
        }

        // Git link and icon
        if (gitRepo && gitRepo !== "") {
            $(iconSection).append($("<a>")
                .attr("href", `${gitRepo}`)
                .attr("target", "_blank").append($('<i>').addClass('icon-github-circled'))
            );
        }

        // Slides link and icon
        if (slides && slides !== "") {
            $(iconSection).append($("<a>")
                .attr("href", `${slides}`)
                .attr("target", "_blank").append($('<i>').addClass('icon-doc-text-inv'))
            );
        }

        // If exists 'git', 'youtube' or 'slides' links append icons section
        if ((ytID && ytID !== "") || (gitRepo && gitRepo !== "") || (slides && slides !== "")) {
            $(mainDiv).append(iconSection);
        }

        // Append thumb title and description
        $(mainDiv)
            .append($("<h3>")
                .addClass("video-description-title")
                .text(vidTitle)
            )
            .append($("<p>")
                .addClass("video-description-content")
                .text(vidDesc)
            );

        // Complete portfolio div
        $(e)
            .addClass("video neu-card")
            .append($("<img>")
                .addClass("lazy")
                .addClass("video-thumb")
                .attr('alt', vidTitle)
                .attr('src', '/assets/img/thumbnail/placeholder.jpg')
                .attr('data-src', ((img && img !== "") ? img : `https://img.youtube.com/vi/${ytID}/0.jpg`))
            )
            .append(mainDiv);
    });
}


// F-BACKEND

/**
 * Send an email using SmtpJS with your configured SMTP server
 */
function sendMail() {

    let fromName = $('#contact_fullname').val();
    let from = $('#contact_email').val();
    let subject = $('#contact_subject').val();
    let body = $('#contact_body').val();

    if (fromName === '' || from === '' || subject === '' || body === '') {
        let emptyInputs = "⚠️ ";
        if (fromName === '') { emptyInputs += 'Full name, '; }
        if (from === '') { emptyInputs += 'Email, '; }
        if (subject === '') { emptyInputs += 'Subject, '; }
        if (body === '') { emptyInputs += 'Message, '; }
        emptyInputs += 'must not be empty.'
        msgAlert(emptyInputs, "#F7A859");
        return;
    }

    let replied = false;
    msgAlert("⏳ Connecting to the server.", "#5E5EBB", false);

    setTimeout(_ => {
        if (!replied) { msgAlert("⌛️ Time out. Sorry, try again later.", "#8E6EDD"); }
    }, 3500);

    Email.send({
        SecureToken: "02c23bcd-40c2-48f9-9453-fd3a6a1a0cfd",
        To: 'hello@cambalamas.com',
        From: from,
        FromName: fromName,
        Subject: subject,
        Body: body
    }).then(status => {
        replied = true;
        if (status === 'OK') {
            msgAlert("✅ Message sent successfully.", "#5EBB5E");
        } else {
            msgAlert("😕 " + status, "#BB5E5E");
        }
    });
}

// PRE-COMPUTED NODES

const personalLinks = str2html(`
        <section>
            <a class="btn-link" href="https://www.instagram.com/cambalamas/" target="_blank">
                <i class="icon-instagram"></i>
            </a>
            <a class="btn-link" href="https://twitter.com/cambalamas" target="_blank">
                <i class="icon-twitter"></i>
            </a>
            <a class="btn-link" href="https://gitlab.com/users/cambalamas/projects" target="_blank">
                <i class="icon-gitlab"></i>
            </a>
            <a class="btn-link" href="https://www.github.com/cambalamas/" target="_blank">
                <i class="icon-github-circled"></i>
            </a>
        </section>

        <section>
            <a class="btn-link" href="https://www.linkedin.com/in/cambalamas/" target="_blank">
                <i class="icon-linkedin"></i>
            </a>
            <a class="btn-link" href="mailto:hello@cambalamas.com?subject=Hi Daniel - Let’s chat about professional opportunities" target="_blank">
                <i class="icon-mail-alt"></i>
            </a>
            <a class="btn-link" href="/assets/docs/Resume_DanielCamba.pdf" target="_blank">
                <i class="icon-doc-text-inv"></i>
            </a>
        </section>
    `);


//
//
//
// ON DOC READY

$(document).ready(() => {

    $('.personal-links').append(personalLinks);

    $('#submitContact').click(sendMail);

    $('#popNav').fadeOut(0);
    let hamburgerOpen = false;
    $('#btnHamburger, .pop-nav-btn').click(_ => {
        if (hamburgerOpen) {
            $('#popNav').fadeOut(100);
        } else {
            $('#popNav').fadeIn(100);
        }
        hamburgerOpen = !hamburgerOpen;
    });

    $(document).click(function (event) {
        $target = $(event.target);
        if (!$target.closest('#btnHamburger, #popNav').length) {
            $('#popNav').fadeOut(200);
            if (hamburgerOpen) { hamburgerOpen = false; }
        }
    });

    const scrollEvents = [
        setSectionToURL,
        _ => setFade(100, '#btnTop'),
        _ => setFade(100, '#btnHamburger'),
        _ => {
            if (currScrollPos() < 100) {
                $('#popNav').fadeOut(200);
                if (hamburgerOpen) { hamburgerOpen = false; }
            }
        },
    ];
    for (const sEv of scrollEvents) { sEv(); }
    for (const sEv of scrollEvents) { $(window).scroll(sEv); }

    smoothScrollButton("btnAbout", "#about");
    smoothScrollButton("btnPortfolio", "#portfolio");
    smoothScrollButton("btnContact", "#contact");
    smoothScrollButton("btnTop", "#top");

    populatePortfolio();

    lazyLoadImgs();
});