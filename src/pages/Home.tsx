import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Code2, BookOpen, Star, Play, Zap } from "lucide-react";
import { useProgress } from "../contexts/ProgressContext";

const Home: React.FC = () => {
  const { getCompletedLessonsCount, getTotalLessonsCount } = useProgress();

  const completedLessons = getCompletedLessonsCount();
  const totalLessons = getTotalLessonsCount();
  const progressPercentage =
    totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  const features = [
    {
      icon: Code2,
      title: "Aprende Practicando",
      description:
        "Escribe código real en nuestro editor interactivo y ve los resultados al instante.",
    },
    {
      icon: Star,
      title: "Progreso Gamificado",
      description:
        "Completa lecciones, desbloquea nuevos temas y rastrea tu evolución.",
    },
    {
      icon: Zap,
      title: "Desde Cero a Experto",
      description:
        "Curriculum diseñado para llevarte desde los conceptos básicos hasta temas avanzados.",
    },
  ];

  const stats = [
    { label: "Lecciones Interactivas", value: "13+" },
    { label: "Ejercicios Prácticos", value: "50+" },
    { label: "Temas Cubiertos", value: "10+" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4 mr-2" />
            Aprende Python de forma interactiva
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Domina{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Python
            </span>
            <br />
            desde cero
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Una plataforma interactiva diseñada para enseñarte Python paso a
            paso, con ejercicios prácticos, ejemplos del mundo real y un
            seguimiento completo de tu progreso.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/introduction"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Play className="w-5 h-5 mr-2" />
              Comenzar Ahora
            </Link>

            <Link
              to="/learning-path"
              className="inline-flex items-center px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold border-2 border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Ver Ruta de Aprendizaje
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </motion.div>

        {/* Progress Card */}
        {completedLessons > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-16 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    ¡Excelente Progreso!
                  </h3>
                  <p className="text-gray-600">
                    Continúa aprendiendo donde lo dejaste
                  </p>
                </div>
              </div>
              <Link
                to="/learning-path"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Continuar Aprendiendo
              </Link>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progreso Total</span>
                <span className="font-medium">
                  {completedLessons}/{totalLessons} lecciones
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full"
                />
              </div>
              <p className="text-sm text-gray-500">
                {Math.round(progressPercentage)}% completado
              </p>
            </div>
          </motion.div>
        )}

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-8">
            Todo lo que necesitas para aprender Python
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.7 + 0.1 * index }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-blue-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¿Listo para comenzar tu viaje en Python?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Únete a miles de estudiantes que ya están aprendiendo
          </p>
          <Link
            to="/introduction"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <Play className="w-5 h-5 mr-2" />
            Empezar Gratis
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
