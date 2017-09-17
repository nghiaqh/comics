## Errors & solutions:

1. __Fatal error: watch ENOSPC__:

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

2. __Extends React.Component doesn't bind this for class custom function__:

  To avoid error, bind custom function with `this` in `constructor`:
  ```
  class Contacts extends React.Component {
    constructor(props) {
      super(props);
      this.handleClick = this.handleClick.bind(this);
    }
    handleClick() {
      console.log(this); // React Component instance
    }
  ```
  Or we can bind this to custom function inside `render` function:
  ```
  render() {
    return (
      <div onClick={this.handleClick.bind(this)}></div>
    );
  }
  ```
