const timerWorker = () => {
  let timerInterval: NodeJS.Timeout;

  self.onmessage = function ({
    data: { turn, timeInput },
  }: MessageEvent<{ turn: "off" | "on"; timeInput: number }>) {
    let time = timeInput;
    if (turn === "off" || timerInterval) {
      clearInterval(timerInterval);
      time = timeInput;
    }
    if (turn === "on") {
      timerInterval = setInterval(() => {
        time -= 1;
        self.postMessage({ time });
      }, 1000);
    }
  };
};

const getTimerWorkerUrl = () => {
  let code = timerWorker.toString();
  code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));

  const blob = new Blob([code], { type: "application/javascript" });
  return URL.createObjectURL(blob);
};

export { getTimerWorkerUrl };
