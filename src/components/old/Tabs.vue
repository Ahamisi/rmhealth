<template>
  <div>
    <!-- Tab headers -->
    <div class="relative flex flex-wrap px-6 pt-2 border-b tab_wrapper">
      <div v-for="(tab, index) in tabs" :key="index" @click="setActive(tab, index)"
        class="relative z-10 px-2 py-3 text-sm transition-all cursor-pointer tab-pane-item" :class="[
          activeTab === getTabName(tab)
            ? 'active_tab'
            : 'text-gray-500 hover:text-gray-700',
          'rounded-t-md',
        ]">
        <span>{{ getTabName(tab) }}</span>
        <span v-if="getTabCount(tab) !== undefined" class="ml-2 count-badge">{{ getTabCount(tab) }}</span>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface Tab {
  name: string;
  count: number;
}

const props = defineProps<{
  tabs: (string | Tab)[];
  defaultTab?: string;
}>();

const emit = defineEmits<{
  tabChanged: [tab: string | Tab, index: number];
}>();

const getTabName = (tab: string | Tab | undefined): string => {
  if (!tab) return '';
  return typeof tab === 'string' ? tab : tab.name;
};

const getTabCount = (tab: string | Tab | undefined): number | undefined => {
  return typeof tab === 'object' && tab?.count !== undefined ? tab.count : undefined;
};

const activeTab = ref('');
const activeIndex = ref(0);

function setActive(tab: string | Tab, index: number) {
  activeTab.value = getTabName(tab);
  activeIndex.value = index;
  emit('tabChanged', tab, index);
}

// Watch tabs for initialization (once)
watch(
  () => props.tabs,
  (newTabs) => {
    if (!newTabs.length || activeTab.value) return;

    let startIndex = 0;

    if (props.defaultTab) {
      const foundIndex = newTabs.findIndex(tab => getTabName(tab) === props.defaultTab);
      if (foundIndex !== -1) startIndex = foundIndex;
    }

    const initialTab = newTabs[startIndex];
    setActive(initialTab, startIndex);
  },
  { immediate: true }
);
</script>

<style scoped>
.tab_wrapper {
  border-bottom: 1px solid rgba(9, 30, 66, 0.14);
  background: #f9fafb;
}

.tab_wrapper .active_tab {
  border: 1px solid rgba(9, 30, 66, 0.14);
  border-bottom: none;
  border-radius: 6px 6px 0px 0px;
  background: white;
  color: #172b4d;
  z-index: 20;
  position: relative;
}

.tab_wrapper .active_tab::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 1px;
  background: white;
  z-index: 21;
}

.tab_wrapper .tab-pane-item {
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px;
}

.count-badge {
  display: inline-block;
  background: rgba(9, 30, 66, 0.06);
  color: rgba(23, 43, 77, 1);
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 12px;
  text-align: center;
}

/* .active_tab .count-badge {
  background: #e3f2fd;
  color: #1976d2;
} */
</style>