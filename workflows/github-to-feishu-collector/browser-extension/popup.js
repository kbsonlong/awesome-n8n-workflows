// 弹出窗口脚本
document.addEventListener('DOMContentLoaded', function() {
  const webhookUrlInput = document.getElementById('webhook-url');
  const saveConfigBtn = document.getElementById('save-config');
  const collectBtn = document.getElementById('collect-btn');
  const statusDiv = document.getElementById('status');
  const projectInfoDiv = document.getElementById('project-info');

  // 加载保存的配置
  chrome.storage.sync.get(['webhookUrl'], function(result) {
    if (result.webhookUrl) {
      webhookUrlInput.value = result.webhookUrl;
    }
  });

  // 保存配置
  saveConfigBtn.addEventListener('click', function() {
    const webhookUrl = webhookUrlInput.value.trim();
    if (!webhookUrl) {
      showStatus('请输入webhook URL', 'error');
      return;
    }
    
    chrome.storage.sync.set({webhookUrl: webhookUrl}, function() {
      showStatus('配置已保存', 'success');
    });
  });

  // 收集按钮点击事件
  collectBtn.addEventListener('click', function() {
    const webhookUrl = webhookUrlInput.value.trim();
    if (!webhookUrl) {
      showStatus('请先配置webhook URL', 'error');
      return;
    }

    // 检查当前标签页是否为GitHub
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      const currentTab = tabs[0];
      
      if (!currentTab.url.includes('github.com')) {
        showStatus('请在GitHub页面使用此扩展', 'error');
        return;
      }

      // 检查是否在项目页面
      const urlPattern = /^https:\/\/github\.com\/[^\/]+\/[^\/]+\/?$/;
      if (!urlPattern.test(currentTab.url)) {
        showStatus('请在GitHub项目主页使用此扩展', 'error');
        return;
      }

      collectProject(currentTab.url, webhookUrl);
    });
  });

  // 显示状态信息
  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    statusDiv.style.display = 'block';
    
    if (type === 'success') {
      setTimeout(() => {
        statusDiv.style.display = 'none';
      }, 3000);
    }
  }

  // 收集项目信息
  function collectProject(githubUrl, webhookUrl) {
    collectBtn.disabled = true;
    collectBtn.textContent = '🔄 收集中...';
    showStatus('正在收集项目信息...', 'loading');

    const projectData = {
      github_url: githubUrl,
      timestamp: new Date().toISOString(),
      source: 'browser-extension'
    };

    fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData)
    })
    .then(response => response.json())
    .then(data => {
      collectBtn.disabled = false;
      collectBtn.textContent = '📋 收集当前项目';
      
      if (data.success) {
        showStatus('✅ 项目信息已成功添加到飞书表格', 'success');
        
        // 显示收集到的项目信息
        if (data.data) {
          displayProjectInfo(data.data);
        }
      } else {
        showStatus('❌ 收集失败: ' + (data.message || '未知错误'), 'error');
      }
    })
    .catch(error => {
      collectBtn.disabled = false;
      collectBtn.textContent = '📋 收集当前项目';
      console.error('收集失败:', error);
      showStatus('❌ 收集失败，请检查网络连接和配置', 'error');
    });
  }

  // 显示项目信息
  function displayProjectInfo(projectData) {
    const infoHtml = `
      <div><strong>项目名称:</strong> ${projectData.title || '未知'}</div>
      <div><strong>所有者:</strong> ${projectData.owner || '未知'}</div>
      <div><strong>Stars:</strong> ${projectData.stars || '0'}</div>
      <div><strong>Forks:</strong> ${projectData.forks || '0'}</div>
      <div><strong>主语言:</strong> ${projectData.language || '未知'}</div>
      <div><strong>收集时间:</strong> ${new Date(projectData.collected_at).toLocaleString()}</div>
    `;
    
    projectInfoDiv.innerHTML = infoHtml;
    projectInfoDiv.style.display = 'block';
  }
});