import {app, shell} from "electron";
import path from "path";
import ffi from 'ffi-napi';
import {exec} from 'child_process'

let filePath: string
if (app.isPackaged) {
  filePath = path.join(app.getPath('exe'), '../', 'resources', 'dll', 'skin.dll')
} else {
  filePath = path.join(__dirname, '../../../', 'resources', 'dll', 'skin.dll')
}

export const injectSkin = () => {
  let cmd = `tasklist | findstr "League of Legends.exe"`;
  let pid: any = '';
  let time = setInterval(() => {
    let processList = [];
    exec(cmd, async function (err, stdout, stderr) {
      if (!err) {
        stdout.split('\n').filter((line) => {
          let processMessage = line.trim().split(/\s+/);
          processList.push(processMessage);
        });
        for (let i = 0; i < processList.length; i++) {
          if (processList[i].length != 6 && processList[i].length != 0) {
            pid = processList[i][3];
            break;
          }
        }
      }
    });
    if (pid) {
      clearInterval(time);
      pid = Number(pid);
      console.log(`获取到pid ${pid}`);
      setTimeout(async () => {
        console.log('开始注入');
        console.log(filePath);
        const skinDll = new ffi.Library(filePath, {
          // 方法名必须与C函数名一致
          injection: [
            'int', // 对应 C函数返回类型
            ['int'], // C函数参数列表
          ],
        });
        const injectStatus = skinDll.injection(pid);
        console.log(injectStatus)
        if (injectStatus == 1) {
          shell.beep();
        }
        return injectStatus;
      }, 2100);
    }
  }, 500)
}

export const changeSkinConfig = async(config: any) => {
  const skinDll = new ffi.Library(filePath, {
    // 方法名必须与C函数名一致
    save: [
      'int', // 对应 C函数返回类型
      ['string'], // C函数参数列表
    ],
  });
  const r = skinDll.save(JSON.stringify(config));
  return r;
}