/* empty css              *//* empty css              *//* empty css               *//* empty css               *//* empty css               *//* empty css               *//* empty css               *//* empty css                */import{d as C,e as I,f as w,H as S,g as D,c as m,b as e,w as o,r as v,a1 as N,o as d,k as u,a as r,j as P,a2 as z,X as L,a3 as M,n as h,M as F,a4 as R,a5 as T,F as $,p as j,B as O,s as X}from"./index.1f476c61.js";import{u as q}from"./user.42c413bc.js";import"./request.c7b83a79.js";const H={class:"flex flex-col w-full h-full"},Y=r("div",{class:"text-base font-medium text-gray-500 mb-0.5"},"\u8D26\u53F7\u4FE1\u606F\u4FEE\u6539",-1),G={key:0,class:"arco-upload-list-picture custom-upload-avatar"},J=["src"],K={class:"arco-upload-list-picture-mask"},Q={key:1,class:"arco-upload-picture-card"},W={class:"arco-upload-picture-card-text"},Z=r("div",{style:{"margin-top":"10px","font-weight":"600"}},"Upload",-1),ee=h("\u63D0\u4EA4\u66F4\u65B0"),ae=h("\u9000\u51FA\u8D26\u53F7"),_e=C({__name:"account",setup(te){const a=q(),c=I(),g={BASE_URL:"./",MODE:"production",DEV:!1,PROD:!0}.VITE_APP_BASE_API,p=w({url:g+"/user/updateAvatar",headers:{Authorization:S()}}),t=D({url:a.avatarUrl,status:"",percent:0}),B=async()=>{F.success({content:"\u5934\u50CF\u4FE1\u606F\u66F4\u65B0\u6210\u529F",duration:1500}),await a.myInfo({mac:c.mac,clientVersion:c.version}),t.value.url=a.avatarUrl},V=_=>{F.error({content:`\u5934\u50CF\u66F4\u65B0\u5931\u8D25:${_}`,duration:3e3})},y=async()=>{await a.updateUser(),await a.myInfo({mac:c.mac,clientVersion:c.version})};return(_,l)=>{const E=v("IconEdit"),A=R,k=v("IconPlus"),x=T,n=$,i=j,f=O,b=X,U=N;return d(),m("div",H,[e(U,{class:"h-full",hoverable:!0,"header-style":{border:"none"}},{default:o(()=>[Y,e(b,{model:u(a),style:{width:"600px"}},{default:o(()=>[e(n,null,{default:o(()=>[e(x,{action:p.url,headers:p.headers,fileList:t.value?[t.value]:[],accept:"image/png, image/jpeg, image/gif","show-file-list":!1,onSuccess:B,onError:V},{"upload-button":o(()=>[r("div",{class:M(`arco-upload-list-item${t.value&&t.value.status==="error"?" arco-upload-list-item-error":""}`)},[t.value&&t.value.url?(d(),m("div",G,[r("img",{src:t.value.url},null,8,J),r("div",K,[e(E)]),t.value.status==="uploading"&&t.value.percent<100?(d(),P(A,{key:0,percent:t.value.percent,type:"circle",size:"mini",style:z({position:"absolute",left:"50%",top:"50%",transform:"translateX(-50%) translateY(-50%)"})},null,8,["percent","style"])):L("",!0)])):(d(),m("div",Q,[r("div",W,[e(k),Z])]))],2)]),_:1},8,["action","headers","fileList"])]),_:1}),e(n,{field:"nickName",label:"\u767B\u5165\u8D26\u53F7"},{default:o(()=>[e(i,{modelValue:u(a).username,"onUpdate:modelValue":l[0]||(l[0]=s=>u(a).username=s),disabled:""},null,8,["modelValue"])]),_:1}),e(n,{field:"nickName",label:"\u7528\u6237\u6635\u79F0"},{default:o(()=>[e(i,{modelValue:u(a).nickName,"onUpdate:modelValue":l[1]||(l[1]=s=>u(a).nickName=s),"max-length":"8",placeholder:"\u8BF7\u8F93\u5165\u663E\u793A\u7684\u6635\u79F0"},null,8,["modelValue"])]),_:1}),e(n,{field:"email",label:"\u90AE\u7BB1"},{default:o(()=>[e(i,{modelValue:u(a).email,"onUpdate:modelValue":l[2]||(l[2]=s=>u(a).email=s),"max-length":"32",placeholder:"\u8BF7\u8F93\u5165\u60A8\u7684\u90AE\u7BB1\u5730\u5740"},null,8,["modelValue"])]),_:1}),e(n,{field:"phone",label:"\u624B\u673A\u53F7"},{default:o(()=>[e(i,{modelValue:u(a).phone,"onUpdate:modelValue":l[3]||(l[3]=s=>u(a).phone=s),"max-length":"11",placeholder:"\u8BF7\u8F93\u5165\u4F60\u7684\u624B\u673A\u53F7"},null,8,["modelValue"])]),_:1}),e(n,null,{default:o(()=>[e(f,{type:"primary",onClick:y},{default:o(()=>[ee]),_:1}),e(f,{class:"ml-2",type:"primary",status:"danger",onClick:u(a).logout},{default:o(()=>[ae]),_:1},8,["onClick"])]),_:1})]),_:1},8,["model"])]),_:1})])}}});export{_e as default};