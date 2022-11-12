<template>
  <section class="register">
    <div class="container">
      <div class="multi-card">
        <form class="card-white" @submit.prevent="register()">
          <h2>Tạo tài khoản</h2>
          <div class="form-item">
            <label for="name">Họ tên</label>
            <input type="text" v-model="user.name" name="name" id="name" />
            <span class="errors" v-if="errors.has('name')">{{
              errors.get("name")
            }}</span>
          </div>
          <div class="form-item">
            <label for="email">Email</label>
            <input type="email" v-model="user.email" name="email" id="email" />
            <span class="errors" v-if="errors.has('email')">{{
              errors.get("email")
            }}</span>
          </div>
          <div class="form-50">
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
            <div class="form-item">
              <label for="passwordConfirmation">Xác nhận mật khẩu</label>
              <input
                type="password"
                v-model="user.passwordConfirmation"
                name="passwordConfirmation"
                id="passwordConfirmation"
              />
              <span class="errors" v-if="errors.has('passwordConfirmation')">{{
                errors.get("passwordConfirmation")
              }}</span>
            </div>
          </div>
          <input type="submit" value="Đăng kí" class="btn btn-primary" />
        </form>
        <div class="card-color">
          <h2>Chào mừng bạn quay trở lại</h2>
          <p>
            Nếu đã có tài khoản, hãy đăng nhập
          </p>
          <router-link :to="{ name: 'login' }" class="btn btn-secondary"
            >Đăng nhập</router-link
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
  name: "Register",
  data: () => ({
    errors: new Errors(),
    user: {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
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
        title: "Đang đăng kí tài khoản",
        text: "Vui lòng chờ...",
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
            title: "Đã xuất hiện lỗi",
            text: err.response.data.msg ? err.response.data.msg : err,
          });
        });
    },
    register() {
      this.errors.clearAll();
      this.$swal({
        title: "Đang đăng kí tài khoản",
        text: "Vui lòng chờ...",
        allowEscapeKey: false,
        allowOutsideClick: false,
      });
      this.$swal.showLoading();
      this.axios
        .post("/auth/register", this.user)
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
            msg = "Không để trống trường này";
          } else if (errorData.msg) {
            msg = errorData.msg;
          } else {
            msg = err;
          }

          this.$swal({
            icon: "Lỗi",
            title: "Đã xuất hiện lỗi.",
            text: msg,
          });
        });
    },
  },
};
</script>