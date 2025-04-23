const map = new Map<string, string>([
  ['西藏自治区', '西藏'],
  ['内蒙古自治区', '内蒙古'],
  ['新疆维吾尔自治区', '新疆'],
  ['广西壮族自治区', '广西'],
  ['宁夏回族自治区', '宁夏'],
  ['香港特别行政区', '香港'],
  ['澳门特别行政区', '澳门']
])

/**
 * 由于 echarts 的 中国地图城市名称 和 接口返回的 城市名称不一致，所以需要进行转换
 * @param name
 */
export function getEchartsMapName(name: string) {
  if (map.has(name)) {
    return map.get(name)
  }
  if (name.endsWith('市')) {
    // 替换末尾的 市
    name = name.slice(0, -1)
  }
  if (name.endsWith('省')) {
    // 替换末尾的 省
    name = name.slice(0, -1)
  }
  return name
}
