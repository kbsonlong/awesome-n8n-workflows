// 创建一个右键菜单项
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "collect-to-feishu",
    title: "收集此GitHub项目到飞书",
    contexts: ["page"] // 这表示菜单项会在页面上右键时出现
  });
});

// 监听菜单项的点击事件
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "collect-to-feishu") {
    // 当右键菜单被点击时，在一个新的小窗口中打开popup.html, 并将当前tab的ID作为参数传递
    chrome.windows.create({
      url: `popup.html?tabId=${tab.id}`,
      type: 'popup',
      width: 400,
      height: 550
    });
  }
});
