import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Lock,
  Play,
  Clock,
  BookOpen,
  Code2,
  Database,
  Cpu,
  FileText,
  Zap,
  RotateCcw,
  Terminal,
  Calculator,
  Scale,
  Brain,
  RefreshCw,
  Type,
  List,
  Shield,
  Box,
  Package,
  Layers,
  Library,
} from "lucide-react";
import { useProgress } from "../contexts/ProgressContext";
import { generateLearningPathLessons } from "../utils/lessonsLoader";

const LearningPath: React.FC = () => {
  const { isLessonCompleted, isLessonUnlocked, resetProgress } = useProgress();

  // Map icon strings to actual icon components
  const iconMap: Record<string, any> = {
    Code2,
    Database,
    FileText,
    Terminal,
    Calculator,
    Scale,
    Brain,
    Zap,
    RotateCcw,
    RefreshCw,
    Type,
    BookOpen,
    Cpu,
    List,
    Shield,
    Box,
    Package,
    Layers,
    Library,
  };

  // Get lessons from JSON
  const lessonsFromJSON = generateLearningPathLessons();

  // Convert icon strings to components
  const lessons = lessonsFromJSON.map((lesson) => ({
    ...lesson,
    icon: iconMap[lesson.icon] || BookOpen,
  }));

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Principiante":
        return "text-green-600 bg-green-100";
      case "Intermedio":
        return "text-yellow-600 bg-yellow-100";
      case "Avanzado":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Ruta de Aprendizaje Python
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Sigue este camino estructurado para dominar Python desde los
            conceptos básicos hasta temas avanzados. Cada lección se desbloquea
            al completar la anterior.
          </p>

          <div className="flex justify-center mt-6">
            <button
              onClick={resetProgress}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reiniciar Progreso
            </button>
          </div>
        </motion.div>

        {/* Learning Path Grid */}
        <div className="space-y-12">
          {/* Group lessons by category */}
          {Object.entries(
            lessons.reduce((acc, lesson) => {
              const category = lesson.category || "Sin Categoría";
              if (!acc[category]) acc[category] = [];
              acc[category].push(lesson);
              return acc;
            }, {} as Record<string, typeof lessons>)
          ).map(([category, categoryLessons]) => (
            <div key={category} className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {category}
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryLessons.map((lesson, index) => {
                  const isCompleted = isLessonCompleted(lesson.id);
                  const isUnlocked = isLessonUnlocked(lesson.id);
                  const IconComponent = lesson.icon;

                  return (
                    <motion.div
                      key={lesson.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.05 * index }}
                      className={`relative group ${
                        isUnlocked ? "cursor-pointer" : "cursor-not-allowed"
                      }`}
                    >
                      <div
                        className={`
                        bg-white rounded-2xl p-6 shadow-lg border-2 transition-all duration-300
                        ${
                          isCompleted
                            ? "border-green-200 bg-green-50"
                            : isUnlocked
                            ? "border-gray-200 hover:border-blue-300 hover:shadow-xl"
                            : "border-gray-200 opacity-60"
                        }
                      `}
                      >
                        {/* Status Icon */}
                        <div className="absolute -top-3 -right-3">
                          {isCompleted && (
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-5 h-5 text-white" />
                            </div>
                          )}
                          {!isUnlocked && (
                            <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                              <Lock className="w-5 h-5 text-white" />
                            </div>
                          )}
                        </div>

                        {/* Lesson Icon */}
                        <div
                          className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${lesson.color} flex items-center justify-center mb-4`}
                        >
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>

                        {/* Lesson Info */}
                        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {lesson.title}
                        </h3>

                        <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                          {lesson.description}
                        </p>

                        {/* Metadata */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span>{lesson.duration}</span>
                          </div>
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${getDifficultyColor(
                              lesson.difficulty
                            )}`}
                          >
                            {lesson.difficulty}
                          </span>
                        </div>

                        {/* Action Button */}
                        {isUnlocked ? (
                          <Link
                            to={`/lesson/${lesson.id}`}
                            className={`
                              inline-flex items-center w-full justify-center px-4 py-3 rounded-lg font-medium transition-all duration-200
                              ${
                                isCompleted
                                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                                  : "bg-blue-600 text-white hover:bg-blue-700"
                              }
                            `}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            {isCompleted ? "Repasar" : "Comenzar"}
                          </Link>
                        ) : (
                          <div className="inline-flex items-center w-full justify-center px-4 py-3 bg-gray-200 text-gray-500 rounded-lg font-medium">
                            <Lock className="w-4 h-4 mr-2" />
                            Bloqueada
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Progress Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Tu Progreso de Aprendizaje
          </h2>

          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="p-4">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {
                  lessons.filter((lesson) => isLessonCompleted(lesson.id))
                    .length
                }
              </div>
              <p className="text-gray-600">Lecciones Completadas</p>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {
                  lessons.filter(
                    (lesson) =>
                      isLessonUnlocked(lesson.id) &&
                      !isLessonCompleted(lesson.id)
                  ).length
                }
              </div>
              <p className="text-gray-600">Lecciones Disponibles</p>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-gray-600 mb-2">
                {
                  lessons.filter((lesson) => !isLessonUnlocked(lesson.id))
                    .length
                }
              </div>
              <p className="text-gray-600">Lecciones Bloqueadas</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LearningPath;
