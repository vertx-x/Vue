var db = new PouchDB('todos5');

$(document).ready(function () {
    var opts = {live: true};
    db.replicate.to('http://192.168.10.41:5984/tasklist');
    db.replicate.from('http://192.168.10.41:5984/tasklist', opts, syncError);
    var listdata =  []
    db.allDocs({include_docs: true, descending: false}, function(err, doc) {
        if ( doc.rows && doc.rows.length > 0){
            for (var i=0;i<doc.rows.length;i++){
                listdata.push(doc.rows[i].doc)
            }
        }
    });
    new Vue({
        el: '#app',
        data: {
            //默认数据
            items:
                {
                    _id:'',
                    content: '',//初始化内容为空，不能省略
                    finished: false,//未完成
                    deleted: false//未删除
                },
            list: listdata
        },
        //列表
        methods: {
            created: function () {
                // `this` 指向 vm 实例
                console.log('a: ' + this.data)
            },
            mounted: function () {
                this.showList()
            },
            //es6 的写法
            addTask() {
                if ( this.items.content === ''){
                    return;
                }
                this.items._id =  new Date().toISOString();
                //将任务存入数组
                this.list.push(this.items);
                db.put(this.items, function callback(err, result) {
                    if (!err) {
                        console.log('Successfully posted a todo!');
                    }else{
                        console.log(err)
                    }
                });
                db.replicate.to('http://192.168.10.41:5984/tasklist');
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
            },
            showList(){
                db.allDocs({include_docs: true, descending: false}, function(err, doc) {
                    console.log(this.list)
                    console.log(doc.rows)
                });
            }
        }
    })

});

function syncError() {
    console.log("syncError");
}

