import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { LESSONS_ORDER as JSON_LESSONS_ORDER } from "../utils/lessonsLoader";

interface ProgressContextType {
  completedLessons: string[];
  completeLesson: (lessonId: string) => void;
  isLessonCompleted: (lessonId: string) => boolean;
  isLessonUnlocked: (lessonId: string) => boolean;
  getCompletedLessonsCount: () => number;
  getTotalLessonsCount: () => number;
  resetProgress: () => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(
  undefined
);

// Use lessons order from JSON
const LESSONS_ORDER = JSON_LESSONS_ORDER;

export const ProgressProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("python-learning-progress");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCompletedLessons(parsed.completedLessons || []);
      } catch (error) {
        console.error("Error loading progress:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "python-learning-progress",
      JSON.stringify({
        completedLessons,
        lastUpdated: new Date().toISOString(),
      })
    );
  }, [completedLessons]);

  const completeLesson = (lessonId: string) => {
    setCompletedLessons((prev) =>
      prev.includes(lessonId) ? prev : [...prev, lessonId]
    );
  };

  const isLessonCompleted = (lessonId: string) => {
    return completedLessons.includes(lessonId);
  };

  const isLessonUnlocked = (lessonId: string) => {
    const lessonIndex = LESSONS_ORDER.indexOf(lessonId);
    if (lessonIndex === 0) return true; // First lesson is always unlocked

    const previousLessonId = LESSONS_ORDER[lessonIndex - 1];
    return isLessonCompleted(previousLessonId);
  };

  const getCompletedLessonsCount = () => completedLessons.length;
  const getTotalLessonsCount = () => LESSONS_ORDER.length;

  const resetProgress = () => {
    setCompletedLessons([]);
    localStorage.removeItem("python-learning-progress");
  };

  return (
    <ProgressContext.Provider
      value={{
        completedLessons,
        completeLesson,
        isLessonCompleted,
        isLessonUnlocked,
        getCompletedLessonsCount,
        getTotalLessonsCount,
        resetProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return context;
};
