import { ElMessage } from "element-plus";

export const Message = (r) => {
  if (r.code === 200) {
    ElMessage({
      message: r.msg,
      type: 'success',
      duration: 3 * 1000,
      offset: 50,
    });
  }else{
    ElMessage({
      message: r.msg,
      type: 'error',
      duration: 3 * 1000,
      offset: 50,
    });
  }
}