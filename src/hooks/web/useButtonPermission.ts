import { useUserStore } from '@/store/modules/user'
import { isArray } from '@/utils/is'
import { intersection } from 'lodash-es'
export function usePermission() {
  const userStore = useUserStore()

  /**
   * Determine whether there is permission
   */
  function hasPermission(value?: any[], def = true): boolean {
    // Visible by default
    if (!value) {
      return def
    }
    if (isArray(value)) {
      return (intersection(value, userStore.getUserInfo.Permissions)).length > 0 || userStore.getUserInfo.Permissions=='*:*:*'
    }
    return true
  }

  return { hasPermission }
}
