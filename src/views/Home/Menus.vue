<script lang="ts" setup>
import { ref, onMounted, toRaw, watch } from "vue";
import { storeToRefs } from "pinia";
import {
  Document,
  Menu as IconMenu,
  ArrowRight,
  ArrowLeft,
  Setting,
  Delete,
} from '@element-plus/icons-vue'
import { usePageCompsStore } from '@/store/pageComps'
const pageCompsStore = usePageCompsStore()
const isCollapse = ref(true)

const menusList = [
  {
    value: 0,
    label: '组件',
    component: Document
  },
  {
    value: 1,
    label: '层级',
    component: Setting
  },
]
const menuIndex = ref(menusList[0].value)

const changeMenu = (menu: { value: number }) => {
  menuIndex.value = menu.value
}

const compsList = [{
  label: '基础组件',
  name: 'base',
  data: [
    {
      name: '1',
      label: '输入框',
      // icon: Setting,
      span: 12,
      comp: {
        label: '输入框',
        type: 'input',
        prop: 'name',
        props: {
          placeholder: '请输入',
          style: {
            width: '200px'
          }
        },
        events: {
          change: (val) => console.log('输入框变化:', val)
        }
      },

    },
    {
      name: '2',
      label: '按钮',
      // icon: Setting,
      span: 12,
      comp: {
        label: '按钮',
        type: 'button',
        prop: 'btnVal',
        props: {
          type: 'primary'
        },
        events: {
          click: () => console.log('点击按钮')
        }
      },
    },
    {
      name: '3',
      label: '下拉框',
      // icon: Setting,
      span: 12,
      comp: {
        label: '下拉框',
        type: 'select',
        prop: 'gender',
        props: {
          style: {
            width: '200px'
          }
        },
        options: [
          { label: '选项1', value: '1' },
          { label: '选项2', value: '2' }
        ],
        events: {
          change: (val) => console.log('下拉框选择:', val)
        }
      },
    },
  ]
}]

const addComp = (data: any) => {
  // console.log(comp)
  // console.log(toRaw(pageCompsStore.menus))
  pageCompsStore.addComp(data.comp)
  // console.log(toRaw(pageCompsStore.getAllComps()))

}

const activeNames = ref(['1'])
const handleChange = (val: any) => {
  console.log(val)
}

// 图层 ===========
// 使用 storeToRefs 解构以保持响应性
const { curComp, allComps } = storeToRefs(pageCompsStore);
// 图层 ===========

watch(
  () => pageCompsStore.allComps,
  (newVal) => {
    // console.log('当前页面的组件集合:', newVal)
  },
  { deep: true, immediate: true }
)

onMounted(async () => {
});
</script>

<template>
  <el-aside class="left-part">
    <span class="left-icon" @click="isCollapse = !isCollapse">
      <el-icon v-if="isCollapse">
        <ArrowLeft />
      </el-icon>
      <el-icon v-else>
        <ArrowRight />
      </el-icon>
    </span>
    <div class="menus">
      <div class="menu-bar">
        <div v-for="menu in menusList" :class="['menu-icon', menu.value == menuIndex ? 'active' : '']"
          :title="menu.label" @click="changeMenu(menu)">
          <el-tooltip effect="dark" :content="menu.label" placement="right">
            <el-icon>
              <component :is="menu.component" />
            </el-icon>
          </el-tooltip>

        </div>
      </div>
      <el-scrollbar :style="{
        transition: 'all 0.5s',
        width: isCollapse ? '250px' : '0px',
      }">
        <div v-if="menuIndex == 0">
          <el-collapse class="menu-content" v-model="activeNames" @change="handleChange">
            <el-collapse-item :title="comp.label" name="1" v-for="comp in compsList">
              <el-row>
                <el-col :span="compItem.span || 12" v-for="compItem in comp.data" @click="addComp(compItem)">
                  <div class="comp-item">
                    <el-icon v-if="compItem.icon">
                      <component :is="compItem.icon" />
                    </el-icon>
                    <span>{{ compItem.label }}</span>
                  </div>
                </el-col>
              </el-row>
            </el-collapse-item>
          </el-collapse>
        </div>
        <div v-else-if="menuIndex == 1">
          <el-scrollbar>
            <div class="layer-list">
              <div :class="['layer-list-item', (curComp && curComp.id == c.id) ? 'active' : '']" v-for="c in allComps" :key="c.id"
                @click="pageCompsStore.selectComp(c)">
                <span>{{ c.label }}</span>
                <el-icon class="delete-icon" @click.prevent="pageCompsStore.removeComp(c.id)">
                  <Delete />
                </el-icon>
              </div>
            </div>
          </el-scrollbar>
        </div>
        <div v-else>暂无</div>
      </el-scrollbar>
    </div>

  </el-aside>

</template>

<style scoped lang="scss">
.el-aside {
  overflow: visible;
}

.left-part {
  width: auto;
  background-color: #fff;
  position: relative;

  .left-icon {
    cursor: pointer;
    position: absolute;
    right: -14px;
    background: #fff;
    height: 40px;
    width: 16px;
    border-radius: 0 6px 6px 0;
    top: calc(50% + 7px);
    align-items: center;
    display: flex;
  }

  .menus {
    display: flex;
    flex-direction: row;
    height: 100%;
  }

  .menu-bar {
    border-right: 1px solid #eee;

    .menu-icon {
      cursor: pointer;
      width: 50px;
      font-size: 24px;
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;

      &.active {
        color: $primary-color;
      }
    }

  }

  .menu-content {
    padding: 0 10px;
    width: 250px;

    .comp-item {
      cursor: pointer;
      height: 32px;
      background: #eee;
      margin: 4px;
      padding: 0 4px;
      font-size: 12px;
      display: flex;
      align-items: center;
      border-radius: 4px;
      border: 1px solid #ccc;
    }
  }

  .layer-list {
    height: 100%;
    padding: 0;

    .layer-list-item {
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 14px;
      height: 32px;
      background-color: #fafafa;
      margin: 5px;
      border-radius: 5px;

      &.active {
        background-color: $primary-color;
        color: #fff;
      }

      &:hover {
        border: 1px solid $primary-color;
      }

      .delete-icon {
        cursor: pointer;
        font-size: 14px;

        &:hover {
          color: #F56C6C;
          font-size: 18px;
          font-weight: bold;
        }
      }
    }
  }
}
</style>