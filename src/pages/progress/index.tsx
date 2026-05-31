import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import classnames from 'classnames';
import TaskCard from '@/components/TaskCard';
import { studentTasks, teacherTasks } from '@/data/mock';
import { useUserStore } from '@/store/userStore';
import styles from './index.module.scss';

export default function ProgressPage() {
  const [activeTab, setActiveTab] = useState('all'); // all, processing, completed
  const { role } = useUserStore();

  // 根据当前身份加载对应的解耦数据
  const currentTasks = role === 'student' ? studentTasks : teacherTasks;

  const filteredTasks = currentTasks.filter(task => {
    if (activeTab === 'processing') return task.status === 'pending' || task.status === 'processing';
    if (activeTab === 'completed') return task.status === 'completed' || task.status === 'evaluated';
    return true;
  });

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <View className={styles.title}>进度追踪</View>
      </View>

      <View className={styles.tabs}>
        <View className={classnames(styles.tab, activeTab === 'all' && styles.active)} onClick={() => setActiveTab('all')}>全部</View>
        <View className={classnames(styles.tab, activeTab === 'processing' && styles.active)} onClick={() => setActiveTab('processing')}>处理中</View>
        <View className={classnames(styles.tab, activeTab === 'completed' && styles.active)} onClick={() => setActiveTab('completed')}>已完成</View>
      </View>

      <View className={styles.list}>
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => <TaskCard key={task.id} task={task} />)
        ) : (
          <View style={{ textAlign: 'center', padding: '100rpx 0', color: '#86909C', fontSize: '28rpx' }}>暂无相关进度数据</View>
        )}
      </View>
    </ScrollView>
  );
}