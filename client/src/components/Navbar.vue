<template>
  <header class="navbar">
    <div class="container navbar-content">
      <div class="navbar-head">
        <div class="logo" @click="$router.push('/')">
        <img src="../assets/logo.png" alt="Blog GameList logo">
        <span>Trang chủ</span>
        </div>
        <div class="mobile">
          <div class="search">
            <input
              v-on:keyup.enter="search()"
              v-model="searchTerm"
              class="search-btn"
              type="search"
              placeholder="Tìm kiếm ..."
            />
            <i
              @click="showSearchInput()"
              class="fa-solid fa-magnifying-glass"
            ></i>
          </div>
          <div class="mobile-menu">
            <span v-on:click="menuOpen = !menuOpen">
              <i class="fas fa-bars"></i>
            </span>
          </div>
        </div>
      </div>
      <nav
        class="navigation"
        v-bind:class="{ 'mobile-menu-active': !menuOpen }"
      >
        <!-- <router-link :to="{ name: 'games' }" @click="menuOpen = false" class="nav-item nav-separator-left"
          >Tất cả bài viết</router-link
        > -->
        <router-link v-if="token" :to="{ name: 'games.liked' }" @click="menuOpen = false" class="nav-item"
          >Bài viết đã thích</router-link
        >
        <router-link v-if="token" :to="{ name: 'games.owned' }" @click="menuOpen = false" class="nav-item"
          >Bài viết đã đăng</router-link
        >
        <router-link
          v-if="token"
          @click="logout(); menuOpen = false;"
          to="/"
          class="nav-item red nav-separator-left"
          >Đăng xuất</router-link
        >
        <router-link
          v-if="!token"
          :to="{ name: 'login' }"
          @click="menuOpen = false"
          class="nav-item nav-separator-left"
          >Đăng nhập</router-link
        >
        <router-link v-if="!token" :to="{ name: 'register' }" @click="menuOpen = false" class="nav-item"
          >Đăng kí</router-link
        >
      </nav>
    </div>
  </header>
</template>

<script>
import { mapActions, mapState } from "vuex";
import Storage from "@/utilities/Storage";
export default {
  name: "Navbar",
  data: () => ({
    menuOpen: false,
    searchTerm: "",
  }),
  mounted() {
    const googleScript = document.createElement("script");
    googleScript.setAttribute("src", "https://accounts.google.com/gsi/client");
    document.head.appendChild(googleScript);
  },
  methods: {
    ...mapActions(["deleteToken"]),
    logout() {
      this.deleteToken();
      if (google && Storage.has("email")) {
        google.accounts.id.disableAutoSelect();
        google.accounts.id.revoke(Storage.get("email"), (done) => {
          Storage.remove("email");
        });
      }
    },
    showSearchInput() {
      if (window.innerWidth < 860) {
        this.$swal({
          title: "Tìm kiếm game...",
          input: "text",
          showCancelButton: true,
          confirmButtonText: "Tìm kiếm",
          showLoaderOnConfirm: true,
        }).then((result) => {
          if (result.isConfirmed) {
            this.searchTerm = result.value;
            this.search();
          }
        });
      } else {
        this.search();
      }
    },
    search() {
      if (this.searchTerm) {
        this.$router.push({
          name: "games.search",
          params: { term: this.searchTerm },
        });
        this.searchTerm = "";
      }
    },
  },
  computed: {
    ...mapState(["token"]),
  },
};
</script>