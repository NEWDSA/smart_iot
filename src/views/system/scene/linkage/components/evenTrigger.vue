<template>
  <div>
    <CompForm />
    <SetForm />
</div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, shallowRef, ComponentOptions, getCurrentInstance, ComponentInternalInstance } from 'vue';
import { useModal } from '@/components/Modal';
import { useGo } from '@/hooks/web/usePage';
import CompForm from './CompForm.vue';
import SetForm from './SetForm.vue'
export default defineComponent({
  name: 'AccountManagement',
  components: { CompForm, SetForm },
  setup() {
    const go = useGo();
    const dataSource: any = ref([]);
    const myData: any = ref('');
    const update = getCurrentInstance() as ComponentInternalInstance | null
    const [registerModal, { openModal }] = useModal();
    const [registerpwdModal, { openModal: openModal3 }] = useModal();
    const [registerMyTable, { openModal: openModal2 }] = useModal();
    const searchInfo = reactive<Recordable>({});
    const checkedKeys = ref<Array<string | number>>([]);
    const currentModal = shallowRef<Nullable<ComponentOptions>>(null);
    const basicData: any = ref('');
    const modalVisible = ref<Boolean>(false);
    var pagination = reactive({ PageNum: 1, PageSize: 10 })
    const internalInstance = getCurrentInstance()
    function handleCreate() {
      openModal(true, {
        isUpdate: false,
      });
    }
    function onSelectChange(selectedRowKeys: (string | number)[]) {
      checkedKeys.value = selectedRowKeys;
    }
    // 编辑用户
    function handleEdit(record: Recordable) {
      openModal(true, {
        record,
        isUpdate: true,
      });
    }
    return {
      registerMyTable,
      registerModal,
      registerpwdModal,
      handleCreate,
      handleEdit,
      onSelectChange,
      openModal2,
      openModal3,
      pagination,
      internalInstance,
      modalVisible,
      currentModal,
      checkedKeys,
      searchInfo,
      basicData,
      dataSource,
      myData,
      update
    };
  },
});
</script>
