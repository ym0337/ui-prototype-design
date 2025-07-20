<script lang="ts" setup>
import { ref, reactive, onMounted, toRaw } from "vue";
import {
  ArrowRight,
  ArrowLeft
} from '@element-plus/icons-vue'
import { usePageCompsStore } from '@/store/pageComps'
const pageCompsStore = usePageCompsStore()

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
      {
        type: 'input',
        label: '占位符',
        model: 'placeholder',
        placeholder: '请输入占位符'
      },
      {
        type: 'input',
        label: '宽度',
        model: 'width',
        placeholder: '请输入宽度'
      }
    ]
  }
])

const activeNames = ref(['1'])
const handleChange = (val: any) => {
  console.log(val)
}

const form = reactive({
  placeholder: '',
  width: 200
})

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
              {{item.title}}
            </div>
          </template>
          <div class="config-content">
            <el-row>
              <el-col v-for="(field, fIndex) in item.fields" :key="fIndex" :span="24">
                <div>{{field.label}}</div>
                <el-input v-model="form[field.model]"></el-input>
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
  }

  ::v-deep .el-collapse-icon-position-right .el-collapse-item__header {
    background-color: #fafafa;
  }
}
</style>