import React, { useState, useEffect } from 'react';
import { View, Text, Input, Textarea, Button, ScrollView, Picker, Switch, RadioGroup, Radio } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { useUserStore } from '@/store/userStore';
import classnames from 'classnames';
import styles from './index.module.scss';

export default function TaskFormPage() {
  const router = useRouter();
  const { type = 'repair', prefill } = router.params;
  const { role, name, id } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>({});
  
  // 材料完整度状态
  const [materialScore, setMaterialScore] = useState(0);

  // 解析首页传过来的预填数据 (Idea A)
  useEffect(() => {
    if (prefill) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(prefill));
        setFormData(prev => ({ ...prev, ...parsedData }));
        Taro.showToast({ title: '已通过 AI 自动补全', icon: 'none' });
      } catch (e) {
        console.error('Failed to parse prefill data');
      }
    }
  }, [prefill]);

  // 监听表单变化，动态计算材料完整度 (Idea C)
  useEffect(() => {
    let score = 0;
    if (formData.title) score += 30;
    if (formData.desc) score += 40;
    if (formData.imageUploaded) score += 30;
    setMaterialScore(score);
  }, [formData]);

  const handleInput = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const simulateUpload = () => {
    Taro.showLoading({ title: 'AI 图像校验中...' });
    setTimeout(() => {
      Taro.hideLoading();
      // 模拟 Idea C: 智能材料校验
      if (Math.random() > 0.5) {
        Taro.showToast({ title: '照片反光/模糊，请重拍', icon: 'none' });
      } else {
        handleInput('imageUploaded', true);
        Taro.showToast({ title: '材料校验通过', icon: 'success' });
      }
    }, 1500);
  };

  const typeMap: Record<string, string> = {
    repair: '后勤报修',
    asset_repair: '资产报修',
    payment: '校园缴费',
    proof: '证明办理',
    consult: '咨询投诉',
    leave: '请假申请',
    meeting: '会议室预约',
    course_change: '调课申请',
    dorm_change: '宿舍调整',
    pass: '教工通行证',
    grade: '成绩查询',
    equipment: '教学设备借用',
    grant: '助学金申请',
    salary: '工资明细查询',
    reimburse: '差旅报销'
  };

  const handleSubmit = () => {
    if (materialScore < 100 && type !== 'salary' && type !== 'grade') {
      Taro.showModal({
        title: '材料可能被退回',
        content: `当前材料完整度仅 ${materialScore}%，建议补全后再提交。是否强行提交？`,
        success: (res) => {
          if (res.confirm) executeSubmit();
        }
      });
    } else {
      executeSubmit();
    }
  };

  const executeSubmit = () => {
    setLoading(true);
    Taro.showLoading({ title: '处理中' });
    setTimeout(() => {
      Taro.hideLoading();
      Taro.showToast({ title: '操作成功', icon: 'success' });
      setTimeout(() => {
        Taro.switchTab({ url: '/pages/progress/index' });
      }, 1500);
    }, 1500);
  };

  const FormItem = ({ label, required = false, children }: any) => (
    <View className={styles.formItem}>
      <Text className={styles.label}>{label} {required && <Text className={styles.required}>*</Text>}</Text>
      {children}
    </View>
  );

  const renderAiAssistant = () => {
    // Idea B: AI 表单助手对话式补全
    if (type === 'repair' && !formData.location) {
      return (
        <View className={styles.aiAssistantCard}>
          <View className={styles.aiHeader}><Text>🤖</Text><Text>AI 表单助手</Text></View>
          <View className={styles.aiMessage}>检测到您正在报修，为了师傅能准确上门，请问您是在宿舍还是教学楼？</View>
          <View className={styles.aiSuggestion}>
            <View className={styles.suggestBtn} onClick={() => handleInput('location', '南区宿舍')}>宿舍</View>
            <View className={styles.suggestBtn} onClick={() => handleInput('location', 'A栋教学楼')}>教学楼</View>
          </View>
        </View>
      );
    }
    if (type === 'proof' && !formData.desc) {
      return (
        <View className={styles.aiAssistantCard}>
          <View className={styles.aiHeader}><Text>🤖</Text><Text>AI 表单助手</Text></View>
          <View className={styles.aiMessage}>已为您自动带入身份信息：{name} ({id})。请选择证明用途，我将为您自动生成标准描述：</View>
          <View className={styles.aiSuggestion}>
            <View className={styles.suggestBtn} onClick={() => handleInput('desc', '本人因参加校外企业实习，特申请开具在读证明一份。')}>用于实习</View>
            <View className={styles.suggestBtn} onClick={() => handleInput('desc', '本人因出国交流项目需要，特申请开具在读证明一份。')}>用于出国</View>
          </View>
        </View>
      );
    }
    return null;
  };

  const renderSpecificFields = () => {
    switch (type) {
      case 'repair':
        return (
          <>
            <FormItem label="报修分类" required>
              <Picker mode="selector" range={['水电维修', '门窗家具', '校园网络', '公共设施']} onChange={e => handleInput('category', ['水电维修', '门窗家具', '校园网络', '公共设施'][e.detail.value])}>
                <View className={classnames(styles.pickerValue, !formData.category && styles.empty)}>{formData.category || '请选择报修分类'}</View>
              </Picker>
            </FormItem>
            <FormItem label="发生地点/详细房号" required>
              <Input className={styles.input} placeholder="如：南区3栋402" value={formData.location || ''} onInput={e => handleInput('location', e.detail.value)} />
            </FormItem>
          </>
        );
      
      case 'asset_repair':
        return (
          <>
            <FormItem label="资产编号" required><Input className={styles.input} placeholder="可扫描资产二维码或手动输入" /></FormItem>
            <FormItem label="资产名称"><Input className={styles.input} placeholder="如：投影仪/打印机" /></FormItem>
          </>
        );

      case 'leave':
        return (
          <>
            <FormItem label="请假类型" required>
              <Picker mode="selector" range={['事假', '病假', '公假', '其他']} onChange={e => handleInput('leaveType', ['事假', '病假', '公假', '其他'][e.detail.value])}>
                <View className={classnames(styles.pickerValue, !formData.leaveType && styles.empty)}>{formData.leaveType || '请选择请假类型'}</View>
              </Picker>
            </FormItem>
            <FormItem label="起止时间" required>
              <Picker mode="date" onChange={e => handleInput('start', e.detail.value)}>
                <View className={classnames(styles.pickerValue, !formData.start && styles.empty)} style={{ marginBottom: '16rpx' }}>{formData.start ? `开始: ${formData.start}` : '选择开始日期'}</View>
              </Picker>
              <Picker mode="date" onChange={e => handleInput('end', e.detail.value)}>
                <View className={classnames(styles.pickerValue, !formData.end && styles.empty)}>{formData.end ? `结束: ${formData.end}` : '选择结束日期'}</View>
              </Picker>
            </FormItem>
            <View className={styles.formItem}>
              <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text className={styles.label} style={{ marginBottom: 0 }}>是否离校</Text>
                <Switch checked={formData.leaveCampus} onChange={e => handleInput('leaveCampus', e.detail.value)} color="#0050A0" />
              </View>
            </View>
            {formData.leaveCampus && (
              <FormItem label="离校去向与紧急联系人" required><Input className={styles.input} placeholder="去向地址及联系人电话" /></FormItem>
            )}
          </>
        );

      case 'course_change':
        return (
          <>
            <FormItem label="调整类型" required>
              <RadioGroup className={styles.radioGroup} onChange={e => handleInput('courseType', e.detail.value)}>
                <Radio className={styles.radioItem} value="调课" color="#0050A0">调课</Radio>
                <Radio className={styles.radioItem} value="停课" color="#0050A0">停课</Radio>
                <Radio className={styles.radioItem} value="补课" color="#0050A0">补课</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="原课程信息" required>
              <Picker mode="selector" range={['高等数学 (周一 1-2节)', '大学物理 (周三 3-4节)', '程序设计 (周五 5-6节)']}>
                <View className={classnames(styles.pickerValue, styles.empty)}>选择要调整的课程</View>
              </Picker>
            </FormItem>
            {formData.courseType !== '停课' && (
              <FormItem label="期望调整至时间" required>
                <Picker mode="date" onChange={e => handleInput('targetDate', e.detail.value)}>
                  <View className={classnames(styles.pickerValue, !formData.targetDate && styles.empty)}>{formData.targetDate || '选择目标日期'}</View>
                </Picker>
              </FormItem>
            )}
          </>
        );

      case 'payment':
        return (
          <>
            <FormItem label="缴费项目" required>
              <Picker mode="selector" range={['2023秋季学费', '四六级报名费', '重修报名费']} onChange={e => handleInput('payItem', ['2023秋季学费', '四六级报名费', '重修报名费'][e.detail.value])}>
                <View className={classnames(styles.pickerValue, !formData.payItem && styles.empty)}>{formData.payItem || '选择缴费项目'}</View>
              </Picker>
            </FormItem>
            <FormItem label="应缴金额 (元)"><Input className={styles.input} value={formData.payItem ? "1200.00" : ""} disabled /></FormItem>
          </>
        );

      case 'proof':
        return (
          <>
            <FormItem label="证明类型" required>
              <Picker mode="selector" range={['在读证明', '成绩单', '实习鉴定表']}>
                <View className={classnames(styles.pickerValue, styles.empty)}>选择需要开具的证明</View>
              </Picker>
            </FormItem>
            <FormItem label="领取方式" required>
              <RadioGroup className={styles.radioGroup} onChange={e => handleInput('delivery', e.detail.value)}>
                <Radio className={styles.radioItem} value="自取" color="#0050A0">自助打印机自取</Radio>
                <Radio className={styles.radioItem} value="邮寄" color="#0050A0">邮寄到付</Radio>
              </RadioGroup>
            </FormItem>
            {formData.delivery === '邮寄' && <FormItem label="收件地址" required><Input className={styles.input} placeholder="请输入详细收件地址" /></FormItem>}
          </>
        );

      case 'dorm_change':
        return (
          <>
            <FormItem label="当前宿舍"><Input className={styles.input} value="南区3栋402" disabled /></FormItem>
            <FormItem label="意向调整楼栋" required><Input className={styles.input} placeholder="如：北区1栋" /></FormItem>
          </>
        );

      case 'grant':
        return (
          <>
            <FormItem label="申请类别" required>
              <Picker mode="selector" range={['国家一等助学金', '国家二等助学金', '校级困难补助']}>
                <View className={classnames(styles.pickerValue, styles.empty)}>选择申请类别</View>
              </Picker>
            </FormItem>
            <FormItem label="家庭情况简述" required><Textarea className={styles.textarea} placeholder="简述家庭经济情况..." /></FormItem>
          </>
        );

      case 'reimburse':
        return (
          <>
            <FormItem label="项目/经费号" required><Input className={styles.input} placeholder="请输入经费代码" /></FormItem>
            <FormItem label="报销总额 (元)" required><Input className={styles.input} type="digit" placeholder="请输入发票总计金额" /></FormItem>
            <FormItem label="差旅事由" required><Textarea className={styles.textarea} placeholder="如：赴北京参加人工智能学术会议" /></FormItem>
          </>
        );

      case 'meeting':
        return (
          <>
            <FormItem label="场地类型" required>
              <Picker mode="selector" range={['多媒体教室', '普通会议室', '计算机实验室', '舞蹈房/排练室']} onChange={e => handleInput('roomType', ['多媒体教室', '普通会议室', '计算机实验室', '舞蹈房/排练室'][e.detail.value])}>
                <View className={classnames(styles.pickerValue, !formData.roomType && styles.empty)}>{formData.roomType || '选择场所类型'}</View>
              </Picker>
            </FormItem>
            <FormItem label="所属学院/中心" required>
              <Picker mode="selector" range={['航空制造工程学院', '信息工程学院', '软件学院', '公共教学楼', '体育部']} onChange={e => handleInput('college', ['航空制造工程学院', '信息工程学院', '软件学院', '公共教学楼', '体育部'][e.detail.value])}>
                <View className={classnames(styles.pickerValue, !formData.college && styles.empty)}>{formData.college || '选择管辖单位'}</View>
              </Picker>
            </FormItem>
            {formData.roomType && formData.college && (
              <FormItem label="具体房间" required>
                <Picker mode="selector" range={['A101', 'A102', 'B205 (可容纳100人)']}>
                  <View className={classnames(styles.pickerValue, styles.empty)}>请选择具体房间</View>
                </Picker>
              </FormItem>
            )}
            <FormItem label="预约日期" required>
              <Picker mode="date" onChange={e => handleInput('mDate', e.detail.value)}>
                <View className={classnames(styles.pickerValue, !formData.mDate && styles.empty)}>{formData.mDate || '选择日期'}</View>
              </Picker>
            </FormItem>
            <FormItem label="使用人数" required><Input className={styles.input} type="number" placeholder="请输入预计人数" /></FormItem>
            <View className={styles.formItem}>
              <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text className={styles.label} style={{ marginBottom: 0 }}>是否需要多媒体设备</Text>
                <Switch color="#0050A0" />
              </View>
            </View>
          </>
        );

      case 'pass':
        return (
          <>
            <FormItem label="车牌号码" required><Input className={styles.input} placeholder="如：赣A·12345" /></FormItem>
            <FormItem label="通行证类型" required>
              <RadioGroup className={styles.radioGroup}>
                <Radio className={styles.radioItem} value="1" color="#0050A0">年度常驻卡</Radio>
                <Radio className={styles.radioItem} value="2" color="#0050A0">临时访问卡</Radio>
              </RadioGroup>
            </FormItem>
          </>
        );

      case 'equipment':
        return (
          <>
            <FormItem label="设备名称/型号" required><Input className={styles.input} placeholder="如：便携式投影仪" /></FormItem>
            <FormItem label="借用时长" required><Input className={styles.input} placeholder="如：2天" /></FormItem>
          </>
        );

      case 'salary':
      case 'grade':
        return (
          <FormItem label="查询周期" required>
            <Picker mode="selector" range={['2023-2024第一学期/第一季度', '2022-2023第二学期/第二季度']}>
              <View className={classnames(styles.pickerValue, styles.empty)}>选择要查询的周期</View>
            </Picker>
          </FormItem>
        );

      default:
        return null;
    }
  };

  return (
    <ScrollView className={styles.page} scrollY>
      
      {/* 注入 AI 表单助手 */}
      {renderAiAssistant()}

      <View className={styles.formCard}>
        <View className={styles.formTitle}>{type === 'salary' || type === 'grade' ? '查询' : '发起'}{typeMap[type] || '事项'}</View>
        
        {type !== 'salary' && type !== 'grade' && (
          <FormItem label="标题" required>
            <Input className={styles.input} placeholder="请输入简短明确的标题" value={formData.title || ''} onInput={e => handleInput('title', e.detail.value)} />
          </FormItem>
        )}

        {renderSpecificFields()}

        {type !== 'salary' && type !== 'grade' && (
          <>
            <FormItem label="详细说明" required>
              <Textarea className={styles.textarea} placeholder="请详细描述您的诉求..." maxlength={500} value={formData.desc || ''} onInput={e => handleInput('desc', e.detail.value)} />
            </FormItem>

            <FormItem label="附件/证明材料" required={type === 'leave' || type === 'reimburse'}>
              <View className={styles.uploadBox} onClick={simulateUpload}>
                {formData.imageUploaded ? (
                  <Text style={{ color: '#00B42A' }}>✓ 已校验</Text>
                ) : (
                  <>
                    <Text className={styles.plus}>+</Text>
                    <Text className={styles.text}>AI智能上传校验</Text>
                  </>
                )}
              </View>

              {/* Idea C: 材料完整度进度条 */}
              <View className={styles.progressContainer}>
                <View className={styles.progressHeader}>
                  <Text>材料完整度评估</Text>
                  <Text className={classnames(styles.percent, materialScore < 60 ? styles.error : materialScore < 100 ? styles.warning : styles.success)}>
                    {materialScore}%
                  </Text>
                </View>
                <View className={styles.progressBar}>
                  <View 
                    className={classnames(styles.progressFill, materialScore < 60 ? styles.error : materialScore < 100 ? styles.warning : styles.success)} 
                    style={{ width: `${materialScore}%` }}
                  />
                </View>
                {materialScore < 100 && <View className={styles.progressTip}>提示：材料不全可能导致退回重办</View>}
              </View>
            </FormItem>
          </>
        )}
      </View>

      <Button className={styles.submitBtn} loading={loading} onClick={handleSubmit}>
        {type === 'salary' || type === 'grade' ? '立即查询' : '提交申请'}
      </Button>
    </ScrollView>
  );
}