$(function() {
    // 35个字
    let arr = [{
        id: 1,
        content: '哈哈哈哈工程学哈哈哈哈工程学哈哈哈哈工程学哈哈哈哈工程学哈哈哈哈工程学',
        commentDate: '2019-09-10 10:27:25',
        agreeCount: 2,
        disagreeCount: 1,
        nickName: '顽石mua'
    }];

    // const baseURL = 'http://2629zj3897.zicp.vip:46157/ssj/comment';
    const baseURL = 'http://192.168.1.101:8080/ssj/comment';
    const app = new Vue({
        el: '#box',
        data() {
            return {
                dataList: arr,
                textValue: '', //评论文本域
                myNickName: '', //你的昵称
                loading: false,
                total: 0,
                getNickNameTipShow: false,
                current: 1
            }
        },
        watch: {
            current(v) {
                console.log(v);
                this.getList(v)
            }
        },
        methods: {
            //提交昵称
            submitNickName() {
                let n = this.myNickName.length;
                if (n < 2 || n > 8) {
                    this.getNickNameTipShow = true;
                    return;
                }
                localStorage.setItem('nickname', this.myNickName);
                $('#nickname').text(localStorage.getItem('nickname'));
                $('#myModal').modal('hide');
            },
            // 提交评论
            submitComment() {
                let nickname = localStorage.getItem('nickname');
                if (nickname == null) {
                    $('#myModal').modal();
                } else {
                    if (this.textValue.length > 180 || this.textValue.length == 0) {
                        alert(`字数不能为0或不要超过180`)
                        return;
                    }
                    this.loading = true;
                    let data = {
                        content: this.textValue,
                        commentDate: formatTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}'),
                        nickName: nickname
                    }
                    console.log(data);
                    $.get(`${baseURL}/add`, data,
                        res => {
                            console.log(res);
                            this.loading = false;
                            $.message({
                                message: '评论成功',
                                type: 'success',
                                duration: 1000
                            });
                            this.getList(1);
                        }
                    );
                    this.textValue = '';
                }

            },
            // 获取评论列表 pageIndex 分页下标
            getList(pageIndex) {
                this.loading = true;
                $.get(`${baseURL}/list`, {
                        page: pageIndex,
                        limits: 4
                    },
                    res => {
                        // console.log(res);
                        setTimeout(() => {
                            this.dataList = res.data.list;
                            this.total = res.data.count;
                            this.loading = false;
                        }, 1000);
                    }
                );
            },

            // 分页下标改变事件
            changeIndex(index) {
                console.log(`父组件${index}`);
                this.getList(index);
            },
            deleteComment(item) {
                console.log(item);
                if (item.nickName != localStorage.getItem('nickname')) {
                    alert(`只能删除自己的评论`)
                    return;
                }
                if (confirm(`确认删除你的这条评论吗?`)) {
                    $.get(`${baseURL}/delete`, { id: item.id },
                        res => {
                            console.log(res);
                            this.getList(this.current);
                            $.message({
                                message: '删除成功',
                                type: 'success',
                                duration: 1000
                            });
                        });
                }

            }
        },
        created() {
            $('#nickname').text(localStorage.getItem('nickname'));
            this.getList(1);

        },

        components: {
            commentComponent,
            pagingComponent
        }
    });
})


/**
 * 自定义格式化时间
 * @param  {time} 指定时间 || new Date() 
 * @param  {cFormat} 格式
 * @return {String} 字符串
 * @example formatTime('2018-1-29', '{y}/{m}/{d} 星期{a} {h}:{i}:{s}') // -> 2018/01/29 星期四 00:00:00
 */
function formatTime(time, cFormat) {
    if (arguments.length === 0) return null
    if ((time + '').length === 10) {
        time = +time * 1000
    }

    var format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}',
        date
    if (typeof time === 'object') {
        date = time
    } else {
        date = new Date(time)
    }
    var formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    }
    var time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        var value = formatObj[key]
        if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
        if (result.length > 0 && value < 10) {
            value = '0' + value
        }
        return value || 0
    })
    return time_str
}
// {
//     id: 1,
//     content: '哈哈哈哈工程学哈哈哈哈工程学哈哈哈哈工程学哈哈哈哈工程学哈哈哈哈工程学',
//     commentDate: '2019-09-10 10:27:25',
//     agreeCount: 2,
//     disagreeCount: 1,
//     nickName: '顽石mua'
// }