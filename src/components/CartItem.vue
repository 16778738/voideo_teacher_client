<template>
    <div class="cart_item">
        <div class="cart_column column_1">
            <el-checkbox class="my_el_checkbox" v-model="course.selected"></el-checkbox>
        </div>
        <div class="cart_column column_2">
            <img :src="course.course_img" alt="">
            <span><router-link to="/course/detail/1">{{ course.name }}</router-link></span>
        </div>
        <div class="cart_column column_3">
            <el-select v-model="course.expire_id" size="mini" placeholder="请选择购买有效期" class="my_el_select">
                <el-option :label="item.expire_text" :value="item.id" :key="item.id"
                           v-for="item in course.expire_list"></el-option>
            </el-select>
        </div>
        <div class="cart_column column_4">¥{{ course.price }}</div>
<!--        <div class="cart_column column_4" v-if="course.expire_id === 0">¥{{ course.price }}</div>-->
<!--        <div class="cart_column column_4" v-else>¥{{ course.expire_price }}</div>-->
        <div class="cart_column column_4" >
            <el-button type="text" @click="delete_course">删除</el-button>
        </div>

    </div>
</template>


<script>
export default {
    name: "CartItem",
    data() {
        return {

        }
    },
    props: ['course'],
    methods: {
        // 发起请求  在后台修改商品的选中状态
        // 课程id， 选中状态
        change_selected() {
            this.$axios({
                url: this.$settings.HOST + "cart/option/",
                method: "patch",
                headers: {
                    "Authorization": "jwt " + sessionStorage.token
                },
                data: {
                    "user_id": sessionStorage.user_id,
                    "course_id": this.course.id,
                }
            }).then(res => {
                this.$emit("get_cart")
                this.$message({
                    message: res.data.message,
                    type: "success",
                    duration: 1000,
                });
            }).catch(error => {
                console.log(error)
            })
        },
        // 删除课程
        delete_course() {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 点击确定,向后端提交删除
                this.$axios({
                    url: this.$settings.HOST + "cart/option/",
                    method: "delete",
                    headers: {
                        "Authorization": "jwt " + sessionStorage.token
                    },
                    data: {
                        "user_id": sessionStorage.user_id,
                        "course_id": this.course.id,
                    }
                }).then(res => {
                    this.$emit("delete_course", this.course)
                    this.$emit("get_cart")
                }).catch(error => {
                    console.log(error)
                })
                // TODO 前端删除商品
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },

        // TODO 发起修改有效期的请求
        change_expire() {
            // console.log(this.course);
            this.$axios({
                url: this.$settings.HOST + "cart/option/",
                method: "put",
                headers: {
                    "Authorization": "jwt " + sessionStorage.token
                },
                data: {
                    "user_id": sessionStorage.user_id,
                    "expire_id": this.course.expire_id,
                    "course_id": this.course.id,
                }
            }).then(res => {
                // TODO 修改有效期价格
                // console.log(res.data.expire_price)
                this.course.price = res.data.expire_price
                this.$emit("get_cart")
                // this.course.expire_price = res.data.expire_price
                this.$message({
                    message: res.data.message,
                    type: "success",
                    duration: 1000,
                })
            }).catch(error => {
                this.$message({
                    message: error.data.message,
                    type: "error",
                    duration: 1000,
                })
            })
        },


    },
    watch: {
        // 检测选择框的状态
        "course.selected": function () {
            // console.log(sessionStorage)
            // console.log(this.course.id)
            this.change_selected();

        },
        // 监测select框的有效期id的一旦发生变化，则发起修改有效期的请求
        "course.expire_id": function () {
            this.change_expire()

        },

    }
}
</script>

<style scoped>
.cart_item::after {
    content: "";
    display: block;
    clear: both;
}

.cart_column {
    float: left;
    height: 250px;
}

.cart_item .column_1 {
    width: 88px;
    position: relative;
}

.my_el_checkbox {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    margin: auto;
    width: 16px;
    height: 16px;
}

.cart_item .column_2 {
    padding: 67px 10px;
    width: 520px;
    height: 116px;
}

.cart_item .column_2 img {
    width: 175px;
    height: 115px;
    margin-right: 35px;
    vertical-align: middle;
}

.cart_item .column_3 {
    width: 197px;
    position: relative;
    padding-left: 10px;
}

.my_el_select {
    width: 117px;
    height: 28px;
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
}

.cart_item .column_4 {
    padding: 67px 10px;
    height: 116px;
    width: 142px;
    line-height: 116px;
}

</style>

