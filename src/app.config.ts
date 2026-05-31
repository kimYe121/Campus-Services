import { AppConfig } from '@tarojs/taro';

const config: AppConfig = {
  pages: [
    'pages/home/index',
    'pages/login/index',
    'pages/service/index',
    'pages/forum/index',
    'pages/progress/index',
    'pages/message/index',
    'pages/mine/index',
    'pages/taskForm/index',
    'pages/taskDetail/index',
    'pages/search/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#0050A0',
    navigationBarTitleText: '校园百事通',
    navigationBarTextStyle: 'white',
    backgroundColor: '#F7F8FA'
  },
  tabBar: {
    color: '#86909C',
    selectedColor: '#0050A0',
    backgroundColor: '#FFFFFF',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/service/index',
        text: '服务'
      },
      {
        pagePath: 'pages/forum/index',
        text: '百事圈'
      },
      {
        pagePath: 'pages/progress/index',
        text: '进度'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的'
      }
    ]
  }
};

export default config;
