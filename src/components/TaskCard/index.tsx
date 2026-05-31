import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import StatusTag from '../StatusTag';
import { TaskItem } from '@/data/mock';
import styles from './index.module.scss';

interface Props {
  task: TaskItem;
}

export default function TaskCard({ task }: Props) {
  const handleClick = () => {
    Taro.navigateTo({ url: `/pages/taskDetail/index?id=${task.id}` });
  };

  return (
    <View className={styles.taskCard} onClick={handleClick}>
      <View className={styles.header}>
        <Text className={styles.typeTag}>{task.type}</Text>
        <StatusTag status={task.status} />
      </View>
      <View className={styles.title}>{task.title}</View>
      <View className={styles.desc}>{task.desc}</View>
      <View className={styles.footer}>
        <Text className={styles.time}>{task.time}</Text>
        <Text className={styles.id}>#{task.id}</Text>
      </View>
    </View>
  );
}
