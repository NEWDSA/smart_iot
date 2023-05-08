<template>
  <PageWrapper contentFullHeight title="个人中心">
    <a-card bordered>
      <div class="flex p-4 rounded-1 justify-items-center">
        <CropperAvatar ref="Avatar" :uploadApi="uploadApi" :width="100" :showBtn="false" @change="cropperOk"
          :value="avatar">
          <template #header>
            <img @click="UploadImg" class=" absolute left-120px bottom-40px" src="@/assets/images/camera.png"
              style="width:32px;height:32px;" />
          </template>
        </CropperAvatar>
        <a-descriptions class="ml-4" size="small" :column="2">
          <a-descriptions-item label="用户名"> {{ info.UserName
          }}</a-descriptions-item>
          <a-descriptions-item label="邮箱">
            <Tag color="blue"> {{ info.Email === '' || info.Email === null ? '暂无数据' : info.Email }}</Tag>
            <a @click="handleCopy(info.Email)" v-if="info.Email">复制</a>
          </a-descriptions-item>
          <a-descriptions-item label="所属部门">{{ info.Dept.DeptName }}</a-descriptions-item>
          <a-descriptions-item label="手机号码">
            <span class="mr-8px">{{ info.PhoneNumber === '' || info.PhoneNumber == null ? '暂无数据' : info.PhoneNumber }}</span>
            <a @click="handleCopy(info.PhoneNumber)" v-if="info.PhoneNumber">复制</a>
          </a-descriptions-item>
          <a-descriptions-item label="角色类型">{{ info.Roles[0].RoleName === '' || info.Roles[0].RoleName === null ?
            '暂无数据' : info.Roles[0].RoleName }}</a-descriptions-item>
          <a-descriptions-item v-if="info?.Basic.CreatedAt" label="创建时间">{{
            dayjs.unix(info?.Basic.CreatedAt.seconds).format('YYYY-MM-DD HH:mm:ss') }}</a-descriptions-item>
        </a-descriptions>
      </div>
    </a-card>
    <a-card class="!mt-5 ">
      <!-- 默认选中修改密码 -->
      <div @click="changeStauts(1)"
        :class="checkStatus == 1 ? 'bg-gray-300 inline-block text-blue-500 p-1 rounded-xl' : '  inline-block text-black p-1 rounded-xl'">
        修改信息
      </div>
      <div @click="changeStauts(2)"
        :class="checkStatus == 2 ? 'bg-gray-300 inline-block text-blue-500 p-1 ml-6  rounded-xl' : 'inline-block ml-6 text-black p-1 rounded-xl'">
        修改密码
      </div>
      <div class="mt-3">
        <BasicForm v-show="checkStatus == 1" @register="register" />
        <Row class="enter-x mb-4">
          <Row :md="8" :xs="8">
            <InputPassword visibilityToggle v-if="checkStatus == 2" type="password" v-model:value="password"
              placeholder="请输入密码" />
          </Row>
        </Row>
        <div :class="checkStatus == 1 ? 'ml-25' : ''">
          <a-button type="primary" @click="handleSubmit"> 保存 </a-button>
        </div>
      </div>

    </a-card>
  </PageWrapper>
</template>

<script lang="ts">
import { defineComponent, onMounted, unref, ref } from 'vue';
import { useRoute } from 'vue-router';
import { PageWrapper } from '@/components/Page';
import { useGo } from '@/hooks/web/usePage';
import { Tabs, Descriptions, Card, Button, Input, Tag, Row, Col } from 'ant-design-vue';
import { CollapseContainer } from '@/components/Container';
import { CropperImage, CropperAvatar } from '@/components/Cropper';
import { uploadApi } from '@/api/sys/upload';
import { modifiAccountList, updatePwd } from '@/api/demo/system';
import { useUserStore } from '@/store/modules/user';
import { BasicForm, useForm } from '@/components/Form';
import { accountFormSchema } from './account.data';
import { useCopyToClipboard } from '@/hooks/web/useCopyToClipboard';
import { useMessage } from '@/hooks/web/useMessage';
import { fileUrl } from '@/utils/file/fileUrl';
import dayjs from 'dayjs';

export default defineComponent({
  name: 'AccountDetail',
  components: {
    PageWrapper, ATabs: Tabs, ATabPane: Tabs.TabPane, CollapseContainer, CropperImage, CropperAvatar, [Descriptions.name]: Descriptions,
    [Descriptions.Item.name]: Descriptions.Item, [Card.name]: Card, Button, BasicForm, Tag, InputPassword: Input.Password, Row, Col
  },
  setup() {
    const route = useRoute();
    const go = useGo();
    const checkStatus = ref(1);
    const { createMessage } = useMessage();
    // 此处可以得到用户ID
    // const userId = ref(route.params?.id);
    const currentKey = ref('detail');
    const userStore = useUserStore();
    const valueRef = ref('');
    const formData = ref();
    const password = ref();
    const url = ref(fileUrl());
    const Avatar = ref();
    const { clipboardRef, copiedRef } = useCopyToClipboard();
    const info = ref(userStore.getUserInfo?.user);
    const avatar = ref(info.value.Avatar || '');
    const [register, { validate, resetFields, setFieldsValue }] = useForm({
      baseColProps: { span: 8 },
      baseRowStyle: {
        display: 'flex',
        flexDirection: 'column'
      },
      labelWidth: 100,
      showActionButtonGroup: false,
      schemas: accountFormSchema,
    });
    info.value.RoleIds = [info.value.Roles[0].RoleId]
    onMounted(() => {
      setFieldsValue({
        ...info.value
      });
    })
    function goBack() {
      // 本例的效果时点击返回始终跳转到账号列表页，实际应用时可返回上一页
      go('/system/account');
    }
    function cropperOk(source: any, data: any) {
      // showAvatar.value = fileUrl() + source.data.Data
      avatar.value = fileUrl() + source.data.Data
    }
    function UploadImg() {
      Avatar.value.openModal();
    }
    function handleBackLogin() {

    }
    function handleCopy(info) {

      clipboardRef.value = info;
      if (unref(copiedRef)) {
        createMessage.warning('复制成功！');
      }
    }
    function changeStauts(value) {
      checkStatus.value = value;
    }
    async function handleSubmit() {
      switch (checkStatus.value) {
        case 1:
          // try {
          const values = await validate();
          values.Avatar = avatar.value;
          const result = await modifiAccountList({ ...values, UserId: info.value.UserId });
          // 刷新页面
          result.Msg == 'ok' ? createMessage.info('修改成功!') : ''
          break;
        case 2:
          try {

            updatePwd({
              UserId: info.value.UserId,
              NewPassword
                : password.value
            });
            // 提示修改成功
          } finally {
            // 刷新页面
            createMessage.info('修改密码成功!');
          }
          break;

      }

    }

    return { register, changeStauts, Avatar, UploadImg, handleSubmit, resetFields, password, url, formData, checkStatus, currentKey, dayjs, info, avatar, valueRef, uploadApi: uploadApi as any, cropperOk, goBack, handleCopy, handleBackLogin };
  },
});
</script>

<style></style>
