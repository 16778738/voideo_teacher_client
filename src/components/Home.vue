<template>
    <div>
        <Header></Header>
        <Banner></Banner>
        <Footer></Footer>
    </div>
</template>

<script>
import Header from "./components/Header";
import Banner from "./components/Banner";
import Footer from "./components/Footer";

export default {
    name: "Home",
    components: {
        Header: Header,
        Banner: Banner,
        Footer: Footer,
    }
}
</script>

<style scoped>

</style>
