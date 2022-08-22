<template>
    <div id="kdaChart"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import * as echarts from 'echarts';

type EChartsOption = echarts.EChartsOption

onMounted(() => {
  
  var kdaChartDom:HTMLElement = document.getElementById('kdaChart') as HTMLElement
  var kdaChart = echarts.init(kdaChartDom);
  var kdaChartOption: EChartsOption;

  kdaChartOption = {
    title: {
      show: true,
      text: '近期数据情况'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
        areaStyle: {}
      }
    ]
  }
  kdaChartOption && kdaChart.setOption(kdaChartOption);
})

</script>
