# 校园百事通 - API 接口文档

本文档专为后端 Java（如 Spring Boot）开发人员提供，定义了《校园百事通》前端 Demo 所需对接的 RESTful API。

## 1. 全局说明

- **基础路径 (Base URL)**: `/api/v1`
- **数据交互格式**: `application/json`
- **鉴权方式**: HTTP Header 携带 `Authorization: Bearer <token>`
- **通用响应结构 (Base Response)**:

```json
{
  "code": 200,          // 业务状态码 (200 表示成功)
  "message": "success", // 提示信息
  "data": {}            // 具体响应数据，可能为对象或数组
}
```

## 2. 接口定义

### 2.1 用户模块

#### 获取当前登录用户信息
- **接口路径**: `GET /user/profile`
- **接口描述**: 获取当前用户的基本信息。
- **响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "U1001",
    "name": "张三",
    "studentId": "20230001",
    "avatar": "https://example.com/avatar.jpg",
    "department": "计算机科学与技术学院"
  }
}
```

### 2.2 事项/工单模块

#### 1. 获取事项列表
- **接口路径**: `GET /tasks`
- **接口描述**: 获取用户发起的所有事项记录，支持分页和状态过滤。
- **请求参数 (Query)**:
  - `status` (可选): 状态过滤 `pending` | `processing` | `completed` | `evaluated`
  - `page` (可选): 页码，默认 1
  - `size` (可选): 每页条数，默认 10
- **响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 42,
    "list": [
      {
        "id": "T2023053101",
        "type": "repair", // repair|payment|proof|consult
        "title": "南区宿舍空调不制冷",
        "status": "processing",
        "createdAt": "2023-05-31T10:00:00Z"
      }
    ]
  }
}
```

#### 2. 获取事项详情
- **接口路径**: `GET /tasks/{id}`
- **接口描述**: 获取某个具体事项的详细信息，包含时间轴进度。
- **响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "T2023053101",
    "type": "repair",
    "title": "南区宿舍空调不制冷",
    "description": "开机半小时仍然没有冷风，显示屏报 E1 错误。",
    "images": ["https://example.com/img1.jpg"],
    "location": "南区3栋402",
    "status": "processing",
    "createdAt": "2023-05-31T10:00:00Z",
    "timeline": [
      {
        "status": "pending",
        "desc": "已提交报修申请",
        "time": "2023-05-31T10:00:00Z"
      },
      {
        "status": "processing",
        "desc": "维修工李师傅已接单，预计今日 14:00 上门",
        "time": "2023-05-31T10:30:00Z"
      }
    ]
  }
}
```

#### 3. 提交新事项
- **接口路径**: `POST /tasks`
- **接口描述**: 用户发起报修、缴费、开证明或咨询。
- **请求体 (Body)**:
```json
{
  "type": "repair",
  "title": "南区宿舍空调不制冷",
  "description": "详细描述内容...",
  "location": "南区3栋402",
  "images": ["https://example.com/img1.jpg"] // 可选，图片上传后获取的 URL
}
```
- **响应示例**:
```json
{
  "code": 200,
  "message": "提交成功",
  "data": {
    "id": "T2023053102"
  }
}
```

### 2.3 消息模块

#### 获取未读消息数量
- **接口路径**: `GET /messages/unread-count`
- **接口描述**: 轮询或进入应用时获取用户的未读通知数量。
- **响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "count": 3
  }
}
```

### 2.4 文件上传模块

#### 上传图片/附件
- **接口路径**: `POST /upload/image`
- **接口描述**: 上传图片，返回图片在服务器或 OSS 上的公网 URL。
- **请求格式**: `multipart/form-data`
  - 字段名: `file`
- **响应示例**:
```json
{
  "code": 200,
  "message": "上传成功",
  "data": {
    "url": "https://example.com/uploads/img_123.jpg"
  }
}
```
