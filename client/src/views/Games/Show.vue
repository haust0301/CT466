<template>
  <main class="game-page">
    <div class="container">
      <div class="game-main card">
        <figure class="game-image">
          <img
            :src="`${axios.defaults.baseURL}/uploads/games/${this.$route.params.id}`"
            :alt="game.title"
          />
          <figcaption @click="likeGame()" :class="{ liked }">
            {{ game.likes }}
            <i class="fas fa-thumbs-up"> </i>
          </figcaption>
        </figure>

        <article class="game-info">
          <h1>
            {{ game.title }}
          </h1>
          <p>{{ game.description }}</p>
        </article>
      </div>
      <aside class="game-aside">
        <div class="card">
          <h2>Thông tin bài viết</h2>
          <div class="game-info">
            <div>
              <b>Thể loại game:</b>
              <p>{{ game.category.name }}</p>
            </div>
            <div>
              <b>Đăng tải bởi:</b>
              <p>{{ token && canManage ? "Bạn" : game.user.name }}</p>
            </div>
          </div>
          <div class="form-50 buttons" v-if="token && canManage">
            <router-link
              :to="{
                name: 'games.edit',
                params: { id: this.$route.params.id },
              }"
              class="btn btn-primary"
              >Chỉnh sửa</router-link
            >
            <a @click="deleteGameAlert()" class="btn btn-secondary"
              >Xoá bài viết</a
            >
          </div>
        </div>
      </aside>
    </div>
  </main>
</template>

<script>
import { mapState } from "vuex";
export default {
  data: () => ({
    game: {
      title: "",
      category: {},
      user: {},
    },
    canManage: false,
    liked: false,
  }),
  mounted() {
    this.getGame();
  },
  methods: {
    getGame() {
      this.$swal({
        title: "Đang tải",
        text: "Vui lòng đợi...",
        allowEscapeKey: false,
        allowOutsideClick: false,
      });
      this.$swal.showLoading();
      this.axios
        .get(`/games/${this.$route.params.id}`, {
          headers: { "x-token": this.token },
        })
        .then((res) => {
          this.game = res.data.game;
          this.canManage = res.data.canManage;
          this.liked = res.data.liked;
          this.$swal.closeModal();
        })
        .catch((err) => {
          this.$router.push({
            name: "404",
          });
          this.$swal.closeModal();
        });
    },
    likeGame() {
      this.$swal({
        text: "Vui lòng đợi...",
        allowEscapeKey: false,
        allowOutsideClick: false,
      });
      this.$swal.showLoading();
      this.axios
        .post(
          `/games/like/${this.$route.params.id}`,
          {},
          {
            headers: { "x-token": this.token },
          }
        )
        .then((res) => {
          this.liked = res.data.liked;
          if (res.data.liked) {
            this.game.likes++;
          } else {
            this.game.likes--;
          }
          this.$swal.closeModal();
        })
        .catch((err) => {
          this.$swal({
            icon: "error",
            title: "Đã có lỗi xuất hiện.",
            text: err.response.data.msg ? err.response.data.msg : err,
          });
        });
    },
    deleteGameAlert() {
      this.$swal({
        title: "¿Bạn có chắc sẽ xoá bài viết này?",
        text: `Bài viết '${this.game.title}' sẽ được xoá.`,
        icon: "warning",
        showCancelButton: true,
      })
        .then((result) => {
          if (result.isConfirmed) {
            this.$swal({
              title: "Đang xoá",
              text: "Vui lòng đợi...",
              allowEscapeKey: false,
              allowOutsideClick: false,
            });
            this.$swal.showLoading();
            return this.deleteGame();
          }
        })
        .catch((err) => {
          this.$swal({
            icon: "error",
            title: "Đã có lỗi xảy ra.",
            text: err.response.data.msg ? err.response.data.msg : err,
          });
        });
    },
    deleteGame() {
      return this.axios
        .delete(`/games/${this.$route.params.id}`, {
          headers: {
            "x-token": this.token,
          },
        })
        .then((res) => {
          this.$swal({
            icon: "success",
            title: `Bài viết '${res.data.game.title}' đã được xoá.`,
          });
          this.$router.push("/");
        });
    },
  },
  computed: {
    ...mapState(["token"]),
  },
};
</script>