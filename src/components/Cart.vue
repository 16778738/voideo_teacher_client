<template>
    <div class="cart">
        <Header></Header>
        <div class="cart_info">
            <div class="cart_title">
                <span class="text">我的购物车</span>
                <span class="total">共{{ cart_list.length }}门课程</span>
            </div>
            <div class="cart_table">
                <div class="cart_head_row">
                    <span class="doing_row"></span>
                    <span class="course_row">课程</span>
                    <span class="expire_row">有效期</span>
                    <span class="price_row">单价</span>
                    <span class="do_more">操作</span>
                </div>
                <div class="cart_course_list">
                    <CartItem v-for="course in cart_list" :course="course" @delete_course="delete_course(course)" @get_cart="get_cart()"></CartItem>
                </div>
                <div class="cart_footer_row">
                    <span class="cart_select"><label> <el-checkbox
                        v-model="checked"></el-checkbox>
                        <span>全选</span></label></span>
                    <span class="cart_delete"><i class="el-icon-delete">

                    </i> <span>删除</span></span>
                    <span class="goto_pay">
                        <button @click="check_cart">{{ btntxt }}</button>
                    </span>
                    <span class="cart_total">总计：¥{{ total_price }}</span>
                </div>
            </div>
        </div>
        <Footer></Footer>
    </div>
</template>

<script>
import CartItem from "./CartItem";
import Header from "./components/Header";
import Footer from "./components/Footer";


export default {
    name: "Cart",
    data() {
        return {
            checked: false,
            cart_list: [],
            cart_total: "",
            total_price: 0.00,
            disabled: false,
            btntxt: "立即购买",
        }
    },
    methods: {
        // 子传父的方法  删除课程
        delete_course(course) {
            // console.log(course)
            // console.log(this.cart_list.indexOf(course));
            this.cart_list.splice(this.cart_list.indexOf(course), 1)
            // 删除商品后，重新计算商品总价
            this.cart_total_price()
        },
        // 获取购物车中的数据
        get_cart() {
            let token = this.check_user_login();
            this.$axios.get(this.$settings.HOST + "cart/option/", {
                headers: {
                    "Authorization": "jwt " + token
                }
            }).then(res => {

                this.cart_list = res.data;
                this.cart_total_price()
                // console.log(this.cart_list, '购物车列表')
            }).catch(error => {
                console.log(error.response);
            })
        },
        // 计算购物车商品总价格
        cart_total_price() {
            let total = 0;
            this.cart_list.forEach((course, key) => {
                // 判断商品是否选中了，只有选中的课程才计入总价
                if (course.selected) {
                    // console.log(course.price, "购物车选中的价格");
                    total += parseFloat(course.price);
                }
                this.total_price = total;
            })
        },
        // 检查用户是否登录
        check_user_login() {
            let token = localStorage.token || sessionStorage.token;
            if (!token) {
                let self = this;
                this.$confirm("对不起,请登录后再添加购物车", {
                    callback() {
                        self.$router.push("/login");
                    }
                });
                return false
            }
            return token;
        },
        check_cart(){
            if (this.cart_list.length===0){
                this.$message({
                    type:"error",
                    message: '购物车为空!'
                })
                this.disabled = true;
                // this.$router.push('/')
            }
            else {
                this.disabled = false;
                this.$router.push('order/')
            }

        }


    },
    created() {
        // 获取购物车商品数据
        this.get_cart()

    },
    components: {
        CartItem: CartItem,
        Footer: Footer,
        Header: Header,
    }
}
</script>

<style scoped>
.cart_info {
    width: 1200px;
    margin: 0 auto 200px;
}

.cart_title {
    margin: 25px 0;
}

.cart_title .text {
    font-size: 18px;
    color: #666;
}

.cart_title .total {
    font-size: 12px;
    color: #d0d0d0;
}

.cart_table {
    width: 1170px;
}

.cart_table .cart_head_row {
    background: #F7F7F7;
    width: 100%;
    height: 80px;
    line-height: 80px;
    padding-right: 30px;
}

.cart_table .cart_head_row::after {
    content: "";
    display: block;
    clear: both;
}

.cart_table .cart_head_row .doing_row,
.cart_table .cart_head_row .course_row,
.cart_table .cart_head_row .expire_row,
.cart_table .cart_head_row .price_row,
.cart_table .cart_head_row .do_more {
    padding-left: 10px;
    height: 80px;
    float: left;
}

.cart_table .cart_head_row .doing_row {
    width: 78px;
}

.cart_table .cart_head_row .course_row {
    width: 530px;
}

.cart_table .cart_head_row .expire_row {
    width: 188px;
}

.cart_table .cart_head_row .price_row {
    width: 162px;
}

.cart_table .cart_head_row .do_more {
    width: 162px;
}

.cart_footer_row {
    padding-left: 30px;
    background: #F7F7F7;
    width: 100%;
    height: 80px;
    line-height: 80px;
}

.cart_footer_row .cart_select span {
    margin-left: -7px;
    font-size: 18px;
    color: #666;
}

.cart_footer_row .cart_delete {
    margin-left: 58px;
}

.cart_delete .el-icon-delete {
    font-size: 18px;
}

.cart_delete span {
    margin-left: 15px;
    cursor: pointer;
    font-size: 18px;
    color: #666;
}

.cart_total {
    float: right;
    margin-right: 62px;
    font-size: 18px;
    color: #666;
}

.goto_pay {
    float: right;
    width: 159px;
    height: 80px;
    outline: none;
    border: none;
    background: #ffc210;
    font-size: 18px;
    color: #fff;
    text-align: center;
    cursor: pointer;
}
</style>

