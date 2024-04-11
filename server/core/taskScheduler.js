export default class TaskScheduler {
  constructor() {
    this.tasks = new Map(); // Use a Map to store tasks
  }

  // Add a task to the scheduler
  scheduleTask(id, callback, duration) {
    const task = {
      id,
      callback,
      duration,
      remainingTime: duration,
      isPaused: false,
      taskId: null,
    };

    this.tasks.set(id, task);
  }

  // Start a task
  startTask(id) {
    const task = this.tasks.get(id);

    if (task && !task.isPaused) {
      task.startTime = Date.now();
      task.taskId = setTimeout(() => {
        this.onTaskComplete(id);
      }, task.remainingTime);
    }
  }

  // Pause a task
  pauseTask(task) {
    if (task && !task.isPaused) {
      clearTimeout(task.taskId);
      task.remainingTime -= Date.now() - task.startTime;
      task.isPaused = true;
    }
  }

  // Resume a paused task
  resumeTask(task) {
    if (task && task.isPaused) {
      task.startTime = Date.now();
      task.taskId = setTimeout(() => {
        this.onTaskComplete(task.id);
      }, task.remainingTime);
      task.isPaused = false;
    }
  }

  // Cancel and remove a task
  cancelTask(id) {
    const task = this.tasks.get(id);

    if (task) {
      clearTimeout(task.taskId);
      this.tasks.delete(id);
    }
  }

  // Callback function when a task completes
  onTaskComplete(id) {
    const task = this.tasks.get(id);

    if (task) {
      task.callback();
      this.tasks.delete(id);
    }
  }

  // When the game is paused:
  pauseTasks() {
    this.tasks.forEach((task) => {
      if (!task.isPaused) {
        this.pauseTask(task);
      }
    });
  }

  // When the game is resumed:
  resumeTasks() {
    this.tasks.forEach((task) => {
      if (task.isPaused) {
        this.resumeTask(task);
      }
    });
  }

  //toggle pause/resume
  togglePauseResume(gamePause) {
    if (gamePause) {
      this.pauseTasks();
    } else {
      this.resumeTasks();
    }
  }
}