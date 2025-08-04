// Utility to load lessons from JSON
import lessonsData from "../../comprehensive-lessons.json";

interface LessonSection {
  type: "theory" | "exercise";
  title: string;
  content: string;
  example?: string;
  description?: string;
  startingCode?: string;
  solution?: string;
  validation?: (code: string) => boolean;
}

interface Lesson {
  title: string;
  sections: LessonSection[];
}

interface LessonsData {
  [key: string]: Lesson;
}

// Convert validation strings to functions
const createValidationFunction = (
  validationString: string
): ((code: string) => boolean) => {
  try {
    // Remove the arrow function wrapper and return the actual function
    const funcBody = validationString.replace(/^\(code\)\s*=>\s*/, "");
    return new Function("code", `return ${funcBody}`) as (
      code: string
    ) => boolean;
  } catch (error) {
    console.warn("Error creating validation function:", error);
    return () => true; // Default to always valid
  }
};

// Process lessons from JSON
const processLessons = (): LessonsData => {
  const processedLessons: LessonsData = {};

  Object.entries(lessonsData.lessons).forEach(([lessonId, lesson]) => {
    processedLessons[lessonId] = {
      title: lesson.title,
      sections: lesson.sections.map((section) => {
        const processedSection: LessonSection = {
          type: section.type as "theory" | "exercise",
          title: section.title,
          content: section.content,
        };

        if (section.example) {
          processedSection.example = section.example;
        }

        if (section.type === "exercise") {
          processedSection.description = section.description;
          processedSection.startingCode = section.startingCode;
          processedSection.solution = section.solution;

          // Convert validation string to function
          if (section.validation) {
            processedSection.validation = createValidationFunction(
              section.validation
            );
          }
        }

        return processedSection;
      }),
    };
  });

  return processedLessons;
};

export const LESSONS_DATA = processLessons();

// Export lesson order from JSON or create a default order
export const LESSONS_ORDER = Object.keys(lessonsData.lessons);

// Interface for LearningPath component
interface LearningPathLesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  icon: string;
  color: string;
  category: string;
}

// Generate lesson metadata for LearningPath component
export const generateLearningPathLessons = (): LearningPathLesson[] => {
  const lessonMetadata: Record<
    string,
    Omit<LearningPathLesson, "id" | "title">
  > = {
    "python-intro": {
      description: "¿Qué es Python? Filosofía y primer programa",
      duration: "25 min",
      difficulty: "Principiante",
      icon: "Code2",
      color: "from-blue-400 to-blue-600",
      category: "Fundamentos Básicos",
    },
    "variables-basic": {
      description: "Aprende a almacenar y manipular información",
      duration: "30 min",
      difficulty: "Principiante",
      icon: "Database",
      color: "from-green-400 to-green-600",
      category: "Fundamentos Básicos",
    },
    "data-types-basic": {
      description: "Strings, números, booleanos y conversiones",
      duration: "25 min",
      difficulty: "Principiante",
      icon: "FileText",
      color: "from-purple-400 to-purple-600",
      category: "Fundamentos Básicos",
    },
    "input-output": {
      description: "Entrada y salida de datos con input() y print()",
      duration: "20 min",
      difficulty: "Principiante",
      icon: "Terminal",
      color: "from-indigo-400 to-indigo-600",
      category: "Fundamentos Básicos",
    },
    "operators-arithmetic": {
      description: "Suma, resta, multiplicación, división y más",
      duration: "20 min",
      difficulty: "Principiante",
      icon: "Calculator",
      color: "from-cyan-400 to-cyan-600",
      category: "Operadores",
    },
    "operators-comparison": {
      description: "Comparar valores: ==, !=, <, >, <=, >=",
      duration: "15 min",
      difficulty: "Principiante",
      icon: "Scale",
      color: "from-teal-400 to-teal-600",
      category: "Operadores",
    },
    "operators-logical": {
      description: "Operadores and, or, not para lógica compleja",
      duration: "20 min",
      difficulty: "Principiante",
      icon: "Brain",
      color: "from-emerald-400 to-emerald-600",
      category: "Operadores",
    },
    "conditionals-basic": {
      description: "if, elif, else - Toma decisiones en tu código",
      duration: "35 min",
      difficulty: "Principiante",
      icon: "Zap",
      color: "from-yellow-400 to-orange-500",
      category: "Control de Flujo",
    },
    "loops-for": {
      description: "Bucles for para iterar sobre secuencias",
      duration: "30 min",
      difficulty: "Intermedio",
      icon: "RotateCcw",
      color: "from-red-400 to-pink-600",
      category: "Control de Flujo",
    },
    "loops-while": {
      description: "Bucles while para repetición condicional",
      duration: "25 min",
      difficulty: "Intermedio",
      icon: "RefreshCw",
      color: "from-rose-400 to-rose-600",
      category: "Control de Flujo",
    },
    "strings-basic": {
      description: "Manipulación básica de texto y cadenas",
      duration: "30 min",
      difficulty: "Intermedio",
      icon: "Type",
      color: "from-violet-400 to-violet-600",
      category: "Tipos de Datos Avanzados",
    },
    "strings-advanced": {
      description: "Métodos avanzados de strings y formateo",
      duration: "35 min",
      difficulty: "Intermedio",
      icon: "Regex",
      color: "from-fuchsia-400 to-fuchsia-600",
      category: "Tipos de Datos Avanzados",
    },
    "lists-basic": {
      description: "Crear, manipular y gestionar listas en Python",
      duration: "40 min",
      difficulty: "Intermedio",
      icon: "List",
      color: "from-blue-400 to-blue-600",
      category: "Estructuras de Datos",
    },
    "dictionaries-basic": {
      description: "Almacenar y acceder datos con clave-valor",
      duration: "35 min",
      difficulty: "Intermedio",
      icon: "Database",
      color: "from-green-400 to-green-600",
      category: "Estructuras de Datos",
    },
    "functions-basic": {
      description: "Crear bloques de código reutilizables",
      duration: "45 min",
      difficulty: "Intermedio",
      icon: "Zap",
      color: "from-purple-400 to-purple-600",
      category: "Funciones y Modularidad",
    },
    "file-handling": {
      description: "Leer, escribir y procesar archivos",
      duration: "40 min",
      difficulty: "Avanzado",
      icon: "FileText",
      color: "from-orange-400 to-orange-600",
      category: "Entrada/Salida",
    },
    "error-handling": {
      description: "Manejo robusto de errores con try/except",
      duration: "35 min",
      difficulty: "Avanzado",
      icon: "Shield",
      color: "from-red-400 to-red-600",
      category: "Manejo de Errores",
    },
    "classes-basic": {
      description: "Programación orientada a objetos básica",
      duration: "60 min",
      difficulty: "Avanzado",
      icon: "Box",
      color: "from-indigo-400 to-indigo-600",
      category: "Programación Orientada a Objetos",
    },
    "modules-basic": {
      description: "Organizar código en módulos y paquetes",
      duration: "30 min",
      difficulty: "Avanzado",
      icon: "Package",
      color: "from-teal-400 to-teal-600",
      category: "Funciones y Modularidad",
    },
    "list-comprehensions": {
      description: "Crear listas de forma elegante y eficiente",
      duration: "25 min",
      difficulty: "Avanzado",
      icon: "Layers",
      color: "from-cyan-400 to-cyan-600",
      category: "Técnicas Avanzadas",
    },
    "libraries-intro": {
      description: "Introducción a librerías populares de Python",
      duration: "50 min",
      difficulty: "Avanzado",
      icon: "Library",
      color: "from-pink-400 to-pink-600",
      category: "Ecosistema Python",
    },
    "web-scraping": {
      description: "Extrae datos de sitios web de forma automática",
      duration: "45 min",
      difficulty: "Avanzado",
      icon: "Globe",
      color: "from-emerald-400 to-emerald-600",
      category: "Web y APIs",
    },
    "apis-rest": {
      description: "Consume y maneja APIs REST con Python",
      duration: "55 min",
      difficulty: "Avanzado",
      icon: "Network",
      color: "from-blue-400 to-blue-600",
      category: "Web y APIs",
    },
    "manejo-archivos": {
      description: "Procesamiento avanzado de archivos CSV, JSON y más",
      duration: "50 min",
      difficulty: "Avanzado",
      icon: "Files",
      color: "from-amber-400 to-amber-600",
      category: "Procesamiento de Datos",
    },
  };

  return LESSONS_ORDER.map((lessonId) => {
    const lesson = (lessonsData.lessons as any)[lessonId];
    const metadata = lessonMetadata[lessonId] || {
      description: "Descripción de la lección",
      duration: "30 min",
      difficulty: "Principiante",
      icon: "BookOpen",
      color: "from-gray-400 to-gray-600",
      category: "Sin Categoría",
    };

    return {
      id: lessonId,
      title: lesson.title,
      ...metadata,
    };
  });
};

export default LESSONS_DATA;
