import React from 'react';
import { View } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';

interface Props {
  status: 'pending' | 'processing' | 'completed' | 'evaluated';
}

const statusMap = {
  pending: '待处理',
  processing: '处理中',
  completed: '已完成',
  evaluated: '已评价'
};

export default function StatusTag({ status }: Props) {
  return (
    <View className={classnames(styles.statusTag, styles[status])}>
      {statusMap[status] || '未知状态'}
    </View>
  );
}
