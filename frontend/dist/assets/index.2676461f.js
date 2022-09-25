import{d as v,r as M,o as f,c as b,a as o,b as e,i as j,u as R,e as H,f as I,g as D,h as W,j as y,w as u,k as c,I as E,l as V,m as O,n as k,p as T,F as z,q as N,B as $,s as U,t as P,v as G,M as J,x as w,y as B,T as K,z as Q}from"./index.1f476c61.js";import{_ as X}from"./logo.7fbeff0b.js";/* empty css              *//* empty css               *//* empty css               *//* empty css               *//* empty css               */import{g as Y}from"./common.fcdc249a.js";import{u as Z,r as ee}from"./user.42c413bc.js";import"./request.c7b83a79.js";const ue={class:"p-2 h-16 backdrop-filter backdrop-blur-[5px] flex justify-between items-center user-drag"},se=o("img",{class:"w-12",src:X},null,-1),ae={class:"flex justify-between items-center no-drag"},te=v({__name:"Header",setup(A){const n=async()=>{j.invoke("controller.common.mainWindowClose",{})};return(s,d)=>{const r=M("icon-close");return f(),b("header",ue,[se,o("div",ae,[o("div",{class:"px-2 rounded-md hover:opacity-60 active:opacity-20",onClick:n},[e(r,{size:"26",class:"!text-light-700"})])])])}}});const oe=["src"],le=k("\u767B\u5165"),C=v({__name:"LoginForm",setup(A){const n=R(),s=H(),d=Z(),{version:r,mac:a}=s,t=I({...{username:"",password:"",captchaId:"",verifyCode:"",clientVersion:r,mac:a}}),F=D("");W(async()=>{await _()});const _=async()=>{const l=await Y(),{id:i,img:h}=l.data;t.captchaId=i,F.value=h},x=async()=>{try{await d.doLogin(t),setTimeout(()=>{n.push({name:"home"})},1e3)}catch{await _()}};return(l,i)=>{const h=T,g=z,q=N,L=$,S=U;return f(),y(S,{model:t,onSubmit:x},{default:u(()=>[e(g,{field:"username","hide-label":"",rules:[{required:!0,message:"\u767B\u5165\u7528\u6237\u540D\u4E0D\u80FD\u4E3A\u7A7A"}]},{prefix:u(()=>[e(c(E))]),default:u(()=>[e(h,{class:"w-full",modelValue:t.username,"onUpdate:modelValue":i[0]||(i[0]=p=>t.username=p),size:"large",placeholder:"\u8BF7\u8F93\u5165\u767B\u5165\u7528\u6237\u540D"},null,8,["modelValue"])]),_:1}),e(g,{field:"password","hide-label":"",rules:[{required:!0,message:"\u767B\u5165\u5BC6\u7801\u7528\u6237\u540D\u4E0D\u80FD\u4E3A\u7A7A"}]},{prefix:u(()=>[e(c(V))]),default:u(()=>[e(q,{class:"w-full",modelValue:t.password,"onUpdate:modelValue":i[1]||(i[1]=p=>t.password=p),size:"large",placeholder:"\u8BF7\u8F93\u5165\u767B\u5165\u5BC6\u7801","allow-clear":""},null,8,["modelValue"])]),_:1}),e(g,{field:"verifyCode","hide-label":"",rules:[{required:!0,message:"\u9A8C\u8BC1\u7801\u4E0D\u80FD\u4E3A\u7A7A"}]},{prefix:u(()=>[e(c(O))]),default:u(()=>[e(h,{class:"!w-[70%]",modelValue:t.verifyCode,"onUpdate:modelValue":i[2]||(i[2]=p=>t.verifyCode=p),size:"large",placeholder:"\u8BF7\u8F93\u5165\u53F3\u4FA7\u9A8C\u8BC1\u7801"},null,8,["modelValue"]),o("img",{class:"w-[94px] ml-2 cursor-pointer",src:F.value,alt:"\u52A0\u8F7D\u5931\u8D25",onClick:_},null,8,oe)]),_:1}),e(g,{"hide-label":""},{default:u(()=>[e(L,{type:"primary",size:"large",long:"","html-type":"submit"},{default:u(()=>[le]),_:1})]),_:1})]),_:1},8,["model"])}}}),ne=k("\u6CE8\u518C\u8D26\u53F7"),re=v({__name:"RegisterForm",setup(A){const s=I({...{username:"",password:"",nickName:"",phone:""}}),d=async()=>{try{await ee(s),J.success({content:"\u6CE8\u518C\u6210\u529F\uFF0C\u5FEB\u5FEB\u767B\u5165\u5427\uFF01",duration:3*1e3})}catch{}};return(r,a)=>{const m=T,t=z,F=N,_=$,x=U;return f(),y(x,{model:s,onSubmit:d},{default:u(()=>[e(t,{field:"username","hide-label":"",rules:[{required:!0,message:"\u767B\u5165\u7528\u6237\u540D\u4E0D\u80FD\u4E3A\u7A7A"}]},{prefix:u(()=>[e(c(E))]),default:u(()=>[e(m,{class:"w-full",modelValue:s.username,"onUpdate:modelValue":a[0]||(a[0]=l=>s.username=l),size:"large",placeholder:"\u8BF7\u8F93\u5165\u767B\u5165\u7528\u6237\u540D"},null,8,["modelValue"])]),_:1}),e(t,{field:"password","hide-label":"",rules:[{required:!0,message:"\u767B\u5165\u5BC6\u7801\u7528\u6237\u540D\u4E0D\u80FD\u4E3A\u7A7A"}]},{prefix:u(()=>[e(c(V))]),default:u(()=>[e(F,{class:"w-full",modelValue:s.password,"onUpdate:modelValue":a[1]||(a[1]=l=>s.password=l),size:"large",placeholder:"\u8BF7\u8F93\u5165\u767B\u5165\u5BC6\u7801","allow-clear":""},null,8,["modelValue"])]),_:1}),e(t,{field:"nickName","hide-label":"",rules:[{required:!0,message:"\u7528\u6237\u6635\u79F0\u4E0D\u80FD\u4E3A\u7A7A"}]},{prefix:u(()=>[e(c(P))]),default:u(()=>[e(m,{class:"w-full",modelValue:s.nickName,"onUpdate:modelValue":a[2]||(a[2]=l=>s.nickName=l),size:"large",placeholder:"\u8BE5\u8D26\u53F7\u6635\u79F0"},null,8,["modelValue"])]),_:1}),e(t,{field:"phone","hide-label":"",rules:[{required:!0,message:"\u7528\u6237\u6635\u79F0\u4E0D\u80FD\u4E3A\u7A7A"}]},{prefix:u(()=>[e(c(G))]),default:u(()=>[e(m,{class:"w-full",modelValue:s.phone,"onUpdate:modelValue":a[3]||(a[3]=l=>s.phone=l),size:"large",placeholder:"\u624B\u673A\u53F7\uFF08\u7528\u4E8E\u627E\u56DE\u8D26\u53F7\uFF09"},null,8,["modelValue"])]),_:1}),e(t,{"hide-label":""},{default:u(()=>[e(_,{type:"primary",size:"large",long:"","html-type":"submit"},{default:u(()=>[ne]),_:1})]),_:1})]),_:1},8,["model"])}}}),ie={class:"h-full w-full login-container"},de={class:"h-[90%] flex items-center"},ce={class:"absolute left-24 py-8 px-8 w-[400px] rounded-md flex flex-col backdrop-filter backdrop-blur-md bg-light-100 bg-opacity-50"},me={class:"font-bold text-gray-900"},_e=o("h1",{class:"text-[2rem] leading-12"},"\u767B\u5165\u5230",-1),pe=o("h1",{class:"text-[1.8rem] leading-12"},"Tik \u82F1\u96C4\u8054\u76DF\u5BF9\u5C40\u52A9\u624B",-1),fe={class:"text-base py-2 font-normal"},Fe=o("span",{class:"text-gray-700"},"\u6CA1\u6709\u8D26\u53F7\u5417\uFF1F",-1),he={class:"text-base py-2 font-normal"},ge=o("span",{class:"text-gray-700"},"\u5DF2\u6709\u8D26\u53F7\uFF1F",-1),Ee=v({__name:"index",setup(A){const n=D(0),s=D(C),d=r=>{r==0?(n.value=0,s.value=C):(n.value=1,s.value=re)};return(r,a)=>(f(),b("div",ie,[e(te),o("div",de,[o("div",ce,[o("div",me,[_e,pe,w(o("div",fe,[Fe,o("a",{class:"text-sky-700 hover:text-sky-600",href:"#",onClick:a[0]||(a[0]=m=>d(1))},"\u6CE8\u518C\u65B0\u8D26\u53F7")],512),[[B,n.value==0]]),w(o("div",he,[ge,o("a",{class:"text-sky-700 hover:text-sky-600",href:"#",onClick:a[1]||(a[1]=m=>d(0))},"\u7ACB\u5373\u767B\u5165")],512),[[B,n.value==1]])]),e(K,{mode:"out-in",duration:300,"enter-active-class":"animate__animated animate__fadeIn","leave-active-class":"animate__animated animate__fadeOut"},{default:u(()=>[(f(),y(Q(s.value),{class:"!mt-6"}))]),_:1})])])]))}});export{Ee as default};