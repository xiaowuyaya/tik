'use strict'
const api = require('../core/api')
const Controller = require('ee-core').Controller

class LcuHandleController extends Controller {
  constructor(ctx) {
    super(ctx)
  }

  async getGameStatus(_args, _event) {
    return api.getGameStatus()
  }

  async currentSummonerInfo(_args, _event) {
    return this.service.lcuHandle.currentSummonerInfo()
  }

  async checkSummonerExist(args, _event) {
    return this.service.lcuHandle.checkSummonerExist(args.summonerName)
  }

  async searchSummonerInfo(args, _event) {
    return this.service.lcuHandle.searchSummonerInfo(args.summonerName)
  }

  async historyMatchesList(args, _event) {
    return this.service.lcuHandle.historyMatchesList(args.summonerName, args.page, args.limit)
  }

  async matchesDetail(args, _event) {
    return this.service.lcuHandle.matchesDetail(args.gameId)
  }

  async confirmChampionById(args, _event) {
    return this.service.lcuHandle.confirmChampionById(args.championId, args.confirm)
  }

  async getPanelData(args, _event) {
    return this.service.lcuHandle.getPanelData(args.status)
  }

  async getPanelDataInChampSelect(_args, _event) {
    return this.service.lcuHandle.getPanelDataInChampSelect()
  }

  async getPanelDataInProgress(_args, _event) {
    return this.service.lcuHandle.getPanelDataInProgress()
  }

  async changeTiger(args, _event) {
    return this.service.lcuHandle.changeTiger(args.tiger)
  }

  async changeStatus(args, _event) {
    return this.service.lcuHandle.changeStatus(args.status)
  }

  async getPlayerSpells(_args, _event) {
    return this.service.lcuHandle.getPlayerSpells()
  }

  async spectatorLaunchByName(args, _event) {
    return api.spectatorLaunchByName(args.summonerName, args.mode)
  }

  async createCustomLobby(args, _event) {
    return api.createCustomLobby(args.gameMode, args.mapId, args.lobbyName)
  }

  async getChampionSkinListById(args, _event) {
    return api.getChampionSkinListById(args.skinId)
  }

  async getLcuImgBase64(args, _event) {
    return api.getLcuImgBase64(args.imgUrl)
  }

  async setBackgroundSkinId(args, _event) {
    return api.setBackgroundSkinId(args)
  }

  async useRunePage(args, _event) {
    return this.service.lcuHandle.useRunePage(args)
  }

}

LcuHandleController.toString = () => '[class LcuHandleController]'
module.exports = LcuHandleController
