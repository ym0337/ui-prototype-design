<script lang="ts" setup>
import { ref, onMounted, toRaw } from "vue";
import {
  Document,
  Menu as IconMenu,
  ArrowRight,
  ArrowLeft
} from '@element-plus/icons-vue'
import { usePageCompsStore } from '@/store/pageComps'
const pageCompsStore = usePageCompsStore()
const isCollapse = ref(true)

const menusList = [
  {
    value: 0,
    label: '组件1',
    component: Document
  },
]
const menuIndex = ref(menusList[0].value)

const changeMenu = (menu: { value: number }) => {
  menuIndex.value = menu.value
}

const compsList = [
  {
    label: '基础组件',
    name: 'base',
    data: [
      {
        name: '1',
        label: '输入框',
        // icon: Setting,
        span: 12,
        comp: {
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
          label: '确认',
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
          type: 'select',
          prop: 'gender',
          props: {
            style: {
              width: '200px'
            }
          },
          options: [
            { label: '男', value: 'male' },
            { label: '女', value: 'female' }
          ],
          events: {
            change: (val) => console.log('下拉框选择:', val)
          }
        },
      },
    ]
  }
]

const selectComp = (data: any) => {
  // console.log(comp)
  // console.log(toRaw(pageCompsStore.menus))
  pageCompsStore.addComp(data.comp)
  // console.log(toRaw(pageCompsStore.getAllComps()))

}

const activeNames = ref(['1'])
const handleChange = (val: any) => {
  console.log(val)
}
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
        <el-collapse class="menu-content" v-model="activeNames" @change="handleChange">
          <el-collapse-item :title="comp.label" name="1" v-for="comp in compsList">
            <el-row>
              <el-col :span="compItem.span || 12" v-for="compItem in comp.data" @click="selectComp(compItem)">
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
}
</style>