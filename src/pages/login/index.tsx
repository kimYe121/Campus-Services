import React, { useState } from 'react';
import { View, Text, Input, Button, Picker } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useUserStore } from '@/store/userStore';
import SliderCaptcha from '@/components/SliderCaptcha';
import styles from './index.module.scss';

export default function LoginPage() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { setRole, login } = useUserStore();

  const roles = ['学生', '教职工'];
  const roleKeys: ('student' | 'teacher')[] = ['student', 'teacher'];

  const handleLoginClick = () => {
    if (!account || !password) {
      Taro.showToast({ title: '请完整填写账号和密码', icon: 'none' });
      return;
    }

    if (!isVerified) {
      // 弹出滑块验证码
      setShowCaptcha(true);
      return;
    }

    executeLogin();
  };

  const executeLogin = () => {
    setLoading(true);
    Taro.showLoading({ title: '认证中...' });

    // 模拟统一身份认证请求
    setTimeout(() => {
      Taro.hideLoading();
      setLoading(false);
      
      const selectedRole = roleKeys[roleIndex];
      const displayName = selectedRole === 'student' ? `${account}同学` : `${account}老师`;

      setRole(selectedRole);
      login({
        id: account,
        name: displayName,
        role: selectedRole
      });

      Taro.showToast({ title: '登录成功', icon: 'success' });
      
      setTimeout(() => {
        Taro.switchTab({ url: '/pages/home/index' });
      }, 1000);
    }, 1000);
  };

  const handleCaptchaSuccess = () => {
    setShowCaptcha(false);
    setIsVerified(true);
    // 验证成功后自动触发登录
    setTimeout(() => {
      executeLogin();
    }, 300);
  };

  return (
    <View className={styles.loginPage}>
      <View className={styles.header}>
        <View className={styles.logo}>N</View>
        <View className={styles.title}>统一身份认证</View>
        <View className={styles.subtitle}>南昌航空大学 · 校园百事通</View>
      </View>

      <View className={styles.formBox}>
        <View className={styles.inputGroup}>
          <View className={styles.inputItem}>
            <Text className={styles.icon}>🎭</Text>
            <Picker mode="selector" range={roles} onChange={e => setRoleIndex(e.detail.value)}>
              <View className={styles.picker}>{roles[roleIndex]}</View>
            </Picker>
          </View>
          <View className={styles.inputItem}>
            <Text className={styles.icon}>👤</Text>
            <Input 
              className={styles.input} 
              placeholder="请输入学工号" 
              value={account}
              onInput={(e) => setAccount(e.detail.value)}
            />
          </View>
          <View className={styles.inputItem}>
            <Text className={styles.icon}>🔒</Text>
            <Input 
              className={styles.input} 
              password 
              placeholder="请输入密码" 
              value={password}
              onInput={(e) => setPassword(e.detail.value)}
            />
          </View>
          {isVerified && (
            <View className={styles.inputItem} style={{ borderBottom: 'none' }}>
              <View className={styles.verifyStatus}>
                <Text>✓</Text>
                <Text>安全验证已通过</Text>
              </View>
            </View>
          )}
        </View>

        <Button className={styles.loginBtn} loading={loading} onClick={handleLoginClick}>
          {isVerified ? '登录' : '点击进行安全验证'}
        </Button>

        <View className={styles.tips}>
          首次登录需绑定微信，忘记密码请联系 <Text className={styles.link}>信息中心</Text>
        </View>
      </View>

      <View className={styles.footer}>
        <View className={styles.copyright}>© 南昌航空大学信息中心 提供技术支持</View>
      </View>

      {/* 现代化滑块验证码弹窗 */}
      <SliderCaptcha 
        visible={showCaptcha} 
        onSuccess={handleCaptchaSuccess} 
        onClose={() => setShowCaptcha(false)} 
      />
    </View>
  );
}