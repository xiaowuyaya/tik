import{h as o}from"./request.c7b83a79.js";function a(){return o.request({url:"/common/captcha",method:"GET"})}function n(t){return o.request({url:"/common/getOpggChampionsByPosition",method:"GET",params:{position:t}})}function r(t,e){return o.request({url:"/common/getOpggChampionDetail",method:"GET",params:{championName:t,position:e}})}function g(){return o.request({url:"/common/getOpggChampionsAram",method:"GET"})}function p(t){return o.request({url:"/common/getOpggChampionAramByName",method:"GET",params:{championName:t}})}export{n as a,g as b,r as c,p as d,a as g};