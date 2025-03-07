<template>
  <div class="md-editor-container" ref="editorRef"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, withDefaults, defineProps, defineEmits, defineExpose } from 'vue'
import Vditor from 'vditor'
import 'vditor/dist/index.css'
import { useStore } from 'vuex'

interface Props {
  modelValue?: string
  height?: number
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  height: 500
})

const emit = defineEmits(['update:modelValue'])
const store = useStore()
const editorRef = ref<HTMLElement>()
/** 编辑器实例 */
const vditor = ref<Vditor>()

/** 初始化编辑器 */
const initEditor = async () => {
  if (!editorRef.value) return

  vditor.value = new Vditor(editorRef.value, {
    height: props.height,
    mode: 'wysiwyg',
    cache: {
      enable: false
    },
    // toolbarConfig: {
    //   pin: true
    // },
    toolbar: [
      'emoji',
      'headings',
      'bold',
      'italic',
      'strike',
      'link',
      '|',
      'list',
      'ordered-list',
      'check',
      'outdent',
      'indent',
      '|',
      'quote',
      'line',
      'code',
      'inline-code',
      'insert-before',
      'insert-after',
      '|',
      'upload',
      'table',
      '|',
      'undo',
      'redo',
      '|',
      'fullscreen',
      'preview'
    ],
    upload: {
      accept: 'image/*,.mp4,.webm,.wav,.mp3',
      url: `${process.env.VUE_APP_baseUrl}/upload`,
      fieldName: 'file',
      // multiple: false,
      headers: {
        Authorization: 'Bearer ' + store.getters.token
      }
    },
    after: () => {
      vditor.value?.setValue(props.modelValue || '')
      // 初始化主题
      changeTheme()
    },
    input: (value) => {
      emit('update:modelValue', value)
    }
  })
}

/** 监听内容变化 */
watch(
  () => props.modelValue,
  (newVal) => {
    try {
      if (vditor.value) {
        if (vditor.value.getValue() === newVal) return
        vditor.value.setValue(newVal)
      }
    } catch (error) {
      // console.error(error)
    }
  }
)

/** 改变主题 */
function changeTheme() {
  const isDark = store.getters.isDarkMode
  const theme = isDark ? 'dark' : 'classic'
  const contentTheme = isDark ? 'dark' : 'light'
  const codeTheme = isDark ? 'paraiso-dark' : 'paraiso-light'
  vditor.value?.setTheme(theme, contentTheme, codeTheme)
}

// 监听暗黑模式
watch(
  () => store.getters.isDarkMode,
  (newVal) => {
    changeTheme()
  }
)

onMounted(() => {
  initEditor()
})

onBeforeUnmount(() => {
  vditor.value?.destroy()
})

defineExpose({
  /** 获取编辑器实例 */
  getEditor: () => vditor.value
})
</script>
<script lang="ts">
export default {
  name: 'MdEditor'
}
</script>

<style lang="scss" scoped>
.md-editor-container {
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
}
</style>
