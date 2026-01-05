#!/usr/bin/env python3
"""
简单的HTTP代理服务器，用于解决跨域问题
"""

import http.server
import socketserver
import urllib.request
import urllib.error
import urllib.parse
import json

PORT = 3000
API_URL = "http://127.0.0.1:9880"

class ProxyHandler(http.server.BaseHTTPRequestHandler):
    """代理服务器请求处理器"""
    
    def do_GET(self):
        """处理GET请求"""
        self._handle_request("GET")
    
    def do_POST(self):
        """处理POST请求"""
        self._handle_request("POST")
    
    def do_OPTIONS(self):
        """处理OPTIONS请求，用于CORS预检"""
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "*")
        self.end_headers()
    
    def _handle_request(self, method):
        """处理HTTP请求，转发到API服务器"""
        try:
            # 构建目标URL
            target_url = f"{API_URL}{self.path}"
            print(f"转发请求: {method} {target_url}")
            
            # 读取请求体
            content_length = int(self.headers.get("Content-Length", 0))
            request_body = self.rfile.read(content_length) if content_length > 0 else None
            
            # 构建请求头
            headers = {}
            for key, value in self.headers.items():
                # 跳过某些不需要转发的头
                if key.lower() not in ["host", "connection", "content-length"]:
                    headers[key] = value
            
            # 创建请求对象
            req = urllib.request.Request(
                target_url,
                data=request_body,
                headers=headers,
                method=method
            )
            
            # 发送请求到API服务器
            with urllib.request.urlopen(req, timeout=30) as response:
                # 获取响应数据
                response_data = response.read()
                response_status = response.getcode()
                response_headers = response.getheaders()
                
                # 发送响应给客户端
                self.send_response(response_status)
                
                # 添加CORS头
                self.send_header("Access-Control-Allow-Origin", "*")
                
                # 转发响应头
                for key, value in response_headers:
                    if key.lower() not in ["connection"]:
                        self.send_header(key, value)
                
                self.end_headers()
                
                # 发送响应体
                self.wfile.write(response_data)
                
                print(f"请求成功: {method} {target_url} -> {response_status}")
                
        except urllib.error.HTTPError as e:
            # 处理HTTP错误
            print(f"HTTP错误: {method} {self.path} -> {e.code} {e.reason}")
            
            # 读取错误响应体
            error_body = e.read()
            
            # 发送错误响应
            self.send_response(e.code)
            self.send_header("Access-Control-Allow-Origin", "*")
            
            # 转发错误响应头
            for key, value in e.headers.items():
                if key.lower() not in ["connection"]:
                    self.send_header(key, value)
            
            self.end_headers()
            self.wfile.write(error_body)
            
        except urllib.error.URLError as e:
            # 处理URL错误
            print(f"URL错误: {method} {self.path} -> {e.reason}")
            
            # 发送500错误
            self.send_response(500)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            
            error_response = json.dumps({
                "message": "代理服务器错误",
                "error": str(e.reason)
            }).encode("utf-8")
            self.wfile.write(error_response)
            
        except Exception as e:
            # 处理其他错误
            print(f"服务器错误: {method} {self.path} -> {str(e)}")
            
            # 发送500错误
            self.send_response(500)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            
            error_response = json.dumps({
                "message": "服务器内部错误",
                "error": str(e)
            }).encode("utf-8")
            self.wfile.write(error_response)
    
    def log_message(self, format, *args):
        """重写日志方法，不输出到控制台"""
        return

def run_proxy():
    """启动代理服务器"""
    try:
        # 创建服务器
        with socketserver.TCPServer(("", PORT), ProxyHandler) as httpd:
            print(f"\n代理服务器已启动")
            print(f"监听端口: {PORT}")
            print(f"转发到: {API_URL}")
            print(f"按 Ctrl+C 停止服务器\n")
            
            # 启动服务器，持续运行
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n代理服务器已停止")
    except Exception as e:
        print(f"启动服务器失败: {str(e)}")

if __name__ == "__main__":
    run_proxy()
