/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import { storeToRefs } from "pinia";
import { createRouter, createWebHistory } from "vue-router";

import { useUserStore } from "@/stores/user";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import MessagingView from "../views/MessagingView.vue";
import MonitoringStatusView from "../views/MonitoringView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import PostingView from "../views/PostingView.vue";
import ProfileView from "../views/ProfileView.vue";
import SettingsView from "../views/SettingView.vue";
import TrustedContactsView from "../views/TrustedContactsView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/profile",
      name: "Profile",
      component: ProfileView,
      meta: { requiresAuth: true },
    },
    {
      path: "/messaging",
      name: "Messaging",
      component: MessagingView,
      meta: { requiresAuth: true },
    },
    {
      path: "/monitoring",
      name: "MonitoringStatus",
      component: MonitoringStatusView,
      meta: { requiresAuth: true },
    },
    {
      path: "/posting",
      name: "Posting",
      component: PostingView,
      meta: { requiresAuth: true },
    },
    {
      path: "/trusted-contacts",
      name: "TrustedContacts",
      component: TrustedContactsView,
      meta: { requiresAuth: true },
    },
    {
      path: "/settings",
      name: "Settings",
      component: SettingsView,
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      name: "Login",
      component: LoginView,
      meta: { requiresAuth: false },
      beforeEnter: (to, from) => {
        const { isLoggedIn } = storeToRefs(useUserStore());
        if (isLoggedIn.value) {
          return { name: "Settings" };
        }
      },
    },
    {
      path: "/:catchAll(.*)",
      name: "not-found",
      component: NotFoundView,
    },
  ],
});

/**
 * Navigation guard to check authentication.
 */
router.beforeEach((to, from) => {
  const { isLoggedIn } = storeToRefs(useUserStore());

  if (to.meta.requiresAuth && !isLoggedIn.value) {
    return { name: "Login" };
  }
});

export default router;
