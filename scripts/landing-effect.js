jQuery(document).ready(function ($) {
  const animationType = $('body').data('animation');
  let delta = 0;
  let scrollThreshold = 5;
  let actual = 1;
  let animating = false;

  const sectionsAvailable = $('.cd-section');
  const verticalNav = $('.cd-vertical-nav');
  const prevArrow = verticalNav.find('a.cd-prev');
  const nextArrow = verticalNav.find('a.cd-next');

  bindEvents(true);

  $(window).on('resize', function () {
    bindEvents(false);
  });

  function bindEvents(bind = true) {
    if (bind) {
      initHijacking();

      $(window).on('DOMMouseScroll mousewheel', scrollHijacking);

      prevArrow.on('click', prevSection);
      nextArrow.on('click', nextSection);

      $(document).on('keydown', function (event) {
        if (event.which == '40' && !nextArrow.hasClass('inactive')) {
          event.preventDefault();
          nextSection();
        } else if (
          event.which == '38' &&
          (
            !prevArrow.hasClass('inactive')
            || (prevArrow.hasClass('inactive') && $(window).scrollTop() != sectionsAvailable.eq(0).offset().top)
          )
        ) {
          event.preventDefault();
          prevSection();
        }
      });
      //set navigation arrows visibility
      checkNavigation();
    } else {
      //reset and unbind
      resetSectionStyle();
      $(window).off('DOMMouseScroll mousewheel', scrollHijacking);
      prevArrow.off('click', prevSection);
      nextArrow.off('click', nextSection);
      $(document).off('keydown');
    }
  }

  function initHijacking() {
    // initialize section style - scrollhijacking
    let visibleSection = sectionsAvailable.filter('.visible');
    topSection = visibleSection.prevAll('.cd-section');
    bottomSection = visibleSection.nextAll('.cd-section'),
      animationParams = selectAnimation(animationType, false),
      animationVisible = animationParams[0],
      animationTop = animationParams[1],
      animationBottom = animationParams[2];

    visibleSection.children('div').velocity(animationVisible, 1, function () {
      visibleSection.css('opacity', 1);
      topSection.css('opacity', 1);
      bottomSection.css('opacity', 1);
    });
    topSection.children('div').velocity(animationTop, 0);
    bottomSection.children('div').velocity(animationBottom, 0);
  }

  function scrollHijacking(event) {
    if (event.originalEvent.detail < 0 || event.originalEvent.wheelDelta > 0) {
      delta--;
      (Math.abs(delta) >= scrollThreshold) && prevSection();
    } else {
      delta++;
      (delta >= scrollThreshold) && nextSection();
    }
    return false;
  }

  function prevSection(event) {
    //go to previous section
    typeof event !== 'undefined' && event.preventDefault();

    let visibleSection = sectionsAvailable.filter('.visible');
    let middleScroll = false;

    let animationParams = selectAnimation(animationType, middleScroll, 'prev');

    if (!animating && !visibleSection.is(":first-child")) {
      animating = true;
      visibleSection.removeClass('visible').children('div').velocity(animationParams[2], animationParams[3], animationParams[4])
        .end().prev('.cd-section').addClass('visible').children('div').velocity(animationParams[0], animationParams[3], animationParams[4], function () {
          animating = false;
        });

      actual = actual - 1;
    }

    resetScroll();
  }

  function nextSection(event) {
    //go to next section
    typeof event !== 'undefined' && event.preventDefault();

    let visibleSection = sectionsAvailable.filter('.visible');
    let middleScroll = false;

    let animationParams = selectAnimation(animationType, middleScroll, 'next');

    if (!animating && !visibleSection.is(":last-of-type")) {
      animating = true;
      visibleSection.removeClass('visible').children('div').velocity(animationParams[1], animationParams[3], animationParams[4])
        .end().next('.cd-section').addClass('visible').children('div').velocity(animationParams[0], animationParams[3], animationParams[4], function () {
          animating = false;
        });

      actual = actual + 1;
    }
    resetScroll();
  }

  function resetScroll() {
    delta = 0;
    checkNavigation();
  }

  function checkNavigation() {
    // update navigation arrows visibility
    (sectionsAvailable.filter('.visible').is(':first-of-type')) ? prevArrow.addClass('inactive') : prevArrow.removeClass('inactive');
    (sectionsAvailable.filter('.visible').is(':last-of-type')) ? nextArrow.addClass('inactive') : nextArrow.removeClass('inactive');
  }

  function resetSectionStyle() {
    // on mobile - remove style applied with jQuery
    sectionsAvailable.children('div').each(function () {
      $(this).attr('style', '');
    });
  }

  function deviceType() {
    return 'desktop';
  }

  function selectAnimation(animationName, middleScroll, direction) {
    const animationVisible = 'translateNone';
    const animationBottom = 'translateDown';
    const animDuration = 300;
    const animationTop = 'scaleDown';
    const easing = 'easeInCubic';

    return [animationVisible, animationTop, animationBottom, animDuration, easing];
  }

  function setSectionAnimation(sectionOffset, windowHeight, animationName) {
    // select section animation - normal scroll
    let scale = 1;
    let translateY = 100;
    let rotateX = '0deg';
    let opacity = 1;
    let boxShadowBlur = 0;

    if (sectionOffset >= -windowHeight && sectionOffset <= 0) {
      // section entering the viewport
      translateY = (-sectionOffset) * 100 / windowHeight;
      scale = 1;
      opacity = 1;
    } else if (sectionOffset > 0 && sectionOffset <= windowHeight) {
      //section leaving the viewport - still has the '.visible' class
      translateY = (-sectionOffset) * 100 / windowHeight;
      scale = (1 - (sectionOffset * 0.3 / windowHeight)).toFixed(5);
      opacity = (1 - (sectionOffset / windowHeight)).toFixed(5);
      translateY = 0;
      boxShadowBlur = 40 * (sectionOffset / windowHeight);
    } else if (sectionOffset < -windowHeight) {
      //section not yet visible
      translateY = 100;
      scale = 1;
      opacity = 1;
    } else {
      //section not visible anymore
      translateY = -100;
      scale = 0;
      opacity = 0.7;
      translateY = 0;
    }

    return [translateY, scale, rotateX, opacity, boxShadowBlur];
  }
});

$.Velocity.RegisterEffect("translateUp", {
  defaultDuration: 1,
  calls: [
    [{ translateY: '-100%' }, 1],
  ],
});
$.Velocity.RegisterEffect("translateDown", {
  defaultDuration: 1,
  calls: [
    [{ translateY: '100%' }, 1],
  ],
});
$.Velocity.RegisterEffect("translateNone", {
  defaultDuration: 1,
  calls: [
    [{ translateY: '0', opacity: '1', scale: '1', rotateX: '0', boxShadowBlur: '0' }, 1],
  ],
});
$.Velocity.RegisterEffect("scaleDown", {
  defaultDuration: 1,
  calls: [
    [{ opacity: '0', scale: '0.7', boxShadowBlur: '40px' }, 1],
  ],
});
