## ⚠️ WARNING: Deletes EVERYTHING
This moves **all** Gmail to Trash: Inbox + All Mail + Sent + Archived + Spam.

* Trash auto-deletes after **30 days, then it's permanent**.
* Takeout backup first and verify it: https://takeout.google.com/
* Don't run on work/school accounts; Workspace Vault may retain copies anyway, and you could violate policy.
* Test with `older_than:1y` or a small label before nuking all.

**I’m not responsible for lost mail. You run this as you, on your account.**


## What this does
`nukeGmail()` in Google Apps Script loops `GmailApp.search('in:anywhere')` and calls `moveThreadsToTrash` in chunks of 100 (Gmail API limit).

* `in:inbox` = Inbox only
* All Mail = Inbox + Sent + Archived
* `in:anywhere` = All Mail + Spam + Trash = **everything**. That's what this uses.

Good: native, no OAuth client setup, handles 100k+ threads.
Bad: Apps Script times out after ~6 min, unverified-app screen, must empty Trash manually.


## Steps
1. Backup: Takeout -> Mail only -> download + open a few `.mbox` files to verify.
2. Go to https://script.google.com/ -> New project
3. Replace `Code.gs` with:

```javascript
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
```
4. Save, click Run -> select nukeGmail
5. Authorize: Review permissions -> choose account -> Advanced -> Go to Untitled project (unsafe) -> Allow. This is normal for personal scripts.
6. Watch Execution log for Trashed 500. Re-run until Done.
7. In Gmail: search in:anywhere should show 0. Sidebar All Mail = 0.
8. Trash -> Empty Trash now. Spam -> Delete all spam now.


### Troubleshooting
* `requires access... allow it` -> Run again and finish Allow, allow popups for script.google.com
* `can only be applied to at most 100 threads` -> you’re on old version, use chunked version above
* Execution timeout -> just Run again, it resumes
* No `Select all conversations` banner alternative: in Gmail search in:anywhere -> top checkbox -> Select all conversations that match -> Delete. No code needed.


### Degoogle next
Emptying mail != deleting address. To kill Gmail: Google Account -> Data & Privacy -> Delete Gmail service. Then remove IMAP/OAuth from your Linux mail client.
