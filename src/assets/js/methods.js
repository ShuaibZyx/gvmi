export default {
  methods: {
    async coinCount() {
      const userId = window.sessionStorage.getItem("userId");
      const { data: userCoinCountRes } = await this.$http.get(
        "coin/count/" + userId
      );
      this.$store.commit("SetUserCoinCount", userCoinCountRes.data);
    },
  },
};
