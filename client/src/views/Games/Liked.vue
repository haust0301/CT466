<template>
  <main>
    <EmptyData v-if="total === 0" />
    <div v-else id="all-games" class="container">
      <div class="description">
        <h2>Các bài viết bạn yêu thích</h2>
        <p>
          Danh sách các bài viết bạn đã thích. 
        </p>
        <router-link :to="{ name: 'home' }" class="btn btn-secondary"
          >Về trang chủ</router-link
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
          :status="game.status"
        />
      </div>
      <Paginator
        :key="total"
        :total="total"
        :limit="limit"
        @updatePage="getOwnedGames()"
      />
    </div>
  </main>
</template>

<script>
import { mapState } from "vuex";
import EmptyData from "@/components/EmptyData.vue";
import GameItem from "@/components/GameItem.vue";
import Paginator from "@/components/Paginator.vue";

export default {
  components: {
    EmptyData,
    GameItem,
    Paginator,
  },
  data: () => ({
    total: null,
    limit: 10,
    games: [],
  }),
  mounted() {
    this.getOwnedGames();
  },
  methods: {
    getOwnedGames() {
      const page = parseInt(this.$route.query.page) || 1;
      this.axios
        .get(`/games/liked?page=${page}&limit=${this.limit}`, {
          headers: { "x-token": this.token },
        })
        .then((res) => {
          this.total = res.data.total;
          this.games = res.data.games;
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