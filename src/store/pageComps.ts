// store/user.ts
import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs'

interface comp {
  id: String,
  type: String,
  label?: String,
  prop?: String,
  props?: any,
  events?: any,
  createdAt: String
}

export const usePageCompsStore = defineStore('pageComps',
  () => {
    // curComp 当前选中的组件
    const curComp = ref<comp | null>(null)
    // 当前页面所有组件
    const allComps = ref<comp[]>([])
    try {
      const _comps = JSON.parse(sessionStorage.getItem('pageComps') || '{}')
      if (_comps && _comps.allComps) {
        allComps.value = _comps.allComps
      }
    } catch (error) {
      console.error(error)
    }

    function selectComp(comp: comp) {
      curComp.value = comp
    }

    function updateComp(comp: comp) {
      curComp.value = comp
    }

    function addComp(c: comp) {
      const uid = uuidv4();
      allComps.value.push({
        ...c,
        id: uid,
        prop: `prop-${uid}`,
        createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss')
      });
    }

    function removeComp(id: String) {
      allComps.value = allComps.value.filter(comp => comp.id !== id)
      curComp.value = null
    }

    // 暴露需要访问的状态和方法
    return {
      allComps,
      curComp,
      selectComp,
      updateComp,
      addComp,
      removeComp,
    }
  },
  {
    persist: {
      key: 'pageComps',      // 自定义存储键名
      storage: sessionStorage, // 改为会话级存储
      pick: ['curComp','allComps'],
      // serializer: {
      //   serialize: (value) => JSON.stringify(value),
      //   deserialize: (value) => JSON.parse(value),
      // }
    }
  })