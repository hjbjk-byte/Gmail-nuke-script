function nukeGmail() {
  while (true) {
    const threads = GmailApp.search('in:anywhere', 0, 500);
    if (!threads.length) {
      Logger.log('Done - no threads left');
      break;
    }
    for (let i = 0; i < threads.length; i += 100) {
      GmailApp.moveThreadsToTrash(threads.slice(i, i + 100));
    }
    Logger.log('Trashed ' + threads.length);
  }
}
