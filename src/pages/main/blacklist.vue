<template>
  <div class="flex flex-col w-full h-full">
    <a-card :hoverable="true" :header-style="{ border: 'none' }">
      <a-row :gutter="24" align="center">
        <a-col :span="8">
          <a-form-item field="useForm.environment" label="所在大区">
            <a-select v-model="useForm.environment" placeholder="请输入所在大区" allow-create>
              <a-option v-for="(item, index) in environmentOption" :key="index">{{ item }}</a-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item field="useForm.summonerName" label="账号">
            <a-input v-model="useForm.summonerName" placeholder="需要绑定的玩家" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item field="useForm.banName" label="拉黑玩家">
            <a-input v-model="useForm.banName" placeholder="拉黑玩家的游戏名" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="20" align="center">
        <a-col :span="16">
          <a-form-item class="!mb-0" field="useForm.reason" label="拉黑原因">
            <a-input v-model="useForm.reason" placeholder="他做了什么？" />
          </a-form-item>
        </a-col>
        <a-col :span="2">
          <a-form-item class="!mb-0">
            <a-button type="primary" @click="submit">拉黑</a-button>
          </a-form-item>
        </a-col>
        <a-col :span="2">
          <a-form-item class="!mb-0">
            <a-button @click="reload">刷新</a-button>
          </a-form-item>
        </a-col>
        <a-col :span="2">
          <a-form-item class="!mb-0">
            <a-button @click="showImportBak = true">导入旧版数据</a-button>
          </a-form-item>
        </a-col>
      </a-row>
    </a-card>
    <!-- 表格显示 -->
    <a-card class="mt-2" :hoverable="true" :header-style="{ border: 'none' }">
      <a-tabs type="rounded">
        <a-tab-pane key="1" title="我的黑名单">
          <a-table :columns="tableTitle" :data="blacklistStore.list" size="medium" :scroll="tableScroll">
            <template #name-filter="{ filterValue, setFilterValue, handleFilterConfirm, handleFilterReset }">
              <div class="custom-filter">
                <a-space direction="vertical">
                  <a-input :model-value="filterValue[0]" @input="value => setFilterValue([value])" />
                  <div class="custom-filter-footer">
                    <a-button @click="handleFilterConfirm">搜索</a-button>
                    <a-button @click="handleFilterReset">重置</a-button>
                  </div>
                </a-space>
              </div>
            </template>
            <template #createdAt="{ record }">
              <span>{{ dayjs(record.createdAt).format('YYYY.MM.DD HH:mm') }}</span>
            </template>
            <template #optional="{ record }">
              <a-button type="primary" status="danger" @click="handleDeleteBlacklist(record)">删除</a-button>
            </template>
          </a-table>
        </a-tab-pane>
        <a-tab-pane key="2" title="诸神板🐷">
          <a-table :columns="blacklistRankTitle" :data="blacklistRankData" size="medium" :scroll="tableScroll">
            <template #name-filter="{ filterValue, setFilterValue, handleFilterConfirm, handleFilterReset }">
              <div class="custom-filter">
                <a-space direction="vertical">
                  <a-input :model-value="filterValue[0]" @input="value => setFilterValue([value])" />
                  <div class="custom-filter-footer">
                    <a-button @click="handleFilterConfirm">搜索</a-button>
                    <a-button @click="handleFilterReset">重置</a-button>
                  </div>
                </a-space>
              </div>
            </template>
            <template #environment-filter="{ filterValue, setFilterValue, handleFilterConfirm, handleFilterReset }">
              <div class="custom-filter">
                <a-space direction="vertical">
                  <a-input :model-value="filterValue[0]" @input="value => setFilterValue([value])" />
                  <div class="custom-filter-footer">
                    <a-button @click="handleFilterConfirm">搜索</a-button>
                    <a-button @click="handleFilterReset">重置</a-button>
                  </div>
                </a-space>
              </div>
            </template>
            <template #reason="{record}">
              <a-link @click="showBanerReason(record.banName)">查看</a-link>
            </template>
            <template #createdAt="{ record }">
              <span>{{ dayjs(record.createdAt).format('YYYY.MM.DD HH:mm') }}</span>
            </template>
            <template #optional="{ record }">
              <a-button type="primary" status="danger" @click="toBlackListSame(record)">我也拉黑</a-button>
            </template>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </a-card>
    <!-- ban reson show -->
    <a-modal v-model:visible="showBanReason" :title="`${banReasonInfo.banName}的拉黑原因`">
     <div class="w-full">
      <a-tag class="m-2" bordered size="large" color="blue" v-for="(item, index) in banReasonInfo.reasons" :key="index">{{item}}</a-tag></div>
    </a-modal>
    <!-- 备份文件导入提醒 -->
    <a-modal v-model:visible="showImportBak" @ok="inputData" ok-text="开始导入">
      <template #title> serendipity 黑名单备份文件导入 </template>
      <div>
        <p>1. 打开旧版本serendipity程序</p>
        <p>2. 点击右上角设置-打开配置路径-在配置路径下找到bans.bak.json文件，记住这个路径！</p>
        <p>3. 点击开始导入，选中bans.bak.json文件开始导入操作</p>
        <p class="text-red-500">
          注意：仅导入当前账号所登入过大区的黑名单信息，如果当前账号下从未登入过黑名单中存在的大区将会导入失败！
        </p>
        <p class="text-red-500">
          例如：如果当前账号{{ userStore.username }}从未在 艾欧尼亚 玩过，而黑名单中有 艾欧尼亚
          的数据，此条数据将导入失败
        </p>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { useBlacklistStore } from '../../store/blacklist'
import { useUserStore } from '../../store/user'
import { environmentOption } from '../../utils/options'
import { IconSearch } from '@arco-design/web-vue/es/icon'
import { onBeforeMount, reactive, ref, h } from 'vue'
import { Message, Modal, TableColumnData } from '@arco-design/web-vue'
import { getRankPage, getReasonByBanName } from '../../api/blacklist'
import { ipcRenderer } from 'electron'

const blacklistStore = useBlacklistStore()
const userStore = useUserStore()

const showImportBak = ref(false)
const showBanReason = ref(false)

const banReasonInfo = reactive({
  banName: '',
  reasons: []
})

const useForm = reactive({
  environment: '',
  summonerName: '',
  summonerId: '',
  banName: '',
  reason: '',
})

const tableScroll = ref({
  x: '100%',
  y: '500px',
})

const tableTitle: TableColumnData[] = [
  {
    title: '大区',
    dataIndex: 'environment',
    width: 90,
  },
  { title: '账号', dataIndex: 'summonerName', width: 140 },
  {
    title: '拉黑玩家',
    dataIndex: 'banName',
    width: 140,
    filterable: {
      filter: (value, record) => record.banName.includes(value),
      slotName: 'name-filter',
      icon: () => h(IconSearch),
    },
  },
  { title: '原因', dataIndex: 'reason' },
  {
    title: '拉黑时间',
    slotName: 'createdAt',
    width: 150,
    sortable: {
      sortDirections: ['ascend', 'descend'],
    },
  },
  {
    title: '操作',
    slotName: 'optional',
    width: 86,
  },
]

const blacklistRankData = ref([])

const blacklistRankTitle: TableColumnData[] = [
  {
    title: '大区',
    dataIndex: 'environment',
    width: 80,
    filterable: {
      filter: (value, record) => record.environment.includes(value),
      slotName: 'environment-filter',
      icon: () => h(IconSearch),
    },
  },
  {
    title: '拉黑玩家',
    dataIndex: 'banName',
    width: 160,
    filterable: {
      filter: (value, record) => record.banName.includes(value),
      slotName: 'name-filter',
      icon: () => h(IconSearch),
    },
  },
  {
    title: '拉黑次数',
    dataIndex: 'count',
    width: 90,
  },
  {
    title: '拉黑原因',
    slotName: 'reason',
    width: 96,
  },
  {
    title: '操作',
    slotName: 'optional',
    width: 86,
  },
]



onBeforeMount(async () => {
  if (userStore.environment) {
    useForm.environment = userStore.environment
  }
  if (userStore.summonerName) {
    useForm.summonerName = userStore.summonerName
  }
  if (userStore.summonerId) {
    useForm.summonerId = userStore.summonerId
  }
  await blacklistStore.getAll()
  const r = await getRankPage({ page: 1, limit: 1000 })
  blacklistRankData.value = r.data.list

})

const submit = async () => {
  let errMsg = ''
  if (useForm.environment == '') errMsg += '所在大区 '
  if (useForm.summonerName == '') errMsg += '账号 '
  if (useForm.banName == '') errMsg += '拉黑玩家 '
  if (errMsg != '') {
    Message.error({
      content: `${errMsg}不可为空`,
      duration: 3 * 1000,
    })
    return
  }
  await blacklistStore.add(useForm)
}

const reload = async () => {
  await blacklistStore.getAll()
}

const handleDeleteBlacklist = async (record: any) => {
  Modal.info({
    title: '删除黑名单',
    content: `是否确定将: ${record.banName}， 移除黑名单`,
    hideCancel: false,
    cancelText: '取消',
    onOk: () => {
      blacklistStore.delete({ ids: [record.id] })
    },
  })
}

const inputData = async () => {
  // console.log("blacklist.inputData");
  
  const importResp = await ipcRenderer.invoke('main-import-blacklist')
  console.log(importResp);
  
  if (importResp.code == 200) {
    for (var i = 0; i < importResp.data.length; i++) {
      await blacklistStore.add({
        environment: importResp.data[i].environment,
        summonerId: '',
        summonerName: importResp.data[i].summonerName,
        banName: importResp.data[i].blackName,
        reason: importResp.data[i].reason,
      })
    }
    Message.success({
      content: `读取黑名单备份文件成功`,
      duration: 3 * 1000,
    })
  } else {
    Message.error({
      content: `读取黑名单备份文件失败:${importResp.msg}`,
      duration: 3 * 1000,
    })
  }
}

const showBanerReason = async(banName: string) => {
  const res =  await getReasonByBanName(banName)
  banReasonInfo.banName = banName
  banReasonInfo.reasons = res.data
  
  showBanReason.value = true
}

const toBlackListSame = async (row: any) => {
  useForm.environment = row.environment
  useForm.banName = row.banName
  useForm.reason = "通过诸神榜拉黑"
  Message.success({content: "信息已同步至上分表单，请手动确定"})
}
</script>
<style scoped>
.custom-filter {
  padding: 20px;
  background: var(--color-bg-5);
  border: 1px solid var(--color-neutral-3);
  border-radius: var(--border-radius-medium);
  box-shadow: 0 2px 5px rgb(0 0 0 / 10%);
}

.custom-filter-footer {
  display: flex;
  justify-content: space-between;
}
</style>
