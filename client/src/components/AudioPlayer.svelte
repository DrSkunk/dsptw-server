<script lang="ts">
  import { GameEvent } from "de-slimste-common/src/models/GameEvent";
  import { events, getBaseUrl } from "../lib/localServer";

  const thinkLoopAudio = new Audio(
    "//" + getBaseUrl() + "/static/sound/thinkLoop.mp3",
  );
  thinkLoopAudio.loop = true;
  thinkLoopAudio.volume = 0.3;
  const stopClockAudio = new Audio(
    "//" + getBaseUrl() + "/static/sound/stopClock.mp3",
  );
  const answerTimeoutAudio = new Audio(
    "//" + getBaseUrl() + "/static/sound/answerTimeout.mp3",
  );
  const answerCorrectAudio = new Audio(
    "//" + getBaseUrl() + "/static/sound/answerCorrect.mp3",
  );
  const bumperAudio = new Audio(
    "//" + getBaseUrl() + "/static/sound/bumper.mp3",
  );
  const itHasHappenedAudio = new Audio(
    "//" + getBaseUrl() + "/static/sound/itHasHappened.mp3",
  );
  const applauseAudio = new Audio(
    "//" + getBaseUrl() + "/static/sound/applause.mp3",
  );

  function stopAndPlayAudio(audio: HTMLAudioElement) {
    if (!audio.error) {
      audio.pause();
      audio.currentTime = 0;
      audio.play();
    }
  }

  events.subscribe((gameEvent: GameEvent | null) => {
    switch (gameEvent) {
      case GameEvent.StartTime:
        stopAndPlayAudio(thinkLoopAudio);
        break;
      case GameEvent.StopTime:
        thinkLoopAudio.pause();
        stopAndPlayAudio(stopClockAudio);
        break;
      case GameEvent.AnswerTimeout:
        stopAndPlayAudio(answerTimeoutAudio);
        break;
      case GameEvent.AnswerCorrect:
        stopAndPlayAudio(answerCorrectAudio);
        break;
      case GameEvent.NextRound:
        stopAndPlayAudio(bumperAudio);
        stopAndPlayAudio(applauseAudio);
        break;
      case GameEvent.ItHasHappened:
        thinkLoopAudio.pause();
        stopAndPlayAudio(itHasHappenedAudio);
        break;
      case GameEvent.Applause:
        stopAndPlayAudio(applauseAudio);
        break;
    }
  });
</script>
