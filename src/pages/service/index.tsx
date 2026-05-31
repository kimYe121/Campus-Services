import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useUserStore } from '@/store/userStore';
import styles from './index.module.scss';

export default function ServicePage() {
  const { role } = useUserStore();

  const serviceCategories = [
    {
      title: '后勤与安保',
      services: [
        { id: 'repair', name: '后勤报修', icon: '🔧', roles: ['student', 'teacher'] },
        { id: 'dorm_change', name: '宿舍调整', icon: '🏠', roles: ['student'] },
        { id: 'asset_repair', name: '资产报修', icon: '🖥️', roles: ['teacher'] },
        { id: 'pass', name: '教工通行证', icon: '🚗', roles: ['teacher'] },
      ]
    },
    {
      title: '教务与办事',
      services: [
        { id: 'proof', name: '证明办理', icon: '📄', roles: ['student', 'teacher'] },
        { id: 'leave', name: '请假申请', icon: '📝', roles: ['student'] },
        { id: 'grade', name: '成绩查询', icon: '📊', roles: ['student'] },
        { id: 'meeting', name: '教学场所预约', icon: '🏢', roles: ['teacher'] },
        { id: 'course_change', name: '调课申请', icon: '📅', roles: ['teacher'] },
        { id: 'equipment', name: '教学设备借用', icon: '📽️', roles: ['teacher'] },
      ]
    },
    {
      title: '财务与咨询',
      services: [
        { id: 'payment', name: '校园缴费', icon: '💳', roles: ['student'] },
        { id: 'grant', name: '助学金申请', icon: '💰', roles: ['student'] },
        { id: 'salary', name: '工资查询', icon: '💴', roles: ['teacher'] },
        { id: 'reimburse', name: '差旅报销', icon: '🧾', roles: ['teacher'] },
        { id: 'consult', name: '咨询投诉', icon: '💬', roles: ['student', 'teacher'] },
      ]
    }
  ];

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <View className={styles.title}>服务大厅</View>
      </View>

      <View className={styles.searchBar} onClick={() => Taro.navigateTo({ url: '/pages/search/index' })}>
        <Text className={styles.icon}>🔍</Text>
        <Text className={styles.placeholder}>搜索服务、事项、编号...</Text>
      </View>

      {serviceCategories.map((category, index) => {
        // 过滤出当前角色有权限看到的服务
        const displayServices = category.services.filter(s => s.roles.includes(role));
        
        if (displayServices.length === 0) return null;

        return (
          <View key={index} className={styles.categorySection}>
            <View className={styles.categoryTitle}>{category.title}</View>
            <View className={styles.grid}>
              {displayServices.map(service => (
                <View 
                  key={service.id} 
                  className={styles.item}
                  onClick={() => Taro.navigateTo({ url: `/pages/taskForm/index?type=${service.id}` })}
                >
                  <Text className={styles.icon}>{service.icon}</Text>
                  <Text className={styles.name}>{service.name}</Text>
                </View>
              ))}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}