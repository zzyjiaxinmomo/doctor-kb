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
                  placeholder="输入问题，如：怎么新建初诊病例？"
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
              <!-- 初始建议 -->
              <div v-if="!query && !loading && !error && results.length === 0" class="ai-search-suggestions">
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

              <!-- 加载中 -->
              <div v-if="loading" class="ai-search-loading">
                <div class="ai-search-spinner" />
                <span>AI 正在检索知识库…</span>
              </div>

              <!-- 错误 -->
              <div v-if="!loading && error" class="ai-search-empty">
                <p>{{ error }}</p>
                <button class="ai-search-retry" @click="handleSearch">重试</button>
              </div>

              <!-- 结果 -->
              <div v-if="!loading && !error && (summaryLoading || summary || summaryError || results.length > 0)">
                <!-- AI 摘要：加载中 / 成功 / 失败 -->
                <div v-if="summaryLoading" class="ai-search-summary ai-search-summary--loading">
                  <div class="ai-search-summary-label">
                    <div class="ai-search-summary-dot" />
                    AI 正在生成回答…
                  </div>
                  <div class="ai-search-skeleton">
                    <div class="ai-search-skeleton-line" style="width: 100%" />
                    <div class="ai-search-skeleton-line" style="width: 92%" />
                    <div class="ai-search-skeleton-line" style="width: 70%" />
                  </div>
                </div>

                <div v-else-if="summary" class="ai-search-summary">
                  <div class="ai-search-summary-label">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                    AI 回答
                  </div>
                  <p class="ai-search-summary-text">{{ summary }}</p>
                  <div v-if="sources.length > 0" class="ai-search-summary-sources">
                    <span class="ai-search-summary-sources-label">来源：</span>
                    <a
                      v-for="(s, i) in sources"
                      :key="i"
                      :href="withBase(s.link)"
                      class="ai-search-summary-source"
                      @click="close"
                    >{{ s.title }}</a>
                  </div>
                </div>

                <div v-else-if="summaryError" class="ai-search-summary ai-search-summary--error">
                  <div class="ai-search-summary-label">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
                    </svg>
                    {{ summaryError }}
                  </div>
                </div>

                <div v-if="(summary || summaryError) && results.length > 0" class="ai-search-divider">
                  <span>相关文档</span>
                </div>

                <div v-if="results.length > 0" class="ai-search-results">
                  <div v-for="(r, i) in results" :key="i" class="ai-search-result-item">
                    <div class="ai-search-result-title">{{ r.title }}</div>
                    <div class="ai-search-result-content">{{ r.content }}</div>
                    <a v-if="r.link" :href="withBase(r.link)" class="ai-search-result-link" @click="close">查看详情 →</a>
                  </div>
                </div>
              </div>

              <!-- 无结果 -->
              <div v-if="!loading && !error && searched && !summaryLoading && results.length === 0" class="ai-search-empty">
                <p>未找到相关内容，换个关键词试试？</p>
              </div>
            </div>

            <div class="ai-search-footer">
              <span>由 AI 驱动 · RAG 检索</span>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { withBase } from 'vitepress'

interface SearchResult {
  title: string
  content: string
  link?: string
  score?: number
}
interface SearchResponse {
  summary?: string | null
  results: SearchResult[]
}

// 后端地址：生产环境 API
const API_BASE = 'https://doctor-kb-server-production.up.railway.app'

const visible = ref(false)
const query = ref('')
const loading = ref(false)        // 检索 loading
const summaryLoading = ref(false) // 摘要 loading（异步，独立于检索）
const searched = ref(false)
const error = ref('')
const summary = ref('')
const sources = ref<{ title: string; link: string }[]>([])
const summaryError = ref('')
const results = ref<SearchResult[]>([])
const inputRef = ref<HTMLInputElement>()
// 记录当前请求序号，避免慢的摘要请求覆盖新的搜索结果
let searchSeq = 0

const suggestions = [
  '系统怎么登录？',
  '如何新建初诊病例？',
  '复诊监控怎么用？',
  '硅橡胶取模标准是什么？'
]

function open() {
  visible.value = true
  setTimeout(() => inputRef.value?.focus(), 100)
}

function close() {
  visible.value = false
}

function resetState() {
  loading.value = false
  summaryLoading.value = false
  searched.value = false
  error.value = ''
  summary.value = ''
  sources.value = []
  summaryError.value = ''
  results.value = []
}

async function handleSearch() {
  const q = query.value.trim()
  if (!q) return

  resetState()
  loading.value = true
  // 本次搜索的唯一序号，摘要回来时校验是否过期
  const seq = ++searchSeq

  // ---- 第 1 步：检索（毫秒级，立即渲染结果）----
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 15000)

  try {
    const res = await fetch(`${API_BASE}/api/v1/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: q, mode: 'rag' }),
      signal: controller.signal
    })

    if (!res.ok) {
      throw new Error(`服务异常（${res.status}）`)
    }

    const data: SearchResponse = await res.json()
    results.value = data.results || []
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
      error.value = '无法连接 AI 搜索服务，请确认后端已启动。'
    } else if (msg.includes('abort') || msg.includes('Abort')) {
      error.value = '搜索超时，请稍后重试。'
    } else {
      error.value = `搜索失败：${msg}`
    }
  } finally {
    clearTimeout(timer)
    loading.value = false
    searched.value = true
  }

  // ---- 第 2 步：异步生成摘要（不阻塞，不 await 等待才渲染）----
  if (results.value.length > 0 && seq === searchSeq) {
    fetchSummary(q, seq)
  }
}

async function fetchSummary(q: string, seq: number) {
  summaryLoading.value = true
  summaryError.value = ''
  summary.value = ''
  sources.value = []

  // 摘要生成较慢（最长约 30s），单独设较长超时
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 45000)

  try {
    const res = await fetch(`${API_BASE}/api/v1/summarize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: q,
        results: results.value.slice(0, 5).map((r) => ({
          title: r.title,
          content: r.content,
          link: r.link
        }))
      }),
      signal: controller.signal
    })

    if (!res.ok) {
      throw new Error(`服务异常（${res.status}）`)
    }

    const data = await res.json()
    // 校验序号：若期间用户已发起新搜索，则丢弃本次结果
    if (seq !== searchSeq) return
    summary.value = data.summary || ''
    sources.value = data.sources || []
  } catch (e: unknown) {
    if (seq !== searchSeq) return
    const msg = e instanceof Error ? e.message : String(e)
    if (msg.includes('abort') || msg.includes('Abort')) {
      summaryError.value = 'AI 回答生成超时'
    } else {
      summaryError.value = 'AI 回答生成失败'
    }
  } finally {
    clearTimeout(timer)
    if (seq === searchSeq) summaryLoading.value = false
  }
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
