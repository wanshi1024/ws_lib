Vue.component('Page', {
        props: {
            total: {
                type: Number,
                default: 0
            },
            current: {
                type: Number,
                default: 1
            },
            pageSize: {
                type: Number,
                default: 4
            },
        },
        watch: {
            iCurrent(v) {
                this.$emit('update:current', v)
            },
            current(v) {
                this.iCurrent = v;
            }
        },
        data() {
            return {
                iCurrent: this.current
            }
        },
        template: `
    <nav aria-label="Page navigation">
        <ul class="pagination">
            <li
                @click="reduce"
            >
                <a href="#" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
            <li
                :class="{active: iCurrent === item}"
                v-for="item in befores "
                @click="iCurrent = item"
            >
                <a href="#">{{item}}</a>
            </li>
            <li @click="move"><a href="#">...</a></li>
            <li
                :class="{active: iCurrent === item}"
                v-for="item in afters"
                @click="iCurrent = item"
            >
                <a href="#">{{item}}</a>
            </li>
            <li @click="add">
                <a href="#" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        </ul>
    </nav>
    `,
        computed: {
            page() {
                if (!this.total) return 0;
                return Math.ceil(this.total / this.pageSize)
            },
            pagePercent50() {
                return this.page / 2
            },
            befores() {
                if (this.iCurrent > this.pagePercent50) {
                    return [1]
                }
                const arr = []
                for (let i = 1; i <= this.iCurrent + 2; i++) {
                    arr.push(i);
                }
                return arr;
            },
            afters() {
                if (this.iCurrent <= this.pagePercent50) {
                    return [this.page];
                }
                const arr = []
                for (let i = this.iCurrent - 1; i <= this.page; i++) {
                    arr.push(i);
                }

                return arr;
            }
        },

        methods: {
            add() {
                this.iCurrent++;
                if (this.iCurrent > this.page) {
                    this.iCurrent = this.page;
                }
            },
            reduce() {
                this.iCurrent--;
                if (this.iCurrent < 1) {
                    this.iCurrent = 1;
                }
            },
            move() {

            }
        },
    })
    // 评论组件
const commentComponent = {
    props: {
        list: Array
    },
    data() {
        return {

        }
    },
    created() {
        setTimeout(() => {
            console.log(this.list);
        }, 2000);

    },
    methods: {
        del(item) {
            this.$emit('delete', item);
        },
        agreenComment(item) {
            console.log(item);
            this.$emit('agreen-comment', item)
        },
        disagreenComment(item) {
            console.log(item);
            this.$emit('disagreen-comment', item)
        }
    },
    template: `
    <div class="messList">
        <div v-for="(item,index) in list" :key="index" class="reply">
            <p class="replyContent"><b>{{item.nickName}}: </b>{{item.content}}</p>
            <p class="operation clearfix">
                <span class="replyTime">{{item.commentDate}}</span>
                <span class="handle">
                    <a @click="agreenComment(item)" class="active">
                        <span class="glyphicon glyphicon-thumbs-up"></span>
                        <span class="num">{{item.agreeCount}}</span>
                    </a>
                    <a @click="disagreenComment(item)">
                        <span class="glyphicon glyphicon-thumbs-down"></span>
                        <span class="num">{{item.disagreeCount}}</span>
                    </a>
                    <a>
                        <span class="glyphicon glyphicon-trash" 
                            @click="del(item)">删除</span>
                    </a>
                </span>
            </p>
        </div>
    </div>
    `,

};
// 分页组件
const pagingComponent = {
    props: {
        count: Number //count 评论总条数
    },
    data() {
        return {
            pageIndex: 1
        }
    },
    created() {
        setTimeout(() => {
            console.log(this.count + "条" + this.pages + "页");
        }, 2000);
    },
    computed: {
        pages() { //页数
            return Math.ceil(this.count / 4);
        }
    },
    methods: {
        changePageIndex(index) {
            if (index < 1) {
                this.pageIndex = 1;
                return;
            }
            if (index > this.pages) {
                this.pageIndex = this.pages;
                return;
            }
            console.log(index);
            this.pageIndex = index;
            this.$emit('change-index', index);
        }
    },
    template: `
    <nav aria-label="Page navigation">
        <ul class="pagination">
            <li @click="changePageIndex(--pageIndex)">
                <a aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
            <li v-for = "(item,index) in pages" 
                :key = "index"
                :class = "{active:pageIndex == index+1}"
                @click="changePageIndex(index+1)" >

                <a>{{index+1}}</a>
            </li>
            <li @click="changePageIndex(++pageIndex)">
                <a aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        </ul>
    </nav>
    `
};