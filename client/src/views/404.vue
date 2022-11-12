<template>
  <section class="page-404">
    <div class="container">
      <div class="card">
        <h1>404</h1>
        <h3>Không tìm thấy trang</h3>
        <p>Trang bạn tìm kiếm không tồn tại!</p>
        <p>Vui lòng trở lại trang chủ</p>
        <router-link :to="{ name: 'home' }" class="btn btn-primary"
          >Về trang chủ</router-link
        >
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "404",
};
</script>