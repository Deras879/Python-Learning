// Utility to load lessons from JSON
import lessonsData from "../../comprehensive-lessons.json";

interface LessonSection {
  type: "theory" | "exercise";
  title: string;
  content?: string;
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
      sections: lesson.sections.map((section: any) => {
        const processedSection: LessonSection = {
          type: section.type as "theory" | "exercise",
          title: section.title,
        };

        // Add content for both theory and exercise sections
        if (section.content) {
          processedSection.content = section.content;
        }

        // Add example if present
        if (section.example) {
          processedSection.example = section.example;
        }

        // Add exercise-specific fields
        if (section.type === "exercise") {
          if (section.description) {
            processedSection.description = section.description;
          }
          if (section.startingCode) {
            processedSection.startingCode = section.startingCode;
          }
          if (section.solution) {
            processedSection.solution = section.solution;
          }

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
    // Fundamentos Básicos
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

    // Operadores
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

    // Control de Flujo
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

    // Tipos de Datos Avanzados
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
    "tuples-sets": {
      description: "Tuplas inmutables y conjuntos únicos",
      duration: "30 min",
      difficulty: "Intermedio",
      icon: "Layers",
      color: "from-slate-400 to-slate-600",
      category: "Tipos de Datos Avanzados",
    },

    // Estructuras de Datos
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

    // Funciones y Modularidad
    "functions-basic": {
      description: "Crear bloques de código reutilizables",
      duration: "45 min",
      difficulty: "Intermedio",
      icon: "Zap",
      color: "from-purple-400 to-purple-600",
      category: "Funciones y Modularidad",
    },
    "functions-advanced": {
      description: "Funciones lambda, *args, **kwargs y decoradores",
      duration: "50 min",
      difficulty: "Avanzado",
      icon: "Zap",
      color: "from-purple-500 to-purple-700",
      category: "Funciones y Modularidad",
    },
    "modules-basic": {
      description: "Organizar código en módulos y paquetes",
      duration: "30 min",
      difficulty: "Avanzado",
      icon: "Package",
      color: "from-teal-400 to-teal-600",
      category: "Funciones y Modularidad",
    },

    // Entrada/Salida y Archivos
    "file-handling": {
      description: "Leer, escribir y procesar archivos",
      duration: "40 min",
      difficulty: "Avanzado",
      icon: "FileText",
      color: "from-orange-400 to-orange-600",
      category: "Entrada/Salida",
    },
    "manejo-archivos": {
      description: "Procesamiento avanzado de archivos CSV, JSON y más",
      duration: "50 min",
      difficulty: "Avanzado",
      icon: "Files",
      color: "from-amber-400 to-amber-600",
      category: "Entrada/Salida",
    },
    "json-csv": {
      description: "Trabajar con datos estructurados JSON y CSV",
      duration: "45 min",
      difficulty: "Avanzado",
      icon: "FileSpreadsheet",
      color: "from-lime-400 to-lime-600",
      category: "Entrada/Salida",
    },

    // Manejo de Errores
    "error-handling": {
      description: "Manejo robusto de errores con try/except",
      duration: "35 min",
      difficulty: "Avanzado",
      icon: "Shield",
      color: "from-red-400 to-red-600",
      category: "Manejo de Errores",
    },

    // Programación Orientada a Objetos
    "classes-basic": {
      description: "Programación orientada a objetos básica",
      duration: "60 min",
      difficulty: "Avanzado",
      icon: "Box",
      color: "from-indigo-400 to-indigo-600",
      category: "Programación Orientada a Objetos",
    },
    "oop-advanced": {
      description: "Herencia, polimorfismo y métodos especiales",
      duration: "75 min",
      difficulty: "Avanzado",
      icon: "Box",
      color: "from-indigo-500 to-indigo-700",
      category: "Programación Orientada a Objetos",
    },

    // Técnicas Avanzadas
    "list-comprehensions": {
      description: "Crear listas de forma elegante y eficiente",
      duration: "25 min",
      difficulty: "Avanzado",
      icon: "Layers",
      color: "from-cyan-400 to-cyan-600",
      category: "Técnicas Avanzadas",
    },
    comprehensions: {
      description: "List, dict y set comprehensions avanzadas",
      duration: "35 min",
      difficulty: "Avanzado",
      icon: "Layers",
      color: "from-cyan-500 to-cyan-700",
      category: "Técnicas Avanzadas",
    },
    "decorators-generators": {
      description: "Decoradores y generadores para código eficiente",
      duration: "60 min",
      difficulty: "Experto",
      icon: "Wand2",
      color: "from-violet-500 to-violet-700",
      category: "Técnicas Avanzadas",
    },
    regex: {
      description: "Expresiones regulares para procesamiento de texto",
      duration: "45 min",
      difficulty: "Avanzado",
      icon: "Search",
      color: "from-orange-500 to-orange-700",
      category: "Técnicas Avanzadas",
    },

    // Web y APIs
    "web-scraping": {
      description: "Extrae datos de sitios web de forma automática",
      duration: "45 min",
      difficulty: "Avanzado",
      icon: "Globe",
      color: "from-emerald-400 to-emerald-600",
      category: "Web y APIs",
    },
    scraping: {
      description: "Web scraping avanzado con BeautifulSoup",
      duration: "55 min",
      difficulty: "Avanzado",
      icon: "Globe",
      color: "from-emerald-500 to-emerald-700",
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
    apis: {
      description: "APIs avanzadas y autenticación",
      duration: "65 min",
      difficulty: "Avanzado",
      icon: "Network",
      color: "from-blue-500 to-blue-700",
      category: "Web y APIs",
    },

    // Ecosistema Python
    "libraries-intro": {
      description: "Introducción a librerías populares de Python",
      duration: "50 min",
      difficulty: "Avanzado",
      icon: "Library",
      color: "from-pink-400 to-pink-600",
      category: "Ecosistema Python",
    },

    // Testing y Debugging
    "testing-debugging": {
      description: "Pruebas unitarias y depuración de código",
      duration: "60 min",
      difficulty: "Avanzado",
      icon: "Bug",
      color: "from-red-500 to-red-700",
      category: "Testing y Debugging",
    },

    // Herramientas CLI
    "cli-tools": {
      description: "Crear herramientas de línea de comandos",
      duration: "50 min",
      difficulty: "Avanzado",
      icon: "Terminal",
      color: "from-gray-500 to-gray-700",
      category: "Herramientas CLI",
    },

    // Bases de Datos
    databases: {
      description: "Conexión y manejo de bases de datos",
      duration: "70 min",
      difficulty: "Avanzado",
      icon: "Database",
      color: "from-green-500 to-green-700",
      category: "Bases de Datos",
    },

    // Proyectos
    projects: {
      description: "Proyectos prácticos integradores",
      duration: "120 min",
      difficulty: "Experto",
      icon: "Rocket",
      color: "from-purple-500 to-pink-500",
      category: "Proyectos",
    },
  };

  return LESSONS_ORDER.map((lessonId) => {
    const lesson = (lessonsData.lessons as any)[lessonId];
    const metadata = lessonMetadata[lessonId];

    if (!metadata) {
      console.warn(
        `⚠️  Metadata no encontrada para la lección: ${lessonId} - ${
          lesson?.title || "Título desconocido"
        }`
      );
      // Metadata por defecto para lecciones sin metadata específica
      return {
        id: lessonId,
        title: lesson?.title || "Lección sin título",
        description: "Descripción de la lección",
        duration: "30 min",
        difficulty: "Intermedio",
        icon: "BookOpen",
        color: "from-gray-400 to-gray-600",
        category: "Sin Categoría",
      };
    }

    return {
      id: lessonId,
      title: lesson.title,
      ...metadata,
    };
  });
};

export default LESSONS_DATA;
