export interface TaskItem {
  id: string;
  type: string;
  title: string;
  desc: string;
  status: 'pending' | 'processing' | 'completed' | 'evaluated';
  time: string;
}

export const studentTasks: TaskItem[] = [
  { id: 'ST1001', type: '后勤报修', title: '南区3栋402空调不制冷', desc: '开机半小时无冷风，显示 E1', status: 'processing', time: '今天 10:00' },
  { id: 'ST1002', type: '请假申请', title: '病假申请 (2天)', desc: '因发烧需请假，已上传医院证明', status: 'pending', time: '昨天 15:30' },
  { id: 'ST1003', type: '校园缴费', title: '2023学年秋季住宿费', desc: '已通过微信支付缴纳 1200 元', status: 'completed', time: '2023-09-01' },
];

export const teacherTasks: TaskItem[] = [
  { id: 'TC2001', type: '会议室预约', title: '行政楼302会议室', desc: '周五下午 14:00-16:00 部门例会', status: 'evaluated', time: '周一 09:00' },
  { id: 'TC2002', type: '资产报修', title: '实验室投影仪故障', desc: '无法连接HDMI信号源', status: 'processing', time: '昨天 14:20' },
  { id: 'TC2003', type: '差旅报销', title: '北京学术会议差旅报销', desc: '机建燃油及住宿费共计 2850 元', status: 'pending', time: '刚刚' },
];

export const studentMessages = [
  { id: 1, title: '工单进度更新', content: '您的报修工单 [南区3栋402空调不制冷] 维修工李师傅已接单，预计今日14:00上门。', time: '10:30', isRead: false },
  { id: 2, title: '系统通知', content: '南昌航空大学2023学年秋季学期选课即将开始，请注意查看教务系统。', time: '昨天', isRead: true },
];

export const teacherMessages = [
  { id: 1, title: '审批提醒', content: '您有一条来自 张同学 的 [请假申请] 待审批，请及时处理。', time: '10:30', isRead: false },
  { id: 2, title: '报销进度', content: '您的 [北京学术会议差旅报销] 已通过财务初审。', time: '昨天', isRead: true },
];
