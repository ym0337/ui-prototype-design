export default {
  mounted (el, binding) {
    el.style.position = 'absolute';
    let startX = 0, startY = 0;
    let isDragging = false;

    // 获取边界限制（支持动态计算或静态配置）
    const getBoundary = () => {
      if (binding.value?.boundary) return binding.value.boundary;
      const parent = binding.value?.limitElement || el.parentNode;
      const parentRect = parent.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      return {
        minX: 0,
        maxX: parentRect.width - elRect.width,
        minY: 0,
        maxY: parentRect.height - elRect.height
      };
    };

    // 节流处理移动事件（优化性能）
    const throttleMove = (e) => {
      const parent = binding.value?.limitElement || el.parentNode;
      const parentRect = parent.getBoundingClientRect();

      if (!isDragging) return;
      const boundary = getBoundary();
      const clientX = e.touches?.[0]?.clientX || e.clientX;
      const clientY = e.touches?.[0]?.clientY || e.clientY;
      // 计算新位置并限制边界
      let left = clientX - startX - parentRect.left;
      let top = clientY - startY - parentRect.top;

      left = Math.max(boundary.minX, Math.min(left, boundary.maxX));
      top = Math.max(boundary.minY, Math.min(top, boundary.maxY));

      // 使用transform优化性能（GPU加速）
      el.style.transform = `translate(${left}px, ${top}px)`;
    };

    // 事件结束处理
    const handleEnd = () => {
      /**
       * 通过 new CustomEvent(type, options) 创建自定义事件，支持两个参数：
       * type：事件名称（字符串，如 "myEvent"）。
       * options：配置对象，包含以下属性：
       * detail：传递的自定义数据（任意类型），可通过 event.detail 访问
       * bubbles：布尔值，控制事件是否冒泡（默认 false）
       * cancelable：布尔值，决定事件能否被取消（默认 false）
      **/
      // console.log(el.dataset.compId)
      if (el.dataset.compId) {
        const event = new CustomEvent('drag-end', {
          detail: {
            compId: el.dataset.compId,
            style: el.style.cssText
          }
        });
        el.dispatchEvent(event);
      }
      isDragging = false;
      document.removeEventListener('mousemove', throttleMove);
      document.removeEventListener('touchmove', throttleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchend', handleEnd);
    };

    // 事件开始处理
    const handleStart = (e) => {
      isDragging = true;
      const rect = el.getBoundingClientRect();
      const clientX = e.touches?.[0]?.clientX || e.clientX;
      const clientY = e.touches?.[0]?.clientY || e.clientY;

      // 计算初始偏移量（鼠标点击位置与元素左上角的差值）
      startX = clientX - rect.left;
      startY = clientY - rect.top;

      document.addEventListener('mousemove', throttleMove);
      document.addEventListener('touchmove', throttleMove, { passive: false });
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchend', handleEnd);

      // 放开这个会导致输入组件失效
      // e.preventDefault();
    };

    // 绑定事件（支持触摸和鼠标）
    el.addEventListener('mousedown', handleStart);
    el.addEventListener('touchstart', handleStart, { passive: false });

    // 组件卸载时清理事件
    const cleanup = () => {
      el.removeEventListener('mousedown', handleStart);
      el.removeEventListener('touchstart', handleStart);
      handleEnd(); // 确保移除所有全局事件
    };

    // 返回清理方法（兼容Vue 3的unmounted钩子）
    // return cleanup;
  },
  unmounted (el) {
    // Vue 3卸载时额外清理（双重保障）
    el._cleanupDrag && el._cleanupDrag();
  }
};