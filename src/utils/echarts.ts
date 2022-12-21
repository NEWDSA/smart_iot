/**
 * echart 工具类
 */
export default class EchartUtil {
  //公用配置
  public static getEchartOption() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const echartUtil = this
    return {
      grid: {
        top: '60', //grid 组件离容器上侧的距离。 'top', 'middle', 'bottom' '20%'
        right: '10%', // grid 组件离容器右侧的距离。 '20' '20%'
        bottom: '60', // grid 组件离容器下侧的距离。 '20' '20%'
        left: '10%' //grid 组件离容器左侧的距离。
      },
      title: {
        // 标题组件，包含主标题和副标题
        text: '测试图表标题', // 主标题文本，支持使用 \n 换行。 string
        subtext: '', // 副标题文本，支持使用 \n 换行。 string
        left: 'left', // title 组件离容器左侧的距离。'20' '20%' 'left', 'center', 'right'  string number
        textStyle: {
          fontWeight: 'normal', //字体粗细
          color: '#FFF',
          fontSize: '20',
          fontFamily: 'STHeiti'
        }
      },
      color: [
        // 调色盘颜色列表。如果系列没有设置颜色，则会依次循环从该列表中取颜色作为系列颜色。
        '#4F9EFD',
        '#00E9EA',
        '#FFDD77',
        '#00EA9C',
        '#FF913F',
        '#FC5A5A',
        '#FF52CB',
        '#C847FF',
        '#00FFDD',
        '#F0FF00'
      ],
      legend: {
        // 图例组件。
        top: 10, // 图例组件离容器上侧的距离。
        right: 10, // 图例组件离容器右侧的距离。
        data: [], // 图例的数据数组。
        itemWidth: 12, // 图例标记的图形宽度。number
        itemHeight: 12, // 图例标记的图形高度。number
        textStyle: {
          // 图例的公用文本样式。
          color: '#FFF', // 文字的颜色。
          fontSize: 10, // 文字的字体大小。
          fontFamily: 'STHeiti' // 文字的字体系列。
        }
      },
      tooltip: {
        // 提示框组件。
        trigger: 'axis', // 触发类型。 'item',数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用。 'axis',坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用。
        axisPointer: { type: 'shadow' }, // 坐标轴指示器配置项。
        textStyle: {
          // 提示框浮层的文本样式。
          color: '#fff', // 文字的颜色。
          fontSize: 10, // 文字的字体大小。
          fontFamily: 'STHeiti' // 文字的字体系列。
        },
        formatter(params: any) {
          // 字符串模板
          if (!params.length) {
            params = [params]
          }
          let html = params[0].name + '<br>'
          for (let i = 0; i < params.length; i++) {
            console.log(params[i].color, 'color')
            html +=
              '<span style="display:inline-block;margin-right:10px;border-radius:10px;width:10px;height:10px;background-color:' +
              params[i].color +
              ';"></span>'
            let unit = ''
            if (params[i].units) {
              unit = ' ' + params[i].units[0]
            }
            if (params.units) {
              unit = ' ' + params.units[i]
            }
            html += params[i].seriesName + ': ' + params[i].value + unit + '<br>'
          }
          return html
        }
      },
      xAxis: {
        // 直角坐标系 grid 中的 x 轴
        data: [], // 类目数据，在类目轴（type: 'category'）中有效。
        axisLine: {
          // 坐标轴轴线相关设置。
          // show: false,
          color: '#57617B'
          // lineStyle: { color: 'rgba(239, 245, 255, 0.1)' }
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          // 坐标轴刻度标签的相关设置。
          formatter(value: any) {
            value = value + ''
            //如果年份是正好今年，则省略年份
            const year = new Date().getFullYear()
            value = value.replace(new RegExp(year + '-', 'g'), '')
            value = value.replace(new RegExp(year + '/', 'g'), '')
            value = value.replace(new RegExp(year + '年', 'g'), '')

            //是否换行：纯中文才需要换行
            let flag = true
            const newValue: any = []
            for (const char of value + '') {
              if (echartUtil.checkNum(char)) {
                flag = false
                newValue.push(`{num|${char}}`)
              } else {
                newValue.push(`${char}`)
              }
            }
            const params = newValue.join('')

            if (!flag) {
              return params
            }

            //换行操作，k：每行显示个数
            let i = 0,
              // eslint-disable-next-line prefer-const
              k = 4
            let newParams = ''
            for (let char of params + '') {
              i++
              if (i >= k) {
                char = char + '\n'
                i = 0
              }
              newParams += char
            }

            return newParams
          },
          rich: {
            // rich 里面，可以自定义富文本样式
            num: {
              color: 'rgba(9,16,255,0.56)',
              fontSize: 12,
              fontFamily: 'STHeiti'
            }
          },
          textStyle: {
            color: 'rgba(234,28,0,0.6)',
            fontSize: 10,
            fontFamily: 'STHeiti'
          },
          rotate: 50
        }
      },
      yAxis: {
        // 直角坐标系 grid 中的 y 轴
        name: '', // 坐标轴名称。
        axisLabel: {
          // 坐标轴刻度标签的相关设置。
          formatter(value: any) {
            const newValue: any = []
            for (const char of value + '') {
              if (echartUtil.checkNum(char)) {
                newValue.push(`{num|${char}}`)
              } else {
                newValue.push(`${char}`)
              }
            }
            return newValue.join('')
          },
          rich: {
            // rich 里面，可以自定义富文本样式
            num: {
              // Y轴刻度线
              color: '#57617B',
              // color: 'rgba(9,16,255,0.56)',
              fontSize: 12,
              fontFamily: 'STHeiti'
            }
          },
          textStyle: {
            color: 'rgba(234,28,0,0.6)',
            fontSize: 10,
            fontFamily: 'STHeiti'
          }
        },
        axisTick: {
          // 坐标轴刻度相关设置。
          show: false
        },
        axisLine: {
          // 坐标轴轴线相关设置。
          // lineStyle: { color: "#6173A3" },
          show: true
        },
        nameTextStyle: {
          // 坐标轴名称的文字样式。
          color: '#FFF',
          fontSize: 10,
          fontFamily: 'STHeiti',
          padding: [50, 0, 0, 50]
        },
        splitLine: {
          // 坐标轴在 grid 区域中的分隔线。
          show: true,
          lineStyle: {
            color: 'rgba(239, 245, 255, 0.1)'
          }
        }
      },
      series: {
        // 系列
        name: '', // 系列名称，用于tooltip的显示
        type: '', // 折线图 柱状图
        itemStyle: {
          // 折线拐点标志的样式。
          normal: {
            label: {
              show: false
            },
            labelLine: {
              show: false
            }
          }
        },
        label: {
          // 图形上的文本标签 可用于说明图形的一些数据信息，比如值，名称等。
          show: true,
          color: '#FFF',
          position: ['105%', '0%'],
          textStyle: {
            fontSize: 10,
            fontFamily: 'STHeiti'
          }
        },
        barWidth: 15,
        symbolSize: 10, // 标记的大小
        smooth: true // 是否使用平滑曲线
      }
    }
  }

  //tooltip自动轮播
  public static autoHover(myChart: any) {
    //轮播时间间隔
    const time = 6000

    if (!myChart.timeTicket) {
      myChart['timeTicket'] = 'interval'
    }
    let currentIndex = -1
    const dataLen = myChart.getOption().series[0].data.length
    const startInterval = function () {
      myChart.timeTicket = setInterval(function () {
        myChart.dispatchAction({
          type: 'downplay',
          seriesIndex: 0,
          dataIndex: currentIndex
        })
        currentIndex = (currentIndex + 1) % dataLen
        myChart.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: currentIndex
        })
        myChart.dispatchAction({
          type: 'showTip',
          seriesIndex: 0,
          dataIndex: currentIndex
        })
      }, time)
      return myChart.timeTicket
    }

    //停用旧的，再调用新的
    clearInterval(myChart.timeTicket)
    myChart.timeTicket = startInterval()

    myChart.getDom().addEventListener('mouseover', function () {
      clearInterval(myChart.timeTicket)
    })

    myChart.getDom().addEventListener('mouseout', function () {
      myChart.timeTicket = startInterval()
    })
  }

  //正则判断字符串是否为数字
  public static checkNum(value: string): boolean {
    return /^[0-9]*$/.test(value)
  }

  //获取随机数
  public static getRandomNumberByRange(start: number, end: number): number {
    return Math.floor(Math.random() * (end + 1 - start) + start)
  }

  //获取随机数组
  public static getRandomArray(length: number): number[] {
    const array: number[] = []
    for (let i = 0; i < length; i++) {
      array.push(this.getRandomNumberByRange(10, 100))
    }
    return array
  }
}
