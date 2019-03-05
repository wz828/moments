const userName = '小知';
// 朋友圈页面的数据
var data = [{
  user: {
    name: '阳和',
    avatar: './img/avatar2.png'
  },
  content: {
    type: 0, // 多图片消息
    text: '华仔真棒，新的一年继续努力！',
    pics: ['./img/reward1.png', './img/reward2.png', './img/reward3.png', './img/reward4.png'],
    share: {},
    timeString: '3分钟前'
  },
  reply: {
    hasLiked: false,
    likes: ['Guo封面', '源小神'],
    comments: [{
      author: 'Guo封面',
      text: '你也喜欢华仔哈！！！'
    }, {
      author: '喵仔zsy',
      text: '华仔实至名归哈'
    }]
  }
}, {
  user: {
    name: '伟科大人',
    avatar: './img/avatar3.png'
  },
  content: {
    type: 1, // 分享消息
    text: '全面读书日',
    pics: [],
    share: {
      pic: 'http://coding.imweb.io/img/p3/transition-hover.jpg',
      text: '飘洋过海来看你'
    },
    timeString: '50分钟前'
  },
  reply: {
    hasLiked: false,
    likes: ['阳和'],
    comments: []
  }
}, {
  user: {
    name: '深圳周润发',
    avatar: './img/avatar4.png'
  },
  content: {
    type: 2, // 单图片消息
    text: '很好的色彩',
    pics: ['http://coding.imweb.io/img/default/k-2.jpg'],
    share: {},
    timeString: '一小时前'
  },
  reply: {
    hasLiked: false,
    likes: [],
    comments: []
  }
}, {
  user: {
    name: '喵仔zsy',
    avatar: './img/avatar5.png'
  },
  content: {
    type: 3, // 无图片消息
    text: '以后咖啡都不敢浪费了',
    pics: [],
    share: {},
    timeString: '2个小时前'
  },
  reply: {
    hasLiked: false,
    likes: [],
    comments: []
  }
}];

// 相关 DOM
var $page = $('.page-moments');
var $momentsList = $('.moments-list');
var $window = $(window);
var $body = $(document.body);

/**
 * 点赞内容 HTML 模板
 * @param {Array} likes 点赞人列表
 * @return {String} 返回html字符串
 */
function likesHtmlTpl(likes) {
  if (!likes.length) {
    return '';
  }
  var htmlText = ['<div class="reply-like"><i class="icon-like-blue"></i>'];
  // 点赞人的html列表
  var likesHtmlArr = [];
  // 遍历生成
  let len = likes.length;
  for (let i = 0; i < len; i++) {
    likesHtmlArr.push('<a class="reply-who" href="#">' + likes[i] + '</a>');
  }
  // 每个点赞人以逗号加一个空格来相隔
  var likesHtmlText = likesHtmlArr.join(', ');
  htmlText.push(likesHtmlText);
  htmlText.push('</div>');
  return htmlText.join('');
}
/**
 * 评论内容 HTML 模板
 * @param {Array} likes 点赞人列表
 * @return {String} 返回html字符串
 */
function commentsHtmlTpl(comments) {
  if (!comments.length) {
    return '';
  }
  var htmlText = ['<div class="reply-comment">'];
  let len = comments.length;
  for (let i = 0; i < len; i++) {
    let comment = comments[i];
    htmlText.push('<div class="comment-item"><a class="reply-who" href="#">' + comment.author + '</a>：' + comment.text + '</div>');
  }
  htmlText.push('</div>');
  return htmlText.join('');
}
/**
 * 评论点赞总体内容 HTML 模板
 * @param {Object} replyData 消息的评论点赞数据
 * @return {String} 返回html字符串
 */
function replyTpl(replyData) {
  var htmlText = [];
  htmlText.push('<div class="reply-zone">');
  htmlText.push(likesHtmlTpl(replyData.likes));
  htmlText.push(commentsHtmlTpl(replyData.comments));
  htmlText.push('</div>');
  return htmlText.join('');
}
/**
 * 多张图片消息模版 
 * @param {Object} pics 多图片消息的图片列表
 * @return {String} 返回html字符串
 */
function multiplePicTpl(pics) {
  var htmlText = [];
  htmlText.push('<ul class="item-pic">');
  let len = pics.length;
  for (let i = 0; i < len; i++) {
    htmlText.push('<img class="pic-item" src="' + pics[i] + '">')
  }
  htmlText.push('</ul>');
  return htmlText.join('');
}
/**
 * 分享消息模版
 * @param{Object} shareData 分享消息数据
 * @return {String} 返回html字符串
 */
function shareTpl(shareData) {
  var htmlText = [];
  htmlText.push('<div class="item-share"><img class="share-img" src="' + shareData.pic + '">');
  htmlText.push('<span class="share-tt">' + shareData.text + '</span></div>');
  return htmlText.join('');
}

/**
 * 单图片消息模版
 */
function singlePicTpl(pics) {
  var htmlText = [];
  htmlText.push('<img class="item-only-img" src="' + pics + '">');
  return htmlText.join('');
}

/**
 * 回复操作面板模板函数
 */
function replybtnTpl(replyLike) {
  var htmlText = [];
  htmlText.push('<div class="reply-more">');
  htmlText.push('<i class="icon-like"></i>');
  var txt = replyLike.hasLiked ? '取消' : '点赞';
  htmlText.push('<a>' + txt + '</a>');
  htmlText.push('<i class="icon-comment"></i>');
  htmlText.push('<a>评论</a>');
  htmlText.push('</div>');
  return htmlText.join('');
}

/**
 * 评论输入框模板函数
 */
function commentTpl() {
  var htmlText = [];
  htmlText.push('<div class="comment-area">');
  htmlText.push('<input class="comment-text" type="text" autofocus="autofocus"/>');
  htmlText.push('<input class="comment-btn" type="button" value="发送"/>');
  htmlText.push('</div>');
  return htmlText.join('');
}


/**
 * 循环：消息体 
 * @param {Object} messageData 对象
 */
function messageTpl(messageData) {
  var user = messageData.user;
  var content = messageData.content;
  var htmlText = [];
  htmlText.push('<div class="moments-item" data-index="0">');
  // 消息用户头像
  htmlText.push('<a class="item-left" href="#">');
  htmlText.push('<img src="' + user.avatar + '" width="42" height="42" alt=""/>');
  htmlText.push('</a>');
  // 消息右边内容
  htmlText.push('<div class="item-right">');
  // 消息内容-用户名称
  htmlText.push('<a href="#" class="item-name">' + user.name + '</a>');
  // 消息内容-文本信息
  htmlText.push('<p class="item-msg">' + content.text + '</p>');
  // 消息内容-图片列表 
  var contentHtml = '';
  switch (content.type) {
    // 多图片消息
    case 0:
      contentHtml = multiplePicTpl(content.pics);
      break;
    case 1:
      contentHtml = shareTpl(content.share);
      break;
    case 2:
      contentHtml = singlePicTpl(content.pics);
      break;
    case 3:
      break;
  }
  htmlText.push(contentHtml);
  // 消息时间和回复按钮
  htmlText.push('<div class="item-ft">');
  htmlText.push('<span class="item-time">' + content.timeString + '</span>');
  htmlText.push(replybtnTpl(messageData.reply)); //回复操作面板模板函数
  htmlText.push('<div class="item-reply-btn">');
  htmlText.push('<span class="item-reply"></span>');
  htmlText.push('</div></div>');
  // 消息回复模块（点赞和评论）
  htmlText.push(replyTpl(messageData.reply));
  htmlText.push('</div></div>');
  return htmlText.join('');
}

/**
 * 页面渲染函数：render
 */
function render() {
  var messageHtml = [];

  data.forEach(function (msg) {
    messageHtml += messageTpl(msg);
  })
  $momentsList.html(messageHtml);

  $('.user-name').html(userName); //设置用户名称
  $body.append('<div class="show"><img></div>');
  $('.moments-list').append(commentTpl);
}


/**
 * 页面绑定事件函数：bindEvent
 */
function bindEvent() {
  // 页面交互功能事件绑定

  /*点击弹出回复面板*/
  $body.on('click', '.item-reply', function () {
    ind = $(this).parents('.moments-item').index();
    $(this).parent().siblings('.reply-more').show("normal", function () {
      $(this).css({
        'display': 'block'
      });
      $('.reply-more').not($(this)).hide();
      $('.comment-area').hide();
    })
  })

  /*点击点赞按钮*/
  $body.on('click', '.icon-like + a', function () {
    if (!data[ind].reply.hasLiked) {
      data[ind].reply.likes.push(userName);
      data[ind].reply.hasLiked = true;
    } else {
      var i = data[ind].reply.likes.indexOf(userName);
      data[ind].reply.likes.splice(i, 1);
      data[ind].reply.hasLiked = false;
    }
    render();
  })

  /*点击评论按钮*/
  $body.on('click', '.icon-comment + a', function () {
    $('.comment-area').show("normal", function () {
      $('.comment-area').css("display", "block");
    });
  })
  /*获取文本框内容*/
  var ctxt = null;
  $body.on('keyup', '.comment-text', function () {
    ctxt = $(this).val();
    if (ctxt.length !== 0) {
      $(".comment-btn").css("background-color", "green");
    } else {
      $(".comment-btn").css("background-color", "#888");
    }
  })
  /*点击发送按钮*/
  $body.on('click', '.comment-btn', function () {
    if (ctxt !== null) {
      data[ind].reply.comments.push({
        author: userName,
        text: ctxt
      });
      ctxt = null;
      $(".comment-area").hide();
      render();
    }
  })
  /*点击其他区域则隐藏操作面板*/
  $window.on('click', function (event) {
    var target = event.target;
    if (target.className !== 'item-reply') {
      $('.reply-more').hide();
      if (target.className !== 'comment-text') {
        $('.comment-area').hide();
      }
    }
  })

  /*点击放大图片*/
  $body.on('click', '.pic-item,.item-only-img', function () {
    var imgsrc = $(this).attr("src");
    $('.show img').attr("src", imgsrc);
    $('.show').show("fast", function () {
      $('.show').css("display", "flex");
    });
  })
  $body.on('click', '.show', function () {
    $('.show').hide();
  })
}

/**
 * 页面入口函数：init
 */
function init() {
  // 渲染页面
  render();
  bindEvent();
}

init();