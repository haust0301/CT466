<template>
  <section class="login">
    <div class="container">
      <div class="multi-card">
        <form class="card-white" @submit.prevent="login(user)">
          <h2>Đăng nhập</h2>
          <div class="form-item">
            <label for="email">Email</label>
            <input type="email" v-model="user.email" name="email" id="email" />
            <span class="errors" v-if="errors.has('email')">{{
              errors.get("email")
            }}</span>
          </div>
          <div class="form-item">
            <label for="password">Mật khẩu</label>
            <input
              type="password"
              v-model="user.password"
              name="password"
              id="password"
            />
            <span class="errors" v-if="errors.has('password')">{{
              errors.get("password")
            }}</span>
          </div>
          <input type="submit" value="Đăng nhập" class="btn btn-primary" />
        </form>
        <div class="card-color">
          <h2>Bạn chưa có tài khoản?</h2>
          <p>Đăng kí tài thoản để được xem các bài viết nhé!</p>
          <router-link :to="{ name: 'register' }" class="btn btn-secondary"
            >Đăng kí</router-link
          >
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapActions } from "vuex";
import Errors from "@/utilities/Errors";
import Storage from "@/utilities/Storage";
export default {
  name: "Login",
  data: () => ({
    errors: new Errors(),
    user: {
      email: "",
      password: "",
    },
  }),
  beforeMount() {
    window.handleCredentialResponse = (res) => {
      this.handleCredentialResponse(res);
    };
  },
  mounted() {
    const googleScript = document.createElement("script");
    googleScript.setAttribute("src", "https://accounts.google.com/gsi/client");
    document.head.appendChild(googleScript);
  },
  beforeDestroy() {
    delete window.handleCredentialResponse;
  },
  methods: {
    ...mapActions(["saveToken"]),
    handleCredentialResponse(response) {
      this.$swal({
        title: "Đang đăng nhập",
        text: "Vui lòng chờ ...",
        allowEscapeKey: false,
        allowOutsideClick: false,
      });
      this.$swal.showLoading();
      this.axios
        .post("/auth/google", {
          id_token: response.credential,
        })
        .then((res) => {
          this.saveToken(res.data.token);
          Storage.record("email", res.data.user.email);
          this.$router.push("/");
          this.$swal.closeModal();
        })
        .catch((err) => {
          this.$swal({
            icon: "Lỗi",
            title: "Đã xuất hiện lỗi.",
            text: err.response.data.msg ? err.response.data.msg : err,
          });
        });
    },
    login() {
      this.errors.clearAll();
      this.$swal({
        title: "Đang đăng nhập",
        text: "Vui lòng chờ ...",
        allowEscapeKey: false,
        allowOutsideClick: false,
      });
      this.$swal.showLoading();
      this.axios
        .post("/auth/login", this.user)
        .then((res) => {
          this.saveToken(res.data.token);
          this.$router.push("/");
          this.$swal.closeModal();
        })
        .catch((err) => {
          const errorData = err.response.data;
          let msg = "";

          if (errorData.errors) {
            this.errors.record(errorData.errors);
            msg = "Không được bỏ trống trường này!";
          } else if (errorData.msg) {
            msg = errorData.msg;
          } else {
            msg = err;
          }

          this.$swal({
            icon: "Lỗi",
            title: "Đã xuất hiện lỗi",
            text: msg,
          });
        });
    },
  },
};
</script>