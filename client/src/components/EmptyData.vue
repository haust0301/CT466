<template>
  <div class="container card no-games">
    <h2>Không có dữ liệu</h2>
    <p>Không có bài viết nào cả</p>
    <div>
      <router-link v-if="$route.name != 'home'" :to="{ name: 'home' }" class="btn btn-secondary"
        >Trở về trang chủ</router-link
      >
      <router-link
        v-if="$route.name != 'games.liked' && token"
        :to="{ name: 'games.add' }"
        class="btn btn-primary"
        >Thêm bài viết mới</router-link
      >
      <router-link v-else-if="$route.name != 'games.liked' && !token" :to="{ name: 'login' }" class="btn btn-primary"
        >Đăng nhập để thêm một bài viết mới</router-link
      >
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "EmptyData",
  computed: {
    ...mapState(["token"]),
  },
};
</script>