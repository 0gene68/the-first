import {
  Post,
  PostPayload,
  PostAndUser,
  User,
} from '@interfaces/post.interface';
import axios from '@axios';
import { createTags } from './tags.service';

export async function createPost(post: PostPayload) {
  if (post.tags) createTags(post.tags);

  const res = await axios.post('/posts', {
    ...post,
    created_at: Date.now(),
    updated_at: Date.now(),
  });
}

export async function getPosts(): Promise<Post[]> {
  const res = await axios.get('/posts');
  return res.data;
}

// 🟡 posts와 users를 관계 쿼리 : posts와 users 같이 나옴 🟡
// src / components / Main / index.tsx 에서 사용 중
export async function getPostsUsers(): Promise<PostAndUser[]> {
  // 반환하는 형은 Promise이고, 그 형태를 PostAndUser인터페이스 형식으로 맞추겠다
  const res = await axios.get('/posts?_expand=user');
  return res.data;
}

// 하트 patch
export async function patchHeart(heart: {
  heart: boolean;
}): Promise<PostAndUser[]> {
  // eslint-disable-next-line prefer-template
  const res = await axios.patch('/posts/1', heart);

  return res.data;
}
