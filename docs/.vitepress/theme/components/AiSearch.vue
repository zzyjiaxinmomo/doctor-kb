<template>
  <div class="ai-search">
    <button class="ai-search-trigger" @click="open" title="AI 搜索">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
        <path d="M11 8v6" />
        <path d="M8 11h6" />
      </svg>
    </button>

    <Teleport to="body">
      <Transition name="ai-search-fade">
        <div v-if="visible" class="ai-search-overlay" @click.self="close">
          <div class="ai-search-dialog">
            <div class="ai-search-header">
              <div class="ai-search-input-wrap">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <input
                  ref="inputRef"
                  v-model="query"
                  type="text"
                  placeholder="输入问题，如：怎么提交排产申请？"
                  @keydown.enter="handleSearch"
                />
                <button v-if="query" class="ai-search-clear" @click="query = ''">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>
              <kbd class="ai-search-shortcut" @click="close">ESC</kbd>
            </div>

            <div class="ai-search-body">
              <div v-if="!query && !loading && results.length === 0" class="ai-search-suggestions">
                <p class="ai-search-suggestions-title">试试问我：</p>
                <div class="ai-search-suggestion-tags">
                  <button
                    v-for="s in suggestions"
                    :key="s"
                    class="ai-search-suggestion-item"
                    @click="query = s; handleSearch()"
                  >
                    {{ s }}
                  </button>
                </div>
              </div>

              <div v-if="loading" class="ai-search-loading">
                <div class="ai-search-spinner" />
                <span>AI 正在思考...</span>
              </div>

              <div v-if="!loading && results.length > 0" class="ai-search-results">
                <div v-for="(r, i) in results" :key="i" class="ai-search-result-item">
                  <div class="ai-search-result-title">{{ r.title }}</div>
                  <div class="ai-search-result-content">{{ r.content }}</div>
                  <a v-if="r.link" :href="r.link" class="ai-search-result-link">查看详情 →</a>
                </div>
              </div>

              <div v-if="!loading && searched && results.length === 0" class="ai-search-empty">
                <p>未找到相关内容，换个关键词试试？</p>
              </div>
            </div>

            <div class="ai-search-footer">
              <span>由 AI 驱动</span>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(false)
const query = ref('')
const loading = ref(false)
const searched = ref(false)
const inputRef = ref<HTMLInputElement>()
const results = ref<{ title: string; content: string; link?: string }[]>([])

const suggestions = [
  '怎么创建病例？',
  'AI报告怎么查看？',
  '排产申请流程是什么？',
  '患者管理有哪些功能？'
]

function open() {
  visible.value = true
  setTimeout(() => inputRef.value?.focus(), 100)
}

function close() {
  visible.value = false
}

async function handleSearch() {
  if (!query.value.trim()) return

  loading.value = true
  searched.value = false
  results.value = []

  await new Promise(r => setTimeout(r, 1000))
  results.value = [
    {
      title: '模拟结果 - 病例管理',
      content: '这里是 AI 搜索结果的占位内容。接入后端后，将显示真实的 RAG 检索结果。',
      link: '/guide/case-management'
    }
  ]

  loading.value = false
  searched.value = true
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
    e.preventDefault()
    visible.value ? close() : open()
  }
  if (e.key === 'Escape' && visible.value) {
    close()
  }
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
</script>
