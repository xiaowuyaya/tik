import { Message } from '@arco-design/web-vue';

export const useMessage = (type: string, content: string) => {
  if (type == 'success') {
    Message.success({
      content,
      duration: 1500,
    })
  }
  if (type == 'error') {
    Message.error({
      content,
      duration: 1500,
    })
  }
}