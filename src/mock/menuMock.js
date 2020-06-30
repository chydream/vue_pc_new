// import Mock from 'mockjs'
let menu = {
    admin: [
        {
          id: 1,
          label: '首页',
          href: '/index/home',
          icon: 'fa fa-home',
          permission: ['view', 'add', 'delete', 'edit'],
          show: true,
          children: []
        },
        {
          id: 1,
          label: '权限配置',
          href: '/auth/auth',
          icon: 'fa fa-sliders',
          permission: ['view', 'add', 'delete', 'edit'],
          show: true,
          children: []
        },
        {
          id: 2,
          label: '用户管理',
          href: '/user/index',
          icon: 'fa fa-user',
          permission: ['view', 'add', 'delete', 'edit'],
          show: true,
          children: []
        },
        {
          id: 7,
          label: '系统设置',
          href: '',
          icon: 'fa fa-cog',
          permission: ['view', 'add', 'delete', 'edit'],
          show: true,
          children: [
            {
              id: 12,
              label: '用户设置',
              href: '/system/index',
              icon: 'fa fa-file-text',
              permission: ['view', 'add', 'delete', 'edit'],
              show: true,
              children: []
            },
            {
              id: 13,
              label: '角色管理',
              href: '/system/role-index',
              icon: 'fa fa-file-text',
              permission: ['view', 'add', 'delete', 'edit'],
              show: true,
              children: []
            }
          ]
        },
        {
          id: 7,
          label: '图表',
          href: '',
          icon: 'fa fa-bar-chart-o',
          permission: ['view', 'add', 'delete', 'edit'],
          show: true,
          children: [
            {
              id: 12,
              label: '图表',
              href: '/chart/line',
              icon: 'fa fa-file-text',
              permission: ['view', 'add', 'delete', 'edit'],
              show: true,
              children: []
            }
          ]
        },
        {
          id: 8,
          label: '树',
          href: '',
          icon: 'fa fa-bar-chart-o',
          permission: ['view', 'add', 'delete', 'edit'],
          show: true,
          children: [
            {
              id: 12,
              label: '树',
              href: '/tree/index',
              icon: 'fa fa-file-text',
              permission: ['view', 'add', 'delete', 'edit'],
              show: true,
              children: []
            },
            {
              id: 12,
              label: '树2',
              href: '/tree/index1',
              icon: 'fa fa-file-text',
              permission: ['view', 'add', 'delete', 'edit'],
              show: true,
              children: []
            },
            {
              id: 12,
              label: '树3',
              href: '/tree/index2',
              icon: 'fa fa-file-text',
              permission: ['view', 'add', 'delete', 'edit'],
              show: true,
              children: []
            },
            {
              id: 12,
              label: '树4',
              href: '/tree/index3',
              icon: 'fa fa-file-text',
              permission: ['view', 'add', 'delete', 'edit'],
              show: true,
              children: []
            },
            {
              id: 12,
              label: '树5',
              href: '/tree/index4',
              icon: 'fa fa-file-text',
              permission: ['view', 'add', 'delete', 'edit'],
              show: true,
              children: []
            }
          ]
        },
        {
          id: 8,
          label: '工作流',
          href: '',
          icon: 'fa fa-bar-chart-o',
          permission: ['view', 'add', 'delete', 'edit'],
          show: true,
          children: [
            {
              id: 12,
              label: '树',
              href: '/jsPlumb/index',
              icon: 'fa fa-file-text',
              permission: ['view', 'add', 'delete', 'edit'],
              show: true,
              children: []
            }
          ]
        },
        {
          id: 8,
          label: '视频',
          href: '',
          icon: 'fa fa-bar-chart-o',
          permission: ['view', 'add', 'delete', 'edit'],
          show: true,
          children: [
            {
              id: 12,
              label: '视频',
              href: '/video/video',
              icon: 'fa fa-file-text',
              permission: ['view', 'add', 'delete', 'edit'],
              show: true,
              children: []
            },
            {
              id: 12,
              label: '视频',
              href: '/video/index',
              icon: 'fa fa-file-text',
              permission: ['view', 'add', 'delete', 'edit'],
              show: true,
              children: []
            },
            {
              id: 12,
              label: '视频',
              href: '/video-new/index',
              icon: 'fa fa-file-text',
              permission: ['view', 'add', 'delete', 'edit'],
              show: true,
              children: []
            },
            {
              id: 12,
              label: '视频js',
              href: '/video/videojs',
              icon: 'fa fa-file-text',
              permission: ['view', 'add', 'delete', 'edit'],
              show: true,
              children: []
            },
            {
              id: 12,
              label: 'test',
              href: '/video/test',
              icon: 'fa fa-file-text',
              permission: ['view', 'add', 'delete', 'edit'],
              show: true,
              children: []
            }
          ]
        },
        {
          id: 9,
          label: '视频Demo',
          href: '',
          icon: 'fa fa-bar-chart-o',
          permission: ['view', 'add', 'delete', 'edit'],
          show: true,
          children: [
            {
              id: 12,
              label: '视频',
              href: '/video-demo/index',
              icon: 'fa fa-file-text',
              permission: ['view', 'add', 'delete', 'edit'],
              show: true,
              children: []
            }
          ]
        },
        {
          id: 8,
          label: '表格',
          href: '',
          icon: 'fa fa-bar-chart-o',
          permission: ['view', 'add', 'delete', 'edit'],
          show: true,
          children: [
            {
              id: 12,
              label: '表格',
              href: '/table-new/index',
              icon: 'fa fa-file-text',
              permission: ['view', 'add', 'delete', 'edit'],
              show: true,
              children: []
            }
          ]
        }
    ],
    user: [
      {
          id: 1,
          label: '首页',
          href: '/index/home',
          icon: 'fa fa-home',
          permission: ['view', 'add', 'delete', 'edit'],
          show: true,
          children: []
      }
    ]
}
// Mock.mock(/\/user\/menu/, 'post', menu)
export default menu
