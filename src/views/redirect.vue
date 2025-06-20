<script setup>
import * as Vue from "vue";
import { useRoute } from "vue-router";

const router = useRoute();
const { params, query } = router;
const { path } = params;
router.replace({ path: "/" + path, query });

return () => Vue.h(); // avoid warning message
</script>
