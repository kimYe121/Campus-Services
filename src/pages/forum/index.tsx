import React, { useState } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';

export default function ForumPage() {
  const [activeChannel, setActiveChannel] = useState('校园互助');

  const channels = ['推荐流', '校园互助', '跳蚤市场', '失物招领', '活动墙', '学术讨论', '社团招新'];

  const posts = [
    { 
      id: 1, name: '张同学', avatar: 'Felix', time: '10分钟前', 
      content: '有同学捡到一把蓝色的天堂伞吗？昨天晚上落在图书馆三楼靠窗的位置了，如果有线索请联系我，必有重谢！', 
      images: ['https://picsum.photos/id/1015/200/200'],
      likes: 12, comments: 5 
    },
    { 
      id: 2, name: '李老师', avatar: 'Aneka', time: '半小时前', 
      content: '今天下午的《计算机网络》实验课因为机房停电，临时调整到明晚，请各班班委通知一下大家。', 
      images: [],
      likes: 45, comments: 12 
    },
    { 
      id: 3, name: '王同学', avatar: 'Jack', time: '2小时前', 
      content: '出一部闲置的九成新 iPad Pro，带Apple Pencil，平时只用来做笔记，无磕碰。有意者私聊带价。', 
      images: ['https://picsum.photos/id/1018/200/200', 'https://picsum.photos/id/1019/200/200'],
      likes: 8, comments: 15 
    },
  ];

  const handlePost = () => {
    Taro.showModal({
      title: 'AI 审核提示',
      content: '您发布的内容将经过 AI 智能审核，确保不包含违规、敏感或恶意广告信息。审核通过后将立即展示在百事圈。',
      confirmText: '去发布',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '发帖页面开发中', icon: 'none' });
        }
      }
    });
  };

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.title}>百事圈</View>
      </View>

      <View className={styles.container}>
        {/* 左侧频道栏 (模仿QQ频道) */}
        <ScrollView className={styles.sidebar} scrollY>
          {channels.map(channel => (
            <View 
              key={channel} 
              className={classnames(styles.channelItem, activeChannel === channel && styles.active)}
              onClick={() => setActiveChannel(channel)}
            >
              {channel}
            </View>
          ))}
        </ScrollView>

        {/* 右侧信息流 */}
        <ScrollView className={styles.feed} scrollY>
          {posts.map(post => (
            <View key={post.id} className={styles.postCard}>
              <View className={styles.userInfo}>
                <Image className={styles.avatar} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.avatar}`} />
                <Text className={styles.name}>{post.name}</Text>
                <Text className={styles.time}>{post.time}</Text>
              </View>
              <View className={styles.content}>{post.content}</View>
              
              {post.images.length > 0 && (
                <View className={styles.images}>
                  {post.images.map((img, index) => (
                    <Image key={index} className={styles.postImg} src={img} mode="aspectFill" />
                  ))}
                </View>
              )}

              <View className={styles.actions}>
                <View className={styles.actionBtn}><Text>👍</Text><Text>{post.likes}</Text></View>
                <View className={styles.actionBtn}><Text>💬</Text><Text>{post.comments}</Text></View>
                <View className={styles.actionBtn}><Text>↪️</Text><Text>分享</Text></View>
              </View>
            </View>
          ))}
          <View style={{ textAlign: 'center', padding: '40rpx 0', color: '#C9CDD4', fontSize: '24rpx' }}>没有更多内容了</View>
        </ScrollView>
      </View>

      <View className={styles.fab} onClick={handlePost}>+</View>
    </View>
  );
}