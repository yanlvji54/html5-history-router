// history API 实现无刷新单页应用
if (window.history && 'pushState' in history) {
  // 增量式体验开发
  (function () {
    'use strict';
    function displayContent(state, reverse) {
      document.title = state.title;
      // 复制一份,一个消失一个出现
      var cloneEle = $('.wrapper').clone();
      cloneEle.find('.content').html(state.content);
      cloneEle.find('.photo').attr('src', state.photo);
      $('.wrapper')
        .addClass((!reverse) ? 'transition-out' : 'transition-in')
        .after(cloneEle.addClass((!reverse) ? 'transition-in' : 'transition-out'))
        .one('webkitTransitionEnd', function () {
          $(this).remove();
        });
      setTimeout(function () {
        cloneEle.removeClass((!reverse) ? 'transition-in' : 'transition-out')
      }, 200);
    }

    function createState(content) {
      return {
        content: content.find('.content').html(),
        photo: content.find('.photo').attr('src'),
        title: content.filter('title').text()
      }
    }

    $(document).on('click', 'a', function (evt) {
      evt.preventDefault();
      var strHref = this.href;
      // alert(strHref);
      var req = $.ajax(strHref);
      req.done(function (data) {
        // $data 转化成jq对象
        console.log(data)
        console.log($(data))
        var state = createState($(data));
        displayContent(state);

        // 改变url
        history.pushState(state, state.title, evt.target.href);
      })
      req.fail(function () {
        document.location = evt.target.href;
      })
    })
    window.onpopstate = function (evt) {
      if (evt.state) {
        displayContent(evt.state, true);
      }
    }
    var state = createState($('title,body'));
    history.replaceState(state, document.title,
      document.location.href);
  })();
}
