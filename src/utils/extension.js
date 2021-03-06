const hasChrome = typeof chrome !== 'undefined'

const e = hasChrome ? chrome : browser

e.browserAction.onClicked.addListener(function (tab) {
  if (e.extension.getExtensionTabs().length) {
    return false
  }

  console.log(e.extension.getBackgroundPage())

  e.tabs.create({
    url: e.extension.getBackgroundPage().location.href,
  })
})
