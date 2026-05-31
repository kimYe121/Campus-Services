import React, { useState } from 'react';
import { View, Text, Input, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useUserStore } from '@/store/userStore';
import styles from './index.module.scss';

// 所有服务数据
const allServices = [
  { id: 'repair', name: '后勤报修', desc: '宿舍、教学楼设施设备损坏报修', icon: '🔧', roles: ['student', 'teacher'] },
  { id: 'dorm_change', name: '宿舍调整', desc: '申请调换寝室或床位', icon: '🏠', roles: ['student'] },
  { id: 'asset_repair', name: '资产报修', desc: '实验室、办公室固定资产报修', icon: '🖥️', roles: ['teacher'] },
  { id: 'pass', name: '教工通行证', desc: '办理车辆常驻或临时通行证', icon: '🚗', roles: ['teacher'] },
  { id: 'proof', name: '证明办理', desc: '在读证明、成绩单等材料开具', icon: '📄', roles: ['student', 'teacher'] },
  { id: 'leave', name: '请假申请', desc: '病假、事假等请假手续办理', icon: '📝', roles: ['student'] },
  { id: 'grade', name: '成绩查询', desc: '历年期末考试成绩查询', icon: '📊', roles: ['student'] },
  { id: 'meeting', name: '教学场所预约', desc: '会议室、多媒体教室借用', icon: '🏢', roles: ['teacher'] },
  { id: 'course_change', name: '调课申请', desc: '调课、停课、补课申请', icon: '📅', roles: ['teacher'] },
  { id: 'equipment', name: '教学设备借用', desc: '投影仪、扩音器等设备借用', icon: '📽️', roles: ['teacher'] },
  { id: 'payment', name: '校园缴费', desc: '学费、住宿费、报名费缴纳', icon: '💳', roles: ['student'] },
  { id: 'grant', name: '助学金申请', desc: '各类困难补助及助学金申请', icon: '💰', roles: ['student'] },
  { id: 'salary', name: '工资查询', desc: '教职工月度薪酬明细查询', icon: '💴', roles: ['teacher'] },
  { id: 'reimburse', name: '差旅报销', desc: '出差费用、科研经费报销', icon: '🧾', roles: ['teacher'] },
  { id: 'consult', name: '咨询投诉', desc: '各类校园问题反馈与建议', icon: '💬', roles: ['student', 'teacher'] },
];

export default function SearchPage() {
  const { role } = useUserStore();
  const [keyword, setKeyword] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<typeof allServices>([]);

  // 历史搜索记录
  const [history, setHistory] = useState(['报修', '请假', '证明']);

  const handleSearch = (text?: string) => {
    const searchWord = text || keyword;
    if (!searchWord.trim()) return;

    setKeyword(searchWord);
    setIsSearching(true);

    // 保存到历史记录
    if (!history.includes(searchWord)) {
      setHistory([searchWord, ...history].slice(0, 5));
    }

    // 过滤出当前角色有权限且匹配关键字的服务
    const filtered = allServices.filter(s => 
      s.roles.includes(role) && 
      (s.name.includes(searchWord) || s.desc.includes(searchWord))
    );

    setResults(filtered);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const navigateToForm = (type: string) => {
    Taro.navigateTo({ url: `/pages/taskForm/index?type=${type}` });
  };

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.backBtn} onClick={() => Taro.navigateBack()}>&lt;</Text>
        <View className={styles.searchBox}>
          <Text className={styles.icon}>🔍</Text>
          <Input 
            className={styles.input} 
            placeholder="搜索服务、事项、指南..." 
            value={keyword}
            onInput={e => setKeyword(e.detail.value)}
            onConfirm={() => handleSearch()}
            focus
          />
          {keyword && (
            <Text 
              style={{ color: '#C9CDD4', padding: '10rpx' }} 
              onClick={() => { setKeyword(''); setIsSearching(false); }}
            >
              ✕
            </Text>
          )}
        </View>
        <Text className={styles.searchBtn} onClick={() => handleSearch()}>搜索</Text>
      </View>

      <ScrollView className={styles.content} scrollY>
        {!isSearching ? (
          <>
            {history.length > 0 && (
              <View>
                <View className={styles.sectionTitle}>
                  <Text>历史搜索</Text>
                  <Text className={styles.clear} onClick={handleClearHistory}>🗑️ 清除</Text>
                </View>
                <View className={styles.tagList}>
                  {history.map(item => (
                    <Text key={item} className={styles.tag} onClick={() => handleSearch(item)}>{item}</Text>
                  ))}
                </View>
              </View>
            )}

            <View>
              <View className={styles.sectionTitle}><Text>热门服务</Text></View>
              <View className={styles.tagList}>
                {role === 'student' ? (
                  <>
                    <Text className={styles.tag} onClick={() => handleSearch('报修')}>后勤报修</Text>
                    <Text className={styles.tag} onClick={() => handleSearch('请假')}>请假申请</Text>
                    <Text className={styles.tag} onClick={() => handleSearch('成绩')}>成绩查询</Text>
                  </>
                ) : (
                  <>
                    <Text className={styles.tag} onClick={() => handleSearch('调课')}>调课申请</Text>
                    <Text className={styles.tag} onClick={() => handleSearch('预约')}>场所预约</Text>
                    <Text className={styles.tag} onClick={() => handleSearch('报销')}>差旅报销</Text>
                  </>
                )}
              </View>
            </View>
          </>
        ) : (
          <View className={styles.resultList}>
            {results.length > 0 ? (
              results.map(item => (
                <View key={item.id} className={styles.resultItem} onClick={() => navigateToForm(item.id)}>
                  <View className={styles.icon}>{item.icon}</View>
                  <View className={styles.info}>
                    <View className={styles.name}>{item.name}</View>
                    <View className={styles.desc}>{item.desc}</View>
                  </View>
                  <Text className={styles.arrow}>&gt;</Text>
                </View>
              ))
            ) : (
              <View className={styles.empty}>
                <View style={{ fontSize: '64rpx', marginBottom: '16rpx' }}>📭</View>
                <Text>未找到相关服务，请换个关键词试试</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}