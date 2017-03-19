## Errors & solutions:

1. __Fatal error: watch ENOSPC__
	Caused by system reach limitation of how many files can be watched by a user.
	To check the max number of inotify watches:
	```
	cat /proc/sys/fs/inotify/max_user_watches
	```
	Run `npm dedupe` to walk through your npm module tree and moves every package up in the tree as much as possible. The result is a flat tree.
	Or permanently increase max number of inotify watches of your system:
	```
	echo 524288 | sudo tee -a /proc/sys/fs/inotify/max_user_watches
	```
2.
