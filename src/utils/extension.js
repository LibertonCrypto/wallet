import extension from 'extensionizer'

extension.browserAction.onClicked.addListener(function (tab) {
  if (extension.extension.getExtensionTabs().length) {
    return false
  }

  extension.tabs.create({
    url: extension.extension.getBackgroundPage().location.href,
  })
})
