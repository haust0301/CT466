<template>
  <main>
    <div id="all-games" class="container">
      <div class="description">
        <h2>Có {{ total }} kết quả cho "{{ this.$route.params.term }}"</h2>
        <router-link :to="{ name: 'home' }" class="btn btn-primary"
          >Về trang chủ</router-link
        >
        <router-link
          v-if="token"
          :to="{ name: 'games.add' }"
          class="btn btn-primary"
          >Thêm bài viết mới</router-link
        >
      </div>
      <div class="game-list">
        <GameItem
          v-for="(game, key) in games"
          :key="key"
          :_id="game._id"
          :title="game.title"
          :description="game.description"
          :likes="game.likes"
        />
      </div>
      <Paginator
        :key="total"
        :total="total"
        :limit="limit"
        @updatePage="searchGames()"
      />
    </div>
  </main>
</template>

<script>
import { mapState } from "vuex";
import GameItem from "@/components/GameItem.vue";
import Paginator from "@/components/Paginator.vue";
export default {
  components: {
    GameItem,
    Paginator,
  },
  data: () => ({
    total: 0,
    limit: 10,
    games: [],
  }),
  watch: {
    "$route.params.term": {
      immediate: true,
      handler() {
        this.searchGames();
      },
    },
  },
  methods: {
    searchGames() {
      const page = parseInt(this.$route.query.page) || 1;
      this.$swal({
        title: "Đang tìm kiếm",
        text: "Vui lòng đợi ...",
        allowEscapeKey: false,
        allowOutsideClick: false,
      });
      this.axios
        .get(
          `/search/games/${this.$route.params.term}?page=${page}&limit=${this.limit}`
        )
        .then((res) => {
          this.total = res.data.total;
          this.games = res.data.results;
          this.$swal.closeModal();
        })
        .catch((err) => {
          this.$swal({
            icon: "error",
            title: "Đã có lỗi xảy ra.",
            text: err.response.data.msg ? err.response.data.msg : err,
          });
        });
    },
  },
  computed: {
    ...mapState(["token"]),
  },
};
</script>