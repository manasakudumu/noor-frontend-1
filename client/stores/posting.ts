import { fetchy } from "@/utils/fetchy";
import { defineStore } from "pinia";
import { ref } from "vue";

interface Post {
  id: string;
  content: string;
  createdAt: Date;
  // Add any other properties you have for posts
}

export const usePostingStore = defineStore("posting", () => {
  const posts = ref<Post[]>([]); // Specify the type for posts

  async function fetchPosts() {
    posts.value = await fetchy("/api/posts", "GET");
  }

  async function createPost(content: string) {
    const newPost: Post = await fetchy("/api/posts", "POST", { body: { content } });
    posts.value.push(newPost);
  }

  return { posts, fetchPosts, createPost };
});
