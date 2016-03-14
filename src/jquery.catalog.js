/*
 *
 *
 *
 * Copyright (c) 2016 Pierre Wang
 * Licensed under the MIT license.
 */
(function ($) {
  var settings = {
    sideBar: true,
    sideBarPos: 'right',
    topBar: true
  };
  $.fn.catalog = function (options) {
    $.extend(settings, options);
    return this.each(function () {
      fn.catalog($(this));
    });
  };
  var fn = {
    catalog: function(content) {
      // catalog body, contains content and side bar
      content.wrap('<div class="catalog_body">');
      // catalog wrapper, contains top bar and catalog_body
      $('.catalog_body').wrap('<div class="catalog_wrapper">');
      fn.topBar(settings.topBar);
      content.addClass('catalog_content');
      fn.sideBar(settings.sideBar);
      fn.registerScrollEvents();
    },
    topBar: function(topEnabled) {
      if (topEnabled) {
        $('.catalog_wrapper').prepend('<div class="catalog_top">');
      }
    },
    sideBar: function(sideEnabled) {
      if (sideEnabled) {
        $('.catalog_body').append('<div class="catalog_side">');
        // side line
        $('.catalog_side').append('<div class="catalog_side_line">');
        $('.catalog_side_line').append('<div class="circle start">').append('<div class="circle end">');
        // side catlog body
        // only support level-1 and level-2 headings
        var list = ['<dl class="catalog_side_body"><br>'];
        $('.catalog_content [heading]').not('[heading] [heading]').each(function() {
          var contentInDt = '<div class="pointer" /><span ><div class="num" /><span class="heading">' + $(this).attr('heading') + '</span></span>';
          list.push('<dt class="level-1">' + contentInDt);
          if ($('[heading]', this).length) {
            list.push('<dl>');
            $('[heading]', this).each(function() {
              list.push('<dt class="level-2">' + contentInDt + '</dt>');
            });
            list.push('</dl>');
          }
          list.push('</dt>');
        });
        list.push('</dl>');
        $('.catalog_side').append(list.join(''));
        fn.registerSideEvents();
      }
    },
    registerSideEvents: function() {
      $('.catalog_side_body dt').hover(function() {
        $('.pointer', this).addClass('hover');
      }, function() {
        $('.pointer', this).removeClass('hover');
      });
      $('.catalog_side_body dt > span').click(function(event) {
        $(window).off('scroll', fn.registerScrollEvents());
        $('.active').removeClass('active');
        var dt = $(this).parent();
        var target;
        if (dt.hasClass('level-2')) {
          // activePointor = dt.parents('dt').find('.pointer');
          var index = dt.parents('dt').index() - 1;// excludes the first <br> in list
          var temp = $('.catalog_content [heading]').not('[heading] [heading]')[index];
          target = $('[heading]', temp)[dt.index()];
        } else {
          // activePointor = $('.pointer', dt);
          var index = dt.index() - 1;// excludes the first <br> in list
          target = $('.catalog_content [heading]').not('[heading] [heading]')[index];
        }
        $('html, body').animate({scrollTop: $(target).offset().top - 2}, 500);
        $(window).on('scroll', fn.registerScrollEvents());
        dt.find('> .pointer').addClass('active');
      });
    },
    registerScrollEvents: function() {
      $(window).scroll(function() {
        // position X: not important; position Y: offset top 50px
        var elem = document.elementFromPoint(300, 2);
        var parentIndex, selfIndex, parent = $(elem).closest('[heading]').parents('[heading]');
        if (parent.length) {
          parentIndex = parent.index();
          selfIndex = $(elem).closest('[heading]').index();
        } else {
          parentIndex = $(elem).closest('[heading]').index();
        }
        $('.active').removeClass('active');
        if (selfIndex) {
          $('.catalog_side_body .level-1').eq(parentIndex).find('dt:eq('+ selfIndex +') .pointer').addClass('active');
        } else {
          $('.catalog_side_body .level-1 > .pointer').eq(parentIndex).addClass('active');
        }
        if($('.active').position().top > 350) {
          //$('.catalog_side_body').scrollTop($('.active').position().top - 200);
        }
        if ($('.active').offset().top - $('.catalog_side_body').offset().top < 0) {
          // $('.catalog_side_body').scrollTop($('.catalog_side_body').offset().top + 27);
        }
        //console.log($('.active').offset().top + "======" + $('.catalog_side_body').offset().top);
      });
    }
  }
}(jQuery));
