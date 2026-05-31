import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';

interface Props {
  visible: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

export default function SliderCaptcha({ visible, onSuccess, onClose }: Props) {
  const trackWidth = 260; // 滑道总可滑动宽度 (px) 模拟
  const [targetPos, setTargetPos] = useState(150); // 目标缺口位置
  const [sliderPos, setSliderPos] = useState(0); // 当前滑块位置
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<'normal' | 'success' | 'fail'>('normal');
  const [startX, setStartX] = useState(0);

  useEffect(() => {
    if (visible) {
      reset();
    }
  }, [visible]);

  const reset = () => {
    // 随机生成缺口位置 (限制在右侧半区)
    setTargetPos(Math.floor(Math.random() * 100) + 120);
    setSliderPos(0);
    setStatus('normal');
    setIsDragging(false);
  };

  // 兼容触摸和鼠标事件的通用处理逻辑
  const handleStart = (clientX: number) => {
    if (status !== 'normal') return;
    setIsDragging(true);
    setStartX(clientX);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging || status !== 'normal') return;
    
    const diff = clientX - startX;
    
    // 限制滑动范围 (0 到 trackWidth)
    let newPos = Math.max(0, diff);
    newPos = Math.min(newPos, trackWidth);
    
    setSliderPos(newPos);
  };

  const handleEnd = () => {
    if (!isDragging || status !== 'normal') return;
    setIsDragging(false);

    // 验证逻辑 (容错范围 5px)
    if (Math.abs(sliderPos - targetPos) < 5) {
      setStatus('success');
      Taro.showToast({ title: '验证通过', icon: 'success' });
      setTimeout(() => {
        onSuccess();
      }, 500);
    } else {
      setStatus('fail');
      Taro.showToast({ title: '验证失败', icon: 'error' });
      setTimeout(() => {
        reset();
      }, 800);
    }
  };

  // 绑定 Touch 事件 (移动端)
  const onTouchStart = (e: any) => handleStart(e.touches[0].clientX);
  const onTouchMove = (e: any) => handleMove(e.touches[0].clientX);
  const onTouchEnd = () => handleEnd();

  // 绑定 Mouse 事件 (PC 网页端)
  const onMouseDown = (e: any) => handleStart(e.clientX);
  const onMouseMove = (e: any) => handleMove(e.clientX);
  const onMouseUp = () => handleEnd();
  const onMouseLeave = () => {
    if (isDragging) handleEnd();
  };

  return (
    <View className={classnames(styles.captchaOverlay, visible && styles.show)} catchMove>
      <View className={styles.captchaBox}>
        <View className={styles.title}>
          <Text>安全验证</Text>
          <Text className={styles.closeBtn} onClick={onClose}>×</Text>
        </View>

        <View className={styles.imageContainer}>
          {/* 随机风景底图 */}
          <Image className={styles.bgImage} src="https://picsum.photos/id/1018/600/260" mode="aspectFill" />
          
          {/* 目标缺口 */}
          <View className={styles.targetHole} style={{ left: `${targetPos}px` }} />
          
          {/* 移动的滑块图像区域 */}
          <View className={styles.sliderBlock} style={{ left: `${sliderPos}px` }} />
        </View>

        <View 
          className={styles.sliderTrack}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
        >
          <Text className={styles.tips}>{status === 'success' ? '验证成功' : '向右拖动滑块完成拼图'}</Text>
          
          {/* 滑过区域的背景 */}
          <View className={styles.progressBg} style={{ width: `${sliderPos + 20}px` }} />
          
          {/* 滑动按钮 */}
          <View 
            className={classnames(
              styles.sliderButton, 
              isDragging && styles.active,
              status === 'success' && styles.success,
              status === 'fail' && styles.fail
            )}
            style={{ transform: `translateX(${sliderPos}px)` }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onMouseDown={onMouseDown}
          >
            {status === 'success' ? '✓' : status === 'fail' ? '✕' : '→'}
          </View>
        </View>
      </View>
    </View>
  );
}