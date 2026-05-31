import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { studentMessages, teacherMessages } from '@/data/mock';
import { useUserStore } from '@/store/userStore';
import styles from './index.module.scss';

export default function MessagePage() {
  const { role } = useUserStore();
  const currentMessages = role === 'student' ? studentMessages : teacherMessages;

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <View className={styles.title}>消息通知</View>
      </View>

      <View className={styles.msgList}>
        {currentMessages.length > 0 ? (
          currentMessages.map(msg => (
            <View key={msg.id} className={styles.msgCard}>
              <View className={styles.msgHeader}>
                <View className={styles.msgTitle}>
                  {!msg.isRead && <View className={styles.dot}></View>}
                  <Text>{msg.title}</Text>
                </View>
                <Text className={styles.msgTime}>{msg.time}</Text>
              </View>
              <View className={styles.msgContent}>{msg.content}</View>
            </View>
          ))
        ) : (
          <View style={{ textAlign: 'center', padding: '100rpx 0', color: '#86909C', fontSize: '28rpx' }}>暂无消息</View>
        )}
      </View>
    </ScrollView>
  );
}