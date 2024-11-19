import { CountdownCircleTimer } from "react-countdown-circle-timer";

const getTimeSeconds = (time: number): number => time % 60 | 0;

const getTimeMinutes = (time: number): number => {
  return Math.floor(time / 60) | 0;
};

const timerProps = {
  isPlaying: true,
  size: 250,
  strokeWidth: 6,
};

const minuteSeconds = 60;
const hourSeconds = 3600;

const renderTime = (
  dimension: string,
  timeMinutes: number,
  timeSeconds: number
) => {
  if (timeSeconds < 10) {
    return (
      <div className="time-wrapper">
        <div style={{ color: "black", textAlign: "center" }}>{dimension}</div>
        <div className="time" style={{ color: "black", textAlign: "center" }}>
          {timeMinutes} : 0{timeSeconds}
        </div>
      </div>
    );
  }
  return (
    <div className="time-wrapper">
      <div style={{ color: "black", textAlign: "center" }}>{dimension}</div>
      <div className="time" style={{ color: "black", textAlign: "center" }}>
        {timeMinutes} : {timeSeconds}
      </div>
    </div>
  );
};

const Timer = ({ remainingTime }: { remainingTime: number }) => {
  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "3vh" }}
    >
      <div style={{ marginRight: "20px" }}>
        <CountdownCircleTimer
          {...timerProps}
          colors="#008000"
          duration={remainingTime}
          initialRemainingTime={Math.floor(remainingTime / 60)}
          onComplete={(totalElapsedTime) => ({
            shouldRepeat: remainingTime - totalElapsedTime > minuteSeconds,
          })}
        >
          {({ elapsedTime }) => (
            <span style={{ color: "black", fontSize: "30px" }}>
              {renderTime(
                "Pozostało",
                getTimeMinutes(remainingTime - elapsedTime),
                getTimeSeconds(remainingTime - elapsedTime)
              )}
            </span>
          )}
        </CountdownCircleTimer>
      </div>
    </div>
  );
};

export default Timer;
