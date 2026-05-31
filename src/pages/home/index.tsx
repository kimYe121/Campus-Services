import React, { useState } from 'react';
import { View, Text, Image, ScrollView, Swiper, SwiperItem, Input } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { useUserStore } from '@/store/userStore';
import { studentTasks, teacherTasks } from '@/data/mock';
import AiAssistant from '@/components/AiAssistant';
import styles from './index.module.scss';

export default function HomePage() {
  const { role, isLoggedIn, name } = useUserStore();
  const recentTasks = role === 'student' ? studentTasks : teacherTasks;
  const recentTask = recentTasks.length > 0 ? recentTasks[0] : null;

  // AI 办事助手状态
  const [aiInput, setAiInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  // 模拟最近使用的功能
  const recentServices = role === 'student' ? [
    { id: 'repair', name: '宿舍报修', icon: '🔧' },
    { id: 'leave', name: '请假申请', icon: '📝' },
    { id: 'grade', name: '成绩查询', icon: '📊' },
    { id: 'proof', name: '证明办理', icon: '📄' },
  ] : [
    { id: 'course_change', name: '调课申请', icon: '📅' },
    { id: 'meeting', name: '会议室预约', icon: '🏢' },
    { id: 'reimburse', name: '差旅报销', icon: '🧾' },
    { id: 'repair', name: '资产报修', icon: '🖥️' },
  ];

  useDidShow(() => {
    if (!isLoggedIn) {
      Taro.redirectTo({ url: '/pages/login/index' });
    }
  });

  const navigateToForm = (type: string, prefill?: any) => {
    // 携带预填数据跳转到表单页 (Idea A)
    const query = prefill ? `&prefill=${encodeURIComponent(JSON.stringify(prefill))}` : '';
    Taro.navigateTo({ url: `/pages/taskForm/index?type=${type}${query}` });
  };

  const handleAiSubmit = () => {
    if (!aiInput.trim()) return;
    setIsAnalyzing(true);
    setAiResult(null);

    // 模拟 AI 意图识别延迟
    setTimeout(() => {
      setIsAnalyzing(false);
      
      // 简单正则匹配演示 AI 效果
      if (aiInput.includes('空调') || aiInput.includes('修')) {
        setAiResult({
          type: 'repair',
          typeName: '后勤报修 - 水电维修',
          department: '后勤维修中心 (空调组)',
          urgent: aiInput.includes('今晚') || aiInput.includes('马上') ? '较急' : '普通',
          missing: '楼栋/房间号',
          prefill: { category: '水电维修', title: aiInput }
        });
      } else if (aiInput.includes('证明') || aiInput.includes('实习')) {
        setAiResult({
          type: 'proof',
          typeName: '证明办理 - 在读证明',
          department: '教务处/学生处',
          urgent: '普通',
          missing: '领取方式',
          prefill: { proofType: '在读证明', usage: aiInput }
        });
      } else {
        setAiResult({
          type: 'consult',
          typeName: '智能问答/咨询',
          department: '综合服务台',
          urgent: '普通',
          missing: '无',
          prefill: { title: aiInput }
        });
      }
    }, 1200);
  };

  const handleSuggestClick = (text: string) => {
    setAiInput(text);
  };

  if (!isLoggedIn) return null;

  return (
    <>
      <ScrollView className={styles.homePage} scrollY>
        <View className={styles.header}>
          <View>
            <View className={styles.title}>{name}，你好</View>
            <View className={styles.subtitle}>日新自强，知行合一</View>
          </View>
          <View className={styles.weatherWidget} onClick={() => Taro.navigateTo({ url: '/pages/message/index' })}>
            <View className={styles.temp}>🔔 消息</View>
            <View className={styles.desc}>2条未读</View>
          </View>
        </View>

        {/* 首页轮播图恢复 */}
        <Swiper
          className={styles.banner}
          circular
          indicatorDots
          autoplay
          indicatorColor="rgba(255, 255, 255, 0.5)"
          indicatorActiveColor="#ffffff"
        >
          <SwiperItem>
            <Image className={styles.bannerImg} src="https://picsum.photos/id/1015/750/400" mode="aspectFill" />
          </SwiperItem>
          <SwiperItem>
            <Image className={styles.bannerImg} src="https://picsum.photos/id/1018/750/400" mode="aspectFill" />
          </SwiperItem>
          <SwiperItem>
            <Image className={styles.bannerImg} src="https://picsum.photos/id/1036/750/400" mode="aspectFill" />
          </SwiperItem>
        </Swiper>

        {/* Idea A: 一句话办事 (AI 意图识别 + 自动分流) */}
        <View className={styles.aiSearchBox}>
          <View className={styles.aiTitle}>
            <Text className={styles.aiIcon}>✨</Text>
            <Text>AI 一句话办事</Text>
          </View>
          
          <View className={styles.inputWrapper}>
            <Input 
              className={styles.aiInput} 
              placeholder="描述你要办的事，如“空调不制冷今晚能修吗”" 
              value={aiInput}
              onInput={e => setAiInput(e.detail.value)}
              onConfirm={handleAiSubmit}
            />
            <View className={styles.sendBtn} onClick={handleAiSubmit}>
              {isAnalyzing ? '...' : '↑'}
            </View>
          </View>

          {!aiResult && !isAnalyzing && (
            <View className={styles.suggestList}>
              <View className={styles.suggestItem} onClick={() => handleSuggestClick('宿舍空调不制冷，今晚能修吗？')}>宿舍空调不制冷，今晚能修吗？</View>
              <View className={styles.suggestItem} onClick={() => handleSuggestClick('我要开在校证明，用于去大厂实习')}>我要开在校证明用于实习</View>
            </View>
          )}

          {/* AI 识别结果卡片 */}
          {aiResult && (
            <View className={styles.aiResultCard}>
              <View className={styles.resultHeader}>
                <Text>🤖 AI 识别完成，已为您分流：</Text>
              </View>
              <View className={styles.resultRow}>
                <Text className={styles.label}>事项类型：</Text>
                <Text className={styles.value}>{aiResult.typeName}</Text>
              </View>
              <View className={styles.resultRow}>
                <Text className={styles.label}>推荐部门：</Text>
                <Text className={styles.value}>{aiResult.department}</Text>
              </View>
              <View className={styles.resultRow}>
                <Text className={styles.label}>紧急程度：</Text>
                <Text className={`${styles.value} ${aiResult.urgent === '较急' ? styles.urgent : ''}`}>{aiResult.urgent}</Text>
              </View>
              <View className={styles.resultRow}>
                <Text className={styles.label}>还缺信息：</Text>
                <Text className={`${styles.value} ${styles.missing}`}>{aiResult.missing} (点击补全)</Text>
              </View>
              
              <View className={styles.quickSubmitBtn} onClick={() => navigateToForm(aiResult.type, aiResult.prefill)}>
                一键进入确认与补全 (草稿已生成)
              </View>
            </View>
          )}
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>最近访问</Text>
            <Text className={styles.more} onClick={() => Taro.switchTab({ url: '/pages/service/index' })}>全部服务 &gt;</Text>
          </View>
          
          <ScrollView className={styles.recentScroll} scrollX showScrollbar={false}>
            {recentServices.map(service => (
              <View key={service.id} className={styles.recentItem} onClick={() => navigateToForm(service.id)}>
                <Text className={styles.icon}>{service.icon}</Text>
                <Text className={styles.name}>{service.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>待办与近期事项</Text>
            <Text className={styles.more} onClick={() => Taro.switchTab({ url: '/pages/progress/index' })}>查看全部 &gt;</Text>
          </View>
          
          {recentTask ? (
            <View className={styles.taskCard} onClick={() => Taro.navigateTo({ url: `/pages/taskDetail/index?id=${recentTask.id}` })}>
              <View className={styles.taskInfo}>
                <View className={styles.taskTitle}>{recentTask.title}</View>
                <View className={styles.taskDesc}>{recentTask.type} · {recentTask.time}</View>
              </View>
              <View className={styles.taskStatus}>{
                recentTask.status === 'pending' ? '待处理' : 
                recentTask.status === 'processing' ? '处理中' : 
                recentTask.status === 'completed' ? '已完成' : '已评价'
              }</View>
            </View>
          ) : (
            <View className={styles.taskCard}>
              <View className={styles.taskInfo}>
                <View className={styles.taskDesc}>暂无近期事项</View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      
      {/* 注入全局 AI 导办员 */}
      <AiAssistant />
    </>
  );
}
