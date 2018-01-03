new Vue({
    el: '#app',
    data: {
        //默认数据
        items:
            {
                content: '',//初始化内容为空，不能省略
                finished: false,//未完成
                deleted: false//未删除
            },
        list: []
    },
    //列表
    methods: {
        //es6 的写法
        addTask() {
            //将任务存入数组
            this.list.push(this.items);
            //重置 items
            this.items = {
                content: '',//初始化内容为空，不能省略
                finished: false,//未完成
                deleted: false//未删除
            }
        },
        //选中改变状态
        changeState(index) {
            let curState = this.list[index].finished;
            this.list[index].finished = !curState;
        },
        //删除
        removeList(index) {
            this.list.splice(index, 1);
        }
    }
})