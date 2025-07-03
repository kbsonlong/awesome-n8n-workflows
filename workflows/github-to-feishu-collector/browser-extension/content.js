// 内容脚本 - 在GitHub页面上运行
(function() {
  // 检查是否在GitHub项目页面
  function isGitHubProjectPage() {
    const urlPattern = /^https:\/\/github\.com\/[^\/]+\/[^\/]+\/?$/;
    return urlPattern.test(window.location.href);
  }

  // 创建浮动收集按钮
  function createFloatingButton() {
    if (document.getElementById('github-collector-float-btn')) {
      return; // 按钮已存在
    }

    const floatBtn = document.createElement('div');
    floatBtn.id = 'github-collector-float-btn';
    floatBtn.innerHTML = '🚀';
    floatBtn.title = '收集此项目到飞书表格';
    floatBtn.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      background: #0366d6;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 10000;
      font-size: 20px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      transition: all 0.3s ease;
    `;
    
    // 悬停效果
    floatBtn.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.1)';
      this.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
    });
    
    floatBtn.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
      this.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    });

    // 点击事件
    floatBtn.addEventListener('click', function() {
      chrome.runtime.sendMessage({
        action: 'collectCurrentProject',
        url: window.location.href
      });
    });

    document.body.appendChild(floatBtn);
  }

  // 移除浮动按钮
  function removeFloatingButton() {
    const floatBtn = document.getElementById('github-collector-float-btn');
    if (floatBtn) {
      floatBtn.remove();
    }
  }

  // 页面加载时检查
  function checkAndCreateButton() {
    if (isGitHubProjectPage()) {
      createFloatingButton();
    } else {
      removeFloatingButton();
    }
  }

  // 监听页面变化（GitHub使用PJAX）
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      setTimeout(checkAndCreateButton, 500); // 延迟检查，确保页面加载完成
    }
  }).observe(document, {subtree: true, childList: true});

  // 初始检查
  checkAndCreateButton();

  // 监听来自popup的消息
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'getPageInfo') {
      // 提取页面信息
      const pageInfo = {
        url: window.location.href,
        title: document.title,
        isGitHubProject: isGitHubProjectPage()
      };
      sendResponse(pageInfo);
    }
  });
})();