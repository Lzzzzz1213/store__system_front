import { request } from '@/utils/request';


export function uploadImg(data: any) {
  return request({
    url: "/img/upload/",
    method: "post",
    data: data,
    headers: { "Content-Type": "multipart/form-data" }
  })
}


export default {
  uploadImg,
};
