import React, { useState } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import StatusTag from '@/components/StatusTag';
import { studentTasks, teacherTasks } from '@/data/mock';
import { useUserStore } from '@/store/userStore';
import classnames from 'classnames';
import styles from './index.module.scss';

export default function TaskDetailPage() {
  const router = useRouter();
  const { id } = router.params;
  const { role } = useUserStore();

  const currentTasks = role === 'student' ? studentTasks : teacherTasks;
  const task = currentTasks.find(t => t.id === id) || currentTasks[0];

  const timeline = [
    { title: '提交申请', desc: '系统已成功接收您的申请', time: '2023-05-31 10:00', active: true },
    { title: '业务流转', desc: '后勤中心/审批人已受理', time: '2023-05-31 10:30', active: true },
    { title: '节点处理', desc: '预计还需 2 小时完成', time: '', active: false },
    { title: '服务评价', desc: '等待最终反馈', time: '', active: false },
  ];

  const handleUrge = () => {
    Taro.showModal({
      title: '智能催办',
      content: '已将您的催办请求及等待时长(2小时)发送至处理人，请稍候。',
      showCancel: false
    });
  };

  const handleUpgrade = () => {
    Taro.showModal({
      title: '工单升级',
      content: '因等待超时，已为您一键升级转交至部门值班负责人。',
      showCancel: false
    });
  };

  return (
    <View className={styles.page}>
      <ScrollView scrollY style={{ height: 'calc(100vh - 140rpx)' }}>
        
        {/* Idea D: AI 进度摘要卡 */}
        <View className={styles.aiProgressCard}>
          <View className={styles.aiHeader}><Text>🤖</Text><Text>AI 进度摘要</Text></View>
          <View className={styles.aiContent}>
            <View className={styles.aiRow}>
              <Text className={styles.label}>当前状态：</Text>
              <Text className={classnames(styles.value, styles.highlight)}>{task.status === 'processing' ? '处理中' : '等待中'}</Text>
            </View>
            <View className={styles.aiRow}>
              <Text className={styles.label}>已完成：</Text>
              <Text className={styles.value}>工单受理、业务指派</Text>
            </View>
            <View className={styles.aiRow}>
              <Text className={styles.label}>预计下一步：</Text>
              <Text className={styles.value}>责任人处理完毕 <Text style={{color: '#86909C'}}>(预计2小时内)</Text></Text>
            </View>
            <View className={styles.aiRow}>
              <Text className={styles.label}>智能建议：</Text>
              <Text className={classnames(styles.value, styles.warning)}>如 18:00 前未更新状态，建议使用底部“一键升级”功能。</Text>
            </View>
          </View>
        </View>

        <View className={styles.detailCard}>
          <View className={styles.header}>
            <Text className={styles.typeTag}>{task.type}</Text>
            <StatusTag status={task.status} />
          </View>
          <View className={styles.title}>{task.title}</View>
          <View className={styles.info}>{task.desc}</View>
          <View className={styles.idTime}>工单号: {task.id} · {task.time}</View>
        </View>

        <View className={styles.timeline}>
          <View className={styles.sectionTitle}>处理进度</View>
          {timeline.map((item, index) => (
            <View key={index} className={styles.timelineItem}>
              <View className={classnames(styles.dot, item.active && styles.active)}></View>
              <View className={styles.content}>
                <View className={styles.itemTitle}>{item.title}</View>
                <View className={styles.itemDesc}>{item.desc}</View>
                {item.time && <View className={styles.itemTime}>{item.time}</View>}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View className={styles.actionFooter}>
        <Button className={classnames(styles.btn, styles.cancel)}>撤销申请</Button>
        {/* Idea E: 智能催办与升级 */}
        <Button className={classnames(styles.btn, styles.primary)} onClick={handleUrge}>智能催办</Button>
        <Button className={classnames(styles.btn, styles.urgent)} onClick={handleUpgrade}>一键升级</Button>
      </View>
    </View>
  );
}