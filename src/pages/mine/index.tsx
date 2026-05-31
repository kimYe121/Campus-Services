import React from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useUserStore } from '@/store/userStore';
import styles from './index.module.scss';

export default function MinePage() {
  const { role, name, id, setRole, logout, setAiHidden } = useUserStore();

  const toggleRole = () => {
    setRole(role === 'student' ? 'teacher' : 'student');
    Taro.showToast({ title: `已切换为${role === 'student' ? '教工' : '学生'}视角`, icon: 'none' });
  };

  const handleRestoreAi = () => {
    setAiHidden(false);
    Taro.showToast({ title: 'AI 导办已恢复显示', icon: 'success' });
  };

  const handleLogout = () => {
    Taro.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: function (res) {
        if (res.confirm) {
          logout();
          Taro.reLaunch({ url: '/pages/login/index' });
        }
      }
    });
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.headerBg}>
        <View className={styles.userInfo}>
          <Image className={styles.avatar} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`} />
          <View className={styles.info}>
            <View className={styles.name}>
              <Text>{name}</Text>
              <Text className={styles.roleTag}>{role === 'student' ? '学生' : '教工'}</Text>
            </View>
            <View className={styles.id}>学工号: {id}</View>
          </View>
        </View>
      </View>

      <View className={styles.menuList}>
        <View className={styles.menuGroup}>
          <View className={styles.menuItem} onClick={() => Taro.switchTab({ url: '/pages/progress/index' })}>
            <View className={styles.menuLabel}><Text className={styles.icon}>📋</Text>我的办事进度</View>
            <Text className={styles.menuArrow}>&gt;</Text>
          </View>
          <View className={styles.menuItem} onClick={() => Taro.navigateTo({ url: '/pages/message/index' })}>
            <View className={styles.menuLabel}><Text className={styles.icon}>🔔</Text>消息通知</View>
            <Text className={styles.menuArrow}>&gt;</Text>
          </View>
          <View className={styles.menuItem}>
            <View className={styles.menuLabel}><Text className={styles.icon}>📝</Text>我的论坛发布</View>
            <Text className={styles.menuArrow}>&gt;</Text>
          </View>
        </View>

        <View className={styles.menuGroup}>
          <View className={styles.menuItem} onClick={handleRestoreAi}>
            <View className={styles.menuLabel}><Text className={styles.icon}>🤖</Text>恢复 AI 导办悬浮窗</View>
            <Text className={styles.menuArrow}>&gt;</Text>
          </View>
          <View className={styles.menuItem}>
            <View className={styles.menuLabel}><Text className={styles.icon}>🛡️</Text>账号与安全</View>
            <Text className={styles.menuArrow}>&gt;</Text>
          </View>
          <View className={styles.menuItem}>
            <View className={styles.menuLabel}><Text className={styles.icon}>❓</Text>帮助与反馈</View>
            <Text className={styles.menuArrow}>&gt;</Text>
          </View>
          <View className={styles.menuItem}>
            <View className={styles.menuLabel}><Text className={styles.icon}>ℹ️</Text>关于校园百事通</View>
            <Text className={styles.menuArrow}>&gt;</Text>
          </View>
        </View>

        <View className={styles.menuGroup}>
          <View className={styles.menuItem} onClick={handleLogout}>
            <View className={styles.menuLabel}><Text className={styles.icon}>🚪</Text><Text style={{ color: '#F53F3F' }}>退出登录</Text></View>
            <Text className={styles.menuArrow}></Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}