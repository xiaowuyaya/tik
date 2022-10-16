export async function confirmChampionById(championId: number, confirm: boolean) {
  const player: any = await $api.getCurrentSummoner()
  const session: any = await $api.getSessionInfo()
  const actions = session.actions[0]
  const team = session.myTeam
  let cellId, id
  for (let i = 0; i < team.length; i++) {
    const order = team[i]
    if (order.summonerId == player.summonerId) {
      cellId = order.cellId
      break
    }
  }
  for (let i = 0; i < actions.length; i++) {
    const action = actions[i]
    if (action.actorCellId == cellId) {
      id = action.id
    }
  }
  return await $api.selectChampionById(championId, id, confirm)
}

