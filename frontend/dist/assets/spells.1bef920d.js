import{d as f,g as p,h as x,i as c,c as a,a as l,K as g,X as _,a7 as h,a8 as w,o}from"./index.1f476c61.js";const k={class:"h-full w-full flex flex-col"},y=l("div",{class:"text-base text-center text-white user-drag"},[l("span",{class:"bg-sky-600 px-4"},"Tik \u82F1\u96C4\u8054\u76DF\u5BF9\u5C40\u52A9\u624B \u624B\u52A8\u6280\u80FD\u63D0\u9192 (\u53EF\u62D6\u52A8\u533A)")],-1),F={class:"mt-2"},S={key:0,class:"text-base font-extrabold text-center text-red-500"},B={key:1,class:"px-4 flex items-center justify-between"},C=["src"],D={class:"flex flex-col ml-1 items-center justify-center"},E=["src","onClick"],A=["src","onClick"],b=f({__name:"spells",setup(N){const i=window.utils,u=p(""),n=p([]);x(async()=>{u.value=i.translate("status",await c.invoke("controller.lcuHandle.getGameStatus",{})),await m(u.value)}),c.ipc.on("playerStatus",async(s,t)=>{u.value=i.translate("status",t),await m(t)});async function m(s){(s=="InProgress"||s=="\u6E38\u620F\u4E2D")&&(n.value=await c.invoke("controller.lcuHandle.getPlayerSpells",{}),console.log(n.value)),(s=="ReadyCheck"||s=="\u7B49\u5F85\u63A5\u53D7\u5BF9\u5C40")&&(n.value=[])}async function d(s,t,e,r){c.invoke("controller.common.spellsWindowHandleSpellsTime",{championName:s,summonerName:t,spellName:e,cooldownBurn:r})}return(s,t)=>(o(),a("div",k,[y,l("div",F,[n.value.length==0?(o(),a("div",S," \u6682\u65E0\u6570\u636E,\u5F53\u524D\u6E38\u620F\u72B6\u6001\uFF1A"+g(u.value),1)):_("",!0),n.value.length!=0?(o(),a("div",B,[(o(!0),a(h,null,w(n.value,(e,r)=>(o(),a("div",{class:"flex",key:r},[l("img",{class:"w-[70px]",src:e.championImg},null,8,C),l("div",D,[l("img",{class:"w-[32px]",src:e.summonerSpellOne.img,onClick:v=>d(e.championName,e.summonerName,e.summonerSpellOne.name,e.summonerSpellOne.cooldownBurn)},null,8,E),l("img",{class:"w-[32px] mt-1",src:e.summonerSpellTwo.img,onClick:v=>d(e.championName,e.summonerName,e.summonerSpellTwo.name,e.summonerSpellTwo.cooldownBurn)},null,8,A)])]))),128))])):_("",!0)])]))}});export{b as default};