<script lang="ts" setup>
import { ref, onMounted, watch, toRaw, onUnmounted } from "vue";
import { ElInput, ElSelect, ElDialog, ElButton } from 'element-plus';
import { usePageCompsStore } from '@/store/pageComps'
const pageCompsStore = usePageCompsStore()

interface ComponentConfig {
  id: string;
  type: string;
  prop: string;
  label?: string;
  props: any;
  options?: any;
  events?: any;
}

const renderComps = (comps: any) => {
  // console.log('render组件集合:', toRaw(comps))
  componentConfigs.value = comps
}

// 动态组件配置
const componentConfigs = ref<ComponentConfig[]>([
  // {
  //   id:'1',
  //   type: 'input',
  //   prop: 'name',
  //   props: {
  //     placeholder: '请输入姓名',
  //     style: {
  //       width: '200px'
  //     }
  //   },
  //   events: {
  //     change: (val) => console.log('输入框变化:', val)
  //   }
  // },
  // {
  //   id:'2',
  //   type: 'select',
  //   prop: 'gender',
  //   props: {
  //     style: {
  //       width: '200px'
  //     }
  //   },
  //   options: [
  //     { label: '男', value: 'male' },
  //     { label: '女', value: 'female' }
  //   ],
  //   events: {
  //     change: (val) => console.log('下拉框选择:', val)
  //   }
  // },
  // {
  //   id:'3',
  //   label:'确认',
  //   type: 'button',
  //   prop: 'btn',
  //   props: {
  //     type:'primary'
  //   },
  //   events: {
  //     click: () => console.log('点击按钮')
  //   }
  // }
]);


const formData = ref<T>({});

// 组件类型映射
const getComponentType = (type: any) => {
  switch (type) {
    case 'input': return ElInput;
    case 'select': return ElSelect;
    case 'button': return ElButton;
    default: return 'div';
  }
};

watch(
  () => pageCompsStore.allComps,
  (newVal) => {
    console.log('当前页面的组件集合:', newVal)
    renderComps(newVal)
  },
  { deep: true, immediate: true }
)

const dragEnd = (event: any) => {
  console.log('更新了位置:', event.detail)
}

const selectCompId = ref('')
const compClick = (item: any) => {
  // console.log('点击了组件:', item)
  selectCompId.value = item.id || ''
  console.log('当前选中的组件id:', selectCompId.value)
}


onMounted(async () => {
  document.addEventListener('click', compClick, true)

});

onUnmounted(() => {
  document.removeEventListener('click', compClick)
})
</script>

<template>
  <el-container class="middle-part">
    <div class="middle-part-container">
      <!-- 动态渲染组件 -->
      <div :class="[selectCompId == item.id ? 'select-comp' : '']" @click="compClick(item)" @drag-end="dragEnd"
        :data-comp-id="item.id" v-draggable v-for="(item, index) in componentConfigs" :key="index">
        <!-- 下拉框 -->
        <el-select v-if="item.type === 'select'" v-model="formData[item.prop]" v-bind="item.props"
          @click="item.events?.click" @change="item.events?.change">
          <el-option v-for="(option, oindex) in item.options" :key="oindex" :label="option.label" v-bind="item.props"
            :value="option.value" />
        </el-select>
        <component v-else :is="getComponentType(item.type)" v-bind="item.props" v-model="formData[item.prop]"
          @click="item.events?.click" @change="item.events?.change">
          <template v-if="item.label">
            {{ item.label || '' }}
          </template>
        </component>
      </div>
    </div>
  </el-container>
</template>

<style scoped lang="scss">
.middle-part {
  background-color: #eee;
  padding: 10px 20px;

  .middle-part-container {
    background-color: #fff;
    width: 100%;
    height: 100%;

    .select-comp {
      border: 2px solid red;
      z-index: 999;
    }
  }
}
</style>