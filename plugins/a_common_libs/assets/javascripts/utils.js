if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (searchElement, fromIndex) {
        for(var i = fromIndex||0, length = this.length; i<length; i++)
            if(this[i] === searchElement) return i;
        return -1
  };
}

// jQuery plugin to change the type of the html element easily
(function ($) {
    $.fn.changeElementType = function (newType) {
        var attrs = {};

        $.each(this[0].attributes, function (idx, attr) {
            attrs[attr.nodeName] = attr.nodeValue;
        });

        this.replaceWith(function () {
            return $("<" + newType + "/>", attrs).append($(this).contents());
        });
    },
    $.fn.isNumber = function (n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }
})(jQuery);

// jQuery plugin to get string representation of the element
(function ($) {
  $.fn.outerHTML = function () {
    return $(this).clone().wrap('<div></div>').parent().html();
  }
})(jQuery);

// usage:
// var visible = TabIsVisible(); // gives current state
// TabIsVisible(function(){ // registers a handler for visibility changes
//  document.title = vis() ? 'Visible' : 'Not visible';
// });
var TabIsVisible = (function () {
    var stateKey,
        eventKey,
        keys = {
                hidden: "visibilitychange",
                webkitHidden: "webkitvisibilitychange",
                mozHidden: "mozvisibilitychange",
                msHidden: "msvisibilitychange"
    };
    for (stateKey in keys) {
        if (stateKey in document) {
            eventKey = keys[stateKey];
            break;
        }
    }
    return function (c) {
        if (c) document.addEventListener(eventKey, c);
        return !document[stateKey];
    }
})();

// Namespace declaration
var RMPlus = (function (my) {
  var my = my || {};
  return my;
})(RMPlus || {});

// Useful utility functions
RMPlus.Utils = (function (my) {
  var my = my || {};

  // function checks existence of the property in the RMPlus namespace recursively
  my.exists = function (prop) {
    obj = RMPlus;
    var parts = prop.split('.');
    for (var i = 0, l = parts.length; i < l; i++) {
      var part = parts[i];
      if (obj !== null && typeof obj === "object" && part in obj) {
          obj = obj[part];
      }
      else {
          return false;
      }
    }
    return true;
  };

  // useful functions to decorate autocomplete handlers, etc.
  // see http://habrahabr.ru/post/60957/  (rus),
  // http://drupalmotion.com/article/debounce-and-throttle-visual-explanation (eng) for more info
  my.debounce = function (delay, fn) {
    var timer = null;
    return function () {
      var context = this, args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    };
  };

  my.throttle = function (threshhold, fn, scope) {
    threshhold || (threshhold = 250);
    var last, deferTimer;
    return function () {
      var context = scope || this;
      var now = +new Date, args = arguments;
      if (last && now < last + threshhold) {
        clearTimeout(deferTimer);
        deferTimer = setTimeout(function () {
          last = now;
          fn.apply(context, args);
        }, threshhold);
      } else {
        last = now;
        fn.apply(context, args);
      }
    };
  };

  my.async_tab_load = function(tab, tab_content, url) {
    tab.attr('data-remote', 'true');
    tab.attr('href', url).click(function() {
      if (tab_content.attr('data-loaded')) {
        $(this).removeAttr('data-remote');
        return;
      }
      tab_content.attr('data-loaded', 1);
    });
  };

  my.append_fast_links = function() {
    var $link = $('<a href="#" class="icon icon-edit rmp-fast-link no_line" target="_blank"></a>');

    $('select.rmp-fast-edit').each(function() {
      var $this = $(this);

      if ($this.data('rmp-fast-link')) { return; }

      var $lnk = $link.clone();
      $this.after($lnk).data('rmp-fast-link', $lnk);
      if ($this.attr('modal')) {
        $lnk.addClass('link_to_modal click_out refreshable');
      }
    }).trigger('change');
  };

  my.create_guid = function() {
    var dt = new Date( ).getTime( );
    var gd = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return gd;
  };

  return my;
})(RMPlus.Utils || {});


$(document).ready(function () {
  $(document.body).on('change', 'select.rmp-fast-edit', function () {
    var $this = $(this);
    var sb_val = $this.val();
    if (parseInt(sb_val)) {
      var edit_field = $this.attr('data-edit-url').split('0').join(sb_val);
      $this.data('rmp-fast-link').attr('href', edit_field);
    } else {
      var new_field =  $this.attr('data-add-url');
      $this.data('rmp-fast-link').attr('href', new_field);
    }
  });
  RMPlus.Utils.append_fast_links();

});

