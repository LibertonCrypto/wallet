extension.browserAction.onClicked.addListener(function (tab) {
  extension.tabs.create({
    url: extension.extension.getBackgroundPage().location.href,
  })
})
