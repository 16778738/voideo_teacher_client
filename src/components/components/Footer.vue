<template>
    <div class="footer">
        <ul>
            <li v-for="(nav, index) in nav_list" :key="index">
                <span v-if="nav.is_site"  v-show="nav.position===2">
                    <a :href="nav.link">{{ nav.title }}</a></span>
                <span v-else  v-show="nav.position===2"><router-link :to="nav.link">{{ nav.title }}</router-link></span>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: "Footer",
    data() {
        return {
            nav_list: [],
            show: false,
        }
    },
    methods: {
        // 获取导航条
        get_all_nav() {
            this.$axios.get(this.$settings.HOST + "home/nav/").then(response => {
                // console.log(response)
                this.nav_list = response.data;
            })
        },
    },
    created() {
        this.get_all_nav();
    }
}
</script>

<style scoped>
.footer {
    width: 100%;
    height: 128px;
    background: #25292e;
    color: #ffffff;
}

.footer ul {
    margin: 0 auto 16px;
    padding-top: 38px;
    width: 810px;
}

.footer ul li {
    float: left;
    width: 112px;
    margin: 0 10px;
    text-align: center;
    font-size: 14px;
}

.footer ul::after {
    content: "";
    display: block;
    clear: both;
}

.footer p {
    text-align: center;
    font-size: 12px;
}

</style>
