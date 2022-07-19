<template>
  <div class="flex flex-col p-2">
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
      </a-row>
    </a-card>
    <!-- 表格显示 -->
    <a-card class="mt-2" :hoverable="true" :header-style="{ border: 'none' }">
      <a-table :columns="tableTitle" :data="blacklistStore.list" size="medium" :scroll="tableScroll">
        <template #name-filter="{ filterValue, setFilterValue, handleFilterConfirm, handleFilterReset }">
          <div class="custom-filter">
            <a-space direction="vertical">
              <a-input :model-value="filterValue[0]" @input="(value) => setFilterValue([value])" />
              <div class="custom-filter-footer">
                <a-button @click="handleFilterConfirm">搜索</a-button>
                <a-button @click="handleFilterReset">重置</a-button>
              </div>
            </a-space>
          </div>
        </template>
        <template #createdAt="{ record }">
          <span>{{ dayjs(record.createdAt).format('YYYY.MM.DD  HH:mm') }}</span>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { useBlacklistStore } from '@/stores/modules/blacklist';
import { useUserStore } from '@/stores/modules/user';
import { environmentOption } from '@/utils/options';
import { IconSearch } from '@arco-design/web-vue/es/icon';
import { onBeforeMount, reactive, ref, h } from 'vue';
import { ElMessage } from 'element-plus';

const blacklistStore = useBlacklistStore();
const userStore = useUserStore();

const useForm = reactive({
  environment: '',
  summonerName: '',
  summonerId: '',
  banName: '',
  reason: '',
});

const tableScroll = ref({
  x: '100%',
  y: '460px',
});

const tableTitle = [
  {
    title: '大区',
    dataIndex: 'environment',
    width: '90',
  },
  { title: '账号', dataIndex: 'summonerName', width: '140' },
  {
    title: '拉黑玩家',
    dataIndex: 'banName',
    width: '140',
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
    width: '150',
    sortable: {
      sortDirections: ['ascend', 'descend'],
    },
  },
];

onBeforeMount(async () => {
  if (userStore.environment) {
    useForm.environment = userStore.environment;
  }
  if (userStore.summonerName) {
    useForm.summonerName = userStore.summonerName;
  }
  if (userStore.summonerId) {
    useForm.summonerId = userStore.summonerId;
  }
  await blacklistStore.getAll();
});

const submit = async () => {
  let errMsg = '';
  if (useForm.environment == '') errMsg += '所在大区 ';
  if (useForm.summonerName == '') errMsg += '账号 ';
  if (useForm.banName == '') errMsg += '拉黑玩家 ';
  if (errMsg != '') {
    ElMessage({
      message: `${errMsg}不可为空`,
      type: 'error',
      duration: 3 * 1000,
      offset: 45,
    });
    return;
  }
  await blacklistStore.add(useForm);
};

const reload = async () => {
  await blacklistStore.getAll();
};
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
