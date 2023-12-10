import { baseAxios, thumbsnapAxios } from '@axios';
import { Post, PostPayload, PostWithUser } from '@interfaces/post.interface';
import { createTags } from './tags.service';
import { ThumbsnapData } from '@interfaces/thumbsnap.interface';

export async function createPost(payload: PostPayload) {
  if (payload.tags) createTags(payload.tags);

  const photos = await registerPhotos(payload.photos);

  const res = await baseAxios.post('/posts', {
    ...payload,
    photos: photos,
    created_at: Date.now(),
    updated_at: Date.now(),
  });
}

export async function getPosts(): Promise<Post[]> {
  const res = await baseAxios.get('/posts');
  return res.data;
}

// 🟡 posts와 users를 관계 쿼리 : posts와 users 같이 나옴 🟡
// src / components / Main / index.tsx 에서 사용 중
export async function getPostsUsers(): Promise<PostWithUser[]> {
  // 반환하는 형은 Promise이고, 그 형태를 PostAndUser인터페이스 형식으로 맞추겠다
  const res = await baseAxios.get('/posts?_expand=user');
  return res.data;
}

// 🟡 하트 patch 🟡
// src / components / Main / MainCard.tsx 에서 사용 중
export async function patchHeart(post: {
  id: number;
  heart: boolean;
}): Promise<PostWithUser[]> {
  // eslint-disable-next-line prefer-template
  // const res = await axios.patch('/posts/1', heart);
  const res = await baseAxios.patch(`/posts/${post.id}`, post);
  return res.data;
}

export async function registerPhotos(photos: File[]) {
  const res = await Promise.all(
    photos.map((photo) =>
      thumbsnapAxios.post<ThumbsnapData>('/upload', { media: photo })
    )
  );

  return res.map((r) => r.data.data.media);
}

export async function registerPhoto(photo: File) {
  const res = await thumbsnapAxios.post<ThumbsnapData>('/upload', {
    media: photo,
  });
  return res.data.data.media;
}

export async function getPostPaginate(page = 1, limit = 10, options?: {}) {
  const res = await baseAxios.get(
    `/posts?_page=${page}&_limit=${limit}&_expand=user`
  );
  return res.data;
}

export async function getPostsByUserId(userId: number) {
  const res = await baseAxios.get<Post[]>(
    `/posts?userId=${userId}&_sort=id&_order=desc`
  );
  return res.data;
}
