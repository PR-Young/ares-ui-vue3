import request from '@/utils/request'

export function getContents() {
  return request({
    url: '/ares/blog/getArticles',
    method: 'get',
  })
}

export function getDetail(id: string) {
  return request({
    url: '/ares/blog/getArticle/' + id,
    method: 'get',
  })
}

export function getArchives(tagId: string) {
  console.log(tagId)
  if (tagId == '0') {
    return [
      {
        id: '1',
        time: '四月,2021',
        archives: [
          {
            id: '1',
            time: '2021年4月1日',
            title: '基于 MIME 类型的服务端推送',
            tag: 'vue',
          },
          {
            id: '2',
            time: '2021年4月2日',
            title: '基于 MIME 类型的服务端推送',
            tag: 'vue',
          },
          {
            id: '3',
            time: '2021年4月3日',
            title: '基于 MIME 类型的服务端推送',
            tag: 'vue',
          },
        ],
      },
      {
        id: '2',
        time: '三月,2021',
        archives: [
          {
            id: '1',
            time: '2021年3月1日',
            title: '基于 MIME 类型的服务端推送',
            tag: 'vue',
          },
          {
            id: '2',
            time: '2021年3月2日',
            title: '基于 MIME 类型的服务端推送',
            tag: 'vue',
          },
        ],
      },
    ]
  } else {
    return [
      {
        id: '1',
        time: '四月,2021',
        archives: [
          {
            id: '1',
            time: '2021年4月1日',
            title: '基于 MIME 类型的服务端推送',
            tag: 'vue',
          },
          {
            id: '2',
            time: '2021年4月2日',
            title: '基于 MIME 类型的服务端推送',
            tag: 'vue',
          },
          {
            id: '3',
            time: '2021年4月3日',
            title: '基于 MIME 类型的服务端推送',
            tag: 'vue',
          },
        ],
      },
    ]
  }
}

export function getTagList() {
  return [
    {
      id: '1',
      name: '分类一',
    },
    {
      id: '2',
      name: '分类二',
    },
    {
      id: '3',
      name: '分类三',
    },
    {
      id: '4',
      name: '分类四',
    },
    {
      id: '5',
      name: '分类五',
    },
    {
      id: '6',
      name: '分类六',
    },
    {
      id: '7',
      name: '分类七',
    },
    {
      id: '8',
      name: '分类八',
    },
    {
      id: '9',
      name: '分类九',
    },
    {
      id: '10',
      name: '分类十',
    },
  ]
}

export function getUpdateInfo() {
  return request({
    url: '/ares/blog/updateInfo',
    method: 'get',
  })
}

export function save(value: any) {
  return request({
    url: '/ares/blog/saveUpdateInfo',
    method: 'post',
    data: value,
  })
}
