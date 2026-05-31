import React, { useState, useEffect } from 'react';
import { View, Text, Input, ScrollView, MovableArea, MovableView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useUserStore } from '@/store/userStore';
import classnames from 'classnames';
import styles from './index.module.scss';

interface Message {
  id: string;
  type: 'user' | 'system';
  content: string;
  actionCard?: {
    title: string;
    desc: string;
    path: string;
  };
}

export default function AiAssistant() {
  const [visible, setVisible] = useState(false);
  // 使用 Zustand 全局状态来控制 AI 助手的显示和隐藏，确保跨页面同步
  const { aiHidden, setAiHidden } = useUserStore();

  // 监听隐藏状态给出提示
  useEffect(() => {
    if (aiHidden) {
      Taro.showToast({ title: 'AI 导办已隐藏，可在“我的”页面恢复', icon: 'none', duration: 2000 });
    }
  }, [aiHidden]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'system',
      content: '你好！我是校园百事通 AI 导办员。无论是新生入学指引、校园缴费，还是后勤报修，都可以直接问我哦！'
    }
  ]);

  const handleSend = () => {
    if (!inputValue.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // 模拟 AI 思考与回复
    setTimeout(() => {
      let sysReply: Message = {
        id: (Date.now() + 1).toString(),
        type: 'system',
        content: ''
      };

      if (userMsg.content.includes('交学费') || userMsg.content.includes('缴费')) {
        sysReply.content = '新生或老生交学费，可以通过我们平台的“校园缴费”功能直接线上办理，支持微信/支付宝支付。需要我现在带您去办理吗？';
        sysReply.actionCard = {
          title: '前往校园缴费',
          desc: '支持学费、住宿费一键缴纳',
          path: '/pages/taskForm/index?type=payment'
        };
      } else if (userMsg.content.includes('网坏了') || userMsg.content.includes('报修')) {
        sysReply.content = '网络故障让人头疼！您可以直接提交一个网络报修工单，我会立刻为您指派信息中心的老师跟进。';
        sysReply.actionCard = {
          title: '发起网络报修',
          desc: '信息中心老师快速响应',
          path: '/pages/taskForm/index?type=repair&prefill=' + encodeURIComponent(JSON.stringify({ category: '校园网络' }))
        };
      } else {
        sysReply.content = '我已经记录下您的问题。校园事务繁杂，如果您需要办理具体业务，可以点击下方的“服务大厅”查看所有分类哦！';
      }

      setMessages(prev => [...prev, sysReply]);
      setIsTyping(false);
    }, 1200);
  };

  if (aiHidden) return null;

  return (
    <>
      {/* 全局可拖拽悬浮按钮 */}
      {!visible && (
        <MovableArea className={styles.movableArea}>
          <MovableView 
            className={styles.aiFab} 
            direction="all" 
            x={300} 
            y={500}
            outOfBounds
            inertia
          >
            <View className={styles.fabContent} onClick={() => setVisible(true)}>
              <Text className={styles.icon}>🤖</Text>
            </View>
            <View className={styles.closeFab} onClick={(e) => { e.stopPropagation(); setAiHidden(true); }}>×</View>
          </MovableView>
        </MovableArea>
      )}

      {/* 聊天弹窗 */}
      <View className={classnames(styles.chatOverlay, visible && styles.show)}>
        <View className={styles.chatBox}>
          <View className={styles.header}>
            <View className={styles.title}><Text>🤖</Text> AI 导办助理</View>
            <View className={styles.closeBtn} onClick={() => setVisible(false)}>×</View>
          </View>

          <ScrollView className={styles.messageList} scrollY scrollWithAnimation>
            {messages.map(msg => (
              <View key={msg.id} className={classnames(styles.msgWrapper, styles[msg.type])}>
                {msg.type === 'system' && <View className={styles.avatar}>🤖</View>}
                <View>
                  <View className={styles.bubble}>{msg.content}</View>
                  {msg.actionCard && (
                    <View className={styles.actionCard}>
                      <View className={styles.cardTitle}>{msg.actionCard.title}</View>
                      <View className={styles.cardDesc}>{msg.actionCard.desc}</View>
                      <View 
                        className={styles.cardBtn}
                        onClick={() => {
                          setVisible(false);
                          Taro.navigateTo({ url: msg.actionCard!.path });
                        }}
                      >
                        一键办理
                      </View>
                    </View>
                  )}
                </View>
                {msg.type === 'user' && <View className={styles.avatar}>👤</View>}
              </View>
            ))}
            
            {isTyping && (
              <View className={classnames(styles.msgWrapper, styles.system)}>
                <View className={styles.avatar}>🤖</View>
                <View className={styles.bubble}>正在输入...</View>
              </View>
            )}
          </ScrollView>

          <View className={styles.inputArea}>
            <Input 
              className={styles.input}
              placeholder="请输入您的问题..."
              value={inputValue}
              onInput={e => setInputValue(e.detail.value)}
              onConfirm={handleSend}
            />
            <View 
              className={classnames(styles.sendBtn, (!inputValue.trim() || isTyping) && styles.disabled)}
              onClick={handleSend}
            >
              ↑
            </View>
          </View>
        </View>
      </View>
    </>
  );
}