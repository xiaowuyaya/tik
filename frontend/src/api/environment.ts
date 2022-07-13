import http from "@/utils/request";

interface CreateEnvironmentDto {
  environment: string;
  summonerId: string;
  summonerName: string;
}


 export function add(data: CreateEnvironmentDto){
  return http.request({
    url: '/environment/add',
    method: 'POST',
    data
  })
}