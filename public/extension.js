const hasChrome = typeof chrome !== 'undefined'

const e = hasChrome ? chrome : browser

e.browserAction.onClicked.addListener(function () {
  if (e.extension.getExtensionTabs().length) {
    return false
  }

  e.tabs.create({
    url: e.runtime.getURL('index.html'),
  })
})
