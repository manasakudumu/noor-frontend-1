/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import { storeToRefs } from "pinia";
import { createRouter, createWebHistory } from "vue-router";

import { useUserStore } from "@/stores/user";
import AlertingView from "@/views/AlertingView.vue";
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import MessagesView from "@/views/MessagingView.vue";
import MonitoringView from "@/views/MonitoringView.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import PostingView from "@/views/PostingView.vue";
import ProfileView from "@/views/ProfileView.vue";
import SettingView from "@/views/SettingView.vue";
import TrustedContactsView from "@/views/TrustedContactsView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/settings",
      name: "Settings",
      component: SettingView,
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
      path: "/profile",
      name: "Profile",
      component: ProfileView,
      meta: { requiresAuth: true },
    },
    {
      path: "/messages",
      name: "Messages",
      component: MessagesView,
      meta: { requiresAuth: true },
    },
    {
      path: "/monitoring",
      name: "Monitoring",
      component: MonitoringView,
      meta: { requiresAuth: true },
    },
    {
      path: "/trusted-contacts",
      name: "TrustedContacts",
      component: TrustedContactsView,
      meta: { requiresAuth: true },
    },
    {
      path: "/alerting",
      name: "Alerting",
      component: AlertingView,
      meta: { requiresAuth: true },
    },
    {
      path: "/posting",
      name: "Posting",
      component: PostingView,
      meta: { requiresAuth: true },
    },
    {
      path: "/:catchAll(.*)",
      name: "NotFound",
      component: NotFoundView,
    },
  ],
});

/**
 * Navigation guards to ensure authenticated access to specific routes.
 */
router.beforeEach((to, from) => {
  const { isLoggedIn } = storeToRefs(useUserStore());

  // Redirect to login if the route requires auth and the user is not logged in
  if (to.meta.requiresAuth && !isLoggedIn.value) {
    return { name: "Login" };
  }
});

export default router;
