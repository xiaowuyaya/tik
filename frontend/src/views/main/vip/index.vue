<template>
  <div class="p-2">
    <a-row :gutter="12" align="center" justify-content="space-between">
      <!-- 手动技能计时 -->
      <a-col :span="6">
        <a-form-item class="!mb-0" label="enable">
          <a-switch @change="toDoSomething">
            <template #checked-icon>
              <icon-check />
            </template>
            <template #unchecked-icon>
              <icon-close />
            </template>
          </a-switch>
        </a-form-item>
      </a-col>
    </a-row>
  </div>
</template>
<script setup lang="ts">
function toDoSomething() {}
</script>
