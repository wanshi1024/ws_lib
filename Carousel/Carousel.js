
/**
 * 用法: $(容器).Carousel({....}) 需要给容器设置宽高
 * 
 * Carousel({})
 *  imgArr 类型:Array 图片地址数组
 *  switchSpeed 类型:Number 切换速度 ms
 *  switchTime 类型:Number 一次切换的时间 ms 
 */
$.fn.Carousel = function (params) {
    console.log(params);
    var $this = this; //this === 当前jQuery元素对象
    var _width = $this.width();
    var _height = $this.height();
    var _html = '<div class="img-container"><img src="" alt="轮播图"></div>' +
        '   <div class="switch-dot"><span></span></div>' +
        '   <div class="prev"></div>' +
        '   <div class="next"></div>';
    $this.html(_html);

    var imgNum = params.imgArr.length;
    console.log(imgNum);

    //图片字符串拼接
    var img_html = '<img src="' + params.imgArr[imgNum - 1] + '">';
    // 圆点字符串拼接
    var dot_html = '';
    $.each(params.imgArr, function (index, element) {
        img_html += '<img src="' + element + '">';
        dot_html += '<span index="' + (index + 1) + '"></span>';
    });
    img_html += '<img src="' + params.imgArr[0] + '">';
    $this.children('.img-container').html(img_html)
        .siblings('.switch-dot').html(dot_html);

    /**************设置css**************/
    (function () {
        // 轮播容器css
        $this.css({
            overflow: 'hidden',
            position: 'relative',
        });
        // 轮播图css
        $this.children('.img-container').css({
            position: 'absolute',
            top: '0',
            left: '-' + _width + 'px',
            height: _height + 'px',
            width: (imgNum + 2) * _width + 'px'
        }).children('img').css({
            display: 'inline-block',
            width: _width + 'px',
            height: _height + 'px',
            // cursor: 'pointer'
        });
        //左右切换css
        $this.children('.prev,.next').css({
            width: '4%',
            height: '10%',
            position: 'absolute',
            top: '40%',
            'z-index': 999,
            cursor: 'pointer',
            background: 'rgba(0, 0, 0, 0.1) url(https://wanshi1024.github.io/ws_lib/icon/left.png) no-repeat center center / 70%',
        }).hover(function () {
            // over
            $(this).css({
                'background-color': 'rgba(0, 0, 0, .6)'
            })

        }, function () {
            // out
            $(this).css({
                'background-color': 'rgba(0, 0, 0, .2)'
            })
        }
        );
        $this.children('.next').css({
            right: '0',
            'background-image': 'url(https://wanshi1024.github.io/ws_lib/icon/right.png)'
        });
        //圆点css
        $this.children('.switch-dot').css({
            position: 'absolute',
            width: '100%',
            bottom: '2%',
            display: 'flex',
            'justify-content': 'center',
        }).children('span').css({
            display: 'inline-block',
            width: '.8em',
            height: '.8em',
            background: '#ddd',
            margin: '5px',
            'border-radius': '50%',
            cursor: 'pointer',
            transition: 'all 200ms'
        })

    })();
    /***********逻辑层******************/
    var currentIndex = 1; //轮播当前位置
    var timer = null;//定时器
    //设置当前下标对应的圆点颜色
    function setDotActiveColor() {
        $this.find('.switch-dot span').each(function (index, element) {
            $(this).css({
                background: '#ddd',
                transform: 'scale(1)'
            })
        })
        $this.find('.switch-dot span[index=' + currentIndex + ']').css({
            background: '#1296db',
            transform: 'scale(1.2)'
        })
    }
    setDotActiveColor();
    //圆点点击
    $this.children('.switch-dot').delegate('span', 'click', function () {
        // this===span
        currentIndex = parseInt($(this).attr('index'));
        setDotActiveColor();
        $this.children('.img-container').stop().animate({
            left: '-' + _width * currentIndex + 'px'
        }, params.switchTime);
    })
    // 左切换
    function prev() {
        var $temp = $this.children('.img-container');
        if ($temp.is(":animated")) return;
        currentIndex--;
        $temp.stop().animate({
            left: '-' + _width * currentIndex + 'px'
        }, params.switchTime);
        if (currentIndex < 1) {
            currentIndex = imgNum;
            setDotActiveColor();
            setTimeout(function () {
                $temp.stop().css({
                    left: '-' + _width * imgNum + 'px'
                })
            }, params.switchTime);
        }
        setDotActiveColor();
    }
    //右切换
    function next() {
        var $temp = $this.children('.img-container');
        if ($temp.is(":animated")) return;
        currentIndex++;
        $temp.stop().animate({
            left: '-' + _width * currentIndex + 'px'
        }, params.switchTime);
        if (currentIndex > imgNum) {
            currentIndex = 1;
            setDotActiveColor();
            setTimeout(function () {
                $temp.stop().css({
                    left: '-' + _width + 'px'
                })
            }, params.switchTime);
        }
        setDotActiveColor();
    }
    $this.children('.prev').click(prev);
    $this.children('.next').click(next);

    timer = setInterval(next, params.switchSpeed);
    // 鼠标移入 自动切换停止 鼠标移出 自动切换继续
    $this.hover(function () {
        clearInterval(timer)
    }, function () {
        timer = setInterval(next, params.switchSpeed);
    })
}