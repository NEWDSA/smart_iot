import { useUserStore } from '@/store/modules/user'
import { isArray } from '@/utils/is'
import { intersection } from 'lodash-es'
export function usePermission() {
  const userStore = useUserStore()

  /**
   * Determine whether there is permission
   */
  debugger
  function hasPermission(value?: any[], def = true): boolean {
    // Visible by default
    if (!value) {
      return def
    }
    console.log(userStore.getUserInfo.Permissions,'...value...?');
    if (isArray(value)) {
      return (intersection(value, userStore.getUserInfo.Permissions)).length > 0 || userStore.getUserInfo.Permissions=='*:*:*'
    }
    return true
  }

  return { hasPermission }
}
