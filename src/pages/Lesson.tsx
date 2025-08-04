import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Play,
  CheckCircle,
  Copy,
  RotateCcw,
  BookOpen,
  Code,
  Target,
  Lightbulb,
  AlertCircle,
} from "lucide-react";
import { useProgress } from "../contexts/ProgressContext";
import CodeEditor from "../components/CodeEditor";
import { PythonExecutor } from "../utils/pythonExecutor";
import { LESSONS_DATA } from "../utils/lessonsLoader";

const Lesson: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { completeLesson, isLessonCompleted } = useProgress();
  const [currentSection, setCurrentSection] = useState(0);
  const [exerciseCode, setExerciseCode] = useState("");
  const [exerciseResult, setExerciseResult] = useState("");
  const [exerciseError, setExerciseError] = useState("");
  const [isExerciseCompleted, setIsExerciseCompleted] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [lastSectionKey, setLastSectionKey] = useState("");

  // Crear una sola instancia del ejecutor de Python
  const pythonExecutor = useMemo(() => new PythonExecutor(), []);

  // Use lessons from JSON instead of local data
  const currentLesson = LESSONS_DATA[lessonId || ""];
  const isCompleted = isLessonCompleted(lessonId || "");

  useEffect(() => {
    if (!currentLesson) {
      navigate("/learning-path");
      return;
    }

    if (currentLesson.sections[currentSection]?.type === "exercise") {
      // Crear una clave única para la sección actual
      const sectionKey = `${lessonId}-${currentSection}`;

      // Solo establecer el código inicial si cambiamos a una nueva sección
      if (sectionKey !== lastSectionKey) {
        const startingCode =
          currentLesson.sections[currentSection].startingCode || "";
        setExerciseCode(startingCode);
        setExerciseResult("");
        setExerciseError("");
        setIsExerciseCompleted(false);
        setLastSectionKey(sectionKey);
      }
    }
  }, [lessonId, currentSection, currentLesson, navigate, lastSectionKey]);

  const handleNextSection = () => {
    if (currentSection < currentLesson.sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePrevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleCompleteLesson = () => {
    completeLesson(lessonId || "");
    navigate("/learning-path");
  };

  const runCode = () => {
    if (!exerciseCode.trim()) {
      setExerciseError("No hay código para ejecutar");
      setExerciseResult("");
      return;
    }

    setIsRunning(true);
    setExerciseError("");
    setExerciseResult("");

    // Usar setTimeout para simular procesamiento asíncrono
    setTimeout(() => {
      try {
        const result = pythonExecutor.execute(exerciseCode);

        if (result.error) {
          setExerciseError(result.error);
          setExerciseResult(result.output || "");
        } else {
          setExerciseResult(result.output || "Código ejecutado exitosamente");

          // Validar ejercicio solo si no hay errores
          const currentExercise = currentLesson.sections[currentSection];
          if (
            currentExercise.validation &&
            currentExercise.validation(exerciseCode)
          ) {
            setIsExerciseCompleted(true);
          }
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Error desconocido";
        setExerciseError(`Error inesperado: ${errorMessage}`);
        setExerciseResult("");
      } finally {
        setIsRunning(false);
      }
    }, 100); // Pequeño delay para mostrar el estado de "ejecutando"
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  if (!currentLesson) {
    return <div>Lección no encontrada</div>;
  }

  const currentSectionData = currentLesson.sections[currentSection];
  const isLastSection = currentSection === currentLesson.sections.length - 1;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/learning-path")}
              className="p-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {currentLesson.title}
              </h1>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-sm text-gray-600">
                  Sección {currentSection + 1} de{" "}
                  {currentLesson.sections.length}
                </span>
                {isCompleted && (
                  <div className="flex items-center space-x-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Completada</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${
                  ((currentSection + 1) / currentLesson.sections.length) * 100
                }%`,
              }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
            />
          </div>
        </motion.div>

        {/* Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Theory/Instructions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                {currentSectionData.type === "theory" ? (
                  <BookOpen className="w-6 h-6 text-blue-600" />
                ) : (
                  <Target className="w-6 h-6 text-green-600" />
                )}
                <h2 className="text-2xl font-bold text-gray-900">
                  {currentSectionData.title}
                </h2>
              </div>

              <div className="prose prose-lg max-w-none text-gray-700 mb-6">
                <p className="leading-relaxed whitespace-pre-line">
                  {currentSectionData.content}
                </p>
              </div>

              {currentSectionData.type === "exercise" && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <Lightbulb className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-900">
                      Instrucciones
                    </h3>
                  </div>
                  <p className="text-blue-800">
                    {currentSectionData.description}
                  </p>
                </div>
              )}
            </div>

            {/* Example Code */}
            {currentSectionData.example && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Code className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-gray-900">Ejemplo</h3>
                  </div>
                  <button
                    onClick={() => copyCode(currentSectionData.example)}
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <CodeEditor
                  code={currentSectionData.example}
                  readOnly={true}
                  height="200px"
                />
              </div>
            )}
          </motion.div>

          {/* Right Column - Exercise */}
          {currentSectionData.type === "exercise" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Tu Código</h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        setExerciseCode(currentSectionData.startingCode || "")
                      }
                      className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                      title="Reiniciar código"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={runCode}
                      disabled={isRunning}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors font-medium ${
                        isRunning
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      <Play
                        className={`w-4 h-4 ${isRunning ? "animate-spin" : ""}`}
                      />
                      <span>{isRunning ? "Ejecutando..." : "Ejecutar"}</span>
                    </button>
                  </div>
                </div>

                <CodeEditor
                  code={exerciseCode}
                  onChange={setExerciseCode}
                  readOnly={false}
                  height="300px"
                />
              </div>

              {/* Output */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Resultado</h3>
                  {exerciseResult && (
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(exerciseResult)
                      }
                      className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                      title="Copiar resultado"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm min-h-[120px] max-h-[300px] overflow-y-auto border-2 border-gray-800">
                  {exerciseResult && (
                    <div className="whitespace-pre-line leading-relaxed">
                      {exerciseResult}
                    </div>
                  )}
                  {exerciseError && (
                    <div className="text-red-400 mt-2">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span className="font-semibold">Error:</span>
                      </div>
                      <div className="ml-6 bg-red-900/20 p-2 rounded border border-red-700">
                        {exerciseError}
                      </div>
                    </div>
                  )}
                  {!exerciseResult && !exerciseError && !isRunning && (
                    <div className="text-gray-500 italic flex items-center justify-center h-full">
                      <div className="text-center">
                        <Code className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>
                          Escribe tu código y haz clic en "Ejecutar" para ver el
                          resultado...
                        </p>
                      </div>
                    </div>
                  )}
                  {isRunning && (
                    <div className="text-yellow-400 italic flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="animate-spin w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full mx-auto mb-2"></div>
                        <p>Ejecutando código...</p>
                      </div>
                    </div>
                  )}
                </div>

                {isExerciseCompleted && (
                  <div className="flex items-center space-x-2 mt-4 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">
                      ¡Ejercicio completado correctamente!
                    </span>
                  </div>
                )}

                {exerciseError && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2 text-red-700 mb-2">
                      <AlertCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">
                        Consejos para corregir el error:
                      </span>
                    </div>
                    <ul className="text-sm text-red-600 ml-7 list-disc space-y-1">
                      <li>
                        Verifica la sintaxis de tu código (paréntesis, comillas,
                        dos puntos)
                      </li>
                      <li>
                        Asegúrate de que las variables estén definidas antes de
                        usarlas
                      </li>
                      <li>
                        Revisa que los nombres de variables no tengan espacios
                        ni caracteres especiales
                      </li>
                      <li>Los strings deben estar entre comillas (" o ')</li>
                      <li>Usa print() para mostrar resultados en la consola</li>
                    </ul>

                    {exerciseError.includes("Variable") &&
                      exerciseError.includes("no está definida") && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded text-blue-800 text-sm">
                          <strong>Ayuda:</strong> Parece que estás usando una
                          variable que no has definido. Asegúrate de asignar un
                          valor a la variable antes de usarla, por ejemplo:{" "}
                          <code>mi_variable = "valor"</code>
                        </div>
                      )}

                    {exerciseError.includes("sintaxis") && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded text-blue-800 text-sm">
                        <strong>Ayuda:</strong> Hay un error de sintaxis. Revisa
                        que todos los paréntesis, corchetes y comillas estén
                        balanceados correctamente.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex items-center justify-between mt-12"
        >
          <button
            onClick={handlePrevSection}
            disabled={currentSection === 0}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
              currentSection === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Anterior</span>
          </button>

          {isLastSection ? (
            <button
              onClick={handleCompleteLesson}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Completar Lección</span>
            </button>
          ) : (
            <button
              onClick={handleNextSection}
              disabled={
                currentSectionData.type === "exercise" && !isExerciseCompleted
              }
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                currentSectionData.type === "exercise" && !isExerciseCompleted
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg"
              }`}
              title={
                currentSectionData.type === "exercise" && !isExerciseCompleted
                  ? "Completa el ejercicio para continuar"
                  : ""
              }
            >
              <span>Siguiente</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Lesson;
