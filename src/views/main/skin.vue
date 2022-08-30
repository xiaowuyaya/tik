<template>
  <div class="w-full h-full">
    <a-card :hoverable="true" :header-style="{ border: 'none' }">
      <a-form-item class="!mb-0" label="手动技能计时">
        <a-switch v-model="configStore.spellsWin.enable" @change="configStore.changeConfig">
          <template #checked-icon>
            <icon-check />
          </template>
          <template #unchecked-icon>
            <icon-close />
          </template>
        </a-switch>
      </a-form-item>
    </a-card>
  </div>
</template>
<script setup lang="ts"></script>