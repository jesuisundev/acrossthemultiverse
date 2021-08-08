self.onmessage = messageEvent => {
  const clustersToPopulate = messageEvent.data.clustersToPopulate
  const blackholeAttributes = {}

  // we dont need any particles for this instance
  for (const clusterToPopulate of clustersToPopulate) {
    blackholeAttributes[clusterToPopulate] = {}
  }

  self.postMessage(blackholeAttributes)
}
