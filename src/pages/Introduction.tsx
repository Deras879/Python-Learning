import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Download, 
  Code, 
  FileText, 
  Settings, 
  CheckCircle,
  ExternalLink,
  Lightbulb,
  Target
} from 'lucide-react';

const Introduction: React.FC = () => {
  const installSteps = [
    {
      step: 1,
      title: 'Descarga Python',
      description: 'Ve al sitio oficial de Python y descarga la versión más reciente',
      action: 'Visitar python.org',
      link: 'https://www.python.org/downloads/',
      icon: Download
    },
    {
      step: 2,
      title: 'Instala Python',
      description: 'Ejecuta el instalador y asegúrate de marcar "Add Python to PATH"',
      action: 'Seguir el asistente',
      icon: Settings
    },
    {
      step: 3,
      title: 'Instala Visual Studio Code',
      description: 'Descarga e instala VS Code, el editor recomendado para Python',
      action: 'Descargar VS Code',
      link: 'https://code.visualstudio.com/',
      icon: Code
    },
    {
      step: 4,
      title: 'Instala la extensión de Python',
      description: 'En VS Code, instala la extensión oficial de Python de Microsoft',
      action: 'Buscar "Python" en extensiones',
      icon: FileText
    }
  ];

  const concepts = [
    {
      title: '¿Qué es un lenguaje de programación?',
      description: 'Un lenguaje de programación es un conjunto de reglas y sintaxis que usamos para comunicarnos con las computadoras y decirles qué tareas realizar.',
      icon: Code
    },
    {
      title: '¿Qué es una variable?',
      description: 'Una variable es como una caja con una etiqueta donde guardamos información que podemos usar más tarde en nuestro programa.',
      icon: Target
    },
    {
      title: '¿Por qué Python?',
      description: 'Python es fácil de leer, tiene una sintaxis simple y es muy poderoso. Se usa en inteligencia artificial, desarrollo web, análisis de datos y mucho más.',
      icon: Lightbulb
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ¡Bienvenido a tu viaje con Python! 🐍
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Antes de comenzar a programar, vamos a entender qué es Python, 
            para qué sirve y cómo configurar tu entorno de desarrollo.
          </p>
        </motion.div>

        {/* What is Python Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl p-8 shadow-lg mb-12 border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <Code className="w-5 h-5 text-blue-600" />
            </div>
            ¿Qué es Python?
          </h2>
          
          <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
            <p>
              <strong>Python</strong> es un lenguaje de programación creado por Guido van Rossum en 1991. 
              Es conocido por su sintaxis clara y legible, lo que lo hace perfecto para principiantes.
            </p>
            
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
              <h3 className="font-semibold text-blue-900 mb-3">¿Para qué se usa Python?</h3>
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                  <span><strong>Inteligencia Artificial y Machine Learning</strong> - TensorFlow, PyTorch</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                  <span><strong>Desarrollo Web</strong> - Django, Flask, FastAPI</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                  <span><strong>Análisis de Datos</strong> - Pandas, NumPy, Matplotlib</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                  <span><strong>Automatización y Scripts</strong> - Automatizar tareas repetitivas</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                  <span><strong>Desarrollo de Juegos</strong> - Pygame</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Basic Concepts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Conceptos Fundamentales
          </h2>
          
          <div className="grid md:grid-cols-1 gap-6">
            {concepts.map((concept, index) => (
              <motion.div
                key={concept.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <concept.icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{concept.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{concept.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Installation Guide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white rounded-2xl p-8 shadow-lg mb-12 border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <Settings className="w-5 h-5 text-green-600" />
            </div>
            Configuración del Entorno de Desarrollo
          </h2>
          
          <p className="text-gray-600 mb-8">
            Sigue estos pasos para configurar Python y Visual Studio Code en tu computadora:
          </p>

          <div className="space-y-6">
            {installSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="flex items-start space-x-4 p-6 bg-gray-50 rounded-xl border border-gray-200"
              >
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  {step.step}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <step.icon className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-3">{step.description}</p>
                  {step.link ? (
                    <a
                      href={step.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      {step.action}
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  ) : (
                    <div className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium">
                      {step.action}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">¡Estás listo para comenzar!</h2>
            <p className="text-blue-100 mb-6 text-lg">
              Ahora que entiendes qué es Python y tienes tu entorno configurado, 
              es hora de explorar la ruta de aprendizaje.
            </p>
            <Link
              to="/learning-path"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Ver Ruta de Aprendizaje
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Introduction;