
//连接本地mongodb客户端
const mongoClient = require('mongodb').MongoClient;
//本地数据库地址
const URL = 'mongodb://127.0.0.1:27017';
//数据库名
const DB_NAME = 'sm'


//连接数据库 成功||失败 的回调
/**
 * 
 * @param {Function} callback 
 */
function connect_db(callback) {
    mongoClient.connect(URL, { useNewUrlParser: true }, (err, client) => {
        if (err) {
            console.log(`连接数据库失败:${err}`);
        } else {
            //连接成功 接收一个数据库操作对象
            const _db = client.db(DB_NAME);
            // 通过_db获取集合操作对象 _db.collection(集合名)
            callback(_db);
        }
        //操作完关闭连接
        client.close();
    })
}

module.exports = {
    /**
     * 添加一条数据
     * @param {String} collection_name 
     * @param {JSON} data 
     * @param {Function} callback 
     */
    insertOne(collection_name, data, callback) {
        connect_db(db => {
            let collection = db.collection(collection_name)
            collection.insertOne(data, (err, res) => {
                if (err) {
                    console.log(`添加数据失败:${err}`)
                } else {
                    //添加数据条数 大于0表示插入成功
                    let n = res.result.n;
                    callback(n)
                }
            })
        })
    },
    /**
    * 添加多条数据
    * @param {String} collection_name 
    * @param {Array} data (json 数组)
    * @param {Function} callback 
    */
    insertMany(collection_name, data, callback) {
        connect_db(db => {
            let collection = db.collection(collection_name)
            //判断是否为数组&&数组长度大于0
            if (data instanceof Array && data.length > 0) {
                collection.insertMany(data, (err, res) => {
                    if (err) {
                        console.log(`添加数据失败:${err}`)
                    } else {
                        //添加数据条数 大于0表示插入成功
                        let n = res.result.n;
                        callback(n)
                    }
                })

            } else {
                throw new Error('请添加长度大于0的数组数据')
            }
        })

    },
    /**
     * 删除第一个符合条件的数据
    * @param {String} collection_name
     * @param {JSON} condition 
     * @param {Function} callback 
     */
    deleteOne(collection_name, condition, callback) {
        connect_db(db => {
            let collection = db.collection(collection_name)
            collection.deleteOne(condition, (err, res) => {
                if (err) {
                    console.log(`删除数据失败:${err}`)
                } else {
                    //删除数据条数 大于0表示删除成功
                    let n = res.result.n;
                    callback(n)
                }
            })
        })
    },
    /**
     * 删除所有符合条件的数据
     * @param {String} collection_name
     * @param {JSON} condition 
     * @param {Function} callback 
     */
    deleteMany(collection_name, condition, callback) {
        connect_db(db => {
            let collection = db.collection(collection_name)
            collection.deleteMany(condition, (err, res) => {
                if (err) {
                    console.log(`删除数据失败:${err}`)
                } else {
                    //删除数据条数 大于0表示删除成功
                    let n = res.result.n;
                    callback(n)
                }
            })
        })
    },
    /**
     * 查找所有符合条件的数据
     * @param {String} collection_name
     * @param {JSON} condition (为空{}返回所有数据)
     * @param {Function} callback 
     */
    find(collection_name, condition, callback) {
        connect_db(db => {
            let collection = db.collection(collection_name)
            collection.find(condition).toArray((err, res) => {
                if (err) {
                    console.log(`修改数据失败:${err}`)
                } else {
                    // res 为 数组
                    callback(res);
                }

            })
        })
    },
    /**
     * 分页查询
     * @param {String} collection_name 
     * @param {JSON} condition (为空{}第一页所有数据)
     * @param {Number} skips (跳过数据条数)
     * @param {Number} limits (限制数据条数)
     * @param {Function} callback 
     */
    findPaging(collection_name, condition, skips, limits, callback) {
        connect_db(db => {
            let collection = db.collection(collection_name)
            collection.find(condition).skip(skips).limit(limits).toArray((err, res) => {
                if (err) {
                    console.log(`查询数据失败:${err}`)
                } else {
                    // res 为 数组
                    callback(res);
                }
            })
        })
    },

    /**
     * 修改第一条符合条件的数据
     * @param {String} collection_name 
     * @param {JSON} condition 
     * @param {JSON} data (原数据没有的属性在原本上追加属性)
     * @param {Function} callback 
     */
    updateOne(collection_name, condition, data, callback) {
        connect_db(db => {
            let collection = db.collection(collection_name)
            // $set 在原有的基础修改
            collection.updateOne(condition, { $set: data }, (err, res) => {
                if (err) {
                    console.log(`修改数据失败:${err}`)
                } else {
                    //修改数据条数 大于0表示修改成功
                    let n = res.result.n;
                    callback(n)
                }
            })
        })
    },
    /**
     * 修改所有符合条件的数据
     * @param {String} collection_name 
     * @param {JSON} condition 
     * @param {JSON} data (原数据没有的属性在原本上追加属性)
     * @param {Function} callback 
     */
    updateMany(collection_name, condition, data, callback) {
        connect_db(db => {
            let collection = db.collection(collection_name)
            // $set 在原有的基础修改
            collection.updateMany(condition, { $set: data }, (err, res) => {
                if (err) {
                    console.log(`修改数据失败:${err}`)
                } else {
                    //修改数据条数 大于0表示修改成功
                    let n = res.result.n;
                    callback(n)
                }
            })
        })
    }
}

