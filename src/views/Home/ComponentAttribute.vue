<script lang="ts" setup>
import { ref, reactive, onMounted, toRaw, watch } from "vue";
import {
  ArrowRight,
  ArrowLeft,
  Delete
} from '@element-plus/icons-vue'
import { storeToRefs } from "pinia";
import { usePageCompsStore } from '@/store/pageComps'
const pageCompsStore = usePageCompsStore()
const { curComp } = storeToRefs(pageCompsStore)


const isCollapse = ref(true)

const configTabs = [
  {
    label: '字段属性',
    value: 'base'
  },
  {
    label: '其他',
    value: 'other'
  }
]
const tabIndex = ref(configTabs[0].value)
const tabChange = (tab: any) => {
  tabIndex.value = tab.value
}

const collapseLists = reactive([
  {
    title: '基础设置',
    name: '1',
    fields: [
      // {
      //   type: 'input',
      //   label: '占位符',
      //   model: 'placeholder',
      //   placeholder: '请输入占位符'
      // },
      {
        type: 'input',
        label: '宽度',
        model: 'width',
        placeholder: '请输入宽度'
      }
    ]
  },
  {
    title: '数据设置',
    name: '2',
    fields: [
      {
        type: 'select-options',
        label: 'options数据',
        model: 'option',
        options: [
          {
            label: '选项3',
          },
          {
            label: '选项4',
          }
        ]
      },
    ]
  }
])

const activeNames = ref(['1', '2'])
const handleChange = (val: any) => {
  console.log(val)
}

const form = reactive({
  placeholder: '',
  width: 200
})

watch(curComp, (newVal) => {
  // console.log('curComp', toRaw(newVal))
  if (newVal && newVal.type === 'select') {
    // 设置options数据
    const selectComp = collapseLists[1].fields.find(item => item.type == 'select-options')
    selectComp.options = newVal.options
  }
}, { deep: true })

onMounted(async () => {
});
</script>

<template>
  <el-aside class="right-part" :style="{
    transition: 'all 0.5s',
    width: isCollapse ? '300px' : '0px',
  }">
    <span class="right-icon" @click="isCollapse = !isCollapse">
      <el-icon v-if="isCollapse">
        <ArrowRight />
      </el-icon>
      <el-icon v-else>
        <ArrowLeft />
      </el-icon>
    </span>
    <div>

      <div class="config-tabs">
        <div v-for="tab in configTabs" :key="tab.value" :class="[tabIndex == tab.value ? 'active' : '']"
          @click="tabChange(tab)">{{ tab.label }}</div>
      </div>
      <div style="padding: 10px">
        <el-button type="primary" plain>下拉框</el-button>
      </div>
    </div>
    <el-scrollbar>
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item v-for="item in collapseLists" :key="item.name" :name="item.name">
          <template #title="{ isActive }">
            <div style="padding: 0 10px;">
              {{ item.title }}
            </div>
          </template>
          <div class="config-content">
            <el-row>
              <el-col v-for="(field, fIndex) in item.fields" :key="fIndex" :span="24">
                <template v-if="field.type === 'input'">
                  <div>{{ field.label }}</div>
                  <el-input v-model="form[field.model]"></el-input>
                </template>
                <template v-if="field.type === 'select-options'">
                  <div>{{ field.label }}</div>
                  <div class="select-options" v-for="option in field.options" :key="option.label">
                    <el-input v-model="option.label"></el-input>
                    <el-button type="danger" :icon="Delete" />
                  </div>
                </template>
              </el-col>
            </el-row>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-scrollbar>
  </el-aside>
</template>

<style scoped lang="scss">
.el-aside {
  overflow: visible;
}

.right-part {
  width: 300px;
  background-color: #fff;
  position: relative;

  .right-icon {
    cursor: pointer;
    position: absolute;
    left: -14px;
    background: #fff;
    height: 40px;
    width: 16px;
    border-radius: 6px 0 0 6px;
    top: calc(50% + 7px);
    align-items: center;
    display: flex;
  }

  .config-tabs {
    display: flex;
    height: 48px;

    >div {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      border-bottom: 2px solid #eee;
      cursor: pointer;
      color: #ccc;
      white-space: nowrap;
    }

    >.active {
      color: #666;
      font-weight: bold;
      border-bottom-color: $primary-color;
    }
  }

  .config-content {
    padding: 10px;

    .el-col {
      margin-bottom: 10px;
    }

    .el-col:last-child {
      margin-bottom: 0px;
    }

    .select-options {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 5px 0px;
    }
  }

  ::v-deep .el-collapse-icon-position-right .el-collapse-item__header {
    background-color: #fafafa;
  }
}
</style>