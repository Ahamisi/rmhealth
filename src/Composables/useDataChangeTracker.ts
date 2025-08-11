import { ref, watch, toRaw, unref, Ref, isRef } from 'vue';

export function useDataChangeTracker<T extends object>(data: T | Ref<T>) {
  const sourceRef = isRef(data) ? data : ref(data);

  const getRawSnapshot = () => safeClone(toRaw(sourceRef.value));

  const initial = ref(getRawSnapshot());
  const hasChanged = ref(false);

  watch(
    sourceRef,
    (newVal) => {
      try {
        const rawNew = safeClone(toRaw(newVal));
        hasChanged.value = JSON.stringify(rawNew) !== JSON.stringify(initial.value);
      } catch (err) {
        console.warn('Failed to compare data:', err);
        hasChanged.value = true;
      }
    },
    { deep: true }
  );

  const reset = () => {
    initial.value = getRawSnapshot();
    hasChanged.value = false;
  };

  return {
    hasChanged,
    reset,
  };
}

// Safe deep clone (fallback to JSON if structuredClone fails)
function safeClone<T>(obj: T): T {
  try {
    return structuredClone(obj);
  } catch {
    return JSON.parse(JSON.stringify(obj));
  }
}
