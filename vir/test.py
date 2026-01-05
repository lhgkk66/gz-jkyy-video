import requests
import os

# API 地址（去掉原 GET 请求中的查询参数）
url = "http://127.0.0.1:9880/tts"
# 将原 GET 参数转为 JSON 格式的请求体
payload = {
    "text": "你好，我是数字人小爱，请问有什么可以帮助你的吗？期待你的回复。",#待合成的文本
    "text_lang": "zh",  # 文本语言
    "ref_audio_path": "D:/1/ai study/GPT-SoVITS-v2pro-20250604/output/slicer_opt/素材.mp3_0001644800_0001769600.wav",  # 参考音频路径
    "prompt_lang": "zh",  # 提示文本语言
    "prompt_text": "",  # 提示文本
    "text_split_method": "cut3",  # 文本分割方法（注意：原 URL 中重复定义，这里以 "cut0" 为准）
    "batch_size": 10,  # 批次大小
    "media_type": "wav",  # 输出音频格式
    "streaming_mode": False,  # 流式模式（原 URL 中重复定义，这里以 False 为准）
    "parallel_infer": True  # 并行推理
    # 其他参数（如 top_k、temperature 等，若有默认值可省略，需显式设置时补充）
}

def get_next_filename(base_dir="outputs", base_name="output"):
    """获取下一个可用的文件名"""
    
    # 确保输出目录存在
    os.makedirs(base_dir, exist_ok=True)
    
    # 查找已存在的文件
    existing_files = []
    for filename in os.listdir(base_dir):
        if filename.startswith(f"{base_name}-") and filename.endswith(".wav"):
            # 尝试提取数字部分
            try:
                # 移除前缀和后缀，提取数字
                num_str = filename[len(base_name)+1:-4]
                num = int(num_str)
                existing_files.append(num)
            except ValueError:
                continue  # 如果文件名格式不对，跳过
    
    # 如果没有找到现有文件，从1开始
    if not existing_files:
        next_num = 1
    else:
        # 找到最大的数字并加1
        next_num = max(existing_files) + 1
    
    # 格式化数字为两位数（01, 02, ... 10, 11, ...）
    formatted_num = f"{next_num:02d}"
    
    # 生成完整文件名
    filename = f"{base_name}-{formatted_num}.wav"
    filepath = os.path.join(base_dir, filename)
    
    return filepath, filename

try:
    # 获取下一个文件名
    filepath, filename = get_next_filename()
    
    # 发送 POST 请求（使用 json 参数自动序列化并设置 Content-Type: application/json）
    response = requests.post(url, json=payload, timeout=30)  # 超时设为 30 秒

    # 检查请求是否成功
    response.raise_for_status()  # 非 200 状态码会抛出异常

    # 处理响应（根据实际返回格式调整，若为音频流可直接保存）
    print("POST 请求成功！")
    
    # 保存音频文件
    with open(filepath, "wb") as f:
        f.write(response.content)
    print(f"音频已保存为 {filename}")

except requests.exceptions.HTTPError as e:
    print(f"HTTP 错误: {e}")
    print("响应内容:", response.text)  # 打印错误详情
except requests.exceptions.Timeout:
    print("请求超时")
except requests.exceptions.RequestException as e:
    print(f"请求失败: {e}")