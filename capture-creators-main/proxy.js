const http = require('http');
const httpProxy = require('http-proxy');

// 创建代理服务器
const proxy = httpProxy.createProxyServer({
  target: 'http://127.0.0.1:9880',
  changeOrigin: true
});

// 创建 HTTP 服务器
const server = http.createServer((req, res) => {
  // 添加 CORS 头，允许所有跨域请求
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  
  // 处理 OPTIONS 请求
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // 将请求转发到 API 服务器
  proxy.web(req, res, (error) => {
    if (error) {
      console.error('代理请求错误:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: '代理服务器错误', error: error.message }));
    }
  });
});

// 代理服务器错误处理
proxy.on('error', (error, req, res) => {
  console.error('代理错误:', error);
  res.writeHead(500, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: '代理服务器错误', error: error.message }));
});

// 启动服务器
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`代理服务器运行在 http://localhost:${PORT}`);
  console.log(`将把请求转发到 http://127.0.0.1:9880`);
});
