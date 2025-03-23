export function addLearningProgress(id: number): void {
  const storedProgress = localStorage.getItem("learningProgress");
  let progressArray: number[] = [];

  if (storedProgress) {
    try {
      const parsedProgress = JSON.parse(storedProgress);
      if (Array.isArray(parsedProgress)) {
        progressArray = parsedProgress;
      }
    } catch (e) {
      console.error("Failed to parse learning progress", e);
    }
  }

  if (!progressArray.includes(id)) {
    progressArray.push(id);
    localStorage.setItem("learningProgress", JSON.stringify(progressArray));
  }
}