<template>
  <div style="position: relative;padding: 0;margin: 0;">

    <div class="rightMain_bottom">
      <div class="flex items-center justify-between table_title" style="background: rgba(0, 0, 0, 0.4);">
        <span class="flex items-center my_title1">
          <img src="@/assets/images/Subtract.png" />
          <span class="sub_title1">访客信息</span>

        </span>
        <span class="flex items-center my_title2">
          <span>合计:</span>
          <span class="my_font">112</span>
        </span>
      </div>
      <div class="rightMain_bottomIn">
        <!-- <h3>这里是标题</h3> -->
        <div class="biaoge biaoge_list my_list" style="width:100%;">
          <div class="biaoge_listIn">
            <ul class="ul_title">
              <li>用户</li>
              <li>类型号</li>
              <li>类别一</li>
              <li>类别二</li>
              <li>类别三</li>
            </ul>
            <div class="ul_list">
              <div class="ul_listIn">
                <ul class="ul_con">
                  <li>张三</li>
                  <li>11</li>
                  <li>类别一</li>
                  <li>类别二</li>
                  <li>类别三</li>
                </ul>
                <ul class="ul_con">
                  <li>张三</li>
                  <li>12</li>
                  <li>类别一</li>
                  <li>类别二</li>
                  <li>类别三</li>
                </ul>
                <ul class="ul_con">
                  <li>张三</li>
                  <li>13</li>
                  <li>类别一</li>
                  <li>类别二</li>
                  <li>类别三</li>
                </ul>
                <ul class="ul_con">
                  <li>更多</li>
                  <li>精美大屏</li>
                  <li>关注</li>
                  <li>公众号</li>
                  <li>DreamCoders</li>
                </ul>
                <ul class="ul_con">
                  <li>张三</li>
                  <li>15</li>
                  <li>类别一</li>
                  <li>类别二</li>
                  <li>类别三</li>
                </ul>
                <ul class="ul_con">
                  <li>张三</li>
                  <li>16</li>
                  <li>类别一</li>
                  <li>类别二</li>
                  <li>类别三</li>
                </ul>
                <ul class="ul_con">
                  <li>张三</li>
                  <li>11</li>
                  <li>类别一</li>
                  <li>类别二</li>
                  <li>类别三</li>
                </ul>
                <ul class="ul_con">
                  <li>张三</li>
                  <li>12</li>
                  <li>类别一</li>
                  <li>类别二</li>
                  <li>类别三</li>
                </ul>
                <ul class="ul_con">
                  <li>张三</li>
                  <li>13</li>
                  <li>类别一</li>
                  <li>类别二</li>
                  <li>类别三</li>
                </ul>
                <ul class="ul_con">
                  <li>张三</li>
                  <li>14</li>
                  <li>类别一</li>
                  <li>类别二</li>
                  <li>类别三</li>
                </ul>
                <ul class="ul_con">
                  <li>张三</li>
                  <li>15</li>
                  <li>类别一</li>
                  <li>类别二</li>
                  <li>类别三</li>
                </ul>
                <ul class="ul_con">
                  <li>张三</li>
                  <li>16</li>
                  <li>类别一</li>
                  <li>类别二</li>
                  <li>类别三</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
  
<script setup lang='ts'>
import '@/utils/lib/flexible';

</script>
  
<style lang="less"  scoped>
.my_title1 {
  margin-left: .125rem;

  /* 10/80 */
  .sub_title1 {
    padding-left: .0625rem
      /* 5/80 */
    ;
  }
}

.my_title2 {
  margin-right: .125rem;

  /* 10/80 */
  .my_font {
    font-size: .225rem
      /* 18/80 */
    ;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-weight: bolder;
  }
}

.table_title {
  img {
    width: .25rem
      /* 20/80 */
    ;
    height: .25rem
      /* 20/80 */
    ;
  }

  height: .55rem
  /* 44/80 */
  ;
  font-size: .2rem
  /* 16/80 */
  ;
}

.rightMain_bottom {
  // margin: 0 .125rem /* 10/80 */;
  width: 100%;
  height: calc(100% - .25rem
      /* 20/80 */
    );
}

.biaoge_list .ul_title {
  height: .4rem
    /* 32/80 */
  ;
  // line-height: .4rem /* 32/80 */;
  background: rgba(70, 69, 69, 0.35);
}

// rgba(70, 69, 69, 0.35)

.my_list {
  height: 100%;
}

.rightMain_bottomIn {
  // border: 0.008rem solid rgba(14, 253, 255, 0.5);
  width: 100%;
  min-height: 60px;
  // height: 2.125rem /* 170/80 */;
  height: calc(100% - .25rem
      /* 20/80 */
    );

  overflow: hidden;
  position: relative;
  padding: 0.08rem 0.05rem;
  // border: 1px solid pink;
}

.rightMain_bottomIn .biaoge_list .biaoge_listIn .ul_listIn {
  -webkit-animation: 14s gundong linear infinite normal;
  animation: 14s gundong linear infinite normal;
  position: relative;
}

.rightMain_bottomIn .biaoge_list .biaoge_listIn .ul_list {
  overflow: hidden;
  position: relative;
}

// ul li 第几行颜色配置
.ul_list ul:nth-child(2) {
  // border: 1px solid blue;
  background: rgba(254, 51, 23, 0.3);
}

.ul_list ul:nth-child(4) {
  // border: 1px solid blue;
  background: rgba(47, 47, 47, 0.4);
}

.ul_list ul:nth-child(6) {
  // border: 1px solid blue;
  background: rgba(47, 47, 47, 0.4);
}

// background: rgba(47, 47, 47, 0.4);

@keyframes gundong {
  0% {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }

  100% {
    -webkit-transform: translate3d(0, -30vh, 0);
    transform: translate3d(0, -30vh, 0);
  }
}

.rightMain .rightMain_bottomIn .biaoge_list .biaoge_listIn .ul_listIn {
  position: relative;
}

.biaoge_list ul {
  display: flex;
  font-size: .175rem
    /* 14/80 */
  ;
  display: -webkit-flex;
  width: 100%;
}

.rightMain_bottomIn h3 {
  font-size: 0.08rem;
  color: #fff;
  margin-bottom: 0.05rem;
}

.rightMain_bottomIn .biaoge_list {
  overflow: hidden;
  position: relative;
}

.rightMain .rightMain_bottomIn .biaoge_list .biaoge_listIn .ul_list {
  overflow: hidden;
  position: relative;
}

.biaoge_list ul li {
  width: 20%;
  line-height: .4rem
    /* 32/80 */
  ;
  text-align: center;
  color: #fff;
  font-size: 0.06rem;
  height: .4rem;
  // line-height: 0.2rem;
}
</style>
