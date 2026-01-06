// ===== DOM元素获取 =====
// 页面相关元素
const pages = document.querySelectorAll('.page');

// 导航相关元素
const mobilePageTitle = document.querySelector('.mobile-page-title');

// 页面标题映射表
const pageTitles = {
  'ai-chat': 'AI智能问答',
  'voice-clone': 'AI声音克隆',
  'voice-library': '声音库',
  'settings': '设置'
};

// 更新移动端页面标题
function updateMobilePageTitle(pageName) {
  if (mobilePageTitle) {
    mobilePageTitle.textContent = pageTitles[pageName] || 'AI智能问答';
  }
}

// ===== 顶部导航栏页面切换功能 =====
function initTopNavigation() {
  const navBtns = document.querySelectorAll('.nav-btn');
  const pages = document.querySelectorAll('.page');
  
  // 导航按钮点击事件处理
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const pageName = btn.dataset.page;
      
      // 更新导航按钮激活状态
      navBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // 显示对应页面
      pages.forEach(page => {
        page.classList.remove('active');
        if (page.id === `page-${pageName}`) {
          page.classList.add('active');
        }
      });
      
      // 更新移动端页面标题
      updateMobilePageTitle(pageName);
      
      console.log('顶部导航项点击:', pageName);
    });
  });
  
  console.log('顶部导航功能初始化完成');
}

// 初始化顶部导航功能
initTopNavigation();

// 文件上传相关元素
const uploadZone = document.getElementById('uploadZone');
const audioInput = document.getElementById('audioInput');
const fileInfo = document.getElementById('fileInfo');
const fileName = document.getElementById('fileName');
const fileMeta = document.getElementById('fileMeta');
const playBtn = document.getElementById('playBtn');
const removeBtn = document.getElementById('removeBtn');
const audioPreview = document.getElementById('audioPreview');

// 音频预览进度相关元素
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const previewProgressBar = document.getElementById('previewProgressBar');
const previewProgressFill = document.getElementById('previewProgressFill');

// 文本输入相关元素
const textInput = document.getElementById('textInput');
const charCount = document.getElementById('charCount');

// 操作按钮相关元素
const startBtn = document.getElementById('startBtn');

// 进度显示相关元素
const progressSection = document.getElementById('progressSection');
const progressStep = document.getElementById('progressStep');
const progressPercent = document.getElementById('progressPercent');
const progressFill = document.getElementById('progressFill');

// 输出结果相关元素
const outputSection = document.getElementById('outputSection');
const outputAudio = document.getElementById('outputAudio');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');

// ===== 应用状态管理 =====
let uploadedFile = null; // 已上传的音频文件
let isPlaying = false; // 音频播放状态
let selectedModel = null; // 选中的声音模型
let models = []; // 可用模型列表
let selectedFolder = ''; // 选中的模型文件夹
const defaultModelPath = 'D:/1/ai study/GPT-SoVITS-v2pro-20250604/GPT_weights_v2Pro'; // 默认模型路径
const defaultModel = { id: 'model_default', name: '小爱助手' }; // 默认小爱助手模型
const SYNTH_CONFIG = {}; // 合成配置对象

// ===== 文件上传功能 =====
// 点击上传区域触发文件选择
uploadZone.addEventListener('click', () => {
  audioInput.click();
});

// 拖拽文件到上传区域时的样式变化
uploadZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadZone.classList.add('dragover');
});

// 拖拽文件离开上传区域时恢复样式
uploadZone.addEventListener('dragleave', () => {
  uploadZone.classList.remove('dragover');
});

// 拖拽文件到上传区域并释放时处理文件
uploadZone.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadZone.classList.remove('dragover');
  
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    handleFile(files[0]);
  }
});

// 文件选择框变化时处理文件
 audioInput.addEventListener('change', (e) => {
  if (e.target.files.length > 0) {
    handleFile(e.target.files[0]);
  }
});

// ===== 文件处理函数 =====
function handleFile(file) {
  // 验证文件类型
  const validTypes = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/m4a', 'audio/x-m4a'];
  if (!validTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|m4a)$/i)) {
    alert('请上传 MP3、WAV 或 M4A 格式的音频文件');
    return;
  }
  
  // 验证文件大小（最大10MB）
  if (file.size > 10 * 1024 * 1024) {
    alert('文件大小不能超过 10MB');
    return;
  }
  
  // 保存上传的文件
  uploadedFile = file;
  
  // 更新UI显示
  uploadZone.classList.add('hidden');
  fileInfo.classList.remove('hidden');
  fileName.textContent = file.name;
  
  // 加载音频用于预览
  const url = URL.createObjectURL(file);
  audioPreview.src = url;
  
  // 音频元数据加载完成时触发
  audioPreview.addEventListener('loadedmetadata', () => {
    const duration = formatDuration(audioPreview.duration);
    const size = formatFileSize(file.size);
    fileMeta.textContent = `${duration} · ${size}`;
    
    // 更新进度条显示
    durationEl.textContent = duration;
    currentTimeEl.textContent = '0:00';
    previewProgressFill.style.width = '0%';
  });
  
  // 音频播放时更新进度
  audioPreview.addEventListener('timeupdate', () => {
    const currentTime = audioPreview.currentTime;
    const duration = audioPreview.duration;
    
    // 计算进度百分比
    const progressPercent = (currentTime / duration) * 100;
    previewProgressFill.style.width = `${progressPercent}%`;
    
    // 更新当前时间显示
    currentTimeEl.textContent = formatDuration(currentTime);
  });
  
  // 音频播放结束时重置进度
  audioPreview.addEventListener('ended', () => {
    previewProgressFill.style.width = '0%';
    currentTimeEl.textContent = '0:00';
    isPlaying = false;
    playBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="5 3 19 12 5 21 5 3"/>
      </svg>
    `;
  });
  
  // 点击进度条进行跳转
  previewProgressBar.addEventListener('click', (e) => {
    const progressBarWidth = previewProgressBar.offsetWidth;
    const clickX = e.offsetX;
    const duration = audioPreview.duration;
    
    // 根据点击位置计算新的播放时间
    const newTime = (clickX / progressBarWidth) * duration;
    audioPreview.currentTime = newTime;
  });
  
  // 更新开始按钮状态
  updateStartButton();
}

// ===== 辅助函数 =====
// 格式化音频时长（秒转换为分:秒格式）
function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// 格式化文件大小（字节转换为B/KB/MB）
function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// ===== 音频预览控制 =====
playBtn.addEventListener('click', () => {
  if (isPlaying) {
    audioPreview.pause();
    playBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="5 3 19 12 5 21 5 3"/>
      </svg>
    `;
  } else {
    audioPreview.play();
    playBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <rect x="6" y="4" width="4" height="16"/>
        <rect x="14" y="4" width="4" height="16"/>
      </svg>
    `;
  }
  isPlaying = !isPlaying;
});



// 移除已上传的音频文件
removeBtn.addEventListener('click', () => {
  uploadedFile = null;
  audioPreview.pause();
  audioPreview.src = '';
  isPlaying = false;
  
  uploadZone.classList.remove('hidden');
  fileInfo.classList.add('hidden');
  audioInput.value = '';
  
  // 重置进度条
  previewProgressFill.style.width = '0%';
  currentTimeEl.textContent = '0:00';
  durationEl.textContent = '0:00';
  
  playBtn.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
  `;
  
  updateStartButton();
});

// ===== 文本输入处理 =====
textInput.addEventListener('input', () => {
  const length = textInput.value.length;
  charCount.textContent = `${length}/500`;
  updateStartButton();
});



// ===== 输出结果操作 =====
// 下载生成的音频
 downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.href = outputAudio.src;
  link.download = 'cloned-voice.mp3';
  link.click();
});

// 重置所有状态
resetBtn.addEventListener('click', () => {
  // 重置文件和音频状态
  uploadedFile = null;
  audioPreview.pause();
  audioPreview.src = '';
  isPlaying = false;
  
  // 重置UI显示
  uploadZone.classList.remove('hidden');
  fileInfo.classList.add('hidden');
  audioInput.value = '';
  
  // 重置文本输入
  textInput.value = '';
  charCount.textContent = '0/500';
  
  // 重置进度显示
  progressSection.classList.add('hidden');
  progressFill.style.width = '0%';
  
  // 重置输出结果
  outputSection.classList.add('hidden');
  outputAudio.pause();
  outputAudio.src = '';
  
  // 重置播放按钮
  playBtn.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
  `;
  
  // 禁用开始按钮
  startBtn.disabled = true;
});

// ===== 模型选择功能 =====
// 文件夹选择按钮点击事件
function handleSelectFolder() {
  const folderInput = document.getElementById('folderInput');
  folderInput.click();
}

// 处理文件夹选择
function handleFolderChange(event) {
  const files = event.target.files;
  if (files.length > 0) {
    // 使用默认模型路径作为选中文件夹
    selectedFolder = defaultModelPath;
    
    // 更新选中文件夹显示
    document.getElementById('selectedFolder').textContent = selectedFolder;
    
    // 提取模型文件名
    const modelNames = [];
    const seenNames = new Set();
    
    for (const file of files) {
      // 获取文件名（不含路径）
      const fileName = file.name;
      
      // 只添加唯一的文件名
      if (!seenNames.has(fileName)) {
        seenNames.add(fileName);
        modelNames.push(fileName);
      }
    }
    
    // 加载模型到下拉框，同时保留默认模型
    loadModelsToSelect([defaultModel.name, ...modelNames]);
  }
}

// 加载模型到下拉框
function loadModelsToSelect(modelNames) {
  const modelSelect = document.getElementById('modelSelect');
  const modelHint = document.getElementById('modelHint');
  
  // 清空下拉框
  modelSelect.innerHTML = '';
  
  // 添加模型选项，包含默认模型
  models = [];
  modelNames.forEach((name, index) => {
    const modelId = index === 0 ? 'model_default' : `model_${index}`;
    models.push({ id: modelId, name: name });
    
    const option = document.createElement('option');
    option.value = modelId;
    option.textContent = name;
    modelSelect.appendChild(option);
  });
  
  // 启用下拉框
  modelSelect.disabled = false;
  
  // 默认选中第一个模型（默认小爱助手模型）
  modelSelect.value = 'model_default';
  selectedModel = defaultModel;
  
  // 根据模型数量显示或隐藏提示信息
  // 如果只有默认模型，显示提示信息
  if (modelNames.length <= 1) {
    modelHint.classList.remove('hidden');
  } else {
    modelHint.classList.add('hidden');
  }
}

// 选择模型
function selectModel() {
  const modelSelect = document.getElementById('modelSelect');
  const modelId = modelSelect.value;
  
  if (modelId) {
    selectedModel = models.find(model => model.id === modelId);
  } else {
    // 如果未选择，使用默认模型
    selectedModel = defaultModel;
    modelSelect.value = 'model_default';
  }
  
  // 更新开始按钮状态
  updateStartButton();
}

// 更新开始按钮状态（当有模型和文本时启用）
function updateStartButton() {
  // 检查元素是否存在，防止在其他页面调用时出错
  if (!startBtn || !textInput) {
    return;
  }
  
  const hasModel = selectedModel !== null;
  const hasText = textInput.value.trim().length > 0;
  startBtn.disabled = !(hasModel && hasText);
}

// 模型训练按钮点击事件
document.getElementById('trainBtn')?.addEventListener('click', () => {
  if (!uploadedFile) {
    alert('请先上传音频样本');
    return;
  }
  
  alert('模型训练功能正在开发中，敬请期待！');
});

// 为文件夹选择按钮添加点击事件
const selectFolderBtn = document.getElementById('selectFolderBtn');
if (selectFolderBtn) {
  selectFolderBtn.addEventListener('click', handleSelectFolder);
}

// 为文件夹输入框添加change事件
const folderInput = document.getElementById('folderInput');
if (folderInput) {
  folderInput.addEventListener('change', handleFolderChange);
}

// 为模型选择框添加change事件
const modelSelect = document.getElementById('modelSelect');
if (modelSelect) {
  modelSelect.addEventListener('change', selectModel);
}

// 移除重复的页面切换处理 - 已在导航切换功能中实现

// ===== API 调用函数 =====
// 调用TTS API进行语音合成，使用与test.py相同的参数
async function callTtsApi(text) {
  try {
    // 构建API请求参数，与test.py脚本完全一致
    const requestBody = {
      text: text,  // 待合成的文本
      text_lang: "zh",  // 文本语言
      ref_audio_path: "D:/1/ai study/GPT-SoVITS-v2pro-20250604/output/me_out/素材.mp3_0001644800_0001769600.wav",  // 参考音频路径
      prompt_lang: "zh",  // 提示文本语言
      prompt_text: "",  // 提示文本
      text_split_method: "cut3",  // 文本分割方法
      batch_size: 10,  // 批次大小
      media_type: "wav",  // 输出音频格式
      streaming_mode: false,  // 流式模式
      parallel_infer: true  // 并行推理
    };

    // 使用花生壳公网地址直接调用API，动态匹配当前页面协议
    const protocol = window.location.protocol;
    const apiUrl = `${protocol}//1vc184tz57649.vicp.fun/tts`;
    
    console.log('API请求URL:', apiUrl);
    console.log('API请求参数:', requestBody);

    // 发送API请求，使用POST方法
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        // 移除Accept头，让服务器决定返回的Content-Type
      },
      body: JSON.stringify(requestBody),
      // 添加超时设置
      signal: AbortSignal.timeout(30000) // 30秒超时
    });

    console.log('API响应状态:', response.status);
    console.log('API响应头:', response.headers);

    // 检查请求是否成功
    if (!response.ok) {
      // 尝试获取错误详情
      let errorText = '';
      try {
        errorText = await response.text();
        console.log('API错误响应:', errorText);
      } catch (e) {
        console.error('获取错误响应失败:', e);
      }
      throw new Error(`API请求失败: ${response.status} ${errorText}`);
    }

    // 获取音频数据
    const audioBlob = await response.blob();
    console.log('API响应成功，音频大小:', audioBlob.size);
    return URL.createObjectURL(audioBlob);
  } catch (error) {
    console.error('TTS API调用失败:', error);
    // 提供更详细的错误信息
    if (error.name === 'AbortError') {
      throw new Error('API请求超时，请检查API服务是否正常运行');
    } else if (error.message.includes('Failed to fetch')) {
      throw new Error('无法连接到API服务，请确保API服务已启动且地址正确');
    }
    throw error;
  }
}

// 开始合成按钮点击事件
startBtn.addEventListener('click', async () => {
  if (startBtn.disabled) return;
  
  // 显示处理进度
  progressSection.classList.remove('hidden');
  startBtn.disabled = true;
  startBtn.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin">
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
    正在合成语音...
  `;
  
  // 添加旋转动画样式（如果还没有的话）
  if (!document.querySelector('style[animation="spin"]')) {
    const style = document.createElement('style');
    style.setAttribute('animation', 'spin');
    style.textContent = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .spin { animation: spin 1s linear infinite; }
    `;
    document.head.appendChild(style);
  }
  
  try {
    // 更新进度信息
    progressStep.textContent = '正在准备合成请求...';
    progressPercent.textContent = '0%';
    progressFill.style.width = '0%';
    
    // 更新进度
    progressStep.textContent = '正在调用语音合成API...';
    progressPercent.textContent = '30%';
    progressFill.style.width = '30%';
    
    // 调用TTS API，仅传递文本参数，使用与test.py相同的配置
    const audioUrl = await callTtsApi(textInput.value);
    
    // 更新进度
    progressStep.textContent = '合成完成，正在处理音频...';
    progressPercent.textContent = '90%';
    progressFill.style.width = '90%';
    
    // 处理完成，显示输出结果
    setTimeout(() => {
      progressSection.classList.add('hidden');
      outputSection.classList.remove('hidden');
      
      // 设置生成的音频
      outputAudio.src = audioUrl;
      
      // 更新进度
      progressStep.textContent = '合成完成';
      progressPercent.textContent = '100%';
      progressFill.style.width = '100%';
      
      // 重置开始按钮
      startBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="5 3 19 12 5 21 5 3"/>
        </svg>
        开始合成
      `;
      startBtn.disabled = false;
    }, 500);
  } catch (error) {
    alert(`语音合成失败: ${error.message}`);
    
    // 重置开始按钮
    startBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="5 3 19 12 5 21 5 3"/>
      </svg>
      开始合成
    `;
    startBtn.disabled = false;
    
    // 隐藏进度条
    progressSection.classList.add('hidden');
  }
});

// 配置项变更处理函数
function handleConfigChange(configKey, value) {
  SYNTH_CONFIG[configKey] = value;
  console.log(`配置已更新: ${configKey} = ${value}`);
}

// ===== 应用初始化 =====
// 初始化默认模型（声音克隆页面）
function initVoiceCloneModel() {
  const voiceModelSelect = document.getElementById('voiceModelSelect');
  const modelHint = document.getElementById('modelHint');
  
  // 检查元素是否存在，防止在其他页面调用时出错
  if (!voiceModelSelect) {
    return;
  }
  
  // 设置默认模型
  selectedModel = defaultModel;
  
  // 添加模型选择事件监听器
  voiceModelSelect.addEventListener('change', () => {
    const selectedValue = voiceModelSelect.value;
    // 简单处理，直接使用选中值作为模型名称
    selectedModel = { id: selectedValue, name: voiceModelSelect.options[voiceModelSelect.selectedIndex].text };
    updateStartButton();
  });
}

// 初始化声音克隆模型
initVoiceCloneModel();

// 更新开始按钮的初始状态
updateStartButton();

// 在DOM加载完成后初始化AI聊天功能
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAIChat);
} else {
  initAIChat();
}

// ===== AI问答功能 =====
let chatHistory = [];
const MAX_HISTORY = 10;

// 封装AI问答功能的初始化
function initAIChat() {
  // 在函数内部获取DOM元素，确保DOM已经加载完成
  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const chatSendBtn = document.getElementById('chatSendBtn');
  const chatOptionBtns = document.querySelectorAll('.chat-option-btn');
  // const chatModelSelect = document.getElementById('chatModelSelect');
  
  // 检查必要元素是否存在
  if (!chatMessages || !chatInput || !chatSendBtn) {
    console.error('AI聊天功能初始化失败：缺少必要的DOM元素');
    return;
  }
  
  console.log('AI聊天功能初始化中...');
  
  // 重置聊天历史
  chatHistory = [];
  
  // 内部函数定义
  function addMessage(role, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${role}`;
    
    const avatar = role === 'ai' ? '🤖' : '👤';
    
    messageDiv.innerHTML = `
      <div class="message-avatar">${avatar}</div>
      <div class="message-content">
        <p>${escapeHtml(content)}</p>
      </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    chatHistory.push({ role, content });
    if (chatHistory.length > MAX_HISTORY) {
      chatHistory.shift();
    }
  }
  
  function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message message-ai';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
      <div class="message-avatar">🤖</div>
      <div class="message-content">
        <div class="message-typing">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }
  
  function showGeneratingIndicator(messageDiv) {
    const generatingDiv = document.createElement('div');
    generatingDiv.className = 'chat-generating';
    generatingDiv.id = 'generatingIndicator';
    generatingDiv.innerHTML = `
      <div class="generating-content">
        <div class="generating-spinner"></div>
        <span>正在生成语音...</span>
      </div>
      <div class="generating-progress">
        <div class="generating-progress-bar" id="generatingProgressBar"></div>
      </div>
    `;
    messageDiv.querySelector('.message-content').appendChild(generatingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  function updateGeneratingProgress(percent) {
    const progressBar = document.getElementById('generatingProgressBar');
    if (progressBar) {
      progressBar.style.width = `${percent}%`;
    }
  }
  
  function removeGeneratingIndicator() {
    const generatingIndicator = document.getElementById('generatingIndicator');
    if (generatingIndicator) {
      generatingIndicator.remove();
    }
  }
  
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  // 发送消息函数
  async function sendMessage(message) {
    if (!message.trim()) return;
    
    addMessage('user', message);
    chatInput.value = '';
    chatSendBtn.disabled = true;
    
    // 重置输入框高度
    chatInput.style.height = 'auto';
    chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
    
    showTypingIndicator();
    
    try {
      const doubaoResult = await callDoubaoApi(message);
      
      removeTypingIndicator();
      
      if (doubaoResult.success) {
        // 清洗豆包回复，移除表情符号和不可读字符
        let responseText = doubaoResult.text;
        // 使用正则表达式移除所有表情符号
        responseText = responseText.replace(/[\u{1F600}-\u{1F6FF}\u{1F300}-\u{1F5FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E0}-\u{1F1FF}\u{1F680}-\u{1F6FF}\u{26A0}-\u{26FF}\u{FE0F}]/gu, '');
        // 移除多余的空白字符
        responseText = responseText.replace(/\s+/g, ' ').trim();
        
        addMessage('ai', responseText);
      
      if (responseText.length <= 200) {
        const messageDiv = chatMessages.lastElementChild;
        const chatModelSelect = document.getElementById('chatModelSelect');
        const selectedModel = chatModelSelect ? chatModelSelect.value : 'xiaoai';
        
        showGeneratingIndicator(messageDiv);
        
        let progress = 0;
        const progressInterval = setInterval(() => {
          progress = Math.min(progress + Math.random() * 15, 90);
          updateGeneratingProgress(progress);
        }, 200);
        
        // 在文本前添加3个-符号，使生成的音频更加流畅
        const textWithPrefix = `   ${responseText}`;
        const ttsResult = await callChatApi(textWithPrefix, selectedModel);
        
        clearInterval(progressInterval);
        updateGeneratingProgress(100);
        setTimeout(() => removeGeneratingIndicator(), 300);
        
        if (ttsResult.success) {
          const audioContainer = document.createElement('div');
          audioContainer.className = 'chat-audio-container';
          audioContainer.innerHTML = `
            <audio controls class="chat-audio-player">
              <source src="${ttsResult.audioUrl}" type="audio/wav">
              您的浏览器不支持音频播放
             </audio>
          `;
          messageDiv.querySelector('.message-content').appendChild(audioContainer);
        } else {
          const errorDiv = document.createElement('div');
          errorDiv.className = 'chat-length-warning';
          errorDiv.innerHTML = `<span>语音生成失败：${ttsResult.error}</span>`;
          messageDiv.querySelector('.message-content').appendChild(errorDiv);
        }
      } else {
        const messageDiv = chatMessages.lastElementChild;
        const lengthWarning = document.createElement('div');
        lengthWarning.className = 'chat-length-warning';
        lengthWarning.innerHTML = `<span>回复文本过长（${responseText.length}字），未生成语音</span>`;
        messageDiv.querySelector('.message-content').appendChild(lengthWarning);
      }
    } else {
      addMessage('ai', `抱歉，处理您的请求时遇到问题：${doubaoResult.error}。请检查豆包API密钥或网络连接。`);
    }
    } catch (error) {
      removeTypingIndicator();
      addMessage('ai', `抱歉，处理您的请求时遇到未知错误：${error.message}`);
    } finally {
      chatSendBtn.disabled = false;
    }
  }
  
  // 绑定事件监听器
  chatSendBtn.addEventListener('click', () => {
    const message = chatInput.value.trim();
    if (message) {
      sendMessage(message);
    }
  });
  
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const message = chatInput.value.trim();
      if (message) {
        sendMessage(message);
      }
    }
  });
  
  chatInput.addEventListener('input', () => {
    chatInput.style.height = 'auto';
    chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
  });
  
  chatOptionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const question = btn.dataset.question;
      sendMessage(question);
    });
  });
  
  console.log('AI聊天功能初始化完成');
}

// 模型路径映射表 - 移到外部确保全局可访问
const modelPaths = {
  'xiaoyou': 'D:/1/ai study/GPT-SoVITS-v2pro-20250604/output/me_out/xiaoyou.wav',
  'xiaoxu': 'D:/1/ai study/GPT-SoVITS-v2pro-20250604/output/me_out/xiaoxu.wav',
  'xiaoai': 'D:/1/ai study/GPT-SoVITS-v2pro-20250604/output/me_out/素材.mp3_0001644800_0001769600.wav'
};

async function callChatApi(message, modelKey) {
  try {
    const protocol = window.location.protocol;
    const apiUrl = `${protocol}//1vc184tz57649.vicp.fun/tts`;
    
    // 使用完整的本地文件路径作为参考音频路径
    // 从modelPaths对象中获取对应的路径
    const refAudioPath = modelPaths[modelKey] || modelPaths['xiaoai'];
    
    const requestBody = {
      text: message,
      text_lang: "zh",
      ref_audio_path: refAudioPath,
      prompt_lang: "zh",
      prompt_text: "",
      text_split_method: "cut3",
      batch_size: 10,
      media_type: "wav",
      streaming_mode: false,
      parallel_infer: true
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(60000)
    });

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    
    return {
      success: true,
      audioUrl: audioUrl
    };
  } catch (error) {
    console.error('API调用失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

async function callDoubaoApi(message) {
  try {
    const apiUrl = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';
    const apiKey = '8f29c083-cb75-49dd-b4c1-44d9db60b4ef';
    
    const messages = [
      ...chatHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      { role: 'user', content: message }
    ];
    
    const requestBody = {
      model: 'doubao-seed-1-6-251015',
      max_completion_tokens: 65535,
      messages: messages,
      reasoning_effort: 'medium'
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(60000)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('豆包API错误响应:', errorText);
      throw new Error(`豆包API请求失败: ${response.status}`);
    }

    const data = await response.json();
    const textResponse = data.choices[0].message.content;
    
    return {
      success: true,
      text: textResponse
    };
  } catch (error) {
    console.error('豆包API调用失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

async function sendMessage(message) {
  if (!message.trim()) return;
  
  addMessage('user', message);
  chatInput.value = '';
  chatSendBtn.disabled = true;
  
  showTypingIndicator();
  
  const doubaoResult = await callDoubaoApi(message);
  
  removeTypingIndicator();
  
  if (doubaoResult.success) {
      // 清洗豆包回复，移除表情符号和不可读字符
      let responseText = doubaoResult.text;
      // 使用正则表达式移除所有表情符号
      responseText = responseText.replace(/[\u{1F600}-\u{1F6FF}\u{1F300}-\u{1F5FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E0}-\u{1F1FF}\u{1F680}-\u{1F6FF}\u{26A0}-\u{26FF}\u{FE0F}]/gu, '');
      // 移除多余的空白字符
      responseText = responseText.replace(/\s+/g, ' ').trim();
      
      addMessage('ai', responseText);
    
    if (responseText.length <= 200) {
      const messageDiv = chatMessages.lastElementChild;
      const selectedModel = chatModelSelect ? chatModelSelect.value : 'xiaoai';
      
      showGeneratingIndicator(messageDiv);
      
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress = Math.min(progress + Math.random() * 15, 90);
        updateGeneratingProgress(progress);
      }, 200);
      
      // 在文本前添加3个-符号，使生成的音频更加流畅
      const textWithPrefix = `   ${responseText}`;
      const ttsResult = await callChatApi(textWithPrefix, selectedModel);
      
      clearInterval(progressInterval);
      updateGeneratingProgress(100);
      setTimeout(() => removeGeneratingIndicator(), 300);
      
      if (ttsResult.success) {
        const audioContainer = document.createElement('div');
        audioContainer.className = 'chat-audio-container';
        audioContainer.innerHTML = `
          <audio controls class="chat-audio-player">
            <source src="${ttsResult.audioUrl}" type="audio/wav">
            您的浏览器不支持音频播放
          </audio>
        `;
        messageDiv.querySelector('.message-content').appendChild(audioContainer);
      } else {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'chat-length-warning';
        errorDiv.innerHTML = `<span>语音生成失败：${ttsResult.error}</span>`;
        messageDiv.querySelector('.message-content').appendChild(errorDiv);
      }
    } else {
      const messageDiv = chatMessages.lastElementChild;
      const lengthWarning = document.createElement('div');
      lengthWarning.className = 'chat-length-warning';
      lengthWarning.innerHTML = `<span>回复文本过长（${responseText.length}字），未生成语音</span>`;
      messageDiv.querySelector('.message-content').appendChild(lengthWarning);
    }
  } else {
    addMessage('ai', `抱歉，处理您的请求时遇到问题：${doubaoResult.error}。请检查豆包API密钥或网络连接。`);
  }
  
  chatSendBtn.disabled = false;
}

// 移除重复的AI问答事件监听器 - 已在initAIChat函数中实现